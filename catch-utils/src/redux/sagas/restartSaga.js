import { call, fork } from 'redux-saga/effects';
import { delay } from 'redux-saga';

export function makeRestartable(saga, retries = 10, initialDelay = 200) {
  return function* restartableSaga() {
    let maxRetries = retries;
    let delayTime = initialDelay;

    yield fork(function*() {
      while (maxRetries >= 0) {
        try {
          yield call(saga);
          console.error(
            'unexpected root saga termination. The root sagas are supposed to be sagas that live during the whole app lifetime!',
            saga,
          );
        } catch (e) {
          console.error(
            `Saga error, the saga will be restarted in: ${delayTime}`,
            e,
          );
        }
        // Exponentially backoff until max retries is reached
        yield delay(delayTime);
        maxRetries--;
        delayTime = delayTime * 2;
      }

      // TODO: if we made it to this part of the saga we should DEFINITELY be
      // sending some sort of error report.  If sagas are expontially unable to
      // restart than there is a bug in our code that needs to be addressed
      // ASAP.
    });
  };
}
