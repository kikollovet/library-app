import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn, pauseTest, find, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { currentSession, authenticateSession, invalidateSession } from 'ember-simple-auth/test-support';
import { tracked } from '@glimmer/tracking';
import Service from '@ember/service';
import Adapter from 'ember-local-storage/adapters/local';
import resetStorages from 'ember-local-storage/test-support/reset-storage';

module('Acceptance | Main flow of Application', function(hooks) {
  setupApplicationTest(hooks);

  //This makes the database empty after the end of the test
  hooks.afterEach(function() {
    if (window.localStorage) {
      window.localStorage.clear();
    }
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
    resetStorages();
  });

  test('Main flow of the application', async function(assert) {

    //This service is needed to mock the real service that needs a real conection with firebase auth
    this.owner.register('service:logged-user', class TestService extends Service {
      @tracked user = {email: 'user@teste.com'}
    });

    //This adapter is used to use ember local storage instead of firestore
    this.owner.register('adapter:application', class TestService extends Adapter {
   
    });

    //These three asserts prove that an unauthorized user can´t see the content of the pages and are redirected
    //to login form
    await visit('admin/invitations');
    assert.equal(currentURL(), '/login', 'Assert unauthorized route admin/invitations');

    await visit('admin/contacts');
    assert.equal(currentURL(), '/login', 'Assert unauthorized route admin/contacts');

    await visit('admin/seeder');
    assert.equal(currentURL(), '/login', 'Assert unauthorized route admin/seeder');

    //Sending an invitation.
    await visit('');
    await fillIn('[data-test="emailField"]', 'cool@cool.com');
    await pauseTest();
    await click('[data-test="saveInvitation"]');
    await pauseTest();

    //Sending a contact message. 
    await visit('contact');
    await fillIn('[data-test="contactEmail"]', 'hellofrommars@gmaioul.com')
    await fillIn('[data-test="contactMessage"]', 'Hello!! Greetings from Mars!!')
    await pauseTest();
    await click('[data-test="saveContact"]');
    await pauseTest();

    //Visiting admin/invitations without login so when the login is done you are redirected to
    //admin/invitations
    await visit('admin/invitations');
    
    //Authenticating the session with ember-simple-auth/test-support
    await authenticateSession();
    await pauseTest();
    
    //Asserting that you are redirected to the last atempted route after login (authenticateSession())
    assert.equal(currentURL(), '/admin/invitations', "Confirm redirected after authenticateSession");
    assert.equal(this.element.querySelector('h1').textContent, 'Invitations', "Confirm is in invitation page");

    //Asserting that the invitation was stored in local database and is show in the page
    assert.equal(find('[data-test="invitationEmail"]').textContent, 'cool@cool.com',
      "Assert invitation saved previously is show in admin/invitations");

    //Asserting that the contact message was stored in local database and is show in the page
    await visit('admin/contacts');
    await pauseTest();
    assert.equal(find('.card-header').innerText, 'hellofrommars@gmaioul.com', 
      "Assert contact email saved previously is show in admin/contacts");
    assert.equal(find('h5').innerText, 'Hello!! Greetings from Mars!!',
      "Assert contact message saved previously is show in admin/contacts");
  
    //Populating the form and saving a Library
    await visit('libraries/new');
    await pauseTest();
    await fillIn('[data-test="nameLib"]', "Biblioteca Penha");
    await pauseTest();
    await fillIn('[data-test="addressLib"]', "Rua do Bosque, 989");
    await pauseTest();
    await fillIn('[data-test="phoneLib"]', "(11) 4444-3333");
    await pauseTest();
    await click('[data-test="saveLibrary"]');
    
    //Asserting that the library was stored in local database and is show in the page
    await visit('libraries');
    await pauseTest();
    const pElement = findAll('p')
    assert.equal(find('[data-test="libName"]').textContent, 'Biblioteca Penha',
      'Assert library name saved previously');
    assert.equal(find('[data-test="libAddress"]').textContent, 'Address: Rua do Bosque, 989',
      'Assert library address saved previously');
    assert.equal(find('[data-test="libPhone"]').textContent, 'Phone: (11) 4444-3333',
      'Assert library phone saved previously');

    //Filling the fields of seeder form to create libraries, books and authors with ember-faker
    //Filling 2 to create 2 libraries
    //Filling 4 to create 4 authors and a random number of books
    await visit('admin/seeder');
    await fillIn('[data-test="libInput"]', '2');
    await pauseTest();
    await click('[data-test="libButton"]')
    await pauseTest();
    await fillIn('[data-test="authorInput"]', '4');
    await pauseTest();
    await click('[data-test="authorButton"]')
    await pauseTest();

    //Asserting that the numbers of libraries and authors created are equal to the numbers filled in the form
    //Remeber that the number of libraries is three because I created 1 before in the form
    //Attention, here we are still in seeder page and the numbers I get from the respective number box.
    assert.equal(find('[data-test="numberLib"]').textContent, '3',
      'Assert total number of libraries in the corresponding number box');
    assert.equal(find('[data-test="numberAuthor"]').textContent, '4',
      'Assert total number of authors in the corresponding number box');

    //The numbers of book created by the seeder is always random, so here I´m getting this random number of
    //books from the respective number box to use later in an assertion
    let numberBooks = (this.element.querySelector('[data-test="numberBook"]')).textContent
    let numberBooksInt = parseInt(numberBooks)

    //Asserting that there are 3 libraries cards because 1 I created in the form and two created with the 
    //seeder
    //Here the assertion works by counting the html elements with their respective data-test attributes,
    //so, there must be three .card-body that means three libraries
    await visit('libraries');
    assert.dom('.card-body').exists({count: 3}, 'Assert the correct number of library cards');
    await pauseTest();

    //Asserting the number of authors and books created by the seeder in authors page
    //(Here I use let numberBooksInt)
    //Here the assertion works by counting the html elements with their respective data-test attributes.
    //Its the same as was with the libraries, suppose there is 20 authors, there will be 20 data-test="book"
    //elements
    await visit('authors');
    assert.dom('[data-test="author"]').exists({count: 4}, 'Assert the total number of authors in the table');
    assert.dom('[data-test="book"]').exists({count: numberBooksInt}, 
      'Assert the total number of books show in table');
    await pauseTest();

    //Invalidating the session
    await invalidateSession();
    
    //I don´t know why but it doesn´t redirect to '/' just in the test as it is supposed to do after the 
    //"log out", so I visit a protected page and assert that after invalidateSession() the user
    //is logged out of the system and is redirected to login page
    await visit('admin/contacts');
    await pauseTest();
    assert.equal(currentURL(), '/login', 
      'Assert after being logged out you can´t enter protected routes');
  });
});