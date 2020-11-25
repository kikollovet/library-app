import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn, pauseTest, find, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { currentSession, authenticateSession, invalidateSession } from 'ember-simple-auth/test-support';
import { tracked } from '@glimmer/tracking';
import Service from '@ember/service';
import Adapter from 'ember-local-storage/adapters/session';
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
    this.owner.register('adapter:application', class TestAdapter extends Adapter {
   
    });
  });

  //This makes the database empty after the end of the test
  hooks.afterEach(function() {
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
    assert.dom('[data-test="saveInvitation"]').isNotDisabled();
    await click('[data-test="saveInvitation"]');

    //Sending a contact message. Also check button is disabled without valid e-mail and message that got less than
    //five characters. After filled in the right requirements check the button is not disabled
    const emailContactForm = faker.internet.email();
    const messageContactForm = faker.lorem.sentence();
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

    //Asserting that the contact message was stored in local database and is show in the page
    await visit('admin/contacts');
    assert.equal(find('.card-header').innerText, emailContactForm, 
      "Assert contact email saved previously is show in admin/contacts");
    assert.equal(find('h5').innerText, messageContactForm,
      "Assert contact message saved previously is show in admin/contacts");
  
    //Populating the form and saving a Library. Also check if button is disabled when the field for the
    //name of the library is empty, and not disabled when its filled
    const libraryNameForm = faker.company.companyName() + ' Library';
    const libraryAddressForm = faker.address.streetAddress();
    const libraryPhoneForm = faker.phone.phoneNumber()
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

    //Filling the fields of seeder form to create libraries, books and authors with random number
    //between 1 and 99 for libraries and between 1 and 100 for authors
    const libNumberForm = Math.floor(Math.random() * 99) + 1;
    const authorNumberForm = Math.floor(Math.random() * 100) + 1;
    await visit('admin/seeder');
    await fillIn('[data-test="libInput"]', libNumberForm);
    await click('[data-test="libButton"]')
    await fillIn('[data-test="authorInput"]', authorNumberForm);
    await click('[data-test="authorButton"]')

    //Asserting that the numbers of libraries and authors created are equal to the numbers filled in the form
    //The number of libraries is added one because one was created filling the form
    //Attention, here we are still in seeder page and the numbers I get from the respective number box.
    const totalNumberOfLibs = libNumberForm + 1 //had to add 1 because one was created in the form
    assert.equal(find('[data-test="numberLib"]').textContent, totalNumberOfLibs,
      'Assert total number of libraries in the corresponding number box');
    assert.equal(find('[data-test="numberAuthor"]').textContent, authorNumberForm,
      'Assert total number of authors in the corresponding number box');

    //The numbers of book created by the seeder is always random, so here I´m getting this random number of
    //books from the respective number box to use later in an assertion
    let numberLib = (this.element.querySelector('[data-test="numberLib"]')).textContent
    let numberLibInt = parseInt(numberLib)
    let numberAuthor = (this.element.querySelector('[data-test="numberAuthor"]')).textContent
    let numberAuthorInt = parseInt(numberAuthor)
    let numberBooks = (this.element.querySelector('[data-test="numberBook"]')).textContent
    let numberBooksInt = parseInt(numberBooks)

    //Asserting the number of libraries
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
  
    //Confirming that the session is invalidated and is not allowed to enter in protected route
    await visit('admin/contacts');
    assert.equal(currentURL(), '/login', 
      'Assert after being logged out you can´t enter protected routes');
  });
});