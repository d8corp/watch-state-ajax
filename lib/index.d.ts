import Async, { IAsyncOptions } from '@watch-state/async';
import { State } from 'watch-state';
declare type AjaxQueryType = string | number | boolean;
export declare type AjaxQuery = AjaxQueryType | AjaxQueryType[];
export declare type AjaxQueryObject = Record<string, AjaxQuery>;
export declare type AjaxData = Record<string, string | number>;
export declare type AjaxOptions<D extends AjaxData = AjaxData, Q extends AjaxQueryObject = AjaxQueryObject> = RequestInit & Omit<IAsyncOptions, 'request'> & {
    data?: D;
    query?: Q;
    type?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';
};
declare class Ajax<V = any, E = any, D extends AjaxData = AjaxData, Q extends AjaxQueryObject = AjaxQueryObject> extends Async<V, E> {
    query: Q;
    data: D;
    _answer: State<any>;
    get answer(): any;
    set answer(value: any);
    constructor(url: string, options?: AjaxOptions<D, Q>);
}
export default Ajax;
