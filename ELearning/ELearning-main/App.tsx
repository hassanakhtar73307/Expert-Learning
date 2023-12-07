import { LogBox } from 'react-native';
import React from 'react'
import StackNav from './src/routes/stack'
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
const App = () => <StackNav />
export default App