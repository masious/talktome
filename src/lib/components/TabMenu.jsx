import React, { Component } from 'react';
import './Tabmenu.scss';

export default class TabMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: this.props.data.findIndex(({ isActive }) => isActive),
    };
  }

  setActive(activeIndex) {
    this.setState({
      activeIndex,
    });
  }

  render() {
    const { activeIndex } = this.state;

    return (
      <div className="tabmenu">
        <div className="tabmenu__headers">
          {this.props.data.map(({ title }, index) => (
            <div
              key={`i${index}`}
              className={`tabmenu__header ${activeIndex === index && 'tabmenu__header--active'}`}
              onClick={() => this.setActive(index)}
            >
              {title}
            </div>
          ))}
        </div>
        <div className="tabmenu__bodies">
          {this.props.data.map(({ body: Body }, index) => (
            <div
              key={`i${index}`}
              className={`tabmenu__body ${activeIndex === index && 'tabmenu__body--active'}`}
            >
              <Body />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
