import React, { PureComponent } from 'react';
import moment from 'moment';

moment.updateLocale('en', {
  relativeTime: {
    s: '>1m',
  },
});

export default class TimeAgo extends PureComponent {
  render() {
    const {
      className,
      children,
    } = this.props;

    const date = new Date(children);

    return (
      <time className={className}>
        {moment(date).fromNow(true)}
      </time>
    );
  }
}
