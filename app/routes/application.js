import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

    session: service(),
    actions: {
        logout() {
            return this.get('session').invalidate().catch(function(error) {
                
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode, errorMessage);

                }).then(() => {
            
                    this.transitionTo('')
            
            })
        }
    }
})