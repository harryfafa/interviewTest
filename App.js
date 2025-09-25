import Navigation from './src/navigation';
import { DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext'; // 新增

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F5F6F7'
  },
};


function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Navigation theme={MyTheme} />
      </AppProvider>
    </SafeAreaProvider>
  );
}

export default App;
