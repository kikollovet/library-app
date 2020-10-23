// import Route from '@ember/routing/route';

// export default class ContactRoute extends Route {
// }

import Route from '@ember/routing/route';
import EmberResolver from 'ember-resolver';

export default Route.extend({

    // email: '',
    confirmationMessage: 'testandooooooo',
    
    

    model() {
        return this.store.createRecord('contact');
        

        
    },

    // model() {
    //     let response = await fetch('/api/rentals.json');
    //     let { data } = await response.json();
    
    //     return data.map(model => {
    //       let { attributes } = model;
    //       let { id, attributes } = model;
    //       let type;
    
    //       if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
    //         type = 'Community';
    //       } else {
    //         type = 'Standalone';
    //       }
    
    //       return { type, ...attributes };
    //     });
    //   },
    

    actions: {

        setupController(model, controller) {
            this._super(controller, model)
            
    
            //controller.set('model', model)
            model.setProperties(
              contact = {
                email: '',
                message: '',
                confirmationMessage: ''
              }
            )
          },
        sendContactMessage(newContact) {
            

            newContact.save().then((response) => {
               
                
                    // set('confirmationMessage', `Thank you! We got your message`);
                    // set('emailAddress', '');
                    // set('message', '');
                
               
                let contact = {
                    email: '',
                    message: '',
                    confirmationMessage: 'aaaaaaaa',
                  }
                //   console.log(cont)
                //   console.log(this.confirmationMessage)
                //   this.modelFor('contact').set('confirmationMessage', `Thank you! We got your message`);
                  //set('confirmationMessage', `Thank you! We got your message`);
                  //this.controller.set('contact', cont)
                
                //mensagem funciona
                this.modelFor('contact').set('confirmationMessage', `Thank you! We got your message`);
                //this.controller.set(confirmationMessage, conf);
                Ember.set(contact, 'confirmationMessage', '234');
                Ember.set(contact, 'email', '234aa');
                Ember.set(contact, 'message', '234aa');
                console.log(contact);
                //this.modelFor('contact').set('message', '');
                //this.setProperties('email', '');
                //this.transitionTo('admin.contacts');
            }) 

            // var route = this;
            // newContact.save()
            // route.currentModel.get('contact').then((contact) => {
            //     contact.set()
            // })
        },

        //  willTransaction() {
        //      this.controller.get('model').rollbackAttributes();
        // }
    }
});
