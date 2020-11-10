// import Route from '@ember/routing/route';

// export default class LoginRoute extends Route {
// }

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import firebase from 'firebase/app';

export default Route.extend({
    
    session: service(),
    firebaseApp: service(),
    
    model() {
        return {email: '', password: ''}
    },
      
    actions: {
        async login(user) {
            const auth = await this.get('firebaseApp').auth();
            
            return auth.signInWithEmailAndPassword(user.email, user.password).catch(function(error) {

                 var errorCode = error.code;
                 var errorMessage = error.message;
                 console.log(errorCode, errorMessage);

               }).then(() => {
    
                    if(this.get('session.attemptedTransition')){
                        this.get('session.attemptedTransition').retry();
                    } else {
                        this.transitionTo("admin.invitations")
                    }
           
                });
            }
        }
});
