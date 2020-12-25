import Route from '@ember/routing/route';

export default Route.extend({

    model() {
        return this.store.createRecord('contact');
    },

    actions: {

        sendContactMessage(newContact) {
            
            newContact.save().then(() => newContact.set('responseMessage', true));
        },

        willTransition(transition) {

            let model = this.controller.get('model');

            if (model.get('hasDirtyAttributes')) {
                    model.rollbackAttributes(); 
            }
        }
    }
});

