import React from 'react';

import Env from '../env';
import Log from '../logger';

// This is supposed to set properties on user, not trackEvents (yes there's a difference)

// https://www.intercom.com/help/configure-intercom-for-your-product-or-site/customize-intercom-to-be-about-your-users/send-custom-user-attributes-to-intercom

export const trackIntercom = payload => {
  if (!Env.isLocal && !Env.isTest) {
    return new Promise((resolve, reject) => {
      if (window.IntercomSettings) {
        const newSettings = Object.assign(window.intercomSettings, payload);
        window.IntercomSettings = newSettings;
      }
      reject('Intercom not available');
    });
  }
  Log.info(`logged Intercom event ${payload} `, 'intercom-tracking');
};
