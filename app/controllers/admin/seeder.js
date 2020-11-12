import { all } from 'rsvp';
import Controller from '@ember/controller';
import Faker from "faker";

export default Controller.extend({

  actions: {

    generateLibraries(volume) {

      this.set('generateLibrariesInProgress', true);

      const counter = parseInt(volume);
      let savedLibraries = [];

      for (let i = 0; i < counter; i++) {

        savedLibraries.push(this._saveRandomLibrary());
      }

      all(savedLibraries)
        .then(() => {
          this.set('generateLibrariesInProgress', false);
          this.set('libDone', true)
        });
    },

    deleteLibraries() {

      this.set('deleteLibrariesInProgress', true);

      this._destroyAll(this.get('libraries'))

        .then(() => {
          this.set('libDelDone', true);
          this.set('deleteLibrariesInProgress', false);
        });
    },

    generateBooksAndAuthors(volume) {

      this.set('generateBooksInProgress', true);

      const counter = parseInt(volume);
      let booksWithAuthors = [];

      for (let i = 0; i < counter; i++) {

        const books = this._saveRandomAuthor().then(newAuthor => this._generateSomeBooks(newAuthor));
        booksWithAuthors.push(books);
      }

      all(booksWithAuthors)

        .then(() => {
          this.set('authDone', true);
          this.set('generateBooksInProgress', false);
        });
    },

    deleteBooksAndAuthors() {

      this.set('deleteBooksInProgress', true);

      const authors = this.get('authors');
      const books = this.get('books');

      this._destroyAll(authors)
        .then(() => this._destroyAll(books))

        .then(() => {
          this.set('authDelDone', true);
          this.set('deleteBooksInProgress', false);
        });
    }
  },

  _saveRandomLibrary() {
    return this.store.createRecord('library').randomize().save();
  },

  _saveRandomAuthor() {
    return this.store.createRecord('author').randomize().save();
  },

  _generateSomeBooks(author) {
    const bookCounter = Faker.random.number(10);
    let books = [];

    for (let j = 0; j < bookCounter; j++) {
      const library = this._selectRandomLibrary();

      const bookPromise =
        this.store.createRecord('book')
          .randomize(author, library)
          .save()
          .then(() => author.save())

          .then(() => library && library.save());
      books.push(bookPromise)
    }

    return all(books);
  },

  _selectRandomLibrary() {

    const libraries = this.get('libraries');
    const size = libraries.get('length');

    const randomItem = Faker.random.number(size - 1);
    return libraries.objectAt(randomItem);
  },

  _destroyAll(records) {

    const recordsAreDestroying = records.map(item => item.destroyRecord());

    return all(recordsAreDestroying);
  }
});