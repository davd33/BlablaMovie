import { HttpException, HttpStatus } from "@nestjs/common";

function isTestEnv() {
  return process.env.ASSERTS === "ON"
}

export function assert(predicate: () => boolean, msg = "") {
  if (isTestEnv()) {
    assert(predicate, msg);
  }
}

export async function promiseOrThrow<T>(lambda: () => Promise<T>) {
  try {
    return await lambda();
  }
  catch (e) {
    throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
  }
}
