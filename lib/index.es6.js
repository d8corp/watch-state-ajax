import { __decorate } from 'tslib';
import Async from '@watch-state/async';
import { state, createEvent } from 'watch-state';

class Ajax extends Async {
    constructor(url, options = {}) {
        const { type = 'text' } = options;
        const request = (resolve, reject) => {
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
            }).then(createEvent(data => {
                this.answer = answer;
                answer.status > 399 ? reject(data) : resolve(data);
            }), createEvent(e => {
                this.answer = answer;
                reject(e);
            }));
        };
        super(Object.assign(Object.assign({}, options), { request }));
        this.query = options.query || {};
        this.data = options.data || {};
    }
}
__decorate([
    state
], Ajax.prototype, "answer", void 0);

export default Ajax;
