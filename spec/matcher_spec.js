var Rematch = require('../lib/Rematch').default;

describe("Clauses", () => {
  it('should support a Value case', () => {
    const result = Rematch(2, [
      Rematch.Value(4, () => 'failure'),
      Rematch.Value(2, () => 'success'),
      Rematch.Value(3, () => 'failure')
    ]);

    expect(result).toBe('success');
  });

  it('should support a Values case', () => {
    const result = Rematch(2, [
      Rematch.Values([3, 4], () => 'failure'),
      Rematch.Values([1, 2], () => 'success'),
      Rematch.Values([5, 6], () => 'failure')
    ]);

    expect(result).toBe('success');
  });

  describe('should support a Type case', () => {
    // :TRICKY: Needed for block-scoped classes.
    'use strict';

    class Animal { }
    class Cat extends Animal { }
    class Dog extends Animal { }
    class Tiger extends Cat { }

    it('should match a basic type', () => {
      const result = Rematch(new Animal, [
        Rematch.Type(Boolean, () => 'failure'),
        Rematch.Type(Animal, () => 'success'),
        Rematch.Type(String, () => 'failure')
      ]);

      expect(result).toBe('success');
    });

    it('should handle inheritance', () => {
      const result = Rematch(new Tiger, [
        Rematch.Type(Dog, () => 'failure'),
        Rematch.Type(Cat, () => 'success'),
        Rematch.Type(Boolean, () => 'failure')
      ]);

      expect(result).toBe('success');
    });

    it('should select the first type match, not the most specific', () => {
      const result = Rematch(new Tiger, [
        Rematch.Type(Boolean, () => 'failure'),
        Rematch.Type(Animal, () => 'success'),
        Rematch.Type(Cat, () => 'failure'),
        Rematch.Type(Tiger, () => 'failure')
      ]);

      expect(result).toBe('success');
    });
  });

  describe('should support an Else case', () => {
    it('should be selected as a fallback if no other cases match', () => {
      const result = Rematch(2, [
        Rematch.Value(3, () => 'failure'),
        Rematch.Value(4, () => 'failure'),
        Rematch.Else(() => 'success')
      ]);

      expect(result).toBe('success');
    });

    it('should be selected even if other cases come after', () => {
      const result = Rematch(2, [
        Rematch.Value(3, () => 'failure'),
        Rematch.Value(4, () => 'failure'),
        Rematch.Else(() => 'success'),
        Rematch.Value(2, () => 'failure'),
        Rematch.Else(() => 'failure')
      ]);

      expect(result).toBe('success');
    });
  });
});
