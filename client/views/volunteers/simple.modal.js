import React from 'react';
import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';

const SimpleModal = ({ title, actions, modal, body, handleClose }) =>
<Dialog
  title={title}
  actions={actions}
  modal={false}
  open={modal}
  onRequestClose={handleClose}>
  {body}
</Dialog>;

SimpleModal.propTypes = {
  title       : PropTypes.string,
  actions     : PropTypes.array,
  modal       : PropTypes.object,
  body        : PropTypes.object,
  handleClose : PropTypes.func
};

export default SimpleModal;
