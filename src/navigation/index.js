
import { View } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './navigator/TabNavigator';
import Settings, { DisplayCurrency } from '../screens/wallet/settings';

const RootStack = createNativeStackNavigator({
    initialRouteName: 'MainTabs',
    screenOptions: {
        headerTitleAlign: 'center',
        headerStyle: {
            backgroundColor: '#F5F6F7',
        },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
    },
    screens: {
        MainTabs: {
            screen: TabNavigator,
            options: {
                headerShown: false,
            },
        },
        Settings: { screen: Settings, },
        DisplayCurrency: { screen: DisplayCurrency, }
    },
});

export default Navigation = createStaticNavigation(RootStack);