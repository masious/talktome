import React, { Component } from 'react';
import moment from 'moment';
import Moment from 'react-moment';

Moment.globalMoment = moment;
Moment.globalMoment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s',
    s: '>1m',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1mo',
    MM: '%dmo',
    y: '1y',
    yy: '%dy',
  },
});
Moment.globalMoment.relativeTimeThreshold('ss', 59);

export default class TimeAgo extends Component {
  render() {
    return (
      <Moment fromNow ago className={this.props.className}>
        {this.props.children}
      </Moment>
    );
  }
}
