import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import { getAllSchools } from '../../actions/schoolActions';
import { getCombined, getSchoolComparison } from '../../actions/visualizationActions';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {ResponsiveContainer, PieChart, Pie, Tooltip} from 'recharts';

class VisualizationPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedSchool : {},
      cfa            : [],
      non            : []
    };

    this.changeSchool = this.changeSchool.bind(this);
  }

  componentWillMount() {
    this.props.actions.getAllSchools();
  }

  changeSchool(e, i, selectedSchool) {
    if(selectedSchool === 'combined') {
      this.props.actions.getCombined();
    } else {
      this.props.actions.getSchoolComparison(selectedSchool.get('_id'));
    }
    this.setState({ selectedSchool });
  }

  render() {
    return (
      <div className="visualization-container">
        <SelectField
          floatingLabelText="Select a school..."
          value={this.state.selectedSchool}
          onChange={this.changeSchool}
          >
          {this.props.schools.map((school, i) =>
            <MenuItem
              key={i}
              value={school}
              primaryText={school.name} />
            )}
            <MenuItem
              value="combined"
              primaryText="Combined" />
        </SelectField>
        <ResponsiveContainer width="40%">
          <PieChart>
            <Pie
              data={this.props.visualization.cfa}
              fill="#8884d8"
              label />
            <Tooltip/>
          </PieChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="40%">
          <PieChart>
            <Pie
              data={this.props.visualization.non}
              fill="#82ca9d" />
            <Tooltip/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

VisualizationPage.propTypes = {
  visualization : PropTypes.object,
  actions       : PropTypes.object
};

const mapStateToProps = state => ({
  schools       : state.schools,
  visualization : state.visualization
});

const mapDispatchToProps = dispatch => ({
  actions : bindActionCreators({ getCombined, getSchoolComparison, getAllSchools }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationPage);
