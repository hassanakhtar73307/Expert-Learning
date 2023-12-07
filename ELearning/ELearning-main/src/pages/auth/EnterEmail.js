import { ScrollView, StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../../theme/colors'
import { Call, appLogo, backIcon } from '../../theme/images'
import { FontSizes, Fonts } from '../../theme/fonts'
import CusTextInput from '../../components/CusTextInput'
import CusButton from '../../components/CusButton'
import { getUserInfo } from '../../db/AuthFunctions'
import auth from '@react-native-firebase/auth';

const EnterEmail = ({ navigation }) => {

    const [inputValue, setInputValue] = useState('')


    function onAuthStateChanged(user) {
        console.log('user', user);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    const handlePress = async () => {
        const res = await getUserInfo(inputValue)
        if (res) {
            console.log(res);
            const confirmation = await auth().signInWithPhoneNumber(inputValue)
            navigation.navigate('OTPVerify', { confirmation: confirmation, userId: res.id })
        }
    }

    return (
        <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.mainContainer}>
                <View style={styles.headerView}>
                    <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
                        <Image source={backIcon} style={styles.backIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Forgot Password</Text>
                </View>
                <Image source={appLogo} style={styles.imgStyle} />
                <View style={styles.divider} />
                <Text style={styles.subHeading}>Select which contact details should we use to Reset Your Password</Text>
                <View style={styles.divider} />
                <CusTextInput
                    inputIcon={Call}
                    inputPlaceholder="Phone Number (+923001234567)"
                    inputType={"phone-pad"}
                    onInputChange={(text) => setInputValue(text)} />
                <View style={styles.divider} />
                <CusButton btnTittle="Send OTP" onPress={() => { handlePress() }} />
            </View>
        </ScrollView>
    )
}

export default EnterEmail

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.bgColor
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '4%',
        marginLeft: '4%'
    },
    backIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    headerText: {
        fontFamily: Fonts.JostSemiBold,
        fontSize: FontSizes.header,
        color: Colors.blackColor,
        marginLeft: '4%'
    },
    imgStyle: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: '8%'
    },
    divider: {
        height: 30,
    },
    subHeading: {
        fontFamily: Fonts.MulishMedium,
        fontSize: FontSizes.normalText,
        color: Colors.lightBlackColor,
        marginTop: '2%',
        marginHorizontal: '4%',
        textAlign: 'center'
    },
})