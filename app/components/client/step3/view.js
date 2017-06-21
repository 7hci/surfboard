import React from 'react';
import Dropzone from 'react-dropzone';
import { Page, InputGroupText, TabbedNav, Link } from '../../shared';

const Step3 = (props) => {
  const { activeTab, spinner, message, src, handleTabSelected, handleUpload, handleSubmit } = props;
  const second = 'Optional - Use if contracting as business entity';
  const uploadMessages = [
    <span>Click to upload a signature image or drag it here</span>,
    <span><em>Uploading...</em></span>,
    <span><strong>Done!</strong> Upload a different signature?</span>,
    <span><strong>Sorry!</strong> An error occurred while uploading!</span>
  ];
  return (
    <Page
      model="form.contractClient"
      key="form"
      content={
        <div className="card-block">
          <InputGroupText model="form.contractClient.firstName" label="First Name" />
          <InputGroupText model="form.contractClient.lastName" label="Last Name" />
          <InputGroupText model="form.contractClient.company" label="Company" secondLabel={second} required={false} />
          <InputGroupText model="form.contractClient.title" label="Title" />
          <InputGroupText model="form.contractClient.email" label="E-mail" />
          <InputGroupText model="form.contractClient.address" label="Address" />
          <InputGroupText model="form.contractClient.phone" label="Phone Number" />
          <TabbedNav
            active={activeTab}
            onSelect={handleTabSelected}
            tabs={[
              {
                name: 'Upload',
                content: (
                  <Dropzone className="dropzone" onDrop={handleUpload}>
                    <i className="fa fa-cloud-upload fa-4x" />
                    {uploadMessages[message]}
                  </Dropzone>
                )
              },
              {
                name: 'Draw',
                content: (
                  <div className="tab-content">
                    <Link className="btn btn-secondary" href="/talent/signature" replace>Draw Signature</Link>
                  </div>
                )
              },
              {
                name: 'Preview',
                content: (
                  <div className="tab-content">
                    <img
                      src={src}
                      style={{ maxHeight: '100%', maxWidth: '100%' }}
                      alt="Signature"
                    />
                  </div>
                )
              }
            ]}
          />
        </div>
      }
      buttons={
        <input className="btn btn-success" type="submit" value="Preview" />
      }
      header="Contract Preview"
      spinner={spinner}
      onSubmit={handleSubmit}
    />);
};

export default Step3;
