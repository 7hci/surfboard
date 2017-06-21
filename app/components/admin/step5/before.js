import React from 'react';
import { Page, InputGroupCheckbox } from '../../shared/index';

const Step5Before = (props) => {
  const { tasks, spinner, handleClickSkip, handleClickStart } = props;
  return (
    <Page
      model="form.onboarding"
      content={
        <div className="card-block">
          {tasks.map(task => <InputGroupCheckbox model={`form.onboarding.${task.name}`} label={task.text} />)}
        </div>
      }
      buttons={
        <div>
          <button className="btn btn-secondary" type="button" onClick={handleClickSkip}>Skip</button>
          &nbsp;
          <button className="btn btn-success" type="button" onClick={handleClickStart}>Start</button>
        </div>
      }
      header="Onboarding Tasks"
      spinner={spinner}
    />
  );
};

export default Step5Before;
