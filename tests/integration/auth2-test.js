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

  test('sending an invitation, visiting admin invitations with authorization, confirming' +
   ' invitation sended + creating libraries and authors using fake + creating a library using form', async function(assert) {

    this.owner.register('service:logged-user', class TestService extends Service {
      @tracked user = {email: 'user@teste.com'}
    });

    this.owner.register('adapter:application', class TestService extends Adapter {
   
    });

    await visit('');
    await fillIn('[data-test="emailField"]', 'cool@cool.com');
    await pauseTest();
    await click('[data-test="saveInvitation"]');
    await pauseTest();

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
    assert.equal(find('[data-test="invitationEmail"]').textContent, 'cool@cool.com');

    await visit('libraries/new');
    await pauseTest();
    await fillIn(this.element.querySelectorAll('input')[0], "Biblioteca Penha")
    await pauseTest();
    await fillIn(this.element.querySelectorAll('input')[1], "Rua do Bosque, 989")
    await pauseTest();
    await fillIn(this.element.querySelectorAll('input')[2], "(11) 4444-3333")
    await pauseTest();
    await click('[data-test="saveLibrary"]');
    await visit('libraries');
    await pauseTest();

    assert.equal(find(this.element.querySelectorAll('p')[0]).textContent, 'Biblioteca Penha');
    assert.equal(find(this.element.querySelectorAll('p')[1]).textContent, 'Address: Rua do Bosque, 989');
    assert.equal(find(this.element.querySelectorAll('p')[2]).textContent, 'Phone: (11) 4444-3333');

    await visit('admin/seeder');
    await fillIn('[data-test="libInput"]', '2');
    await pauseTest();
    await click('[data-test="libButton"]')
    await pauseTest();
    await fillIn('[data-test="authorInput"]', '4');
    await pauseTest();
    await click('[data-test="authorButton"]')
    await pauseTest();
    assert.equal(find('[data-test="numberLib"]').textContent, '3');
    assert.equal(find('[data-test="numberAuthor"]').textContent, '4');

    let numberBooks = (this.element.querySelector('[data-test="numberBook"]')).textContent
    console.log("numero de livros: " + numberBooks)

    let numberBooksInt = parseInt(numberBooks)

    await visit('libraries');
    assert.equal(findAll('.card-body').length, 3);
    await pauseTest();

    await visit('authors');
    assert.equal(findAll('[data-test="author"]').length, 4);
    //assert.equal(findAll('[data-test="book"]').length, numberBooksInt);
    assert.equal(findAll('[data-test="book"]').length, numberBooksInt);
    await pauseTest();

    //await click('button#logoutButton');
    await invalidateSession();
    
    await visit('admin/contacts');
    await pauseTest();
    assert.equal(currentURL(), '/login');
  });
});