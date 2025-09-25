import React, { useState } from 'react';
import { TouchableOpacity, Pressable, Text, Image, Dimensions, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getDefaultHeaderHeight } from '@react-navigation/elements';

import Home from '../../screens/Home';
import Wallet from '../../screens/wallet';
import TransactionModal from '../components/TransactionModal';
import SwitchWalletModal from '../components/SwitchWalletModal';

const TabBarImage = {
    Home: require('../../assets/images/tabbar/home.png'),
    Wallet: require('../../assets/images/tabbar/wallet.png'),
    Transaction: require('../../assets/images/tabbar/transfer.png'),
};

const Tab = createBottomTabNavigator();

export default function RootTabs() {
    const [transactionModalVisible, setTransactionModalVisible] = useState(false);
    const [switchWalletModalVisible, setSwitchWalletModalVisible] = useState(false);

    return (
        <>
            <TransactionModal
                visible={transactionModalVisible}
                onClose={() => setTransactionModalVisible(false)}
            />
            <SwitchWalletModal
                visible={switchWalletModalVisible}
                onClose={() => setSwitchWalletModalVisible(false)}
            />

            <Tab.Navigator
                screenOptions={({ route }) => {
                    const { width, height } = Dimensions.get('window');
                    const statusBarHeight = StatusBar.currentHeight ?? 0;
                    const isLandscape = width > height;
                    const headerHeight = getDefaultHeaderHeight(
                        { width, height },
                        statusBarHeight,
                        isLandscape
                    );
                    return {
                        tabBarShowLabel: false,
                        tabBarStyle: {
                            backgroundColor: '#F5F6F7',
                            elevation: 0,
                            shadowOpacity: 0,
                            borderTopWidth: 0,
                        },
                        headerStyle: {
                            backgroundColor: '#F5F6F7',
                            elevation: 0,
                        },
                        headerTitle: () => null,
                        headerLeft: () => (
                            <TouchableOpacity
                                style={{
                                    width: headerHeight * 2,
                                    height: headerHeight * 0.7,
                                    justifyContent: 'center',
                                    backgroundColor: '#E6EBF0',
                                    borderRadius: 20,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-evenly',
                                    marginLeft: 16,
                                }}
                                onPress={() => setSwitchWalletModalVisible(true)}
                            >
                                <Image
                                    source={require('../../assets/images/user.png')}
                                    style={{
                                        width: headerHeight * 0.5,
                                        height: headerHeight * 0.5,
                                    }}
                                />
                                <Text style={{ fontWeight: '500' }}>Wallet 1</Text>
                                <Image
                                    source={require('../../assets/images/down-arrow.png')}
                                    style={{
                                        width: headerHeight * 0.3,
                                        height: headerHeight * 0.3,
                                    }}
                                />

                            </TouchableOpacity>
                        ),
                        tabBarButton: (props) => (
                            <Pressable
                                {...props}
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {props.children}
                            </Pressable>
                        ),

                        tabBarIcon: ({ color, size, focused }) => {
                            const isTransaction = route.name === 'Transaction';
                            return (
                                <Image
                                    source={TabBarImage[route.name]}
                                    style={{
                                        width: isTransaction ? size + 16 : size,
                                        height: isTransaction ? size + 16 : size,
                                        tintColor: isTransaction ? undefined : color,
                                    }}
                                    resizeMode="contain"
                                />
                            );
                        },
                    };
                }}
            >
                <Tab.Screen name="Home" component={Home} />

                <Tab.Screen
                    name="Transaction"
                    component={() => null}
                    listeners={{
                        tabPress: (e) => {
                            console.log('Transaction Tab Pressed');
                            e.preventDefault(); // 阻止 Tab 預設跳轉
                            setTransactionModalVisible(true);
                        },
                    }}
                />

                <Tab.Screen name="Wallet" component={Wallet} />
            </Tab.Navigator>
        </>
    );
}
