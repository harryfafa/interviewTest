import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

export default function TransactionModal({ visible, onClose }) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#fff',
                            padding: 20,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        }}
                    >
                        <Text style={{ fontSize: 18 }}>Transaction Modal</Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={{ marginTop: 20 }}
                        >
                            <Text style={{ color: 'blue' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
