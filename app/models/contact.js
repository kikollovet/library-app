// import Model, { attr } from '@ember-data/model';

// export default class ContactModel extends Model {
//   @attr('string') email;
//   @attr('string') message;
// }

import DS from 'ember-data';


export default DS.Model.extend({
  email: DS.attr('string'),
  message: DS.attr('string'),

});

