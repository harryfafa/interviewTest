import { useEffect } from 'react';
import { requireNativeComponent, NativeEventEmitter, NativeModules } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import DisplayCurrency
    from './DisplayCurrency';
import { useAppContext } from '../../../context/AppContext'; // 新增

const NativeSettingsView = requireNativeComponent('NativeSettingsView');

export default function Settings() {
    const { state } = useAppContext();
    const navigation = useNavigation();

    useEffect(() => {
        const eventEmitter = new NativeEventEmitter(NativeModules.SettingsModule);
        const subscription = eventEmitter.addListener('OnDisplayCurrencyPress', () => {
            navigation.navigate('DisplayCurrency');
        });

        return () => subscription.remove();
    }, [navigation]);

    return (
        <NativeSettingsView style={{ flex: 1 }} currency={state.currency} />
    );
}

export { DisplayCurrency };
