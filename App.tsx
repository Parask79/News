import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NewsScreen } from './src/ui/screens/newsList';
import { SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <NewsScreen />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({});
