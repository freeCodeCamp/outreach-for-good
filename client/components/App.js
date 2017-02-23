import React, {PropTypes} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiTheme from '../styles/muiTheme.js';
import Header from './common/Header';
import Sidebar from './common/Sidebar';
import Footer from './common/Footer';


class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="viewport">
          <Header/>
          <section className="main-body">
            <Sidebar/>
            <section id="main-view">
              <div id="main-content">
                {this.props.children}
              </div>
              <Footer />
            </section>
          </section>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  children : PropTypes.object.isRequired,
};

export default App;
