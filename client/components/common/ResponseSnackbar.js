import React, {PropTypes} from 'react';
import Snackbar from 'material-ui/Snackbar';

const snackTypes = {
  success : {
    backgroundColor : '#16a461',
    color           : 'white'
  },
  error : {
    backgroundColor : '#d9152a',
    color           : 'white'
  }
};

const ResponseSnackbar = ({ message, closeSnackbar, type }) =>
  <Snackbar
    open={!!message}
    message={message}
    autoHideDuration={4000}
    onRequestClose={closeSnackbar}
    bodyStyle={snackTypes[type]}
  />
;

ResponseSnackbar.propTypes = {
  message       : PropTypes.string,
  closeSnackbar : PropTypes.func,
  type          : PropTypes.string
};

export default ResponseSnackbar;
