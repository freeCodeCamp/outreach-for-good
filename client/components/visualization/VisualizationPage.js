import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import { getAllSchools } from '../../actions/schoolActions';
import { getCombined, getSchoolComparison } from '../../actions/visualizationActions';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend} from 'recharts';

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
    const COLORS = ['#c3a435', '#5049ba', '#b43b3b'];
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
        <div className="grid">
          <div className="grid-cell">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={this.props.visualization.cfa}
                  fill="#8884d8"
                  label>
                  {this.props.visualization.cfa
                    && this.props.visualization.cfa.map((entry, i) =>
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip/>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid-cell">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={this.props.visualization.non}
                  fill="#82ca9d">
                  {this.props.visualization.non
                    && this.props.visualization.non.map((entry, i) =>
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip/>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
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
