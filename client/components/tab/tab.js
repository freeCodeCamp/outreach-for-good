import React from 'react';
import PropTypes from 'prop-types';

import Report from '../../models/report';
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

export const Tab = ({...props}) =>
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
    buttonStyle={props.buttonStyle}
    className={props.className}
    icon={props.icon}
    index={props.index}
    onActive={props.onActive}
    onTouchTap={props.onTouchTap}
    selected={props.selected}
    style={props.style}
    value={props.value}
    width={props.width}
  >
    {props.children}
  </MuiTab>;

Tab.propTypes = {
  children    : PropTypes.element.isRequired,
  reports     : PropTypes.instanceOf(Report),
  iconClass   : PropTypes.string,
  // MuiTab default props
  buttonStyle : PropTypes.string,
  className   : PropTypes.string,
  icon        : PropTypes.string,
  index       : PropTypes.number,
  onActive    : PropTypes.func.isRequired,
  onTouchTap  : PropTypes.func,
  style       : PropTypes.string,
  selected    : PropTypes.bool,
  value       : PropTypes.string.isRequired,
  width       : PropTypes.string
};

Tab.muiName = 'Tab';
