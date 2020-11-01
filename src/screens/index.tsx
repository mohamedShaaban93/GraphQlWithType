import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';
import { Navigation } from 'react-native-navigation';
import { Posts } from './posts/Posts';
import { AddPost } from './addPost/AddPost';



interface Screens {
  name: string;
  Screen: any;
}
const screens = [
  { name: 'posts', Screen: Posts },
  { name: 'addPosts', Screen: AddPost }

];

const client = new ApolloClient({
  uri: 'https://api.graphqlplaceholder.com/',
  cache: new InMemoryCache()
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
