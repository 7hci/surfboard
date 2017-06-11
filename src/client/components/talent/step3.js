import React from 'react';
import Dropzone from 'react-dropzone';
import PDFObject from 'pdfobject';
import axios from 'axios';
import Signature from 'react-another-signature-pad';
import { CSSTransitionGroup } from 'react-transition-group';
import { Page, FullscreenPage, InputGroupText, TabbedNav } from '../common';

const uploadMessages = [
  <span>Click to upload a signature image or drag it here</span>,
  <span><em>Uploading...</em></span>,
  <span><strong>Done!</strong> Upload a different signature?</span>
];

class Step3 extends React.Component {
  constructor(props) {
    super(props);
    const inputs = { title: 'Contractor', firstName: '', lastName: '', email: '', company: '', address: '', phone: '' };
    this.state = { inputs, uploadMessage: 0, newHire: {}, activeTab: 0 };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickBack = this.handleClickBack.bind(this);
    this.handleClickSign = this.handleClickSign.bind(this);
    this.handleClickClear = this.handleClickClear.bind(this);
    this.handleTabSelected = this.handleTabSelected.bind(this);
    this.handleClickDraw = this.handleClickDraw.bind(this);
    this.handleDrawn = this.handleDrawn.bind(this);
    this.handleClickUpload = this.handleClickUpload.bind(this);
  }

  componentDidMount() {
    this.newHireId = window.location.search.substring(4);
    axios.get(`/talent/info/${this.newHireId}`)
      .then((res) => {
        if (res.data.error) {
          alert(`Could not find the id ${this.newHireId}`);
        } else {
          const newHire = res.data;
          const inputs = Object.assign({}, this.state.inputs);
          inputs.firstName = newHire.firstName;
          inputs.lastName = newHire.lastName;
          inputs.email = newHire.email;
          this.setState({ newHire, inputs });
        }
      });
  }

  componentDidUpdate() {
    if (this.state.preview) {
      const exportUrl = `https://www.googleapis.com/drive/v3/files/${this.state.contractId}/export?`
        + `mimeType=application%2Fpdf&access_token=${this.state.accessToken}`;
      PDFObject.embed(exportUrl, '#content', { height: '100%' });
    }
  }

  handleChange(event) {
    const input = event.target;
    const inputs = Object.assign({}, this.state.inputs);
    inputs[input.name] = input.value;
    this.setState({ inputs });
  }

  handleUpload(files) {
    this.setState({ uploadMessage: 1 });
    const data = new FormData();
    data.append(this.newHireId, files[0]);
    axios.post('/talent/contract/upload', data)
      .then(() => {
        this.setState({ uploadMessage: 2 });
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ spinnerVisible: true });
    axios.post('/talent/contract/preview', { formData: this.state.inputs, newHire: this.state.newHire })
      .then((res) => {
        if (res.data.error) {
          alert('Server error!');
        } else {
          const contractId = res.data.contractId;
          const accessToken = res.data.accessToken;
          this.setState({ contractId, accessToken, preview: true, spinnerVisible: false });
        }
      });
  }

  handleClickClear() {
    this.setState({ clear: true });
  }

  handleClickBack() {
    this.setState({ preview: false });
  }

  handleClickSign() {
    axios.post(`/talent/contract/submit?id=${this.newHireId}`)
      .then((res) => {
        if (res.data.error) {
          alert('Server erro!');
        } else {
          this.props.history.replace('/talent/4');
        }
      });
  }

  handleTabSelected(index) {
    this.setState({ activeTab: index });
  }

  handleClickDraw() {
    this.setState({ signing: true });
  }

  handleDrawn(data) {
    this.data = data;
  }

  handleClickUpload() {
    const data = new FormData();
    data.append(this.newHireId, this.data);
    axios.post('/talent/contract/upload', data)
      .then(() => {
        this.setState({ signing: false });
      });
  }

  render() {
    let screen;
    if (this.state.preview) {
      screen = (
        <FullscreenPage
          key="preview"
          buttons={
            <div>
              <button className="btn btn-secondary" type="button" onClick={this.handleClickBack}>
                Back
              </button>
              &nbsp;
              <button className="btn btn-success" type="button" onClick={this.handleClickSign}>
                Sign
              </button>
            </div>
          }
        />
      );
    } else if (this.state.signing) {
      screen = (
        <FullscreenPage
          key="signature"
          content={
            <Signature clear={this.state.clear} onEnd={this.handleDrawn} blob trim />
          }
          buttons={
            <div>
              <button className="btn btn-secondary" type="button" onClick={this.handleClickClear}>
                Clear
              </button>
              &nbsp;
              <button className="btn btn-success" type="button" onClick={this.handleClickUpload}>
                Upload
              </button>
            </div>
          }
        />
      );
    } else {
      screen = (
        <Page
          key="form"
          content={
            <div className="card-block">
              <InputGroupText
                id="firstName"
                label="First Name"
                onChange={this.handleChange}
                value={this.state.inputs.firstName}
              />
              <InputGroupText
                id="lastName"
                label="Last Name"
                onChange={this.handleChange}
                value={this.state.inputs.lastName}
              />
              <InputGroupText
                id="company"
                label="Company"
                secondLabel="Optional - Use if contracting as business entity"
                required={false}
                onChange={this.handleChange}
                value={this.state.inputs.company}
              />
              <InputGroupText
                id="title"
                label="Title"
                onChange={this.handleChange}
                value={this.state.inputs.title}
              />
              <InputGroupText
                id="email"
                label="E-mail"
                onChange={this.handleChange}
                value={this.state.inputs.email}
              />
              <InputGroupText
                id="address"
                label="Address"
                onChange={this.handleChange}
                value={this.state.inputs.address}
              />
              <InputGroupText
                id="phone"
                label="Phone Number"
                onChange={this.handleChange}
                value={this.state.inputs.phone}
              />
              <TabbedNav
                active={this.state.activeTab}
                onSelect={this.handleTabSelected}
                tabs={[
                  {
                    name: 'Upload',
                    content: (
                      <Dropzone className="dropzone" onDrop={this.handleUpload}>
                        <i className="fa fa-cloud-upload fa-4x" />
                        {uploadMessages[this.state.uploadMessage]}
                      </Dropzone>
                    )
                  },
                  {
                    name: 'Draw',
                    content: (
                      <div className="tab-content">
                        <button className="btn btn-secondary" type="button" onClick={this.handleClickDraw}>
                          Draw Signature
                        </button>
                      </div>
                    )
                  },
                  {
                    name: 'Preview',
                    content: (
                      <div className="tab-content">
                        <img
                          src={`/upload/${this.newHireId}.bmp?${Date.now()}`}
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
          spinner={this.state.spinnerVisible}
          onSubmit={this.handleSubmit}
        />
      );
    }
    const transitionProps = {
      transitionName: 'slide',
      transitionAppear: true,
      transitionEnterTimeout: 400,
      transitionLeaveTimeout: 400,
      transitionAppearTimeout: 400
    };
    return <CSSTransitionGroup {...transitionProps}>{screen}</CSSTransitionGroup>;
  }
}

export default Step3;
