// import Route from '@ember/routing/route';

// export default class LoginRoute extends Route {
// }

import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import firebase from 'firebase/app';

export default Controller.extend({
    
    session: service(),
    firebaseApp: service(),
      
    actions: {
        async login() {
            const auth = await this.get('firebaseApp').auth();

            const email = this.get('email');
            const password = this.get('password');
            
            return auth.signInWithEmailAndPassword(email, password).catch((error) => {

                 var errorCode = error.code;
                 var errorMessage = error.message;
                 console.log(errorCode, errorMessage);

                this.set('errorLogin', errorMessage)

               })
            }
        }
});
