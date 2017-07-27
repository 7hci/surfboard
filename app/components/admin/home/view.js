import React from 'react';

import { Page, Link } from '../../shared/index';

const Home = (props) => {
  const { newHires, handleClick } = props;
  const newHireItems = newHires.map((newHire) => {
    const percent = (newHire.step / 7) * 100;
    const barStyle = { width: `${percent}%` };
    return (
      <li className="card-item" onClick={handleClick} data-step={newHire.step} data-id={newHire.id}>
        {`${newHire.firstName} ${newHire.lastName}`}
        <br />
        <div className="progress w-100">
          <div className="progress-bar bg-success" role="progressbar" style={barStyle} />
        </div>
      </li>
    );
  });
  return (
    <Page
      content={<ul id="inProgress" className="list-group list-group-flush">{newHireItems}</ul>}
      buttons={<Link className="btn btn-success" href="/admin/1" replace>New Talent</Link>}
      header="Onboarding in Progress"
    />
  );
};
export default Home;
