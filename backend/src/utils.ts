function isTestEnv() {
  return process.env.ASSERTS === "ON"
}

export function assert(predicate: () => boolean, msg = "") {
  if (isTestEnv()) {
    assert(predicate, msg);
  }
}
