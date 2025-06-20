import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NoteListScreen } from './src/screens/NoteListScreen';
import { NoteDetailScreen } from './src/screens/NoteDetailScreen';
import { ScamperEditorScreen } from './src/screens/ScamperEditorScreen';

const Stack = createStackNavigator();

const theme = {
  colors: {
    primary: '#3B82F6',
    accent: '#FF6B35',
    background: '#f8f9fa',
    surface: '#ffffff',
    text: '#212529',
    disabled: '#6c757d',
    placeholder: '#adb5bd',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="NoteList"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#3B82F6',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: '500',
              },
            }}
          >
            <Stack.Screen
              name="NoteList"
              component={NoteListScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="NoteDetail"
              component={NoteDetailScreen}
              options={{
                title: 'メモ詳細',
              }}
            />
            <Stack.Screen
              name="ScamperEditor"
              component={ScamperEditorScreen}
              options={{
                title: 'SCAMPER編集',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}