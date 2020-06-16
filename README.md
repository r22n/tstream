# tstream
stream api like jdk for typescript.

## how to use
### Stream#from(), Stream#seq():
```
Stream.from([0, 1, 2]) => 0, 1, 2
Stream.seq(0, 1, 3) => 0, 1, 2; [begin, step, end)
```
create stream instance

### Stream#itr()
```
for (let i of stream.itr()) {
    //do something
}
```
for each all elements in stream

### terminal operations
#### Stream#ary()
```
stream.ary() => [0, 1, 2]
```
create new array that has all elements in stream

#### Stream#count()
```
stream.count() => 3
```
returns count of all elements in stream

#### Stream#first(), Stream#findFirst()
```
stream.find() => 0
stream.findFirst(x => x > 0) => 1
```
returns first element in stream.
however, if the stream had no element, throws Error

#### Stream#min(), Stream#max()
```
stream.min(x => x) => 0
stream.max(x => x) => 2
```
returns the element can minimize/maximize evaluator.
throws Error on stream is empty.

#### Stream#reduce()
```
stream.reduce((left, right) => left + right) => 3
```
reduce all element with reducer.
throws empty error.

### internal operations
#### Stream#map(), Stream#filter()
```
stream.map(x => x * x) => 0, 1, 4
stream.filter(x => x < 2) => 0, 1
```
maps/filters all elements

#### Stream#join(), Stream#distinct()
```
stream1.join(stream2, (left, right) => left + right) => 0, 1, 2 x 0, 1, 2 => 0, 1, 2, 1, 2, 3, 2, 3, 4
stream3.distinct() => 0, 1, 2, 3, 4
```
evaluates full outer join without distinct.
and the distinct discards duplications.

#### Stream#limit(), Stream#skip()
```
stream.skip(1) => 1, 2
stream.limit(1) => 0
```
skips/limits elements to its position.

#### Stream#peek()
```
stream.peek(x => console.log(x)) => "0", "1", "2" will be logged
```
the consumer method will apply all elements in stream.