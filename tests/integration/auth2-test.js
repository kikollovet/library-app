import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn, pauseTest, find, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import $ from 'jquery';
import { currentSession } from 'ember-simple-auth/test-support';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Service from '@ember/service';

module('Acceptance | login Authentificated', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting admin invitations with proper authorization', async function(assert) {

    this.owner.register('service:logged-user', class TestService extends Service {
      @tracked user = {email: 'ola@test.com'}
    });


    
    // await visit('admin/invitations');
    // await fillIn('input#emailField', 'user@teste.com');
    // await fillIn('input#passwordField', 'testeteste');
    
    currentSession(this.application).isAuthenticated = true;
    currentSession(this.application).sessionDataUpdated;
    // await click('button#submitButton');
  
    await visit('admin/invitations');
    await pauseTest();
    assert.equal(currentURL(), 'admin/invitations');
    assert.equal(this.element.querySelector('h1').textContent, 'Invitations');
    //assert.equal(find('.invitationEmail').textContent, 'user@teste.com');
  });
});