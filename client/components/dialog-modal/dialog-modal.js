import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const DialogModal = ({ modalContent }) => {
  console.log(modalContent);
  const actions = [
    <FlatButton key="cancel"
      label="Cancel"
      primary
      onTouchTap={modalContent.handleClose}
    />,
    <FlatButton key="submit"
      label="Submit"
      primary
      disabled
      onTouchTap={modalContent.handleSubmit}
    />,
  ];

  return (
    <Dialog
      title={modalContent.title}
      actions={actions}
      modal
      open={modalContent.open}
    >
      Only actions can close this dialog.
    </Dialog>
  );
};

export default DialogModal;
