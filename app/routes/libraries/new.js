import Route from '@ember/routing/route';

export default Route.extend({

    model() {
        return this.store.createRecord('library');
    },

    actions: {
        saveLibrary(newLibrary) {
            newLibrary.save().then(() => this.transitionTo('libraries'));
        },

        willTransaction() {
            this.controller.get('model').rollbackAttributes();
        }
    }
});