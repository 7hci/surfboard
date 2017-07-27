import { gql } from 'react-apollo';

export default {
  addNewHire: gql`
    mutation addNewHire($formData: JSON!) {
      newHire(formData: $formData) {
        id
      }
    }
  `,

  skipStep: gql`
    mutation skipStep($id: ID!, $step: Int!) {
      skipStep(id: $id, step: $step)
    }
  `,

  completeHire: gql`
    mutation completeHire($id: ID!) {
      completeHire(id: $id)
    }
  `,

  sendContract: gql`
    mutation sendContract($formData: JSON!, $id: ID!) {
      sendContract(formData: $formData, id: $id)
    }
  `,

  acceptContract: gql`
    mutation acceptContract($id: ID!) {
      acceptContract(id: $id)
    }
  `,

  previewContract: gql`
    mutation previewContract($formData: JSON!, $id: ID!) {
      previewContract(formData: $formData, id: $id) {
        contractId
        credentials
      }
    }
  `,

  submitContract: gql`
    mutation submitContract($id: ID!) {
      submitContract(id: $id)
    }
  `,

  uploadSignature: gql`
    mutation uploadSignature($file: Upload!, $id: ID!) {
      uploadSignature(file: $file, id: $id)
    }
  `
};
