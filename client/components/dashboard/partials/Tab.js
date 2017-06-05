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

const Tab = ({...props}) =>
  <MuiTab label={
    props.reports.get('outreachCounts').get(props.value)
    && <Badge
      badgeContent={props.reports
        .get('outreachCounts').get(props.value) || ''}
      badgeStyle={badgeStyle}
      secondary
    >
      <i className={props.iconClass} />
    </Badge>
    || <i className={props.iconClass} />
    }
    onActive={props.onActive}
    value={props.value}
    buttonStyle={props.buttonStyle}
    className={props.className}
    icon={props.icon}
    style={props.style}
    index={props.index}
    onTouchTap={props.onTouchTap}
    selected={props.selected}
    width={props.width}
  >
    {props.children}
  </MuiTab>;

Tab.propTypes = {
  children  : PropTypes.object.isRequired,
  reports   : PropTypes.instanceOf(Report),
  value     : PropTypes.string.isRequired,
  onActive  : PropTypes.func.isRequired,
  iconClass : PropTypes.string.isRequired
};

Tab.muiName = 'Tab';

export default Tab;
