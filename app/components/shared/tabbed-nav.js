import React from 'react';

class TabbedNav extends React.Component {
  constructor(props) {
    super(props);
    this.handleSelectTab = this.handleSelectTab.bind(this);
  }

  handleSelectTab(event) {
    const clicked = parseInt(event.currentTarget.getAttribute('data-index'), 10);
    this.props.onSelect(clicked);
  }

  render() {
    const contentDivs = [];
    const tabItems = this.props.tabs.map((tab, index) => {
      contentDivs.push(<div height="175px">{tab.content}</div>);
      return (
        <li className="nav-item" data-index={index} onClick={this.handleSelectTab} key={tab.name}>
          <a className={`nav-link${this.props.active === index ? ' active' : ''}`}>
            {tab.name}
          </a>
        </li>
      );
    });
    return (
      <div width="100%">
        <ul className="nav nav-tabs" style={{ marginBottom: '5px' }}>
          {tabItems}
        </ul>
        {contentDivs[this.props.active]}
      </div>
    );
  }
}

export default TabbedNav;
