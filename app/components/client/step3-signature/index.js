import React from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import actions from '../../../redux/actions';
import selectors from '../../../redux/selectors';
import mutations from '../../../graphql/mutations';
import Step3Signature from './view';

const Container = props => <Step3Signature {...props} />;
const { selectId, selectSignatureData, selectSignatureClear } = selectors;
const mapStateToProps = state =>
  ({ clear: selectSignatureClear(state), data: selectSignatureData(state), id: selectId(state) });
const mapDataToProps = ({ ownProps: { id, data, dispatch }, mutate: uploadSignature }) => ({
  handleClickUpload: () => {
    const file = new File([data], 'drawn.png');
    return uploadSignature({ variables: { file, id } })
      .then(() => {
        dispatch(actions.setUploadImageUrl(`/upload/${id}.bmp?${Date.now()}`));
        dispatch(actions.replace(`/talent?id=${id}`));
      });
  },
  handleDrawn: (points) => { dispatch(actions.setSignatureData(points)); },
  handleClickClear: () => { dispatch(actions.clearSignature()); }
});

export default compose(
  connect(mapStateToProps),
  graphql(mutations.uploadSignature, { props: mapDataToProps })
)(Container);
