import Route from '@ember/routing/route';

export default Route.extend({

    model() {
        return this.store.createRecord('contact');
    },

    actions: {

        sendContactMessage(newContact) {
            
            newContact.save().then(() => newContact.set('responseMessage', true));
            //this.controller.get('model').set('responseMessage', true);
        },

        willTransaction() {
            this.controller.get('model').rollbackAttributes();
        }
    }
});

