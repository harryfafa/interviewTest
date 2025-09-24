import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './navigator/TabNavigator';


const RootStack = createNativeStackNavigator({
    initialRouteName: 'MainTabs',
    screenOptions: {
        headerTitleAlign: 'center',
    },
    screens: {
        MainTabs: {
            screen: TabNavigator,
            options: {
                headerShown: false,
            },
        },
    },
});

export default Navigation = createStaticNavigation(RootStack);