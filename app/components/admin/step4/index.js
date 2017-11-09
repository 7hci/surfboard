import React from 'react';
import PDFObject from 'pdfobject';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import mutations from '../../../graphql/mutations';
import queries from '../../../graphql/queries';
import Step4 from './view';
import actions from '../../../redux/actions';
import selectors from '../../../redux/selectors';

const Step4Container = (props) => {
  if (props.newHire) {
    const { contractId, credentials: { access_token: token } } = props.newHire;
    const url = `https://www.googleapis.com/drive/v3/files/${contractId}/export?access_token=${token}`
      + '&mimeType=application%2Fpdf';
    PDFObject.embed(url, '#content', { height: '100%' });
  }
  return <Step4 {...props} />;
};
const mapStateToProps = state => ({ id: selectors.selectId(state) });
const mapDataToProps = ({ ownProps: { id, dispatch, data: { newHire }, skipStep }, mutate: acceptContract }) => ({
  newHire,
  handleClickAccept: () => {
    PDFObject.embed('', '#content', { height: '100%' });
    return acceptContract({ variables: { id } })
    .then(() => { dispatch(actions.replace('/admin/5')); });
  },
  handleClickReject: () => skipStep({ variables: { step: 2, id } })
    .then(() => { dispatch(actions.replace('/admin/2')); })
});

export default compose(
  connect(mapStateToProps),
  graphql(queries.getNewHire, { options: ({ id }) => ({ variables: { id } }) }),
  graphql(mutations.skipStep, { props: ({ mutate }) => ({ skipStep: mutate }) }),
  graphql(mutations.acceptContract, { props: mapDataToProps })
)(Step4Container);
