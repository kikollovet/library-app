import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin,{

    session: service(),
    actions:{
        logout(){
            return this.get('session').invalidate().catch(function(error) {
                
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage);

            })
        }
    }

})