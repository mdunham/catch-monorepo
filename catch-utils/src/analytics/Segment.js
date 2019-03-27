import { createLogger } from '../logger';

const Log = createLogger('analytics:');

export function initAnalytics(segmentKey, debug) {
  // Create a queue, but don't obliterate an existing one!
  const analytics = (window.analytics = window.analytics || []);

  // If the real analytics.js is already on the page return.
  if (analytics.initialize) return;

  // If the snippet was invoked already show an error.
  if (analytics.invoked) {
    if (window.console && console.error) {
      console.error('Segment snippet included twice.');
    }
    return;
  }

  // Invoked flag, to make sure the snippet
  // is never invoked twice.
  analytics.invoked = true;

  // A list of the methods in Analytics.js to stub.
  analytics.methods = [
    'trackSubmit',
    'trackClick',
    'trackLink',
    'trackForm',
    'pageview',
    'identify',
    'reset',
    'group',
    'track',
    'ready',
    'alias',
    'debug',
    'page',
    'once',
    'off',
    'on',
  ];

  // Define a factory to create stubs. These are placeholders
  // for methods in Analytics.js so that you never have to wait
  // for it to load to actually record data. The `method` is
  // stored as the first argument, so we can replay the data.
  analytics.factory = function(method) {
    return function() {
      const args = Array.prototype.slice.call(arguments);
      args.unshift(method);
      analytics.push(args);
      return analytics;
    };
  };

  // For each of our methods, generate a queueing stub.
  for (let i = 0; i < analytics.methods.length; i++) {
    const key = analytics.methods[i];
    analytics[key] = analytics.factory(key);
  }

  // Define a method to load Analytics.js from their CDN,
  // and that will be sure to only ever load it once.
  analytics.load = function(key, options) {
    // Create an async script element based on your key.
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src =
      'https://cdn.segment.com/analytics.js/v1/' + key + '/analytics.min.js';

    // Insert our script next to the first script element.
    const first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(script, first);
    analytics._loadOptions = options;
  };

  // Add a version to keep track of what's in the wild.
  analytics.SNIPPET_VERSION = '4.1.0';

  // Load Analytics.js with proper environment key, which will automatically
  // load the tools we've enabled.
  analytics.load(segmentKey);

  // Debug should display some useful messages
  if (debug) {
    analytics.debug();
  }

  // Make the first page call to load the integrations.
  analytics.page();
}

// We can create custom analytics methods or getters here
// this makes sure the script is loaded and we get the most
// recent instance of it
// It may also be helpful to see what we are capturing in a centralized way
export default {
  get analytics() {
    return window.analytics;
  },
  identifyUser(userID, email, traits) {
    Log.debug({ userID, email, ...traits });
    if (!this.analytics) return;
    this.analytics.identify(userID, {
      email,
      ...traits,
    });
  },
  pageView() {
    if (!this.analytics) {
      return;
    }
    this.analytics.page();
  },
  copiedRefLink(referralLink) {
    if (!this.analytics) return;
    const eName = 'User Copied Referral Link';
    this.analytics.track(
      eName,
      {
        referral_link: referralLink,
      },
      {},
      () => Log.debug(eName),
    );
  },
  // Triggered in BankSuccessView.js
  bankLinked(bankName) {
    const eName = 'Bank Linked';
    if (!this.analytics) return;
    this.analytics.track(
      eName,
      {
        bank_name: bankName,
      },
      {},
      () => Log.debug(eName, bankName),
    );
  },
  goalAdded(goalType) {
    const eName = 'Goal Added';
    if (!this.analytics) return;
    this.analytics.track(
      eName,
      {
        goal_type: goalType,
      },
      {},
      () => Log.debug(eName, goalType),
    );
  },
  fundsWithheld(value) {
    const eName = 'Funds Withheld';
    if (!this.analytics) return;
    this.analytics.track(
      eName,
      {
        value,
      },
      {},
      () => Log.debug(eName, value),
    );
  },
  fundsDeposited(value) {
    const eName = 'Funds Deposited';
    if (!this.analytics) return;
    this.analytics.track(eName, { value }, {}, () => Log.debug(eName, value));
  },
  userCreated(email) {
    const eName = 'User Created';
    if (!this.analytics) return;
    this.analytics.track(eName, { email }, {}, () => Log.debug(eName, email));
  },
  interestExpressed(benefit, cb) {
    const eName = 'Interest Expressed';
    if (!this.analytics) {
      if (cb) cb();
      return;
    }
    const lcName = benefit && benefit.toLowerCase();
    const type = lcName ? lcName.slice(9) : 'unknown';
    this.analytics.identify({
      [`interested_${type}`]: true,
    });
    this.analytics.track(eName, { benefit: type }, {}, cb);
  },
  checkupCompleted() {
    const eName = 'Checkup Completed';
    if (!this.analytics) return;
    this.analytics.track(eName, {}, {}, () => Log.debug(eName));
  },
  guideCardOpened(benefit) {
    const eName = 'Guide Card Opened';
    if (!this.analytics) return;
    const lcName = benefit && benefit.toLowerCase();
    const type = lcName ? lcName.slice(9) : 'unknown';
    this.analytics.track(eName, { benefit: type }, {}, () => Log.debug(eName));
  },
  healthPlanViewed(healthplanID) {
    const eName = 'Health Plan Viewed';
    if (!this.analytics) return;
    this.analytics.track(eName, { healthplan_id: healthplanID }, {}, () =>
      Log.debug(eName),
    );
  },
  healthQLEChecked(lifeEvent) {
    const eName = 'Health QLE Checked';
    if (!this.analytics) return;
    this.analytics.identify({
      life_event: lifeEvent || 'NA',
    });
    this.analytics.track(eName);
  },
};
