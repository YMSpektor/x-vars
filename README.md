# x-vars

**x-vars** is a small library for programming in a reactive style. It allows you to create reactive variables that act like cells in a spreadsheet - when you update any variable, all dependent variables will be updated automatically. Here is the example showing the difference between reactive and non-reactive variables (pseudocode):

    // Non reactive variables
    var a = 10;
    var b = 5;
    var c = a + b; // 15
    var b = 10;
    console.log(c) // still 15

    // Reactive variables
    var a = 10;
    var b = 5;
    var c <= a + b; // <= means 'c always equals a + b'
    var b = 10;
    console.log(c) // 20

## Basic usage
Here is the code demonstrating how to implement the example above using *x-vars*
```javascript
import $ from 'x-vars';

const a = new $(10);
const b = new $(5);
const c = $.calc((a, b) => a + b, [a, b]);
console.log(c.$); // 15
b.$ = 10;
console.log(c.$); // 20
```
Each reactive variable represents a data stream, its *$* property (read/write) contains the current value. The *$.calc* method can take 3 arguments:
* The function to calculate the resulting value. The number of arguments can vary and corresponds the values of argument variables (see below). The very last argument contains the last value of resulting variable
* Array of reactive variables that affect the resulting value (argument variables)
* (optional) The reactive variable where to put the result. If not specified the new variable will be created.

If you don't need a separate reactive variable, but still want to react to changes, you can call *$.calc* as a procedure:
```javascript
$.calc((a) => {
	console.log(`Variable "a" has changed. New value is ${a}`);
}, [a]);
```
Every calculated variable created by *$.calc* makes subscriptions to the variables it depends on (argument variables). If the calculated variable lives less than it's argument variables it must be released manually to clear its subscriptions and prevent performance loss and memory leaks:
```javascript
$.release(a, b, c, d, ...);
```
Calling *$.calc* as a procedure also creates subscriptions and to clear them you can pass a third argument to the method:
```javascript
const $$ = new $(null); // Dummy variable to hold subscriptions
...
$.calc((a) => {/* Do something */}, [a], $$);
$.calc((b) => {/* Do something else */}, [b], $$);
...
$.release($$);
```
The same variable can be used multiple times as a result of the *$.calc* method to merge different logics to the same data stream:
```javascript
const loadedData = new $([]);
const removedItem = new $(null);
const list = $.calc((data) => data, [loadedData]);
$.calc((item, currentValue) => currentValue.filter(x => x !== item), [removedItem], list);
loadedData.$ = [1, 2, 3, 4, 5];
console.log(list.$); // [1, 2, 3, 4, 5]
removedItem.$ = 3;
console.log(list.$); // [1, 2, 4, 5]
```

## Creating reactive variables from asynchronous sources
You can create reactive variable from asynchronous sources using *$.gen* method:
```javascript
// From setTimeout
const fromTimer = $.gen(0, (emit) => setTimeout(
    () => emit(10)
    , 1000));

// From promise
const promise = ...
const fromPromise = $.gen(null, (emit) => promise.then(
    (result) => emit(result));

// From rxjs observables
const observable = ...
const fromObservable = $.gen(null, (emit) => observable.subscribe(
    (result) => emit(result));

// From user input
const input = document.querySelector(...);
const fromInput = $.gen(input.value, (emit) => {
    input.onchange = (e) => {
        emit(e.target.value);
    }
});
```
The first argument accepts the initial value, the second is a function to produce new values when needed. The method can also take an optional third argument where to put the result, similar to *$.calc*. The new value will be assigned to the variable when *emit* function is called.

## Authors
* Yuri Spektor

## License
MIT