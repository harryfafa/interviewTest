
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    LayoutAnimation,
    Platform,
    UIManager,
    Animated,
    ScrollView,
    FlatList,
    Button,
    NativeModules, NativeEventEmitter
} from 'react-native';
import { Text } from '@react-navigation/elements';
import ManageModal from './components/ManageModal';
import SearchBar from './components/SearchBar';
import { useAppContext } from '../../context/AppContext';
import { getProfitLossRate } from './utils';
import cryptoMockData from '../../assets/mockdata/currency.json';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { SettingsModule } = NativeModules;

const menu = [
    {
        icon: require('../../assets/images/wallet/buy.png'),
        label: 'Buy',
    },
    {
        icon: require('../../assets/images/wallet/send.png'),
        label: 'Send',
    },
    {
        icon: require('../../assets/images/wallet/receive.png'),
        label: 'Receive',
    },
    {
        icon: require('../../assets/images/wallet/earn.png'),
        label: 'Earn',
    },
]

const assetType = [
    'Crypto',
    'Earn',
    'NFTs',
]

export default function Wallet({ navigation }) {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => alert('Scan')}>
                        <Image
                            source={require('../../assets/images/wallet/scanner.png')}
                            style={styles.headerIcons}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => alert('History')}>
                        <Image
                            source={require('../../assets/images/wallet/time.png')}
                            style={styles.headerIcons}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <Image
                            source={require('../../assets/images/wallet/settings.png')}
                            style={styles.headerIcons}
                        />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    const { state, dispatch } = useAppContext();
    const { currency } = state;
    const [mainnetsExpand, setMainnetsExpand] = useState(true);
    const animatedHeight = useRef(new Animated.Value(60)).current;
    const [seletedAssetType, setSelectedAssetType] = useState('Crypto');
    const [manageModalVisible, setManageModalVisible] = useState(false);
    const [cryptoData, setCryptoData] = useState(new Array());
    const [fiatRate, setFiatRate] = useState(new Array());

    useEffect(() => {
        console.log('cryptoMockData', cryptoMockData.data)
        setCryptoData(cryptoMockData.data);
    }, []);

    useEffect(() => {
        let _currency = currency || 'HKD';
        let fiatRateData;
        switch (_currency) {
            case 'HKD':
                fiatRateData = require('../../assets/mockdata/fiat_rate_hkd.json');
                break;
            case 'USD':
                fiatRateData = require('../../assets/mockdata/fiat_rate_usd.json');
                break;
        }
        fiatRateData = fiatRateData.data || [];
        setFiatRate(fiatRateData);
    }, [currency]);


    const toggleExpand = () => {
        if (mainnetsExpand) {
            // 收合
            Animated.timing(animatedHeight, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false, // 因為要改 height，不能用 true
            }).start(() => setMainnetsExpand(false));
        } else {
            // 展開
            setMainnetsExpand(true);
            Animated.timing(animatedHeight, {
                toValue: 60, // 設定展開後的高度，依照實際 UI 調整
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    };

    const renderCryptoItem = (item) => {
        const data = item.item;
        const profitLossRate = getProfitLossRate();
        let _fiatRate = fiatRate.find(rate => rate.symbol === data.symbol);
        _fiatRate = _fiatRate.fiat_rate || 0;
        const fiatValut = data.amount * _fiatRate;
        return (
            <View style={{
                flexDirection: 'row',
                width: '100%',
                height: 60,
                alignItems: 'center',
                backgroundColor: '#eaeff4',
                borderRadius: 12,
                padding: 8,
                marginBottom: 10
            }}>
                <Image
                    source={require('../../assets/images/wallet/crypto.png')}
                    style={{ width: 40, height: 40 }}
                />
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10 }}>
                    <View style={{ justifyContent: 'space-evenly', height: '100%' }}>
                        <Text style={{ color: 'black', fontWeight: '700', justifyContent: 'space-evenly', textTransform: 'capitalize' }} numberOfLines={1}>{data.name}</Text>
                        <Text style={{ color: profitLossRate.value !== 0 ? profitLossRate.isNegative ? 'red' : 'green' : 'black', fontSize: 12 }}>
                            <Text style={{ color: profitLossRate.value !== 0 ? profitLossRate.isNegative ? 'red' : 'green' : 'black', fontWeight: 'bold' }}>
                                {profitLossRate.isNegative ? '- ' : ''}
                            </Text>
                            {profitLossRate.value} %
                        </Text>
                    </View>

                    <View style={{ alignItems: 'flex-end', justifyContent: 'space-evenly', height: '100%' }}>
                        <Text style={{ color: 'black', fontWeight: '700' }}>$ {fiatValut}</Text>
                        <Text style={{ color: 'gray', fontSize: 12 }}>{data.amount} {data.symbol}</Text>
                    </View>
                </View>
            </View>

        )
    }

    const aboveListUI = () => {
        return <>
            <TouchableOpacity style={styles.btn_allMainnets} onPress={toggleExpand}>
                <Text style={styles.grayText}>All Mainnets</Text>
                <Image
                    style={styles.Icon_mainnetsArrow}
                    source={mainnetsExpand ? require('../../assets/images/wallet/down.png') : require('../../assets/images/wallet/up.png')} />
            </TouchableOpacity>
            <Animated.View
                style={{
                    overflow: 'hidden',
                    height: animatedHeight,
                    width: '100%',
                    alignItems: 'center',
                }}
            >
                {mainnetsExpand && (
                    <>
                        <Image
                            source={require('../../assets/images/wallet/open-eye.png')}
                            style={styles.Icon_eye}
                        />
                        <Text style={styles.blackText}>--  <Text style={styles.grayText}>●</Text>  --</Text>
                    </>
                )}
            </Animated.View>
            <View style={styles.menuRow}>
                {menu.map((item, index) => (
                    <View key={`menu${index}`} style={styles.menuItem}>
                        <TouchableOpacity style={styles.menuButton}>
                            <Image source={item.icon} style={styles.menuIcon} />
                        </TouchableOpacity>
                        <Text style={styles.menuLabel}>{item.label}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.assetTypeRow}>
                {assetType.map((item, index) => (
                    <TouchableOpacity
                        key={`assetType${index}`}
                        onPress={() => setSelectedAssetType(item)}
                    >
                        <Text
                            style={[
                                styles.assetTypeText,
                                { color: seletedAssetType === item ? 'black' : 'gray' },
                            ]}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 10 }}>
                <Text style={{ color: 'black', fontWeight: '700' }}>
                    Your Assets
                </Text>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => setManageModalVisible(true)}>
                    <Text style={{ lineHeight: 20, color: '#159BFA' }}>Manage</Text>
                    <Image source={require('../../assets/images/wallet/manage.png')} style={{ width: 20, height: 20, tintColor: '#159BFA' }} />
                </TouchableOpacity>
            </View>
        </>
    }

    return (
        <>
            <ManageModal
                visible={manageModalVisible}
                onClose={() => setManageModalVisible(false)}
            />
            <View style={styles.container}>
                <FlatList
                    data={cryptoData}
                    renderItem={renderCryptoItem}
                    keyExtractor={item => item.id}
                    style={{ width: '100%' }}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={aboveListUI}
                    ListHeaderComponentStyle={{ alignItems: 'center' }}
                />
                <View style={{ width: '100%', paddingTop: 10 }}>
                    <SearchBar />
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    headerRight: {
        flexDirection: 'row',
        marginRight: 10,
    },
    headerIcons: {
        width: 22,
        height: 22,
        tintColor: 'gray',
        marginHorizontal: 8,
    },
    container: {
        flex: 1,
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    btn_allMainnets: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    Icon_mainnetsArrow: {
        width: 12,
        height: 12,
        marginLeft: 10,
        tintColor: 'gray',
    },
    expandContent: {
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
    },
    Icon_eye: {
        width: 20,
        height: 20,
        tintColor: 'gray',
        marginTop: 20
    },
    grayText: {
        color: 'gray',
    },
    blackText: {
        color: 'black',
    },
    menuRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
    },
    menuItem: {
        alignItems: 'center',
    },
    menuButton: {
        backgroundColor: '#CDEAFE',
        padding: 12,
        borderRadius: 50,
    },
    menuIcon: {
        width: 20,
        height: 20,
        tintColor: '#159BFA',
    },
    menuLabel: {
        color: '#159BFA',
        marginTop: 2,
    },
    assetTypeRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 40,
    },
    assetTypeText: {
        fontSize: 16,
        fontWeight: '700',
    },
});