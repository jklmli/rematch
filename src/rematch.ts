import _ = require('lodash');
import Monapt = require('monapt');

function Rematch<T, U>(value: T, clauses: Array<Rematch.Case<T, U>>): U {
  return Rematch.match(value, clauses);
}

module Rematch {
  export class Case<T, U> {
    matches: (t: T) => boolean;
    private onceAction: (t: T) => U;

    constructor(matches: (t: T) => boolean, action: (t: T) => U) {
      this.matches = matches;
      this.onceAction = _.once(action);
    }

    result(t: T): U { return this.onceAction(t); }
  }

  export function match<T, U>(value: T, clauses: Array<Case<T, U>>): U {
    const matched: Monapt.Option<U> = Monapt.Option(
      _(clauses)
        .find((clause: Case<T, U>) => clause.matches(value))
    )
      .map((clause: Case<T, U>) => clause.result(value));

    return matched
      .getOrElse((): U => { throw new Rematch.MatchError(JSON.stringify(value) + " doesn't match any of the possible match clauses."); });
  }

  export var isEqual: (value1: any, value2: any) => boolean = _.isEqual;

  export function Value<T, U>(key: T, action: () => U): Case<T, U> {
    return new Case(
      (value: T) => Rematch.isEqual(key, value),
      action
    );
  }

  export function Values<T, U>(keys: Array<T>, action: () => U): Case<T, U> {
    return new Case(
      (value: T) => _(keys).some((key: T) => Rematch.isEqual(key, value)),
      action
    );
  }

  export function Type<T, U>(key: { new(...args: any[]): T }, action: (t?: T) => U): Case<T, U> {
    return new Case(
      (value: T) => value instanceof key,
      action
    );
  }

  export function Else<U>(action: () => U): Case<any, U> {
    return new Case(
      (value: any) => true,
      action
    );
  }

  export class MatchError extends Error {
    message: string;

    constructor(message: string = '') {
      super(message);

      this.name = 'MatchError';
      this.message = message;
    }

    toString(): string {
      return this.name + ': ' + this.message;
    }
  }
}

export default Rematch;
