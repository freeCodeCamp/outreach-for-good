import Immutable from 'immutable';

export const Dialog = Immutable.Record({
  title   : '',
  open    : '',
  actions : Immutable.List(),
  text    : Immutable.List(),
});

class DialogModel extends Dialog {

  addDialogs(currentState, dialogValues) {
    return currentState.update('MuiDialogs', i => i.clear().merge(dialogValues));
  }

  toggleDialogs(currentState, dialogValue) {
    return currentState.update('MuiDialogs', iMap =>
      iMap.update(dialogValue, state => !state));
  }

  resetDialogs(currentState) {
    return currentState.update('MuiDialogs', iMap => iMap.map(() => false));
  }
}

export default DialogModel;
