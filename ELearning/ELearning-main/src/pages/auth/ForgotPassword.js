import { ScrollView, StyleSheet, ToastAndroid, TouchableOpacity, Text, View, Image } from 'react-native'
import React, { useState } from 'react'
import { Password, appLogo, backIcon } from '../../theme/images'
import { Colors } from '../../theme/colors'
import { FontSizes, Fonts } from '../../theme/fonts'
import CusTextInput from '../../components/CusTextInput'
import CusButton from '../../components/CusButton'
import { updateUserInFirestore } from '../../db/AuthFunctions'

const ForgotPassword = ({ navigation, route }) => {
    const { userId } = route.params
    const [inputValue, setInputValue] = useState({
        password: '',
        confPassword: '',
    })

    const handlePress = async () => {
        if (inputValue.password === '') {
            ToastAndroid.show('Please Enter Password', ToastAndroid.SHORT);
        }
        else if (inputValue.confPassword === '') {
            ToastAndroid.show('Please Enter Confirm Password', ToastAndroid.SHORT);
        } else if (inputValue.password !== inputValue.confPassword) {
            ToastAndroid.show('Password Not Matched', ToastAndroid.SHORT);
        } else {
            const res = await updateUserInFirestore(userId, { password: inputValue.password })
            if (res) {
                ToastAndroid.show('Password Updated Successfully', ToastAndroid.SHORT);
                navigation.replace('Login')
            }
        }
    }

    return (
        <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.mainContainer}>
                <View style={styles.headerView}>
                    <TouchableOpacity onPress={() => { navigation.replace('Login') }} activeOpacity={0.8}>
                        <Image source={backIcon} style={styles.backIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Create New Password</Text>
                </View>
                <Image source={appLogo} style={styles.imgStyle} />
                <View style={styles.divider} />
                <View style={styles.divider} />
                <Text style={styles.headerText}>Create Your New Password</Text>
                <View style={styles.divider} />
                <CusTextInput
                    inputIcon={Password}
                    inputPlaceholder="Password"
                    typePass={true}
                    isSecureType={true}
                    onInputChange={(text) => setInputValue({ ...inputValue, password: text })} />
                <View style={styles.divider} />
                <CusTextInput
                    inputIcon={Password}
                    inputPlaceholder="Confirm Password"
                    typePass={true}
                    isSecureType={true}
                    onInputChange={(text) => setInputValue({ ...inputValue, confPassword: text })} />
                <View style={styles.divider} />
                <View style={styles.divider} />
                <CusButton btnTittle="Continue" onPress={() => { handlePress() }} />
            </View>
        </ScrollView>
    )
}

export default ForgotPassword

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
})