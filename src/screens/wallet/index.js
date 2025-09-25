import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Platform,
    UIManager,
    Animated,
    FlatList,
} from 'react-native';
import { Text } from '@react-navigation/elements';
import ManageModal from './components/ManageModal';
import SearchBar from './components/SearchBar';
import { useAppContext } from '../../context/AppContext';
import { getProfitLossRate, getFiatValue } from './utils';
import cryptoMockData from '../../assets/mockdata/currency.json';
import { menu, assetType } from './constants';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const HeaderButton = ({ icon, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <Image source={icon} style={styles.headerIcons} />
    </TouchableOpacity>
);

const CryptoItem = React.memo(({ item, fiatRate }) => {
    const profitLossRate = getProfitLossRate();
    const fiatValue = getFiatValue(item.amount, item.symbol, fiatRate);

    return (
        <View style={styles.cryptoItem}>
            <Image
                source={require('../../assets/images/wallet/crypto.png')}
                style={styles.cryptoIcon}
            />
            <View style={styles.cryptoItemContent}>
                <View style={styles.cryptoLeftBlock}>
                    <Text style={styles.cryptoName} numberOfLines={1}>{item.name}</Text>
                    <Text style={[styles.profitLossText, { color: profitLossRate.color }]}>
                        {profitLossRate.isNegative ? '- ' : ''}
                        {profitLossRate.value} %
                    </Text>
                </View>
                <View style={styles.cryptoRightBlock}>
                    <Text style={styles.cryptoValue}>$ {fiatValue}</Text>
                    <Text style={styles.cryptoAmount}>{item.amount} {item.symbol}</Text>
                </View>
            </View>
        </View>
    );
});

const AboveListUI = React.memo(({ toggleExpand, mainnetsExpand, setSelectedAssetType, seletedAssetType, setManageModalVisible, animatedHeight }) => (
    <>
        <TouchableOpacity style={styles.btn_allMainnets} onPress={toggleExpand}>
            <Text style={styles.grayText}>All Mainnets</Text>
            <Image
                style={styles.Icon_mainnetsArrow}
                source={mainnetsExpand ? require('../../assets/images/wallet/down.png') : require('../../assets/images/wallet/up.png')}
            />
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
));

export default function Wallet({ navigation }) {
    const { state } = useAppContext();
    const { currency } = state;
    const [mainnetsExpand, setMainnetsExpand] = useState(true);
    const animatedHeight = useRef(new Animated.Value(60)).current;
    const [seletedAssetType, setSelectedAssetType] = useState('Crypto');
    const [manageModalVisible, setManageModalVisible] = useState(false);
    const [cryptoData, setCryptoData] = useState([]);
    const [fiatRate, setFiatRate] = useState([]);

    // set header buttons
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerRight}>
                    <HeaderButton icon={require('../../assets/images/wallet/scanner.png')} onPress={() => alert('Scan')} />
                    <HeaderButton icon={require('../../assets/images/wallet/time.png')} onPress={() => alert('History')} />
                    <HeaderButton icon={require('../../assets/images/wallet/settings.png')} onPress={() => navigation.navigate('Settings')} />
                </View>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        setCryptoData(cryptoMockData.data);
    }, []);

    useEffect(() => {
        const rates = (currency === 'USD' ?
            require('../../assets/mockdata/fiat_rate_usd.json')
            : require('../../assets/mockdata/fiat_rate_hkd.json')).data
            || [];
        setFiatRate(rates);
    }, [currency]);

    const toggleExpand = () => {
        const expanded = !mainnetsExpand;
        setMainnetsExpand(expanded);
        Animated.timing(animatedHeight, {
            toValue: expanded ? 60 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
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
                    renderItem={({ item }) => <CryptoItem item={item} fiatRate={fiatRate} />}
                    keyExtractor={item => String(item.id)}
                    style={{ width: '100%' }}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <AboveListUI
                            toggleExpand={toggleExpand}
                            mainnetsExpand={mainnetsExpand}
                            setSelectedAssetType={setSelectedAssetType}
                            seletedAssetType={seletedAssetType}
                            setManageModalVisible={setManageModalVisible}
                            animatedHeight={animatedHeight}
                        />
                    }
                    ListHeaderComponentStyle={{ alignItems: 'center' }}
                    extraData={{ fiatRate, seletedAssetType }}
                />
                <View style={styles.searchBarContainer}>
                    <SearchBar />
                </View>
            </View>
        </>
    );
}

const SIZES = {
    headerIcon: 22,
    cryptoIcon: 40,
    arrow: 12,
};
const SPACING = {
    sm: 8,
    md: 12,
    lg: 20,
};

const styles = StyleSheet.create({
    headerRight: {
        flexDirection: 'row',
        marginRight: SPACING.md,
    },
    headerIcons: {
        width: SIZES.headerIcon,
        height: SIZES.headerIcon,
        tintColor: 'gray',
        marginHorizontal: SPACING.sm,
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
        marginTop: SPACING.lg,
    },
    Icon_mainnetsArrow: {
        width: SIZES.arrow,
        height: SIZES.arrow,
        marginLeft: SPACING.sm,
        tintColor: 'gray',
    },
    Icon_eye: {
        width: 20,
        height: 20,
        tintColor: 'gray',
        marginTop: SPACING.lg,
    },
    grayText: { color: 'gray' },
    blackText: { color: 'black' },
    menuRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
    },
    menuItem: { alignItems: 'center' },
    menuButton: {
        backgroundColor: '#CDEAFE',
        padding: SPACING.md,
        borderRadius: 50,
    },
    menuIcon: { width: 20, height: 20, tintColor: '#159BFA' },
    menuLabel: { color: '#159BFA', marginTop: 2 },
    assetTypeRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 40,
    },
    assetTypeText: { fontSize: 16, fontWeight: '700' },
    cryptoItem: {
        flexDirection: 'row',
        width: '100%',
        height: 60,
        alignItems: 'center',
        backgroundColor: '#eaeff4',
        borderRadius: 12,
        padding: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    cryptoIcon: { width: SIZES.cryptoIcon, height: SIZES.cryptoIcon },
    cryptoItemContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: SPACING.sm,
    },
    cryptoLeftBlock: { justifyContent: 'space-evenly', height: '100%' },
    cryptoName: { color: 'black', fontWeight: '700', textTransform: 'capitalize' },
    profitLossText: { fontSize: 12 },
    cryptoRightBlock: { alignItems: 'flex-end', justifyContent: 'space-evenly', height: '100%' },
    cryptoValue: { color: 'black', fontWeight: '700' },
    cryptoAmount: { color: 'gray', fontSize: 12 },
    mainnetsExpandBox: { overflow: 'hidden', width: '100%', alignItems: 'center' },
    assetsHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    assetsHeaderTitle: { color: 'black', fontWeight: '700' },
    manageButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    manageText: { lineHeight: 20, color: '#159BFA' },
    manageIcon: { width: 20, height: 20, tintColor: '#159BFA' },
    searchBarContainer: { width: '100%', paddingTop: SPACING.sm },
});
