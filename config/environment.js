'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'library-app',
    environment,
    rootURL: '/',
    locationType: 'auto',

    firebase: {
      apiKey: 'AIzaSyDhMxUwb88en8wIInOEDUb0OnTMk_UI_eU',
      authDomain: 'library-app-d127b.firebaseapp.com',
      databaseURL: 'https://library-app-d127b.firebaseio.com',
      projectId: 'library-app-d127b',
      storageBucket: 'library-app-d127b.appspot.com',
      messagingSenderId: '989821641053',
      appId: "1:989821641053:web:9f8eba505a7436fbf108b4"
    },   

    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
    ENV['ember-local-storage'] = {
      namespace: 'testData', // will use 'customNamespace'
      keyDelimiter: '/', // will use / as a delimiter - the default is :
      includeEmberDataSupport: true
    }
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
    ENV['ember-faker'] = {
      enabled: true
    };
  }

  return ENV;
};
