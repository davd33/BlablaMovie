import { HttpException, HttpStatus } from "@nestjs/common";
import { UsersService } from "./users/users.service";

function isTestEnv() {
  return process.env.ASSERTS === "ON"
}

export function assert(predicate: () => boolean, msg = "") {
  if (isTestEnv()) {
    assert(predicate, msg);
  }
}

export const NO_AUTH_REQUIRED = null;

export async function promiseOrThrow<T>(
  auth: { userName: string, token: string },
  users: UsersService,
  lambda: () => Promise<T>) {

  try {
    if (auth !== null) {
      const authorized = await users.authorized(auth.userName, auth.token);
      if (!authorized) {
        throw new Error("User not logged in.")
      }
    }

    return await lambda();
  }
  catch (e) {
    throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
  }
}

export function getWeekNumber(date: Date) {
  // Copy date so don't modify original
  const d: any = new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart: any = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo: number = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}
