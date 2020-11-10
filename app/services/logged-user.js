import Service from '@ember/service';
import firebase from 'firebase/app';
import { tracked } from '@glimmer/tracking';

export default class LoggedUserService extends Service {

    @tracked user = firebase.auth().currentUser;
    
}
