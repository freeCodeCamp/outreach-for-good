import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
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

class ResponseSnackbar extends Component {

  render() {
    return (
      <Snackbar
        open={this.props.response}
        message="this is the snackbar message"
        autoHideDuration={4000}
        // onRequestClose={closeSnackbar}
        bodyStyle={snackTypes.success}
      />
    );
  }
}

ResponseSnackbar.propTypes = {
  response : PropTypes.bool,
  actions  : PropTypes.object
};

const mapStateToProps = state => ({
  response : state.response
});

const mapDispatchToProps = dispatch => ({
  actions : bindActionCreators({}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ResponseSnackbar);
