import { Stream } from "../src/Stream";

test("numeric sequence testing", () => {
    let i: number = 0;
    for (let j of Stream.seq(0, 1, 5).itr()) {
        expect(j).toBe(i++);
    }
    for (let j of Stream.seq(5, 2, 11).itr()) {
        expect(j).toBe(i);
        i += 2;
    }
});

test("first numeric sequence testing", () => {
    expect(Stream.seq(0, 1, 10).first()).toBe(0);
    expect(Stream.seq(-50, 2, 10).first()).toBe(-50);
    //-1, 2, 5, 8
    //       ^
    expect(Stream.seq(-1, 3, 10).findFirst((x: number) => x >= 5)).toBe(5);
    //-1, 2, 5, 8
    //            ^ error
    expect(() => Stream.seq(-1, 3, 11).findFirst((x: number) => x >= 9)).toThrow(Error);
});

test("filter numeric sequence testing", () => {
    //0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    //0, 2, 4, 6, 8
    let i: number = 0;
    for (let j of Stream.seq(0, 1, 10).filter(x => x % 2 == 0).itr()) {
        expect(j).toBe(i);
        i += 2;
    }
    //0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    //0, 2, 4, 6, 8
    //         ^
    expect(Stream.seq(0, 1, 10).filter(x => x % 2 == 0).findFirst(x => x >= 6)).toBe(6);
    //0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    //0, 2, 4, 6, 8
    //0, 6
    //0
    expect(Stream.seq(0, 1, 10).filter(x => x % 2 == 0).filter(x => x % 3 == 0).first()).toBe(0);
    //0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    //0, 2, 4, 6, 8
    //0, 6
    //6
    expect(Stream.seq(0, 1, 10).filter(x => x % 2 == 0).filter(x => x % 3 == 0).skip(1).first()).toBe(6);
    //0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    //0, 2, 4, 6, 8
    //0, 6
    //0
    expect(Stream.seq(0, 1, 10).filter(x => x % 2 == 0).filter(x => x % 3 == 0).limit(1).first()).toBe(0);
    expect(Stream.seq(0, 1, 10).filter(x => x % 2 == 0).filter(x => x % 3 == 0).limit(1).count()).toBe(1);
});

test("limit sequence testing", () => {
    //0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    //0, 1, 2, 3, 4
    expect(Stream.seq(0, 1, 10).limit(5).first()).toBe(0);
    expect(Stream.seq(0, 1, 10).limit(5).count()).toBe(5);
    //0, 1, 2, 3, 4
    //3, 4
    expect(Stream.seq(0, 1, 10).limit(5).skip(3).first()).toBe(3);
    expect(Stream.seq(0, 1, 10).limit(5).skip(3).count()).toBe(2);

    //0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    //4, 5, 6, 7, 8, 9
    //4, 5
    expect(Stream.seq(0, 1, 10).skip(4).limit(2).first()).toBe(4);
    expect(Stream.seq(0, 1, 10).skip(4).limit(2).count()).toBe(2);
});

test("min in sequence testing", () => {
    //-3, -2, -1, 0, 1, 2, 3
    //9, 4, 1, 0, 1, 4, 9
    //         ^
    expect(Stream.seq(-3, 1, 4).map(x => x * x).min(x => x)).toBe(0);
    expect(Stream.seq(-3, 1, 4).map(x => x * x).max(x => x)).toBe(9);
});

test("reduce sequence testing", () => {
    //-2, -1, 0, 1, 2
    //-8, -1, 0, 1, 8
    //0
    expect(Stream.seq(-2, 1, 3).map(x => Math.pow(x, 3)).reduce((left, right) => left + right)).toBe(0);
});

test("map sequence testing", () => {
    //-2, -1, 0, 1, 2
    //4, 1, 0, 1, 4
    //5, 2, 1, 2, 5
    let shouldbe: Array<number> = [5, 2, 1, 2, 5];
    let pos: number = 0;
    for (let j of Stream.seq(-2, 1, 3).map(x => x * x).map(x => x + 1).itr()) {
        expect(j).toBe(shouldbe[pos++]);
    }
});

test("join sequence testing", () => {
    //0, 1, 2 x 10, 11, 12
    //10, 11, 12, 11, 12, 13, 12, 13, 14
    let shouldbe: Array<number> = [10, 11, 12, 11, 12,13, 12, 13, 14];
    let pos: number = 0;
    for (let j of Stream.seq(0, 1, 3).join(Stream.seq(10, 1, 13), (left, right) => left + right).itr()) {
        expect(j).toBe(shouldbe[pos++]);
    }
});

test("distinct sequence testing", () => {
    //0, 1, 2 x 10, 11, 12
    //10, 11, 12, 11, 12, 13, 12, 13, 14
    //10, 11, 12, 13, 14
    let shouldbe: Array<number> = [10, 11, 12, 13, 14];
    let pos: number = 0;
    for (let j of Stream.seq(0, 1, 3).join(Stream.seq(10, 1, 13), (left, right) => left + right).distinct().itr()) {
        expect(j).toBe(shouldbe[pos++]);
    }

    //5, 1, 5, 3
    //5, 1, 3
    shouldbe = [5, 1, 3];
    pos = 0;
    for (let j of Stream.from([5, 1, 5, 3]).distinct().itr()) {
        expect(j).toBe(shouldbe[pos++]);
    }
});

test("peek sequence testing", () => {
    //1, 2, 3
    let shouldbe: Array<number> = [1, 2, 3];
    let pos: number = 0;
    Stream.seq(1, 1, 4).peek(x => expect(x).toBe(shouldbe[pos++])).first();
});