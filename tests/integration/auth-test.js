import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

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
});