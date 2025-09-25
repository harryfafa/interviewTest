import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const SearchBar = ({ onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={{
                backgroundColor: '#eaeff4',
                borderRadius: 12,
                height: 44,
                justifyContent: 'center',
                width: '100%',
            }}
        >
            <Image
                source={require('../../../assets/images/wallet/search.png')}
                style={{
                    width: 18,
                    height: 18,
                    tintColor: '#94a3b8',
                    position: 'absolute',
                    left: 12,
                }}
            />

            <Text style={{ color: '#94a3b8', fontSize: 16, textAlign: 'center' }}>
                Browse Web3
            </Text>
        </TouchableOpacity>
    );
};

export default SearchBar;
