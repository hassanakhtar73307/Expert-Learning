import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../theme/colors'
import { ActiveCheck, Call, Check, Email, Password, User, appLogo } from '../../theme/images'
import { FontSizes, Fonts } from '../../theme/fonts'
import CusTextInput from '../../components/CusTextInput'
import CusButton from '../../components/CusButton'
import { loginUser } from '../../db/AuthFunctions'

const Login = ({ navigation }) => {
    const [isCheck, setIsCheck] = useState(false)
    const [inputValue, setInputValue] = useState({ email: '', password: '' })

    const handleLogin = async () => {
        const res = await loginUser(inputValue.email, inputValue.password)
        if (res) {
            navigation.replace('Home')
        }
    }

    return (
        <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.mainContainer}>
                <Image source={appLogo} style={styles.imgStyle} />
                <View style={styles.tittleView}>
                    <Text style={styles.Tittle}>Let’s Sign In.!</Text>
                    <Text style={styles.subTittle}>Login to Your Account to Continue your Courses</Text>
                </View>
                <View style={styles.inputView}>
                    <CusTextInput
                        inputIcon={Email}
                        inputPlaceholder="Email"
                        inputType={"email-address"}
                        onInputChange={(text) => setInputValue({ ...inputValue, email: text })} />
                    <View style={styles.divider} />
                    <CusTextInput
                        inputIcon={Password}
                        inputPlaceholder="Password"
                        typePass={true}
                        isSecureType={true}
                        onInputChange={(text) => setInputValue({ ...inputValue, password: text })} />
                </View>
                <TouchableOpacity style={[styles.checkView, { alignSelf: 'flex-end', marginRight: '4%', marginTop: '2%' }]} activeOpacity={0.8} onPress={() => navigation.navigate('EnterEmail')}>
                    <Text style={[styles.checkText]}>Forgot Password?</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => setIsCheck(!isCheck)} style={styles.checkView} activeOpacity={0.8}>
                    <Image source={isCheck ? ActiveCheck : Check} style={styles.checkImg} />
                    <Text style={styles.checkText}>Remember Me</Text>
                </TouchableOpacity> */}
                <View style={styles.divider} />
                <CusButton btnTittle="Sign In" onPress={() => handleLogin()} />
                <TouchableOpacity style={[styles.checkView, { alignSelf: 'center' }]} activeOpacity={0.8} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.checkText}>Don’t have an Account?</Text>
                    <Text style={[styles.checkText, { color: Colors.mainColor, marginLeft: '1%', textDecorationLine: 'underline' }]}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default Login

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.bgColor
    },
    imgStyle: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: '8%'
    },
    tittleView: {
        marginTop: '5%',
        marginHorizontal: '4%',
    },
    Tittle: {
        fontFamily: Fonts.JostSemiBold,
        fontSize: FontSizes.normalTitle,
        color: Colors.blackColor,
    },
    subTittle: {
        fontFamily: Fonts.MulishMedium,
        fontSize: FontSizes.normalText,
        color: Colors.lightBlackColor,
        marginTop: '2%'
    },
    inputView: {
        marginTop: '8%',
    },
    divider: {
        height: 20,
    },
    checkView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '5%',
        marginHorizontal: '4%',
    },
    checkImg: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginRight: '2%'
    },
    checkText: {
        fontFamily: Fonts.MulishBold,
        fontSize: FontSizes.normalText,
        color: Colors.lightBlackColor,
    }
})