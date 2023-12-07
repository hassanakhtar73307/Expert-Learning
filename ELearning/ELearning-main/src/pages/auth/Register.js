import { Alert, Image, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../../theme/colors'
import { ActiveCheck, Call, Check, Email, Password, User, appLogo } from '../../theme/images'
import { FontSizes, Fonts } from '../../theme/fonts'
import CusTextInput from '../../components/CusTextInput'
import CusButton from '../../components/CusButton'
import auth from '@react-native-firebase/auth';
import { addUserToFirestore } from '../../db/AuthFunctions'
import Asyncstorage from '@react-native-async-storage/async-storage';
import isEmail from 'validator/lib/isEmail';


const Register = ({ navigation }) => {
    const [isCheck, setIsCheck] = useState(false)
    const [inputValue, setInputValue] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confPassword: '',
        roleSelected: ''
    })

    function onAuthStateChanged(user) {
        console.log('user', user);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    // const handlePressed = () => {
    //     if (inputValue.name === '') {
    //         ToastAndroid.show('Please Enter Name', ToastAndroid.SHORT);
    //     } else if (inputValue.email === '') {
    //         ToastAndroid.show('Please Enter Email', ToastAndroid.SHORT);
    //     } else if (inputValue.phone === '') {
    //         ToastAndroid.show('Please Enter Phone Number', ToastAndroid.SHORT);
    //     } else if (inputValue.password === '') {
    //         ToastAndroid.show('Please Enter Password', ToastAndroid.SHORT);
    //     }
    //     else if (inputValue.confPassword === '') {
    //         ToastAndroid.show('Please Enter Confirm Password', ToastAndroid.SHORT);
    //     } else if (inputValue.password !== inputValue.confPassword) {
    //         ToastAndroid.show('Password Not Matched', ToastAndroid.SHORT);
    //     } else if (inputValue.roleSelected === '') {
    //         ToastAndroid.show('Please Select Role', ToastAndroid.SHORT);
    //     } else if (!isCheck) {
    //         ToastAndroid.show('Please Agree to Terms & Conditions', ToastAndroid.SHORT);
    //     } else if (inputValue.phone) {
    //         const checkValid = phone(inputValue.phone);
    //         if (!checkValid) {
    //             ToastAndroid.show('Please Enter Valid Phone Number', ToastAndroid.SHORT);
    //         }
    //         if (inputValue.email) {
    //             const checkValid = isEmail(inputValue.email);
    //             if (!checkValid) {
    //                 ToastAndroid.show('Please Enter Valid Email', ToastAndroid.SHORT);
    //             } else {
    //                 handleSendOTP();
    //             }
    //         }
    //     }
    // }

    const handlePressed = () => {
        const { name, email, phone, password, confPassword, roleSelected } = inputValue;
        const nameRegex = /^[a-zA-Z ]*$/;

        if (name === '') {
            ToastAndroid.show('Please Enter Name', ToastAndroid.SHORT);
        } else if (!nameRegex.test(name)) {
            ToastAndroid.show('Please Enter Valid Name', ToastAndroid.SHORT);
        } else if (email === '') {
            ToastAndroid.show('Please Enter Email', ToastAndroid.SHORT);
        } else if (phone === '') {
            ToastAndroid.show('Please Enter Phone Number', ToastAndroid.SHORT);
        } else if (password === '') {
            ToastAndroid.show('Please Enter Password', ToastAndroid.SHORT);
        } else if (confPassword === '') {
            ToastAndroid.show('Please Enter Confirm Password', ToastAndroid.SHORT);
        } else if (password !== confPassword) {
            ToastAndroid.show('Password Not Matched', ToastAndroid.SHORT);
        } else if (roleSelected === '') {
            ToastAndroid.show('Please Select Role', ToastAndroid.SHORT);
        } else if (!isCheck) {
            ToastAndroid.show('Please Agree to Terms & Conditions', ToastAndroid.SHORT);
        } else if (!isEmail(inputValue.email)) {
            ToastAndroid.show('Please Enter Valid Email', ToastAndroid.SHORT);
        } else if (inputValue.phone) {
            const checkValidNUmber = () => {
                if (inputValue.phone.length === 12) {
                    if (inputValue.phone.startsWith('03')) {
                        return true
                    } else {
                        return false
                    }
                } else if (inputValue.phone.length === 13) {
                    if (inputValue.phone.startsWith('+923')) {
                        return true
                    } else {
                        return false
                    }
                } else if (inputValue.phone.length === 14) {
                    if (inputValue.phone.startsWith('+9233')) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            }
            if (!checkValidNUmber()) {
                ToastAndroid.show('Please Enter Valid Phone Number', ToastAndroid.SHORT);
            } else {
                handleSendOTP();
            }
        }
    };

    const handleSendOTP = async () => {
        const res = await addUserToFirestore(inputValue);
        if (res) {
            navigation.replace('Login')
        }
        // console.log('res', res);
        // if (res) {
        //     Asyncstorage.setItem('userId', JSON.stringify(res))
        //     const confirmation = await auth().signInWithPhoneNumber(inputValue.phone)
        //     navigation.navigate('OTPVerify', { confirmation: confirmation, userId: res.id })
        // }
    };

    return (
        <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.mainContainer}>
                <Image source={appLogo} style={styles.imgStyle} />
                <View style={styles.tittleView}>
                    <Text style={styles.Tittle}>Getting Started.!</Text>
                    <Text style={styles.subTittle}>Create an Account to Continue your all Courses</Text>
                </View>
                <View style={styles.inputView}>
                    {/* <CusTextInput
                        inputIcon={User}
                        inputPlaceholder="University Resigration Number"
                        onInputChange={(text) => console.log(text)} /> */}
                    <CusTextInput
                        inputIcon={User}
                        inputPlaceholder="Name"
                        onInputChange={(text) => setInputValue({ ...inputValue, name: text })} />
                    <View style={styles.divider} />
                    <CusTextInput
                        inputIcon={Email}
                        inputPlaceholder="Email"
                        inputType={"email-address"}
                        onInputChange={(text) => setInputValue({ ...inputValue, email: text })} />
                    <View style={styles.divider} />
                    <CusTextInput
                        inputIcon={Call}
                        inputPlaceholder="Phone Number (+923001234567)"
                        inputType={"phone-pad"}
                        onInputChange={(text) => setInputValue({ ...inputValue, phone: text })} />
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
                    <View >
                        <Text style={[styles.checkText, { marginLeft: '4%' }]}>Select Role</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '4%' }}>
                            {
                                RoleBtn.map((item, index) => {
                                    return (
                                        <TouchableOpacity onPress={() => setInputValue({ ...inputValue, roleSelected: item })} style={[styles.btnRoleStyle, { backgroundColor: inputValue.roleSelected === item ? Colors.mainColor : Colors.whiteColor }]} activeOpacity={0.8} key={index}>
                                            <Text style={[styles.checkText, { color: inputValue.roleSelected === item ? Colors.whiteColor : Colors.lightBlackColor }]}>{item}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={() => setIsCheck(!isCheck)} style={styles.checkView} activeOpacity={0.8}>
                    <Image source={isCheck ? ActiveCheck : Check} style={styles.checkImg} />
                    <Text style={styles.checkText}>Agree to Terms & Conditions</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <CusButton btnTittle="Sign Up" onPress={() => handlePressed()} />
                <TouchableOpacity style={[styles.checkView, { alignSelf: 'center' }]} activeOpacity={0.8} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.checkText}>Already have an account?</Text>
                    <Text style={[styles.checkText, { color: Colors.mainColor, marginLeft: '1%', textDecorationLine: 'underline' }]}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default Register

const RoleBtn = ['Teacher', 'Student']

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
        marginTop: '5%'
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
        marginTop: '4%',
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
    },
    btnRoleStyle: {
        backgroundColor: Colors.whiteColor,
        width: '46%',
        height: 48,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '2%',
        elevation: 1
    }
})