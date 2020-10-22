// import Route from '@ember/routing/route';

// export default class AdminInvitationsRoute extends Route {
// }

import Route from '@ember/routing/route';

export default Route.extend({

  model() {
    return this.store.findAll('invitation');
  }

});
