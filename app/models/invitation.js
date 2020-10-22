//import Model, { attr } from '@ember-data/model';
import DS from 'ember-data';

// export default class InvitationModel extends Model {
//   @attr('string') email;
// }

export default DS.Model.extend({
 email: DS.attr('string')
});
