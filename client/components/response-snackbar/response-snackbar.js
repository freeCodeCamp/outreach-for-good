import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Snackbar from 'material-ui/Snackbar';

import {closeSnackbar} from '../../modules/view';

import './snackbar.scss';

class ResponseSnackbar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  handleRequestClose() {
    this.props.actions.closeSnackbar();
  }

  render() {
    if(!this.props.snackbar) {
      return null;
    }

    return (
      <Snackbar
        open={!!this.props.snackbar.message}
        message={this.props.snackbar.message}
        autoHideDuration={this.props.snackbar.autoHideDuration}
        onRequestClose={this.handleRequestClose}
        className={`snackbar-${this.props.snackbar.snackType}`}
      />
    );
  }
}

ResponseSnackbar.propTypes = {
  snackbar : PropTypes.object.isRequired,
  actions  : PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    snackbar : state.view.snackbar
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions : bindActionCreators({closeSnackbar}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResponseSnackbar);
