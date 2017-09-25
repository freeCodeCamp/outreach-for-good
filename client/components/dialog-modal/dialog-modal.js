import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

const editForm = fields =>
  <div>
    <input name="interventionId" type="hidden" value={fields._id} />

    <TextField name="interventionTitle"
      defaultValue={fields.title}
      floatingLabelText="Intervention Title"
      floatingLabelFixed
    />

    <TextField name="interventionDescription"
      defaultValue={fields.description}
      floatingLabelText="Intervention Description"
      floatingLabelFixed
    />
  </div>
;

const DialogModal = props =>
  <Dialog
    title={props.title}
    open={props.open}
    modal
  >
    <form name={props.name} onSubmit={props.handleSubmit}>
      {props.intervention
        && editForm(props.intervention)}

      {!props.intervention
      && <div>
      <TextField name="interventionTitle"
        floatingLabelText="Intervention Title"
        floatingLabelStyle={{fontWeight: 400}}
      />

      <span style={{width: 40, display: 'inline-block'}}>&nbsp;</span>

      <TextField name="interventionDescription"
        floatingLabelText="Description"
        floatingLabelStyle={{fontWeight: 400}}
      />
      </div>}
      <div style={{textAlign: 'right'}}>
        <FlatButton key="submit"
          type="submit"
          label="Add"
          onTouchTap={props.handleSubmit}
          primary
        />
        <FlatButton key="cancel"
          label="Cancel"
          primary
          onTouchTap={props.handleClose}
        />
      </div>
    </form>
  </Dialog>
;

DialogModal.propTypes = {
  title        : PropTypes.string,
  open         : PropTypes.bool,
  handleSubmit : PropTypes.func,
  handleClose  : PropTypes.func
};

export default DialogModal;
