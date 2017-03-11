import React, {Component} from 'react';

import LinearProgress from 'material-ui/LinearProgress';
import Paper from 'material-ui/Paper';
import UploadTable from './UploadTable';
import Dropzone from 'react-dropzone';
import ParsePDF from './UploadService';

class UploadTab extends Component {
  constructor() {
    super();

    this.state = {
      loadingState : 'determinate',
      loadingValue : 0,
      students : []
    };
  }

  changeFile(accepted) {
    this.setState({ loadingState: 'indeterminate', loadingValue: null });
    if(accepted) {
      ParsePDF(accepted[0])
      .then(response => {
        this.setState({
          students : response.students,
          loadingState : 'determinate',
          loadingValue : 100
        });
      });
    }
  }

  confirm() {
    this.props.confirm(this.state.students);
  }

  cancel() {
    this.setState({ students: [], loadingValue: null, loadingState: 'indeterminate' });
  }

  render() {
    return (
      <div className="upload-tab">
        <Paper className="dropzone-paper" zDepth={2}>
          <Dropzone onDrop={this.changeFile.bind(this)} multiple={false} accept="application/pdf" className="dropzone">
            <h2>Click here or drop a PDF into this field</h2>
          </Dropzone>
        </Paper>
        <LinearProgress mode={this.state.loadingState} value={this.state.loadingValue} />
        {this.state.students.length ? <UploadTable confirm={this.confirm.bind(this)} cancel={this.cancel.bind(this)} students={this.state.students} /> : ''}
      </div>
    );
  }
}

export default UploadTab;
