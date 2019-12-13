# ArrayManip.js  v1.0
Dependency-free library for turning common array manipulations into single lines of code with minimal nested parentheses.
Created By: Gavin Ovsak. www.workbygavin.com

## Documentation + Examples

### `a.prop`

Map property values
```js
[{x: 2}, {x: 4}, {x: 6}].map(a.prop('x'))
> [2, 4, 6]
```

### `a.is`

Pull out specific items
```js
[{x: 2}, {x: 4}, {x: 6}].filter(a.prop('x').is(4))
> [{x: 4}]
```

### `a.op`

Filter by a condition
```js
[{x: 2}, {x: 4}, {x: 6}].filter(a.prop('x').op('>', 3))
> [{x: 4}, {x: 6}]
```

Get a property and add to it
```js
[{x: 2}, {x: 4}, {x: 6}].map(a.prop('x').op('+', 1))
> [3, 5, 7]
```

Add up all property values
```js
[{x: 2}, {x: 4}, {x: 6}].map(a.prop('x')).reduce(a.op('+'))
> 12
```

Multiply all property values
```js
[{x: 2}, {x: 4}, {x: 6}].map(a.prop('x')).reduce(a.op('*'))
> 48
```

Find the max property value
```js
[{x: 2}, {x: 4}, {x: 6}].map(a.prop('x')).reduce(a.op('max'))
> 6
```
Available operations: `<, <=, >, >=, ==, !=, +, *, -, /, ^, max, min, abs`


### `a.in`

Filter by items in a separate list
```js
var clothing = ['hat', 'shoe'];
['hat', 'shoe', 'car'].filter(a.in(clothing))
> ['hat', 'shoe']
```

Filter by property in a list
```js
var clothing = ['hat', 'shoe'];
[{x: 'hat'}, {x: 'shoe'}, {x: 'car'}].filter(a.prop('x').in(clothing))
> [{x: 'hat'}, {x: 'shoe'}]
```

Filter by property in an object set
```js
var clothing = {
  'hat': true,
  'show': true
}
[{x: 'hat'}, {x: 'shoe'}, {x: 'car'}].filter(a.prop('x').in(clothing))
> [{x: 'hat'}, {x: 'shoe'}]
```

### `a.not`

Easy negation

```js
var clothing = ['hat', 'shoe'];
['hat', 'shoe', 'car'].filter(a.in(clothing).not)
> ['car']
```
```js
['hat', 'shoe', 'car'].some(a.in(clothing).not)
> true
```
```js
['hat', 'shoe', 'car'].filter(a.is('hat').not)
> ['shoe', 'car']
```

### `a.from`

Pull from a set by its keys

```js
var price = {
  hat: 6,
  shoe: 10,
  car: 1000
};
['hat', 'shoe', 'car'].map(a.from(price))
> [6, 10, 1000]
```

### `a.index`

Access indices to perform lookups

```js
var species = ['dog', 'cat', 'giraffe']
var heights = [4, 3, 20];
```
```js
species.map(a.index)
> [0, 1, 2]
```
```js
species.filter(a.index.from(heights).op('>', 10))
> 'giraffe'
```

### `a.by`

Simple inline sorting

```js
var data = [{a:1, b: 7}, {a:4, b: 2}, {a:3, b: 3}, {a:3, b: 5}];
data.sort(a.by('a'))
> [{a: 1, b: 7}, {a: 3, b: 5}, {a: 3, b: 3}, {a: 4, b: 2}]
```
```js
var data = [3,5,8,1,2,4,4,6];
data.sort(a.by(null, 'dec'));
> [8, 6, 5, 4, 4, 3, 2, 1]
```
```js
var species = ['dog', 'cat', 'giraffe']
var heights = [4, 3, 20];
species.map(a.index).sort(a.by(a.from(heights), 'dec')).map(a.from(species))
> 'giraffe'
```

### `a.minIndex`

Get the index of the minimum value

```js
var data = [3,5,8,1,2,4,4,6];
data.reduce(a.minIndex);
> 3
```
```js
var data = [{a:1, b: 7}, {a:4, b: 2}, {a:3, b: 3}, {a:3, b: 5}];
data.reduce(a.minIndex(a.prop('b')));
> 1
```

### `a.toArr`

```js
var data = [{a:1, b: 7}, {a:4, b: 2}, {a:3, b: 3}, {a:3, b: 5}];
data.map(a.toArr([a.index, a.prop('a'), a.item]))
> [[0, 1, {a: 1, b: 7}],
   [1, 4, {a: 4, b: 2}],
   [2, 3, {a: 3, b: 3}],
   [3, 3, {a: 3, b: 5}]]
```

### `a.toObj`

```js
var data = [{a:1, b: 7}, {a:4, b: 2}, {a:3, b: 3}, {a:3, b: 5}];
data.map(a.toObj({
  x: a.prop('a'), 
  y: a.prop('b'), 
  sum: a.prop('b').op('+', a.prop('a'))
}))
> [{x: 1, y: 7, sum: 8},
   {x: 4, y: 2, sum: 6},
   {x: 3, y: 3, sum: 6},
   {x: 3, y: 5, sum: 8}]
```

### `a.and / a.or`

Combine conditions inline
```js
var data = [{a:1, b: 7}, {a:4, b: 2}, {a:3, b: 3}, {a:3, b: 5}];
data.filter(a.and(
  a.prop('a').op('>', 2),
  a.prop('b').op('<=', 3)))
> [{a: 4, b: 2}, {a: 3, b: 3}]
```