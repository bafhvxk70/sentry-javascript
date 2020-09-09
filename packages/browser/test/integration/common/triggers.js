// All the functions below can be called within the iframe under the test

function bar() {
  baz();
}

function foo() {
  bar();
}

function foo2() {
  // identical to foo, but meant for testing
  // different stack frame fns w/ same stack length
  bar();
}

function throwNonError() {
  try {
    throw { foo: "bar" };
  } catch (o_O) {
    Beidou.captureException(o_O);
  }
}

function throwError(message) {
  // eslint-disable-next-line no-param-reassign
  message = message || "foo";
  try {
    throw new Error(message);
  } catch (o_O) {
    Beidou.captureException(o_O);
  }
}

function throwRandomError() {
  try {
    throw new Error("Exception no " + (Date.now() + Math.random()));
  } catch (o_O) {
    Beidou.captureException(o_O);
  }
}

function throwSameConsecutiveErrors(message) {
  throwError(message);
  throwError(message);
}

function captureMessage(message) {
  // eslint-disable-next-line no-param-reassign
  message = message || "message";
  Beidou.captureMessage(message);
}

function captureRandomMessage() {
  Beidou.captureMessage("Message no " + (Date.now() + Math.random()));
}

function captureSameConsecutiveMessages(message) {
  captureMessage(message);
  captureMessage(message);
}
