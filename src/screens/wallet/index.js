import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Platform,
    UIManager,
    Animated,
    FlatList,
    NativeModules,
} from 'react-native';
import { Text } from '@react-navigation/elements';
import ManageModal from './components/ManageModal';
import SearchBar from './components/SearchBar';
import { useAppContext } from '../../context/AppContext';
import { getProfitLossRate, getFiatValue } from './utils';
import cryptoMockData from '../../assets/mockdata/currency.json';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { SettingsModule } = NativeModules;

const menu = [
    { icon: require('../../assets/images/wallet/buy.png'), label: 'Buy' },
    { icon: require('../../assets/images/wallet/send.png'), label: 'Send' },
    { icon: require('../../assets/images/wallet/receive.png'), label: 'Receive' },
    { icon: require('../../assets/images/wallet/earn.png'), label: 'Earn' },
];

const assetType = ['Crypto', 'Earn', 'NFTs'];

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

    const { state } = useAppContext();
    const { currency } = state;
    const [mainnetsExpand, setMainnetsExpand] = useState(true);
    const animatedHeight = useRef(new Animated.Value(60)).current;
    const [seletedAssetType, setSelectedAssetType] = useState('Crypto');
    const [manageModalVisible, setManageModalVisible] = useState(false);
    const [cryptoData, setCryptoData] = useState([]);
    const [fiatRate, setFiatRate] = useState([]);

    useEffect(() => {
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
            Animated.timing(animatedHeight, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start(() => setMainnetsExpand(false));
        } else {
            setMainnetsExpand(true);
            Animated.timing(animatedHeight, {
                toValue: 60,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    };

    const renderCryptoItem = (item) => {
        const data = item.item;
        const profitLossRate = getProfitLossRate();
        const fiatValue = getFiatValue(data.amount, data.symbol, fiatRate);
        return (
            <View style={styles.cryptoItem}>
                <Image
                    source={require('../../assets/images/wallet/crypto.png')}
                    style={styles.cryptoIcon}
                />
                <View style={styles.cryptoItemContent}>
                    <View style={styles.cryptoLeftBlock}>
                        <Text style={styles.cryptoName} numberOfLines={1}>{data.name}</Text>
                        <Text style={{
                            color: profitLossRate.value !== 0 ? profitLossRate.isNegative ? 'red' : 'green' : 'black',
                            fontSize: 12
                        }}>
                            <Text style={{
                                color: profitLossRate.value !== 0 ? profitLossRate.isNegative ? 'red' : 'green' : 'black',
                                fontWeight: 'bold'
                            }}>
                                {profitLossRate.isNegative ? '- ' : ''}
                            </Text>
                            {profitLossRate.value} %
                        </Text>
                    </View>

                    <View style={styles.cryptoRightBlock}>
                        <Text style={styles.cryptoValue}>$ {fiatValue}</Text>
                        <Text style={styles.cryptoAmount}>{data.amount} {data.symbol}</Text>
                    </View>
                </View>
            </View>
        );
    };

    const aboveListUI = () => {
        return <>
            <TouchableOpacity style={styles.btn_allMainnets} onPress={toggleExpand}>
                <Text style={styles.grayText}>All Mainnets</Text>
                <Image
                    style={styles.Icon_mainnetsArrow}
                    source={mainnetsExpand ? require('../../assets/images/wallet/down.png') : require('../../assets/images/wallet/up.png')} />
            </TouchableOpacity>
            <Animated.View style={[styles.mainnetsExpandBox, { height: animatedHeight }]}>
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
            <View style={styles.assetsHeader}>
                <Text style={styles.assetsHeaderTitle}>Your Assets</Text>
                <TouchableOpacity style={styles.manageButton} onPress={() => setManageModalVisible(true)}>
                    <Text style={styles.manageText}>Manage</Text>
                    <Image source={require('../../assets/images/wallet/manage.png')} style={styles.manageIcon} />
                </TouchableOpacity>
            </View>
        </>
    };

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
                <View style={styles.searchBarContainer}>
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
    Icon_eye: {
        width: 20,
        height: 20,
        tintColor: 'gray',
        marginTop: 20,
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
    cryptoItem: {
        flexDirection: 'row',
        width: '100%',
        height: 60,
        alignItems: 'center',
        backgroundColor: '#eaeff4',
        borderRadius: 12,
        padding: 8,
        marginBottom: 10,
    },
    cryptoIcon: {
        width: 40,
        height: 40,
    },
    cryptoItemContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10,
    },
    cryptoLeftBlock: {
        justifyContent: 'space-evenly',
        height: '100%',
    },
    cryptoName: {
        color: 'black',
        fontWeight: '700',
        textTransform: 'capitalize',
    },
    cryptoRightBlock: {
        alignItems: 'flex-end',
        justifyContent: 'space-evenly',
        height: '100%',
    },
    cryptoValue: {
        color: 'black',
        fontWeight: '700',
    },
    cryptoAmount: {
        color: 'gray',
        fontSize: 12,
    },
    mainnetsExpandBox: {
        overflow: 'hidden',
        width: '100%',
        alignItems: 'center',
    },
    assetsHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 10,
    },
    assetsHeaderTitle: {
        color: 'black',
        fontWeight: '700',
    },
    manageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    manageText: {
        lineHeight: 20,
        color: '#159BFA',
    },
    manageIcon: {
        width: 20,
        height: 20,
        tintColor: '#159BFA',
    },
    searchBarContainer: {
        width: '100%',
        paddingTop: 10,
    },
});
