import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import Snackbar from 'material-ui/Snackbar';
import {connect} from 'react-redux';

import * as viewAct from '../../modules/viewReducer';

class SnackbarWrapper extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  handleRequestClose() {
    this.props.viewAct.closeSnackbar();
  }

  render() {
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
    return (
      <div className="viewport">
        {this.props.children}
        <Snackbar
          open={this.props.snackbar.open}
          message={this.props.snackbar.message}
          autoHideDuration={this.props.snackbar.autoHideDuration}
          onRequestClose={this.handleRequestClose}
          bodyStyle={snackTypes[this.props.snackbar.snackType]}
        />
      </div>
    );
  }
}

SnackbarWrapper.propTypes = {
  children : React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]),
  snackbar : PropTypes.object.isRequired,
  viewAct  : PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    snackbar : state.view.snackbar
  };
}

function mapDispatchToProps(dispatch) {
  return {
    viewAct : bindActionCreators(viewAct, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SnackbarWrapper);
