import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
//import JSONAPIAdapter from '@ember-data/adapter/json-api';

module('Acceptance | login unauthorized', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting admin invitations without authorization (without being logged)', async function(assert) {
    await visit('admin/invitations');
    assert.equal(currentURL(), '/login');
  });

  test('visiting admin contacts without authorization (without being logged)', async function(assert) {
    await visit('admin/contacts');
    assert.equal(currentURL(), '/login');
  });

  test('visiting admin seeder without authorization (without being logged)', async function(assert) {
    await visit('admin/seeder');
    assert.equal(currentURL(), '/login');
  });

  // test('Saving Invitation', async function(assert) {
  //  // this.owner.register('adapter:application', class TestAdapter extends JSONAPIAdapter {
  //  // });
  //   await visit('');
  //   await fillIn('input#emailField', 'insertionfromTHETEST@teste.com');
  //   await click('button#submitButton');
  //   assert.equal(currentURL(), '');
  // });
});