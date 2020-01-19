jest.mock("../src/uniqid");

const uniqidMock = require("../src/uniqid");

const LIB = "@impress/react";
const UNIQ_1 = "5m6";
const UNIQ_2 = "5m7";

function transform(code) {
  return require("@babel/core").transform(code, {
    plugins: [ require("../src") ],
    code: true,
    ast: false,
  }).code;
}

beforeEach(() => {
  uniqidMock
  .mockReset()
  .mockReturnValueOnce(UNIQ_1)
  .mockReturnValueOnce(UNIQ_2);
});

test("Should pass class without decorators", () => {
  const code = `class A {
  n = 0;
  m() {}
}`;
  const transformedCode = `class A {
  n = 0;

  m() {}

}`;
  expect(transform(code)).toBe(transformedCode);
});

test("Should pass class with another decorator", () => {
  const code = `class C {
  @some c;
}`;

  const transformedCode = `class C {
  @some
  c;
}`;

  expect(transform(code)).toBe(transformedCode);
});

test("Should work with class expression", () => {
  const code = `hello(@mut class {
  @store data;
});`;

  const transformedCode = `hello(require("${LIB}").register("${UNIQ_1}", @mut
class {
  @store
  data;
}));`;

  expect(transform(code)).toBe(transformedCode);
});

test("Should work with class declaration", () => {
  const code = `
@mut
export class A {
  @store data;
}
class B {
  @store a;
  @store b;
}`;

  const transformedCode = `export @mut
class A {
  @store
  data;
}

require("${LIB}").register("A_${UNIQ_1}", A);

class B {
  @store
  a;
  @store
  b;
}

require("${LIB}").register("B_${UNIQ_2}", B);`;

  expect(transform(code)).toBe(transformedCode);
});