import React, { Component } from 'react';
import { View, Text, TextInput, Platform, StyleSheet } from 'react-native';
import {AccessToken, LoginButton, LoginManager} from 'react-native-fbsdk';
import firebase from 'react-native-firebase';

import Button from 'react-native-button';


export default class LoginFb extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLogin : false,
      user : null,
    }
  }

  onLoginFacebook = async () => {
    try {
      const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);
  
      if (result.isCancelled) {
        throw new Error('User cancelled request'); // Handle this however fits the flow of your app
      }
  
      console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);
  
      // get the access token
      const data = await AccessToken.getCurrentAccessToken();
      console.log(`Login success with data: ${JSON.stringify(data)}`);
      if (!data) {
        throw new Error('Something went wrong obtaining the users access token'); // Handle this however fits the flow of your app
      }
  
      // create a new firebase credential with the token
      const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
  
      // login with credential
      const currentUser = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
      if(currentUser != null){
        console.info(JSON.stringify(currentUser.user.toJSON()));
        this.setState({
          isLogin: true,
          user:currentUser.user, 
        })
      }
      
    } catch (e) {
      console.error(e);
    }
  }

  onLogoutFacebook = () => {
    LoginManager.logOut();
    this.setState({
      isLogin: false,
      user : null,
    })
  }

  render() {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        {this.state.isLogin == false ? 
         <Button
                    containerStyle = {{
                        padding:10,
                        width:150,
                        margin:20,
                        borderRadius: 4,
                        backgroundColor: 'rgb(73,104,173)'
                    }} 
                    style={{
                        fontSize:18,
                        color: 'white',
                    }}
                    onPress = {this.onLoginFacebook}    
                    >
                    Login by Facebook
                </Button>
           :
           <Button
           containerStyle = {{
               padding:10,
               width:150,
               margin:20,
               borderRadius: 4,
               backgroundColor: 'rgb(73,104,173)'
           }} 
           style={{
               fontSize:18,
               color: 'white',
           }}
           onPress = {this.onLogoutFacebook}    
           >
           Log out user {JSON.stringify(this.state.user.email)}
       </Button>
        }  
      </View>
    );
  }
};