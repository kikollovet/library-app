import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn, pauseTest, find, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { currentSession, authenticateSession, invalidateSession } from 'ember-simple-auth/test-support';
import { tracked } from '@glimmer/tracking';
import Service from '@ember/service';
import Adapter from 'ember-local-storage/adapters/local';
import resetStorages from 'ember-local-storage/test-support/reset-storage';
import faker from 'faker';

module('Acceptance | Main flow of Application', function(hooks) {
  setupApplicationTest(hooks);
  
  //Preparation before test
  hooks.beforeEach(function() {
    //This service is needed to mock the real service that needs a real conection with firebase auth
    //to retrieve logged user email
    this.owner.register('service:logged-user', class TestService extends Service {
      @tracked user = {email: 'user@teste.com'}
    });

    //This adapter is used to use ember local storage instead of firestore
    this.owner.register('adapter:application', class TestService extends Adapter {
   
    });
  });

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

    //These three asserts prove that an unauthorized user can´t see the content of the pages and are redirected
    //to login form
    await visit('admin/invitations');
    assert.equal(currentURL(), '/login', 'Assert unauthorized route admin/invitations');

    await visit('admin/contacts');
    assert.equal(currentURL(), '/login', 'Assert unauthorized route admin/contacts');

    await visit('admin/seeder');
    assert.equal(currentURL(), '/login', 'Assert unauthorized route admin/seeder');

    //Sending an invitation. Also check button is disabled with no e-mail written and not disable with valid
    //email
    const emailInvitationInput = faker.internet.email();
    await visit('');
    assert.dom('[data-test="saveInvitation"]').isDisabled();
    await fillIn('[data-test="emailField"]', emailInvitationInput);
    await pauseTest()
    assert.dom('[data-test="saveInvitation"]').isNotDisabled();
    await click('[data-test="saveInvitation"]');

    //Sending a contact message. Also check button is disabled without valid e-mail and message that got less than
    //five characters. After filled in the right requirements check the button is not disabled
    const emailContactForm = 'hellofrommars@gmaioul.com';
    const messageContactForm = 'Hello!! Greetings from Mars!!';
    await visit('contact');
    assert.dom('[data-test="saveContact"]').isDisabled();
    await fillIn('[data-test="contactEmail"]', emailContactForm)
    assert.dom('[data-test="saveContact"]').isDisabled();
    await fillIn('[data-test="contactMessage"]', messageContactForm)
    assert.dom('[data-test="saveContact"]').isNotDisabled();
    await click('[data-test="saveContact"]');

    //Visiting admin/invitations without login so when the login is done you are redirected to
    //admin/invitations
    await visit('admin/invitations');
    
    //Authenticating the session with ember-simple-auth/test-support
    await authenticateSession();
    
    //Asserting that you are redirected to the last atempted route after login (authenticateSession())
    assert.equal(currentURL(), '/admin/invitations', "Confirm redirected after authenticateSession");
    assert.equal(this.element.querySelector('h1').textContent, 'Invitations', "Confirm is in invitation page");

    //Asserting that the invitation was stored in local database and is show in the page
    assert.equal(find('[data-test="invitationEmail"]').textContent, emailInvitationInput,
      "Assert invitation saved previously is show in admin/invitations");
      await pauseTest()

    //Asserting that the contact message was stored in local database and is show in the page
    await visit('admin/contacts');
    assert.equal(find('.card-header').innerText, emailContactForm, 
      "Assert contact email saved previously is show in admin/contacts");
    assert.equal(find('h5').innerText, messageContactForm,
      "Assert contact message saved previously is show in admin/contacts");
  
    //Populating the form and saving a Library. Also check if button is disabled when the field for the
    //name of the library is empty, and not disabled when its filled
    const libraryNameForm = 'Biblioteca Penha';
    const libraryAddressForm = 'Rua do Bosque, 989';
    const libraryPhoneForm = '(11) 4444-3333'
    await visit('libraries/new');
    assert.dom('[data-test="saveLibrary"]').isDisabled();
    await fillIn('[data-test="nameLib"]', libraryNameForm);
    assert.dom('[data-test="saveLibrary"]').isNotDisabled();
    await fillIn('[data-test="addressLib"]', libraryAddressForm);
    await fillIn('[data-test="phoneLib"]', libraryPhoneForm);
    await click('[data-test="saveLibrary"]');
    
    //Asserting that the library was stored in local database and is show in the page
    await visit('libraries');
    assert.dom(find('[data-test="libName"]')).hasText(libraryNameForm,
      'Assert library name saved previously');
    assert.dom(find('[data-test="libAddress"]')).includesText(libraryAddressForm,
      'Assert library address saved previously');
    assert.dom(find('[data-test="libPhone"]')).includesText(libraryPhoneForm,
      'Assert library phone saved previously');

    //Filling the fields of seeder form to create libraries, books and authors with ember-faker
    //Filling 2 to create 2 libraries
    //Filling 4 to create 4 authors and a random number of books
    await visit('admin/seeder');
    await fillIn('[data-test="libInput"]', '2');
    await click('[data-test="libButton"]')
    await fillIn('[data-test="authorInput"]', '4');
    await click('[data-test="authorButton"]')

    //Asserting that the numbers of libraries and authors created are equal to the numbers filled in the form
    //Remeber that the number of libraries is three because I created 1 before in the form
    //Attention, here we are still in seeder page and the numbers I get from the respective number box.
    assert.equal(find('[data-test="numberLib"]').textContent, '3',
      'Assert total number of libraries in the corresponding number box');
    assert.equal(find('[data-test="numberAuthor"]').textContent, '4',
      'Assert total number of authors in the corresponding number box');

    //The numbers of book created by the seeder is always random, so here I´m getting this random number of
    //books from the respective number box to use later in an assertion
    let numberLib = (this.element.querySelector('[data-test="numberLib"]')).textContent
    let numberLibInt = parseInt(numberLib)
    let numberAuthor = (this.element.querySelector('[data-test="numberAuthor"]')).textContent
    let numberAuthorInt = parseInt(numberAuthor)
    let numberBooks = (this.element.querySelector('[data-test="numberBook"]')).textContent
    let numberBooksInt = parseInt(numberBooks)

    //Asserting that there are 3 libraries cards because 1 I created in the form and two created with the 
    //seeder
    //Here the assertion works by counting the html elements with their respective data-test attributes,
    //so, there must be three .card-body that means three libraries
    await visit('libraries');
    assert.dom('.card-body').exists({count: numberLibInt}, 'Assert the correct number of library cards');

    //Asserting the number of authors and books created by the seeder in authors page
    //(Here I use let numberBooksInt)
    //Here the assertion works by counting the html elements with their respective data-test attributes.
    //Its the same as was with the libraries, suppose there is 20 authors, there will be 20 data-test="book"
    //elements
    await visit('authors');
    assert.dom('[data-test="author"]').exists({count: numberAuthorInt}, 'Assert the total number of authors in the table');
    assert.dom('[data-test="book"]').exists({count: numberBooksInt}, 
      'Assert the total number of books show in table');

    //Invalidating the session
    await invalidateSession();
    
    //I don´t know why but it doesn´t redirect to '/' just in the test as it is supposed to do after the 
    //"log out", so I visit a protected page and assert that after invalidateSession() the user
    //is logged out of the system and is redirected to login page
    await visit('admin/contacts');
    assert.equal(currentURL(), '/login', 
      'Assert after being logged out you can´t enter protected routes');
  });
});