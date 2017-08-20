import React from 'react';
import PropTypes from 'prop-types';

import * as papa from 'papaparse';

class CsvParse extends React.Component {
  componentDidMount() {
    var csv = [papa.unparse(this.props.data)];

    var csvData = new Blob(csv, {type: 'text/csv;charset=utf-8;'});
    if(navigator.msSaveBlob) {
      navigator.msSaveBlob(csvData, this.props.filename || 'download.csv');
    } else {
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(csvData);
      link.setAttribute('download', this.props.filename || 'download.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  render() {
    return (<div />);
  }
}

CsvParse.propTypes = {
  data     : PropTypes.object.isRequired,
  filename : PropTypes.string
};

export default CsvParse;
