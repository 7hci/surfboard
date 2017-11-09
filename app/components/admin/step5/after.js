import React from 'react';
import { Page, Link } from '../../shared/index';
import { status } from '../../../constants';

const Step5Before = (props) => {
  const { tasks, form, progress, spinner } = props;

  return (
    <Page
      content={
        <div className="card-block">
          {tasks.map((task) => {
            if (form[task.name]) {
              const taskStatus = task.status;
              const icon = `fa fa-inverse fa-stack-1x ${(taskStatus === 'success') ? 'fa-check' : 'fa-times'}`;
              const message = task.text;
              return (
                <p className={taskStatus} key={task.name}>
                  <span className="fa-stack">
                    <i className="fa fa-square fa-stack-2x" /><i className={icon} />
                  </span>&nbsp;{message}
                </p>
              );
            }
            return null;
          })}
        </div>
      }
      buttons={
        progress === status.DONE ? <Link className="btn btn-success" href="/admin/6" replace>Continue</Link> : null
      }
      header="Onboarding Tasks"
      spinner={spinner}
    />
  );
};

export default Step5Before;
