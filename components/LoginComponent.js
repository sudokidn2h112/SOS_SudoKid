import React, { Component } from 'react';
import { View, Text, Platform, TextInput } from 'react-native';
import firebase from 'react-native-firebase';
import { AccessToken, LoginManager } from 'react-native-fbsdk';

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import Button from 'react-native-button';

export default  class LoginComponent extends Component {
    constructor(props){
        super(props);
        this.unsubcriber = null;
        this.state = {
            isLogin : false,
            typedEmail : '',
            typedPassword : '',
            user : null,
            isLoginGoogle : false,
            isLoginFb : false,
        };

    }

    componentDidMount(){
        this.unsubcriber = firebase.auth().onAuthStateChanged( (changedUser) => {
            this.setState({user : changedUser})
        });
        GoogleSignin.configure({
            // iosClientId : '', //only ios
        }).then( () => {
            //you can now call curUserAsync()
        });   
    }

    componentWillUnmount(){
        if(this.unsubcriber){
            this.unsubcriber();
        }
    }

    onAnonymousLogin = () => {
        firebase.auth().signInAnonymouslyAndRetrieveData()
            .then( () => {
                this.setState ({
                    isLogin :true,
                });
            })
            .catch(err => console.log(`Login failed: ${err}`))
    }

    onRegister = () => {
        firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(this.state.typedEmail, this.state.typedPassword)
            .then( loginUser => {
                this.setState({ user: loginUser});
                console.log(`Regiter success with user: ${JSON.stringify(this.state.user)}`);
            })
            .catch(err => console.log(`Register failed with error : ${err}`))
    }

    onLogin = () => {
        firebase.auth().signInAndRetrieveDataWithEmailAndPassword(this.state.typedEmail, this.state.typedPassword)
            .then( user => {
                // this.setState({ user: loginUser});
                console.log(`Login success with user: ${JSON.stringify(user)}`);
            })
            .catch(err => console.log(`Login failed with error : ${err}`))
    }

    // onLoginFacebook = () => {
    //     LoginManager
    //         .logInWithReadPermissions(['public_profile', 'email'])
    //         .then( result => {
    //             if(result.isCancelled) {
    //                 return Promise.reject(new Error(`The user called the request`));
    //             }
    //             console.log(`Login success with premission: ${result.grantedPermissions.toString()}`);
    //             //get the access token
    //             return AccessToken.getCurrentAccessToken();
    //         })
    //         .then( (data) => {  
    //             const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
    //             return firebase.auth().signInWithCredential(credential);
    //         })
    //         .then ( curUser => {
    //             console.log(`Facebook login with user: ${JSON.stringify(curUser)}`);

    //         })
    //         .catch (err => {
    //             console.log(`Facebook login failed with error: ${JSON.stringify(err)}`);
    //         })
    // }
        // Calling the following function will open the FB login dialogue:
 onLoginFacebook = async () => {
    try {
      const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);
  
      if (result.isCancelled) {
        throw new Error('User cancelled request'); // Handle this however fits the flow of your app
      }
  
      console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);
  
      // get the access token
      const data = await AccessToken.getCurrentAccessToken();
  
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
            user: currentUser.user,
            isLoginFb: true,
        });
      }
      
    } catch (e) {
      console.error(e);
    }
  }
    onLoginGoogle = () => {
        GoogleSignin
            .signIn()
            .then((data) => {
                // create a new firebase credential with the token
                const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
                // login with credential
                return firebase.auth().signInAndRetrieveDataWithCredential(credential);
            })
            .then((currentUser) => {
                console.log(`Google Login with user : ${JSON.stringify(currentUser.user.toJSON())}`);
                this.setState({
                    isLoginGoogle : true,
                    user : currentUser.user
                })
            })
            .catch((error) => {
                console.log(`Login fail with error: ${error}`);
            });
    }

    onLogoutGoogle = () => {
        GoogleSignin.revokeAccess()
            .then(() => GoogleSignin.signOut())
            .then(() => {
            this.setState({
                user: null,
                isLoginGoogle: false
            });
            })
            .done();
    }

    onLogoutFacebook = () => {
        LoginManager.logOut();
        this.setState({
            user: null,
            isLoginFb : false,
        });
    }

    render () {
        return (
            <View style={{
                flex:1,
                alignItems:'center',
                backgroundColor:'white',
                borderRadius: Platform.OS === 'IOS' ? 30: 0
            }}>
                <Text style={{
                    fontSize:20,
                    fontWeight: 'bold',
                    textAlign:'center',
                    margin: 40
                }}>
                    Login with Firebase
                </Text>
                <Button
                    containerStyle = {{
                        padding:10,
                        borderRadius: 4,
                        backgroundColor: 'rgb(226,161,184)'
                    }} 
                    style={{
                        fontSize:18,
                        color: 'white',
                    }}
                    onPress = {this.onAnonymousLogin}    
                    >
                    Login anonymous
                </Button>
                <Text style={{margin:20, fontSize:15}}>{this.state.isLogin == true ? "Login in anonymous" : ''}</Text>
            
                <TextInput style={{
                    height:40,
                    width:200,
                    margin:10,
                    padding:10,
                    borderColor:'grey',
                    borderWidth:1,
                    color:'black'
                }}  
                underlineColorAndroid='transparent'
                keyboardType='email-address'
                placeholder='Enter your email'
                autoCapitalize='none'
                onChangeText = { (text) => {
                    this.setState({
                        typedEmail :text,
                    })
                }}  
                />
                <TextInput style={{
                    height:40,
                    width:200,
                    margin:10,
                    padding:10,
                    borderColor:'grey',
                    borderWidth:1,
                    color:'black'
                }} 
                underlineColorAndroid='transparent' 
                keyboardType='default'
                placeholder='Enter your password'
                secureTextEntry={true}
                onChangeText = { (txtPass) => {
                    this.setState({
                        typedPassword :txtPass,
                    })
                }}  
                /> 
                <View style={{flexDirection:'row'}}>
                    <Button containerStyle = {{
                        padding:10,
                        margin:10,
                        borderRadius:4,
                        backgroundColor:'green'
                    }}
                    style={{fontSize:17, color:'white'}}
                    onPress={this.onRegister}
                    >   
                        Register
                    </Button>
                    <Button containerStyle = {{
                        padding:10,
                        margin:10,
                        borderRadius:4,
                        backgroundColor:'blue'
                    }}
                    style={{fontSize:17, color:'white'}}
                    onPress={this.onLogin}
                    >   
                      Login
                    </Button>
                </View> 
                {this.state.isLoginFb == false ? 
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
                </Button> :
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
                Log out facebook {this.state.user.email}
            </Button> 
                }
                {this.state.isLoginGoogle == false ? 
               
                <Button
                    containerStyle = {{
                        padding:10,
                        width:150,
                        margin:20,
                        borderRadius: 4,
                        backgroundColor: 'rgb(284,84,65)'
                    }} 
                    style={{
                        fontSize:18,
                        color: 'white',
                    }}
                    onPress = {this.onLoginGoogle}    
                    >
                   Login by Google
                </Button>    
                : 
                    <Button
                    containerStyle = {{
                        padding:10,
                        width:100,
                        margin:20,
                        borderRadius: 4,
                        backgroundColor: 'blue'
                    }} 
                    style={{
                        fontSize:18,
                        color: 'white',
                    }}
                    onPress = {this.onLogoutGoogle}    
                    >
                Log out {this.state.user.email}
                    </Button> 
                }
            </View>
        );
    }
};