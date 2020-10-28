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

        willTransition(transition) {

            let model = this.controller.get('model');

            if (model.get('hasDirtyAttributes')) {
                let confirmation = confirm("Your changes haven't saved yet. Would you like to leave this form?");

                if(confirmation) {
                    model.rollbackAttributes();
                } else {
                    transition.abort();
                }
            }
        }
    }
});