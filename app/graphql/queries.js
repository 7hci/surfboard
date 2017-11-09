import { gql } from 'react-apollo';

export default {
  getNewHires: gql`
    query newHires{
      newHires{
        id
        firstName
        lastName
        email
        override
        isResident
        step
        contractId
        folderId
        credentials
      }
    }
`,

  getNewHire: gql`
    query newHire($id: ID!){
      newHire(id: $id){
        id
        firstName
        lastName
        email
        override
        isResident
        step
        contractId
        folderId
        credentials
      }  
}
  `
};
