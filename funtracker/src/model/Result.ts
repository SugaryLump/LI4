export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E};

class Failure<E = Error> {
  constructor(public readonly value: E) {}
}

export function fail<T , E = Error>(
  f: (
    (arg: {
      success(value: T): Result<T, E>;
      fail(error: E): Result<T, E>;
      run<R>(func: () => Result<R, E>): R;
    }) => Result<T, E>
  )
): Result<T, E> {
  try {
    return f({
      success(value) {
        return {
          ok: true,
          value: value
        }
      },
      fail(error) {
        return {
          ok: false,
          error: error
        }
      },
      run(func) {
        const result = func()
        if (!result.ok) {
            throw new Failure(result.error)
        } else {
          return result.value
        }
    }
    })
  } catch (e) {
    if (e instanceof Failure) {
      return {
        ok: false,
        error: e.value
      }
    } else {
      throw e
    }
  }
}
