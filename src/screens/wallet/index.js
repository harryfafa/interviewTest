
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
    SafeAreaProvider,
} from 'react-native-safe-area-context';

export default function Wallet() {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <SafeAreaProvider>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        </SafeAreaProvider>
    );
}
