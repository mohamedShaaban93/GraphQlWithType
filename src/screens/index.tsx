import { ApolloClient, ApolloProvider, FieldPolicy, InMemoryCache } from '@apollo/client';
import React from 'react';
import { Navigation } from 'react-native-navigation';
import { Posts } from './posts/Posts';
import { AddPost } from './addPost/AddPost';
import { offsetLimitPagination } from '@apollo/client/utilities';



interface Screens {
  name: string;
  Screen: any;
}
const screens = [
  { name: 'posts', Screen: Posts },
  { name: 'addPosts', Screen: AddPost }

];

type KeyArgs = FieldPolicy<any>['keyArgs'];


function pageLimitPagination<T>(keyArgs: KeyArgs = false): FieldPolicy<T[]> {
  return {
      keyArgs,
      merge(existing: any, incoming: any, { args }) {
          console.log('args',keyArgs );
          console.log('exist', existing);
          console.log('inco', incoming);
          const cacheCopy = existing ? [...existing.data] : [];
          return {
              ...incoming,
              data: [
                  ...cacheCopy,
                  ...incoming.data,
              ],
          };
      },
  };
}

const client = new ApolloClient({
  uri: 'https://api.graphqlplaceholder.com/',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: pageLimitPagination()
        },
      },
    },
  })
});

/// create Screen
function createScreen(screen: Screens): void {
  const { name, Screen } = screen;
  let ScreenWraper = (props: object) => (
    <ApolloProvider client={client}>
      <Screen {...props} />
    </ApolloProvider>
  );
  Navigation.registerComponent(name, () =>
    ScreenWraper,
  );
}

//// register fun
const registerScreens = () => {
  screens.forEach((screen) => createScreen(screen));
};

export default registerScreens;
