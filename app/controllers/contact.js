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
            alert(`Sending contact message from ${this.get('emailAddress')}\nMessage: ${this.get('message')}`);
            this.set('confirmationMessage', `We got your message and we’ll get in touch soon`);
            this.set('emailAddress', '');
            this.set('message', '');
        }
    }
})
