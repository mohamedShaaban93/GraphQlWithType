import {gql} from '@apollo/client';

export const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId) {
      id
    }
  }
`;

export const ADD_POST = gql`
  mutation addPost($userId: Int!, $title: String!, $body: String!) {
    addPost(data: {userId: $userId, title: $title, body: $body}) {
      title
      body
      author {
        name
      }
    }
  }
`;
