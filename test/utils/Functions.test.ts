import { omitPrivateFields } from '../../src/utils/Functions';

describe('omitPrivateFields', () => {
  it('omits keys starting with _', () => {
    const input = { a: 5, b: 3, _c: 5 };

    const res = omitPrivateFields(input);

    const expected = { a: 5, b: 3 };
    expect(res).toEqual(expected);
  });

  it('returns identity if no private fields are there', () => {
    const input = { a: 5, b: 3 };

    const res = omitPrivateFields(input);

    const expected = { a: 5, b: 3 };
    expect(res).toEqual(expected);
  });

  it('returns identity for empty objects', () => {
    const input = {};

    const res = omitPrivateFields(input);

    const expected = {};
    expect(res).toEqual(expected);
  });
});
