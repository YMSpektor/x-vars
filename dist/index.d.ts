export default class $<T> {
    private currentValue;
    private listeners;
    private subjects;
    get $(): T;
    set $(value: T);
    constructor(initialValue: T);
    private subscribe;
    private unsubscribe;
    release(): void;
    static gen<T>(initialValue: T, fn: (emit: (value: T) => void) => void, result?: $<T>): $<T>;
    static calc<TA, TR>(callback: (a: TA, r: TR) => TR, values: [$<TA>], result?: $<TR>): $<TR>;
    static calc<TA, TB, TR>(callback: (a: TA, b: TB, r: TR) => TR, values: [$<TA>, $<TB>], result?: $<TR>): $<TR>;
    static calc<TA, TB, TC, TR>(callback: (a: TA, b: TB, c: TC, r: TR) => TR, values: [$<TA>, $<TB>, $<TC>], result?: $<TR>): $<TR>;
    static calc<TA, TB, TC, TD, TR>(callback: (a: TA, b: TB, c: TC, d: TD, r: TR) => TR, values: [$<TA>, $<TB>, $<TC>, $<TD>], result?: $<TR>): $<TR>;
    static calc<TA, TB, TC, TD, TE, TR>(callback: (a: TA, b: TB, c: TC, d: TD, e: TE, r: TR) => TR, values: [$<TA>, $<TB>, $<TC>, $<TD>, $<TE>], result?: $<TR>): $<TR>;
    static release(...args: $<any>[]): void;
}
