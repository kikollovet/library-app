import DS from 'ember-data';
import { match, not } from '@ember/object/computed';
import { gte } from '@ember/object/computed';
import { and } from '@ember/object/computed';


export default DS.Model.extend({
  email: DS.attr('string'),
  message: DS.attr('string'),

  isValidEmail: match('email', /^.+@.+\..+$/),
  isLongEnough: gte("message.length", 5),
  isBothTrue: and('isValidEmail','isLongEnough'),
  isDisabled: not('isBothTrue'),
});

