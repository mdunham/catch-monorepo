import { delay } from 'redux-saga';
import { fork, take, all, call, put } from 'redux-saga/effects';
import { actions, constants as at } from './duck';

import { createLogger } from '@catch/utils';

const Log = createLogger('toaastss');

// Constants to affect the toast system
const MAX_TOASTS = 3;

export default function* rootSaga() {
  let pendingToasts = [];
  let activeToasts = [];

  function* displayToast(toast) {
    if (activeToasts.length >= MAX_TOASTS) {
      throw new Error(
        "can't display more than " + MAX_TOASTS + ' at the same time',
      );
    }
    activeToasts = [...activeToasts, toast];
    yield put(actions.toastDisplayed(toast));
    yield call(delay, toast.autoCloseIn);
    yield put(actions.toastHidden(toast));
    activeToasts = activeToasts.filter(t => t.id !== toast.id);
  }

  function* toastRequestsWatcher() {
    while (true) {
      const action = yield take(at.TOAST_REQUESTED);
      const newToast = action.payload;
      pendingToasts = [...pendingToasts, newToast];
    }
  }

  // We try to read the queued toasts periodically and display a toast if it's a good time to do so...
  function* toastScheduler() {
    while (true) {
      const canDisplayToast =
        activeToasts.length < MAX_TOASTS && pendingToasts.length > 0;
      if (canDisplayToast) {
        const [firstToast, ...remainingToasts] = pendingToasts;
        pendingToasts = remainingToasts;
        yield fork(displayToast, firstToast);
        yield call(delay, 300);
      } else {
        yield call(delay, 50);
      }
    }
  }

  yield all([call(toastRequestsWatcher), call(toastScheduler)]);
}
