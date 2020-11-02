import React, { useState } from 'react';
import { gql, InMemoryCache, useMutation, useQuery } from '@apollo/client';
import { FlatList, ScrollView, Text, TouchableNativeFeedback, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { cache } from '..';
import { GET_POSTS } from '../../graphql/query/postQuery';
import { DELETE_POST } from '../../graphql/mutations/postMutation';
import { Post } from '../../models/Post.model';
import { Navigation } from 'react-native-navigation';

interface Props {
  componentId: string;
}


export const Posts: React.FC<Props> = (props: Props) => {

  const page = React.useRef(1);

  const { loading, error, data, fetchMore } = useQuery(GET_POSTS,
    {
      variables: { page: 1, limit: 10 }
    });

  const [deletePost] = useMutation(DELETE_POST, {
  });

  const deletePostHandler = (id: number) => {
    deletePost({
      variables: {
        postId: id,
      },
      update: (cache: any) => {
        const myCache:any = (cache as InMemoryCache).readQuery({ query: GET_POSTS, variables: { page: 1, limit: 10 } });
        console.log("My cache", myCache);
        const updatedCache = (myCache.posts.data).filter((p:Post) => p.id !== id);
        // updatedCache.map(item=>console.log(item.id))
        (cache as InMemoryCache).writeQuery({
          query: GET_POSTS,
          variables: {
            page: 1,
            limit: 10,
          },
          data: {
            posts: { ...myCache.posts, data: [...updatedCache] },
          }
        });
      },
    });

  };

  const fetchMoreHandler = async () => {
    const myCache:any = (cache as InMemoryCache).readQuery({ query: GET_POSTS, variables: { page: 1, limit: 10 } });
    const newData = await fetchMore({
      variables: {
        page: ++page.current,
      },
    });
         (cache as InMemoryCache).writeQuery({
      query: GET_POSTS,
      variables: {
        page: 1,
        limit: 10,
      },
      data: {
        posts:{ ...myCache.posts,data:[...myCache.posts.data,...newData.data.posts.data] }
      },
    });
  }



  if (loading) return <Text>'Loading...'</Text>;
  if (error) return <Text>`Error! ${error.message}`</Text>;

  return (
    <View style={{ flex: 1 }} >
      <FlatList
        style={{ flex: 1 }}
        keyExtractor={({ id }) => id}
        data={data?.posts.data || []}
        renderItem={({ item: { id, title, body } }) => {
          return (
            <TouchableNativeFeedback onLongPress={() => deletePostHandler(id)}>
              <View key={id} style={{ margin: 10, backgroundColor: 'pink', paddingVertical: 30 }}>
                <Text>{id}---{title}</Text>
              </View>
            </TouchableNativeFeedback>
          )
        }}
        onEndReached={fetchMoreHandler}

      />

      <FAB
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        small={false}
        icon="plus"
        onPress={async () => {
          Navigation.push(props.componentId, {
            component: {
              name:'addPost'
            }
          })
        }}
      />

    </View>
  )
};