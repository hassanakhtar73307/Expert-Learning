import { ActivityIndicator, ToastAndroid, Image, StyleSheet, ScrollView, TextInput, Text, TouchableOpacity, View, PermissionsAndroid, Modal } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../theme/colors'
import { backIcon } from '../../theme/images'
import { FontSizes, Fonts } from '../../theme/fonts'
import CusTextInput from '../../components/CusTextInput'
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { addJobs, uploadImage } from '../../db/JobFunctions'

const JobPublish = ({ navigation }) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [inputValues, setInputValues] = useState({
        jobTitle: '',
        companyName: '',
        jobBudget: '',
        jobDescription: '',
        jobImage: '',
    })

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
            setInputValues({ ...inputValues, jobImage: response?.assets[0]?.uri })
        }
    }

    const handlePublish = async () => {
        setModalVisible(true);
        const userInfo = await AsyncStorage.getItem('userInfo');
        const user = JSON.parse(userInfo);
        if (user) {
            if (Object.values(inputValues).includes('')) {
                setModalVisible(false);
                ToastAndroid.show('Please fill all the fields', ToastAndroid.SHORT);
            } else {
                const imgUrl = await uploadImage(inputValues.jobImage);
                if (imgUrl) {
                    const jobData = {
                        jobTitle: inputValues.jobTitle,
                        companyName: inputValues.companyName,
                        jobBudget: inputValues.jobBudget,
                        jobDescription: inputValues.jobDescription,
                        jobImage: imgUrl,
                        userId: user?.id,
                        userName: user?.name,
                        userImage: '',
                        createdAt: Date.now(),
                    }
                    const res = await addJobs(jobData)
                    if (res) {
                        setModalVisible(false);
                        ToastAndroid.show('Job Published Successfully', ToastAndroid.SHORT);
                        navigation.goBack();
                    }
                }
            }
        }
    }

    return (
        <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.mainContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={backIcon} style={styles.backIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Create Job</Text>
                </View>
                <View style={styles.inputFiledView}>
                    <CusTextInput inputPlaceholder="Job Title" onInputChange={(text) => setInputValues({ ...inputValues, jobTitle: text })} />
                    <View style={styles.divider} />
                    <CusTextInput inputPlaceholder="Publisher Name (Company Name)" onInputChange={(text) => setInputValues({ ...inputValues, companyName: text })} />
                    <View style={styles.divider} />
                    <CusTextInput inputPlaceholder="Job Budget" onInputChange={(text) => setInputValues({ ...inputValues, jobBudget: text })} />

                    <View style={styles.divider} />
                    <TextInput
                        style={styles.inputStyle}
                        placeholder="Job Description"
                        placeholderTextColor={Colors.lightBlackColor}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={(text) => setInputValues({ ...inputValues, jobDescription: text })}
                    />
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.btnView} onPress={() => pickImage()}>
                        {
                            inputValues.jobImage === '' ?
                                <Text style={styles.btnText}>Pick Image</Text>
                                :
                                <AntDesign name="checkcircle" size={24} color={Colors.whiteColor} />
                        }
                    </TouchableOpacity>

                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.btnView} onPress={() => handlePublish()}>
                        <Text style={styles.btnText}>Publish Job</Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                </View>


                <Modal animationType="slide" transparent={true} visible={modalVisible}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <ActivityIndicator size="large" color={Colors.mainColor} />
                    </View>
                </Modal>
            </View>
        </ScrollView>
    )
}

export default JobPublish

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        height: 60,
        paddingHorizontal: 20,
    },
    headerText: {
        color: Colors.blackColor,
        fontSize: FontSizes.header,
        fontFamily: Fonts.MulishBold,
        marginLeft: 20,
    },
    backIcon: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
    },
    inputFiledView: {
        marginTop: 20,
    },
    divider: {
        marginVertical: 10,
    },
    inputStyle: {
        fontSize: 16,
        marginHorizontal: '4%',
        color: Colors.blackColor,
        width: "92%",
        height: 120,
        backgroundColor: Colors.whiteColor,
        borderRadius: 8,
        alignSelf: "center",
        alignItems: "center",
        elevation: 1,
        paddingHorizontal: 10,
        textAlignVertical: "top",
    },
    btnText: {
        fontSize: FontSizes.paragraph,
        fontFamily: Fonts.MulishRegular,
        color: Colors.whiteColor,
    },
    btnView: {
        width: "92%",
        height: 48,
        backgroundColor: Colors.mainColor,
        borderRadius: 8,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        elevation: 1,
    },
})