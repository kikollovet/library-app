import Model, { attr } from '@ember-data/model';
import DS from 'ember-data';
import { notEmpty } from '@ember/object/computed';

// export default class LibraryModel extends Model {
//   @attr('string') name;
//   @attr('string') address;
//   @attr('string') phone;
// }

export default DS.Model.extend({

  name: DS.attr('string'),
  address: DS.attr('string'),
  phone: DS.attr('string'),

  isValid: notEmpty('name')
});
