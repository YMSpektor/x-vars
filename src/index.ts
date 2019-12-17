export default class $<T> {
    private currentValue: T;
    private listeners = new Map<$<any>, (() => void)[]>();
    private subjects = new Set<$<any>>();

    get $(): T { return this.currentValue }
    set $(value: T) {
        this.currentValue = value;
        this.listeners.forEach(callbacks => (callbacks || []).forEach(callback => callback()));
    }

    constructor(initialValue: T) {
        this.currentValue = initialValue;
    }

    private subscribe(listener: $<any>, callback: () => void) {
        listener.subjects.add(this);
        const callbacks = this.listeners.get(listener) || [];
        this.listeners.set(listener, callbacks.concat(callback));
    }

    private unsubscribe(listener: $<any>) {
        this.listeners.delete(listener);
        listener.subjects.delete(this);
    }

    release() {
        this.subjects.forEach(x => x.unsubscribe(this));
    }

    static gen<T>(initialValue: T, fn: (emit: (value: T) => void) => void, result?: $<T>): $<T> {
        const res = result || new $<T>(initialValue);
        fn((value) => res.$ = value);
        return res;
    }

    static calc<TA, TR>(callback: (a: TA, r: TR) => TR, values: [$<TA>], result?: $<TR>): $<TR>;
    static calc<TA, TB, TR>(callback: (a: TA, b: TB, r: TR) => TR, values: [$<TA>, $<TB>], result?: $<TR>): $<TR>;
    static calc<TA, TB, TC, TR>(callback: (a: TA, b: TB, c: TC, r: TR) => TR, values: [$<TA>, $<TB>, $<TC>], result?: $<TR>): $<TR>;
    static calc<TA, TB, TC, TD, TR>(callback: (a: TA, b: TB, c: TC, d: TD, r: TR) => TR, values: [$<TA>, $<TB>, $<TC>, $<TD>], result?: $<TR>): $<TR>;
    static calc<TA, TB, TC, TD, TE, TR>(callback: (a: TA, b: TB, c: TC, d: TD, e: TE, r: TR) => TR, values: [$<TA>, $<TB>, $<TC>, $<TD>, $<TE>], result?: $<TR>): $<TR>;
    static calc(callback: (...args: any[]) => any, values: $<any>[], result?: $<any>): $<any> {
        const res = result || new $<any>(callback(...values.map(x => x.$)));
        values.forEach(x => x.subscribe(res, () => res.$ = callback(...values.map(x => x.$), res.$)));
        return res;
    }

    static release(...args: $<any>[]) {
        args.forEach(x => x.release());
    }
}