import Route from '@ember/routing/route';

export default Route.extend({

    model() {
        return this.store.createRecord('library');
    },

    setupController(controller, model) {
        this._super(controller, model);
    
        controller.set('title', 'Edit library');
        controller.set('buttonLabel', 'Create');
    },

    renderTemplate() {
        this.render('libraries/form');
    },

    actions: {
        saveLibrary(newLibrary) {
            newLibrary.save().then(() => this.transitionTo('libraries'));
        },

        willTransaction() {
            let model = this.controller.get('model');

            if (model.get('isNew')) {
                model.destroyRecord();
            }
        }
    }
});