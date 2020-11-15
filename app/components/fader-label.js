import { later, cancel } from '@ember/runloop';
import { observer } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
    tagName: 'span',

    classNames: ['label label-success label-fade'],
    classNameBindings: ['isShowing:label-show'],

    isShowing: false,

    isShowingChanged: observer('isShowing', function() {
        this._runLater = later(() => this.set('isShowing', false), 3000);
    }),

    resetRunLater() {
        this.set('isShowing', false);
        cancel(this._runLater);
    },

    willDestroy() {
        this.resetRunLater();
        this._super(...arguments);
    }
});