import Dialog from 'material-ui/Dialog';

const SimpleModal = ({ title, actions, modal, body, handleClose }) =>
<Dialog
  title={title}
  actions={actions}
  modal={false}
  open={modal}
  onRequestClose={handleClose}>
  {body}
</Dialog>;

export default SimpleModal;
