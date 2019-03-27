import { Env } from '@catch/utils';

class NotificationsManager {
  constructor() {
    this.source = new EventSource(Env.serverEvents.uri);
  }
  addListener = cb => {
    this.source.onmessage = e => {
      cb(e);
    };
  };
  closeListener = _ => {
    this.source.close();
  };
}

export default NotificationsManager;
