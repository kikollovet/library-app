import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import firebase from 'firebase/app';

export default Controller.extend ({

    session: service(),
    
    loggedUser: service(),

})