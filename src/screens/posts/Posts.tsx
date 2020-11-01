import React, { useState } from 'react';
import { gql, InMemoryCache, useMutation, useQuery } from '@apollo/client';
import { FlatList, ScrollView, Text, TouchableNativeFeedback, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { Navigation } from 'react-native-navigation';

interface Props {
  componentId: string;
}

const GET_POSTS = gql`
query getPosts($page: Int){
  posts(pagination:{
    limit: 10 ,
    page: $page
  }){
     data{
       id
        title
        body
      }
    }
  }
`

const DELETE_POST = gql`
mutation deletePost($postId:ID! ){
  deletePost(postId:$postId){
    id
   title
    body
    author{
      name
    	}
  	}
  }
`



export const Posts: React.FC<Props> = (props: Props) => {
  const [page, setpage] = useState(1)
  const { loading, error, data, fetchMore } = useQuery(GET_POSTS,
    {
      variables: { page }
    });

  const [deletePost] = useMutation(DELETE_POST, {
  });

  const deletePostHandler = (id: number) => {
    deletePost({
      variables: {
        postId: id,
      },
      update: (cache: any) => {
        const myCache = (cache as InMemoryCache).readQuery({ query: GET_POSTS, variables: { page: 1, limit: 10 } });
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxx',data);
        
        const updatedCache = (data).filter((p) => p.id !== id);
        (cache as InMemoryCache).writeQuery({
          query: GET_POSTS,
          variables: {
            page: 1,
            limit: 10,
          },
          data: {
            posts: { data: [...updatedCache] },
          },
        });
      },
    });
  };




  if (loading) return <Text>'Loading...'</Text>;
  if (error) return <Text>`Error! ${error.message}`</Text>;
  console.log('ddddddddddddddddddddddddddddddddddd', data);

  return (
    <View >
      <FlatList
        data={data.posts.data}
        renderItem={({ item: { id, title, body } }) => {
          return (
            <TouchableNativeFeedback onLongPress={()=>deletePostHandler(id)}>
            <View key={id} style={{ margin: 10, backgroundColor: 'pink', paddingVertical: 30 }}>
              <Text>{id}</Text>
              </View>
              </TouchableNativeFeedback>
          )
        }}
        onEndReachedThreshold={0.5} // Tried 0, 0.01, 0.1, 0.7, 50, 100, 700

        onEndReached={({ distanceFromEnd }) => {
          console.log(distanceFromEnd) // 607, 878 
          console.log('reached'); // once, and if I scroll about 14% of the screen, 
          fetchMore({
            variables: {
              page: page + 1,
              limit: 10,
            },
          });
          setpage(page + 1)
        }}

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
        onPress={() => {
          Navigation.push(props.componentId, {
            component: {
              name: 'addPosts',
            },
          });
        }}
      />

    </View>
  )
};