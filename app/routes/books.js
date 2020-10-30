// import Route from '@ember/routing/route';

// export default class BooksRoute extends Route {
// }

import Route from '@ember/routing/route';

export default Route.extend({

  model() {
    return this.store.findAll('book');
  },

  actions: {

    editBook(book) {
      book.set('isEditing', true);
    },

    cancelBookEdit(book) {
      book.set('isEditing', false);
      book.rollbackAttributes();
    },

    saveBook(book) {

      if (book.get('isNotValid')) {
        return;
      }

      book.set('isEditing', false);
      book.save();
    }
  }
});