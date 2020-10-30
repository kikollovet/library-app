import Controller from '@ember/controller';
import { match, not } from '@ember/object/computed';
import { gte } from '@ember/object/computed';
import { and } from '@ember/object/computed';

export default Controller.extend ({

    emailAddress: '',
    message: '',

    isValidEmail: match('emailAddress', /^.+@.+\..+$/),
    isLongEnough: gte("message.length", 5),
    isBothTrue: and('isValidEmail','isLongEnough'),
    isDisabled: not('isBothTrue'),

    actions: {

        sendContactMessage() {
            
            const email = this.get('emailAddress');
            const message = this.get('message');

            const newContact = this.store.createRecord('contact', { email, message });
           
            newContact.save().then(response => {
                this.set('confirmationMessage', `Thank you! We got your message`);
                this.set('emailAddress', '');
                this.set('message', '');
            }) 
        },

        willTransaction() {
            this.controller.get('model').rollbackAttributes();
        }
    }
})
