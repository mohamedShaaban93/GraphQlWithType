import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, Text, View } from 'react-native';
import { FAB, TextInput } from 'react-native-paper';
import { Navigation } from 'react-native-navigation';
import { ADD_POST } from '../../graphql/mutations/postMutation';

interface Props {
  componentId: string;
}



export const AddPost: React.FC<Props> = (props: Props) => {
  const [title, settitle] = useState('')
  const [body, setbody] = useState('')

  const [addPost, { data }] = useMutation(ADD_POST, {
    onCompleted : (data) => {
      console.log(data);
      
  }});
  

  return (
    <View>
      <TextInput
        placeholder='title'
        onChangeText = {(value)=>settitle(value)}
      />
       <TextInput
        placeholder='body'
        onChangeText = {(value)=>setbody(value)}
      />
      <Button
        title="Add"
        onPress={() => {
          addPost({
            variables: {
            title,body,userId:1
            }
            
          })
          
          Navigation.pop(props.componentId)
        }}
      />

    </View>
  )
};
