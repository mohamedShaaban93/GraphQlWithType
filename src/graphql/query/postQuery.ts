import {gql} from '@apollo/client';

export const GET_POSTS = gql`
  query getPosts($page: Int, $limit: Int) {
    posts(pagination: {limit: $limit, page: $page}) {
      data {
        id
        title
        body
      }
    }
  }
`;