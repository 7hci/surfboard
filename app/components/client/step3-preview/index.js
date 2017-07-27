import React from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import PDFObject from 'pdfobject';
import actions from '../../../redux/actions';
import selectors from '../../../redux/selectors';
import mutations from '../../../graphql/mutations';
import Step3Preview from './view';

class Container extends React.Component {
  componentDidMount() {
    if (this.props.currentHire) {
      const { currentHire: { contractId, credentials: { access_token: token } } } = this.props;
      const url = `https://www.googleapis.com/drive/v3/files/${contractId}/export?access_token=${token}`
        + '&mimeType=application%2Fpdf';
      PDFObject.embed(url, '#content', { height: '100%' });
    }
  }

  render() {
    return <Step3Preview {...this.props} />;
  }
}
const mapStateToProps = state => ({ currentHire: selectors.selectCurrentHire(state) });
const mapDataToProps = ({ ownProps: { currentHire: { id }, dispatch }, mutate: submitContract }) => ({
  handleClickSign: () => submitContract({ variables: { id } })
    .then(() => {
      dispatch(actions.replace('/talent/4'));
    })
});

export default compose(
  connect(mapStateToProps),
  graphql(mutations.submitContract, { props: mapDataToProps })
)(Container);
