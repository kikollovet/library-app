// import Route from '@ember/routing/route';

// export default class AdminInvitationsRoute extends Route {
// }

import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin,{

  model() {
    return this.store.findAll('invitation');
  },

  actions: {

    deleteInvitation(invitation) {
      let confirmation = confirm('Are you sure?');

      if (confirmation) {
        invitation.destroyRecord();
      }
    }
  }

});
