// import Model, { attr, hasMany } from '@ember-data/model';

// export default class AuthorModel extends Model {
//   @attr('string') name;
//   @hasMany books;
// }

import { empty } from '@ember/object/computed';
import DS from 'ember-data';
import Faker from 'faker';

export default DS.Model.extend({

    name: DS.attr('string'),
    books: DS.hasMany('book', { inverse: 'author', async: true }),

    isNotValid: empty('name'),

    randomize() {
      this.set('name', Faker.name.findName());
      return this;
    }
});