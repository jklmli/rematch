declare function Rematch<T, U>(value: T, clauses: Array<Rematch.Case<T, U>>): U;
declare module Rematch {
    class Case<T, U> {
        matches: (t: T) => boolean;
        private onceAction;
        constructor(matches: (t: T) => boolean, action: (t: T) => U);
        result(t: T): U;
    }
    function match<T, U>(value: T, clauses: Array<Case<T, U>>): U;
    var isEqual: (value1: any, value2: any) => boolean;
    function Value<T, U>(key: T, action: () => U): Case<T, U>;
    function Values<T, U>(keys: Array<T>, action: () => U): Case<T, U>;
    function Type<T, U>(key: {
        new (...args: any[]): T;
    }, action: (t?: T) => U): Case<T, U>;
    function Else<U>(action: () => U): Case<any, U>;
    class MatchError extends Error {
        message: string;
        constructor(message?: string);
        toString(): string;
    }
}
export default Rematch;
