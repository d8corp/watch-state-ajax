import Async from '@watch-state/async';
import { globalEvent, State } from 'watch-state';

class Ajax extends Async {
    constructor(url, options = {}) {
        super(Object.assign(Object.assign({}, options), { request: (resolve, reject) => {
                const { type = 'text' } = options;
                let query = '';
                for (const key in this.query) {
                    const value = this.query[key];
                    if (!value)
                        continue;
                    if (Array.isArray(value)) {
                        for (const subValue of value) {
                            query += (query && '&') + key + '[]=' + subValue;
                        }
                    }
                    else {
                        query += (query && '&') + key + '=' + value;
                    }
                }
                if (query) {
                    query = '?' + query;
                }
                let answer;
                fetch(url.replace(/\{(\w+)\}/g, (str, key) => this.data[key] + '') + query, options).then(data => {
                    answer = data;
                    return data[type]();
                }).then(data => {
                    globalEvent.start();
                    this.answer = answer;
                    answer.status > 399 ? reject(data) : resolve(data);
                    globalEvent.end();
                }, e => {
                    globalEvent.start();
                    this.answer = answer;
                    reject(e);
                    globalEvent.end();
                });
            } }));
        this._answer = new State();
        this.query = options.query || {};
        this.data = options.data || {};
    }
    get answer() {
        return this._answer.value;
    }
    set answer(value) {
        this._answer.value = value;
    }
}

export default Ajax;
