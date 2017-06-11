import Immutable from 'immutable';

export const Form = Immutable.Record({
  submitDisabled : true,
  field          : Immutable.Map(),
  error          : Immutable.Map()
});

class FormModel extends Form {

  setFieldValue(currentState, id, value) {
    return currentState.updateIn(['field'], iMap =>
      iMap.set(id, value));
  }

  setErrorMessage(currentState, id, value) {
    return currentState.updateIn(['error'], iMap =>
      iMap.set(id, value));
  }

  // Write function to reset multiple error messages
  // resetErrorMessage(currentState, idArray) {
  //   return currentState.updateIn(['error'], iMap => {
  //     idArray.forEach(id => iMap.set(id, ''));
  //     return iMap;
  //   });
  // }

  enableSubmitButton(currentState) {
    return currentState.set('submitDisabled', false);
  }

  disableSubmitButton(currentState) {
    return currentState.set('submitDisabled', true);
  }
}

export default FormModel;
