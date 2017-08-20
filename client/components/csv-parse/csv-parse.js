import React from 'react';
import PropTypes from 'prop-types';

import * as papa from 'papaparse';

var DEFAULT_FILENAME = 'download.csv';

class CsvParse extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { token: null };
  }

  componentDidMount() {
    this.checkToken(this.props.token);
  }

  componentDidUpdate() {
    this.checkToken(this.props.token);
  }

  checkToken(token) {
    if(token && this.state.token !== token && this.props.data) {
      this.parseCsv(token);
    }
  }

  parseCsv = token => {
    var csv = [papa.unparse(this.props.data)];

    var csvData = new Blob(csv, {type: 'text/csv;charset=utf-8;'});
    if(navigator.msSaveBlob) {
      navigator.msSaveBlob(csvData, this.props.filename || DEFAULT_FILENAME);
    } else {
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(csvData);
      link.setAttribute('download', this.props.filename || DEFAULT_FILENAME);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    this.setState({token});
  }

  render() {
    return (<div />);
  }
}

CsvParse.propTypes = {
  data     : PropTypes.array,
  token    : PropTypes.number,
  filename : PropTypes.string
};

export default CsvParse;
