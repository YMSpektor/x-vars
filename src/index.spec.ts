import $ from './';

describe('$ tests', () => {
    it('update calculated value', () => {
        var a = new $(5);
        var b = new $(6);
        var c = $.calc((a, b) => a * b, [a, b]);
        expect(c.$).toEqual(30);
        b.$ = 5;
        expect(c.$).toEqual(25);
    });

    it('release should stop tracking changes', () => {
        var a = new $(5);
        var b = new $(6);
        var c = $.calc((a, b) => a * b, [a, b]);
        expect(c.$).toEqual(30);
        $.release(c);
        b.$ = 5;
        expect(c.$).toEqual(30);
    });

    it('using setTimeout function for async generation', () => {
        jest.useFakeTimers();
        var a = $.gen(0, (emit) => setTimeout(() => emit(10), 100));
        expect(a.$).toEqual(0);
        jest.runAllTimers();
        expect(a.$).toEqual(10);
    });

    it('subscribe multiple times', () => {
        const loadedData = new $<any[]>([]);
        const removedItem = new $<any>(null);
        const list = $.calc((data) => data, [loadedData]);
        $.calc((item, list) => list.filter(x => x !== item), [removedItem], list);
        loadedData.$ = [1, 2, 3, 4, 5];
        expect(list.$.length).toEqual(5);
        removedItem.$ = 3;
        expect(list.$.length).toEqual(4);
    });
});