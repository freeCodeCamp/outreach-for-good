import React, {Component} from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Dropzone from 'react-dropzone';
import PDFJS from 'pdfjs-dist';

class UploadTab extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      pdfProgress: 0
    }
  }

  changeFile(accepted) {
    if(accepted) {
      PDFJS.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.bundle.js';

      let reader = new FileReader();
      reader.onload = () => {
        PDFJS.getDocument(reader.result)
          .then(pdf => {
            //TODO: handle multiple pages and update progress
            pdf.getPage(1)
              .then(page => page.getTextContent())
              .then(text => text.items.map((each, i) => {
                this.setState({pdfProgress: (i / pdf.numPages * 100).toFixed(2)});
                return each.str;
              }))
              .then(items => this.setState({items}));
          });
      };
      reader.readAsArrayBuffer(accepted[0]);
    }
  }

  render() {
    return (
      <div className="upload-tab">
        <Dropzone onDrop={this.changeFile} multiple={false} accept="application/pdf" className="dz">
          <div>Drop a pdf into this field</div>
        </Dropzone>
        {/* <CircularProgress
          mode="determinate"
          value={this.state.pdfProgress}
          size={80}
          thickness={5}
          /> */}
      </div>
    );
  }
}
export default UploadTab;
