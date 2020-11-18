import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn, pauseTest, find, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { currentSession, authenticateSession, invalidateSession } from 'ember-simple-auth/test-support';
import { tracked } from '@glimmer/tracking';
import Service from '@ember/service';
import Adapter from 'ember-local-storage/adapters/local';
import resetStorages from 'ember-local-storage/test-support/reset-storage';

module('Acceptance | login Authentificated', function(hooks) {
  setupApplicationTest(hooks);

  hooks.afterEach(function() {
    if (window.localStorage) {
      window.localStorage.clear();
    }
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
    resetStorages();
  });

  test('sending an invitation, visiting admin invitations with authorization, confirming invitation sended', async function(assert) {

    this.owner.register('service:logged-user', class TestService extends Service {
      @tracked user = {email: 'user@teste.com'}
    });

    this.owner.register('adapter:application', class TestService extends Adapter {
   
    });

    await visit('');
      await fillIn('input#emailField', 'cool@cool.com');
      await click('button#submitButton');

    await visit('admin/invitations');
    // await fillIn('input#emailField', 'user@teste.com');
    // await fillIn('input#passwordField', 'testeteste');
    // await click('button#submitButton');

    // currentSession(this.application).isAuthenticated = true;
    // currentSession(this.application).sessionDataUpdated;
    
    await authenticateSession();
    await pauseTest();
    
    assert.equal(currentURL(), '/admin/invitations');
    assert.equal(this.element.querySelector('h1').textContent, 'Invitations');
    assert.equal(find('.invitationEmail').textContent, 'cool@cool.com');
    
    //await click('button#logoutButton');
    await invalidateSession();
    
    await visit('admin/contacts');
    await pauseTest();
    assert.equal(currentURL(), '/login');
  });
});