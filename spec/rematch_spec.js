var Rematch = require('../lib/rematch').default;

const TrueClause = (key, action) => {
  return new Rematch.Case(
    (value) => true,
    action
  );
};

describe('Basic functionality:', () => {
  it('should select a case that is always true', () => {
    const result = Rematch.match(2, [
      TrueClause(3, () => 'success')
    ]);

    expect(result).toBe('success');
  });

  it('should select the first case that is always true', () => {
    const result = Rematch.match(2, [
      TrueClause(3, () => 'success'),
      TrueClause(4, () => 'failure')
    ]);

    expect(result).toBe('success');
  });

  it('should have a functional top-level function', () => {
    const result = Rematch(2, [
      TrueClause(3, () => 'success')
    ]);

    expect(result).toBe('success');
  });
});
