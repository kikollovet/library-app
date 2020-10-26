import Component from '@ember/component';
import { action } from '@ember/object';

export default class LibraryItemFormComponent extends Component {
  
  buttonLabel = 'Save'

  @action
  buttonClicked(param) {
    this.sendAction('action', param);
  }
}