import { Alert, PermissionsAndroid, ScrollView, StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors } from '../../theme/colors'
import { ProfileImg } from '../../theme/images'
import CusTextInput from '../../components/CusTextInput'
import CusButton from '../../components/CusButton'
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUserRegInfo, updateUserInFirestore } from '../../db/AuthFunctions'
import { uploadImage } from '../../db/FeedFunction'

const EditProfile = ({ navigation }) => {

    const [inputValues, setInputValues] = useState({
        name: '',
        headline: '',
        address: '',
        about: '',
        userImage: '',
    })
    const [newImage, setNewImage] = useState('')

    const getUserInfo = async () => {
        const user = await AsyncStorage.getItem('userInfo');
        const parseUser = JSON.parse(user);
        console.log(parseUser);
        setInputValues({ ...inputValues, name: parseUser.name, headline: parseUser.headline, address: parseUser.address, about: parseUser.about, userImage: parseUser.imgaeUrl })
    }

    const requestExternalReadPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'External Storage Read Permission',
                    message: 'App needs read permission',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Read permission given');
            } else {
                Alert.alert('Read permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    const pickImage = async () => {
        await requestExternalReadPermission();
        const response = await launchImageLibrary({ mediaType: 'photo', includeBase64: true });
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else {
            setInputValues({ ...inputValues, userImage: response?.assets[0]?.uri })
            setNewImage(response?.assets[0]?.uri)
        }
    }


    const handleSave = async () => {
        const user = await AsyncStorage.getItem('userInfo');
        const parseUser = JSON.parse(user);

        if (parseUser) {
            if (newImage === '') {
                const Values = {
                    name: inputValues.name,
                    address: inputValues.address,
                    about: inputValues.about,
                    imgaeUrl: inputValues.userImage,
                    headline: inputValues.headline,
                }
                const res = await updateUserInFirestore(parseUser.id, Values);
                if (res) {
                    const upRes = await getUserRegInfo(parseUser.id)
                    if (upRes) {
                        await AsyncStorage.setItem('userInfo', JSON.stringify(upRes))
                        navigation.goBack()
                    }
                }
            } else {
                const uploadImg = await uploadImage(inputValues.userImage);
                if (uploadImg) {
                    const Values = {
                        name: inputValues.name,
                        address: inputValues.address,
                        about: inputValues.about,
                        imgaeUrl: uploadImg,
                        headline: inputValues.headline,
                    }
                    const res = await updateUserInFirestore(parseUser.id, Values);
                    if (res) {
                        const upRes = await getUserRegInfo(parseUser.id)
                        if (upRes) {
                            await AsyncStorage.setItem('userInfo', JSON.stringify(upRes))
                            navigation.goBack()
                        }
                    }
                }
            }
        }

    }

    useEffect(() => { getUserInfo() }, []);

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.imgBtn} onPress={() => pickImage()}>
                    {
                        inputValues.userImage === '' ?
                            <Image source={ProfileImg} style={styles.ImgStyle} />
                            :
                            <Image source={{ uri: inputValues.userImage }} style={styles.ImgRouStyle} />
                    }
                </TouchableOpacity>
                <View style={styles.divider} />
                <CusTextInput inputPlaceholder="Name"
                    inputValue={inputValues.name}
                    onInputChange={(text) => setInputValues({ ...inputValues, name: text })}
                    typePass={false}
                />
                <View style={styles.divider} />
                <CusTextInput inputPlaceholder="Headline"
                    inputValue={inputValues.headline}
                    onInputChange={(text) => setInputValues({ ...inputValues, headline: text })} />
                <View style={styles.divider} />
                <CusTextInput inputPlaceholder="Address"
                    inputValue={inputValues.address}
                    onInputChange={(text) => setInputValues({ ...inputValues, address: text })} />
                <View style={styles.divider} />
                <CusTextInput inputPlaceholder="About"
                    inputValue={inputValues.about}
                    onInputChange={(text) => setInputValues({ ...inputValues, about: text })} />
                <View style={styles.divider} />
                <View style={styles.divider} />
                <CusButton btnTittle="Save" onPress={() => handleSave()} />
            </ScrollView>
        </View>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    imgBtn: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginTop: '15%'
    },
    ImgStyle: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    ImgRouStyle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    divider: {
        height: 20,
    },
})