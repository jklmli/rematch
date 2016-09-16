# Rematch [![npm version](https://badge.fury.io/js/rematch.svg)](http://badge.fury.io/js/rematch) [![Build Status](https://travis-ci.org/jiaweihli/rematch.png?branch=master)](https://travis-ci.org/jiaweihli/rematch)

Rematch is a pattern matching library built for JavaScript and TypeScript.
Pattern matching helps you write safer, more readable, and more concise code.

## Try it now

```bash
npm install rematch
```

Or download a release and pick up `lib/rematch.js`.

## Basic usage

```javascript
function favoriteColor(favoritePlanet) {
  return Rematch(favoritePlanet, [
    Rematch.Type(GasGiantPlanet, () => 'blue'),
    Rematch.Value('mars', () => 'red'),
    Rematch.Value('venus', () => 'yellow')
  ]);
}

>> favoriteColor('jupiter') // 'blue'
>> favoriteColor('neptune') // 'blue'
>> favoriteColor('venus') // 'yellow'

>> favoriteColor('mercury') // Error: Rematch.MatchError
```

## API

The `Rematch` function takes in an argument and a group of cases to test the argument against.

There are 4 types of cases:
 
  - **Value** - argument matches single value
  - **Values** - argument matches one of multiple values
  - **Type** - argument matches a type
  - **Else** - argument does not match any previous cases
  
If no cases are valid, a `Rematch.MatchError` is thrown.  There are no 'fall-throughs' like in switch statements.

#### Advanced

By default, equality checks use `lodash.isEqual`, which does a structural comparison.  You can override this by setting
`Rematch.isEqual` to a custom value.
  
## Why use pattern matching over if/else?

For the large majority of code that isn't performance-sensitive, there are a lot of great reasons why you'd want to use 
pattern matching over if/else:

  - it enforces a common return value and type for each of your branches (when using type definitions)
  - in languages with exhaustiveness checks, it forces you to explicitly consider all cases and noop the ones you don't 
    need
  - it prevents early returns, which become harder to reason about if they cascade, grow in number, or the branches grow 
    longer than the height of your screen (at which point they become invisible).  Having an extra level of indentation 
    goes a long way towards warning you you're inside a scope.
  - it can help you identify logic to pull out, rewriting it into a more DRY, debuggable, and testable form.
     
## A longer example
  
Let's do an example!  We're building a webapp, and we need to authenticate our users and update them on their status.
Here's a straightforward solution:

```javascript
if(user instanceof BlacklistedUser) {
  warnBlacklistMonitor();
  
  return;
}
else if(user.password === enteredPassword) {
  login();
  
  alert("You're logged in!");
}
else {
  onUserFailedLogin();
  
  alert("Mistyped your password?  Try again or do a password reset.");
}
```

This code works.  Let's see how a pattern matching solution stacks up:

  
```javascript
Rematch(user, [
  Rematch.Type(BlacklistedUser, () => warnBlacklistMonitor()),
  Rematch.Else(() => {
    var statusMessage = Rematch(enteredPassword, [
      Rematch.Value(user.password, () => {
        login();    
         
        return "You're logged in!";
      }),
      Rematch.Else(() => {
        onUserFailedLogin();
     
        return "Entered password is invalid";
      })
    ]);
    
    alert(statusMessage);
  }) 
])
```

It's immediately clear that there are 3 return points, and that 2 of them are dependent on the other one.
We've identified a common variable `statusMessage`, which'll make debugging / testing easier down the line.
And lastly, all the return points consistently return nothing.
