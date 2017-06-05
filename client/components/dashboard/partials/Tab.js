import React from 'react';
import PropTypes from 'prop-types';

import Report from '../../../models/ReportModel';
import { Tab as MuiTab } from 'material-ui/Tabs';
import Badge from 'material-ui/Badge';

const badgeStyle = {
  top          : 15,
  right        : -10,
  height       : 20,
  borderRadius : 6,
  width        : 'auto',
  paddingRight : 4,
  paddingLeft  : 4,
};

export default class Tab extends React.Component {
  render() {
    return (
      <MuiTab label={
        this.props.reports.get('outreachCounts').get(this.props.value)
        && <Badge
          badgeContent={this.props.reports
            .get('outreachCounts').get(this.props.value) || ''}
          badgeStyle={badgeStyle}
          secondary
        >
          <i className={this.props.iconClass} />
        </Badge>
        || <i className={this.props.iconClass} />
        }
        onActive={this.props.onActive}
        value={this.props.value}
        buttonStyle={this.props.buttonStyle}
        className={this.props.className}
        icon={this.props.icon}
        style={this.props.style}
        index={this.props.index}
        onTouchTap={this.props.onTouchTap}
        selected={this.props.selected}
        width={this.props.width}
      >
        {this.props.children}
      </MuiTab>
    );
  }
}

Tab.propTypes = {
  children  : PropTypes.object.isRequired,
  reports   : PropTypes.instanceOf(Report),
  value     : PropTypes.string.isRequired,
  onActive  : PropTypes.func.isRequired,
  iconClass : PropTypes.string.isRequired
};

Tab.muiName = 'Tab';
