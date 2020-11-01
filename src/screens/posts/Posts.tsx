import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { ScrollView, Text, TouchableNativeFeedback, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { Navigation } from 'react-native-navigation';

interface Props {
  componentId: string;
}

const GET_POSTS = gql`
query getPosts($page: Int){
  posts(pagination:{
    limit:10 ,
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

export const Posts: React.FC<Props> = (props: Props) => {
  const [page, setpage] = useState(1)
  const { loading, error, data, fetchMore } = useQuery(GET_POSTS,
    {
    variables: {page}
  });
  
  console.log(loading);



  if (loading) return <Text>'Loading...'</Text>;
  if (error) return <Text>`Error! ${error.message}`</Text>;
  return (
    <View >
      <ScrollView>
        {data.posts.data.map((data: {id:number, title: string, body: string }) => (
          <View key={data.id} style={{ margin: 10, backgroundColor: 'pink', paddingVertical: 30 }}>
            <Text>{data.title}</Text>
          </View>

        ))}
      </ScrollView>
      <FAB
        style={{
          position: 'absolute',
          margin: 16,
          left: 0,
          bottom: 0,
        }}
        small={false}
        icon="plus"
        onPress={() => { }}
          
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
