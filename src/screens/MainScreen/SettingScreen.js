import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { color } from '../../config';

const SettingScreen = () => (
  <View style={styles.container}>
    <Text>Hello SettingScreen</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.darkColor,
    flex: 1,
  },
});

export default SettingScreen;
