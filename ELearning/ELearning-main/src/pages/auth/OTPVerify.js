import { Alert, Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell, } from 'react-native-confirmation-code-field';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { backIcon } from '../../theme/images';
import CusButton from '../../components/CusButton';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { updateUserInFirestore } from '../../db/AuthFunctions';


const OTPVerify = ({ navigation, route }) => {
    const [value, setValue] = useState('')
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue, });
    const CELL_COUNT = 6;
    const { confirmation, userId } = route.params;


    // Handle user state changes
    function onAuthStateChanged(user) {
        console.log('user', user);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    const handleVerifyOTP = async () => {
        try {
            const verifyStatus = await confirmation.confirm(value);
            console.log('verifyStatus', verifyStatus);
            if (verifyStatus) {
                ToastAndroid.show('OTP Verified Successfully', ToastAndroid.SHORT);
                console.log('Phone number verified successfully');
                // await updateUserInFirestore(userId, { status: 'verified' });
                navigation.navigate('ForgotPassword', { userId: userId })
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            Alert.alert('Error', 'Invalid OTP. Please try again.');
        }
    };


    return (
        <>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: '5%', backgroundColor: Colors.bgColor }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={backIcon} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
                </TouchableOpacity>
                <Text style={styles.tittle}>OTP Verification</Text>
            </View>
            <View style={styles.mainContainer}>
                <Text style={styles.subTittle}>Enter the OTP sent to your registered mobile number</Text>
                <View style={{ width: '90%', marginTop: '2%' }}>
                    <CodeField
                        ref={ref}
                        {...props}
                        value={value}
                        onChangeText={setValue}
                        cellCount={CELL_COUNT}
                        rootStyle={styles.codeFiledRoot}
                        keyboardType="number-pad"
                        hidden={true}
                        renderCell={({ index, symbol, isFocused }) => (
                            <View
                                key={index}
                                style={[styles.cellRoot, isFocused && styles.focusCell]}>
                                <Text style={styles.cellText}>
                                    {symbol || (isFocused ? <Cursor /> : null)}
                                </Text>
                            </View>
                        )}
                    />
                </View>
                <View style={{ marginTop: '10%' }} />
                <CusButton btnTittle="Verify OTP" onPress={() => { handleVerifyOTP() }} />
            </View>
        </>
    )
}

export default OTPVerify

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.bgColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tittle: {
        fontSize: 25,
        fontFamily: Fonts.JostMedium,
        color: Colors.blackColor,
        marginLeft: '5%',
    },
    subTittle: {
        fontSize: 14,
        fontFamily: Fonts.MulishRegular,
        color: '#000',
        textAlign: 'center',
    },
    codeFiledRoot: {
        marginTop: 30,
        width: '100%',
        justifyContent: 'space-between',
    },
    cellRoot: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    cellText: {
        color: '#000',
        fontSize: 30,
        textAlign: 'center',
        fontFamily: 'Roboto-Regular',
    },
    focusCell: {
        borderColor: '#000',
        borderWidth: .5,
        borderRadius: 10,
    },
})