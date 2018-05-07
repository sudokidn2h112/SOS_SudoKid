import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import LoginFb from './components/LoginFb';
import LoginComponent from './components/LoginComponent';

export default class App extends Component {
  render() {
    return (
      <LoginComponent />
    );
  }
}


