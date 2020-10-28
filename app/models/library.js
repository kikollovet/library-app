import Model, { attr } from '@ember-data/model';
import DS from 'ember-data';
import { notEmpty } from '@ember/object/computed';
import Faker from 'faker';

// export default class LibraryModel extends Model {
//   @attr('string') name;
//   @attr('string') address;
//   @attr('string') phone;
// }

export default DS.Model.extend({

    name: DS.attr('string'),
    address: DS.attr('string'),
    phone: DS.attr('string'),

    books: DS.hasMany('book'),

    isValid: notEmpty('name'),

    randomize() {
        this.set('name', Faker.company.companyName() + ' Library');
        this.set('address', this._fullAddress());
        this.set('phone', Faker.phone.phoneNumber());

        return this;
    },

    _fullAddress() {
        return `${Faker.address.streetAddress()}, ${Faker.address.city()}`;
    }
});
