// import Route from '@ember/routing/route';

// export default class AdminContactssRoute extends Route {
// }
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin,{

  model() {
    return this.store.findAll('contact');
  },

  actions: {

    deleteContact(contact) {
      let confirmation = confirm('Are you sure?');

      if (confirmation) {
        contact.destroyRecord();
      }
    }
  }

});
