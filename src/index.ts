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

    static gen<T>(initialValue: T, fn: (emit: (value: T) => void) => void): $<T> {
        const result = new $<T>(initialValue);
        fn((value) => result.$ = value);
        return result;
    }

    static calc<TA, TR>(callback: (a: TA) => TR, values: [$<TA>], result?: $<TR>): $<TR>;
    static calc<TA, TB, TR>(callback: (a: TA, b: TB) => TR, values: [$<TA>, $<TB>], result?: $<TR>): $<TR>;
    static calc(callback: (...args: any[]) => any, values: $<any>[], result?: $<any>): $<any> {
        const res = result || new $<any>(callback(...values.map(x => x.$)));
        values.forEach(x => x.subscribe(res, () => res.$ = callback(...values.map(x => x.$))));
        return res;
    }

    static release(...args: $<any>[]) {
        args.forEach(x => x.release());
    }
}