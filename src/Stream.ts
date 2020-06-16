
export abstract class Stream<T> {
    public abstract itr(): Iterable<T>;

    public ary(): Array<T> {
        return [...this.itr()];
    }

    public count(): number {
        let result: number = 0;
        for (let i of this.itr()) {
            result++;
        }
        return result;
    }

    public first(): T {
        for (let i of this.itr()) {
            return i;
        }
        throw new Error("stream has no element");
    }

    public findFirst(where: (x: T) => boolean): T {
        for (let i of this.itr()) {
            if (where(i)) {
                return i;
            }
        }
        throw new Error("stream has no element matches conditions");
    }

    public min(evaluate: (x: T) => number): T {
        let result: T;
        let val: number = Number.MAX_VALUE;
        let one: boolean = false;
        for (let i of this.itr()) {
            one = true;
            let ival: number = evaluate(i);
            if (ival < val) {
                result = i;
                val = ival;
            }
        }
        if (!one) {
            throw new Error("stream has no element minimize evaluator");
        }
        return result;
    }

    public max(evaluate: (x: T) => number): T {
        let result: T;
        let val: number = Number.MIN_VALUE;
        let one: boolean = false;
        for (let i of this.itr()) {
            one = true;
            let ival: number = evaluate(i);
            if (ival > val) {
                result = i;
                val = ival;
            }
        }
        if (!one) {
            throw new Error("stream has no element maximize evaluator");
        }
        return result;
    }

    public reduce(reducer: (left: T, right: T) => T): T {
        let result: T;
        let first: boolean = true;
        let one: boolean = false;
        for (let i of this.itr()) {
            one = true;
            if (first) {
                result = i;
            }
            else {
                result = reducer(result, i);
            }
            first = false;
        }
        if (!one) {
            throw new Error("stream has no element for reducing");
        }
        return result;
    }

    public map<U>(select: (x: T) => U): Stream<U> {
        return Stream.from(this.internalMap(select));
    }

    public filter(where: (x: T) => boolean): Stream<T> {
        return Stream.from(this.internalFilter(where));
    }

    public join<U, V>(rights: Stream<U>, cat: (left: T, right: U) => V): Stream<V> {
        return Stream.from(this.internalJoin(rights.itr(), cat));
    }

    public distinct(): Stream<T> {
        return Stream.from(this.internalDistinct());
    }

    public limit(size: number): Stream<T> {
        return Stream.from(this.internalLimit(size));
    }

    public skip(size: number): Stream<T> {
        return Stream.from(this.internalSkip(size));
    }

    public peek(consumer: (x: T) => void): Stream<T> {
        return Stream.from(this.internalPeek(consumer));
    }

    private *internalMap<U>(select: (x: T) => U): Iterable<U> {
        for (let i of this.itr()) {
            yield select(i);
        }
    }

    private *internalFilter(where: (x: T) => boolean): Iterable<T> {
        for (let i of this.itr()) {
            if (where(i)) {
                yield i;
            }
        }
    }

    private *internalJoin<U, V>(rights: Iterable<U>, cat: (left: T, right: U) => V): Iterable<V> {
        for (let i of this.itr()) {
            for (let j of rights) {
                yield cat(i, j);
            }
        }
    }

    private *internalDistinct(): Iterable<T> {
        let known: Set<T> = new Set();
        for (let i of this.itr()) {
            if (!known.has(i)) {
                known.add(i);
                yield i;
            }
        }
    }

    private *internalLimit(size: number): Iterable<T> {
        let pos: number = 0;
        for (let i of this.itr()) {
            if (pos >= size) {
                break;
            }
            yield i;
            pos++;
        }
    }

    private *internalSkip(size: number): Iterable<T> {
        let pos: number = 0;
        for (let i of this.itr()) {
            if (pos >= size) {
                yield i;
            }
            pos++;
        }
    }

    private *internalPeek(consumer: (x: T) => void): Iterable<T> {
        for (let i of this.itr()) {
            consumer(i);
            yield i;
        }
    }

    public static from<T>(src: Iterable<T>): Stream<T> {
        return new Through(src);
    }

    public static seq(begin: number, step: number, end: number): Stream<number> {
        return new Seq(begin, step, end);
    }
}

class Through<T> extends Stream<T> {
    private src: Iterable<T>;

    public constructor(src: Iterable<T>) {
        super();
        this.src = src;
    }

    public itr(): Iterable<T> {
        return this.src;
    }
}

class Seq extends Stream<number> {
    private begin: number;
    private step: number;
    private end: number;
    
    public constructor(begin: number, step: number, end: number) {
        super();
        this.begin = begin;
        this.step = step;
        this.end = end;
    }

    public *itr(): Iterable<number> {
        for (let i: number = this.begin; i < this.end; i += this.step) {
            yield i;
        }
    }
}