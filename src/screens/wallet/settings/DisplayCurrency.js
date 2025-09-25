import { requireNativeComponent, NativeEventEmitter, NativeModules } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../../../context/AppContext';

const NativeDisplayCurrencyView = requireNativeComponent('NativeDisplayCurrencyView');

export default function DisplayCurrency() {
    const navigation = useNavigation();
    const { dispatch } = useAppContext();

    useEffect(() => {
        const eventEmitter = new NativeEventEmitter(NativeModules.SettingsModule);
        const subscription = eventEmitter.addListener('OnCurrencySelected', (currency) => {
            console.log('Selected currency:', currency);
            dispatch({ type: 'SET_CURRENCY', payload: currency });
            navigation.goBack();
        });

        return () => subscription.remove();
    }, [navigation]);

    return <NativeDisplayCurrencyView style={{ flex: 1 }} />;
}
