import React from 'react';
import axios from 'axios';
import PDFObject from 'pdfobject';
import { FullscreenPage } from '../common';

class Step4 extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    let accessToken;
    axios.get('/credentials')
      .then((res) => {
        accessToken = res.data.access_token;
      })
      .then(() => axios.get(`/onboard/newhire/${this.props.newHireId}`))
      .then((res) => {
        const newHire = res.data;
        const exportUrl = `https://www.googleapis.com/drive/v3/files/${newHire.contractId}/export?`
          + `mimeType=application%2Fpdf&access_token=${accessToken}`;
        PDFObject.embed(exportUrl, '#content', { height: '100%' });
      });
  }

  handleClick(event) {
    const step = event.currentTarget.getAttribute('data-step');
    const url = (step === '2') ? `/onboard/skip?to=${step}&id=${this.props.newHireId}`
      : `/onboard/contract/accept?id=${this.props.newHireId}`;
    axios.post(url)
      .then((res) => {
        if (res.data && res.data.error) {
          alert('Server error!');
        } else {
          this.props.history.replace(`/step/${step}`);
        }
      });
  }

  render() {
    return (
      <FullscreenPage
        buttons={
          <div>
            <button className="btn btn-danger" type="button" data-step="2" onClick={this.handleClick}>
              Reject
            </button>&nbsp;
            <button className="btn btn-success" type="button" data-step="5" onClick={this.handleClick}>
              Sign
            </button>
          </div>
        }
      />
    );
  }
}

export default Step4;
