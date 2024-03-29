import Async, {IAsyncOptions} from '@watch-state/async'
import {State, globalEvent} from 'watch-state'

type AjaxQueryType = string | number | boolean
export type AjaxQuery = AjaxQueryType | AjaxQueryType[]
export type AjaxQueryObject = Record<string, AjaxQuery>
export type AjaxData = Record<string, string | number>
export type AjaxOptions <D extends AjaxData = AjaxData, Q extends AjaxQueryObject = AjaxQueryObject> = RequestInit & Omit<IAsyncOptions, 'request'> & {
  data?: D
  query?: Q
  type?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData'
}

class Ajax<V = any, E = any, D extends AjaxData = AjaxData, Q extends AjaxQueryObject = AjaxQueryObject> extends Async<V, E> {
  query: Q
  data: D
  _answer = new State()
  get answer () {
    return this._answer.value
  }
  set answer (value) {
    this._answer.value = value
  }

  constructor (url: string, options: AjaxOptions<D, Q> = {}) {
    super({...options, request: (resolve, reject) => {
      const {type = 'text'} = options
      let query = ''
      for (const key in this.query) {
        const value = this.query[key]
        if (!value) continue
        if (Array.isArray(value)) {
          for (const subValue of value) {
            query += (query && '&') + key + '[]=' + subValue
          }
        } else {
          query += (query && '&') + key + '=' + value
        }
      }
      if (query) {
        query = '?' + query
      }
      let answer
      fetch(url.replace(/\{(\w+)\}/g, (str, key) => this.data[key] + '') + query, options).then(data => {
        answer = data
        return data[type]()
      }).then(data => {
        globalEvent.start()
        this.answer = answer
        answer.status > 399 ? reject(data) : resolve(data)
        globalEvent.end()
      }, e => {
        globalEvent.start()
        this.answer = answer
        reject(e)
        globalEvent.end()
      })
    }})

    this.query = options.query || {} as Q
    this.data = options.data || {} as D
  }
}

export default Ajax
