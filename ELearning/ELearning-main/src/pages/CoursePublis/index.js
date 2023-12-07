import { ToastAndroid, Image, StyleSheet, ScrollView, TextInput, Text, TouchableOpacity, View, PermissionsAndroid, Modal } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../theme/colors'
import { backIcon } from '../../theme/images'
import { FontSizes, Fonts } from '../../theme/fonts'
import CusTextInput from '../../components/CusTextInput'
import { launchImageLibrary } from 'react-native-image-picker';
import { addCourse } from '../../db/CourseFunction'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import storage from '@react-native-firebase/storage';

const CoursePublish = ({ navigation }) => {

    const [inputValues, setInputValues] = useState({
        courseName: '',
        coursePrice: '',
        courseDuration: '',
        courseLanguage: '',
        courseCategory: '',
        courseLength: '',
        courseImage: '',
        courseVideo: '',
        courseDescription: '',
    });
    const [imgProgress, setImgProgress] = useState(0);
    const [videoProgress, setVideoProgress] = useState(0);
    const [uploading, setUploading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

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
            setInputValues({ ...inputValues, courseImage: response?.assets[0]?.uri })
        }
    }

    const pickVideo = async () => {
        await requestExternalReadPermission();
        const response = await launchImageLibrary({ mediaType: 'video', includeBase64: true });
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else {
            setInputValues({ ...inputValues, courseVideo: response?.assets[0]?.uri })
        }
    }

    // Function to upload image to Firebase Storage
    const uploadImage = async (uri) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(uri);
                const blob = await response.blob();
                const imageRef = storage().ref().child("Stuff/" + new Date().getTime());
                const uploadTask = imageRef.put(blob);

                uploadTask.on(
                    storage.TaskEvent.STATE_CHANGED,
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Upload is ${progress}% done`);
                        setImgProgress(progress.toFixed());
                    },
                    (error) => {
                        console.error('Error during upload:', error);
                        reject(error);
                    },
                    async () => {
                        try {
                            const url = await uploadTask.snapshot.ref.getDownloadURL();
                            console.log('Image uploaded successfully. URL:', url);
                            resolve(url);
                        } catch (error) {
                            console.error('Error getting download URL:', error);
                            reject(error);
                        }
                    }
                );
            } catch (error) {
                console.error('Error uploading image:', error);
                reject(error);
            }
        });
    };

    // Function to upload video to Firebase Storage
    const uploadVideo = async (uri) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(uri);
                const blob = await response.blob();
                const imageRef = storage().ref().child("Stuff/" + new Date().getTime());
                const uploadTask = imageRef.put(blob);

                uploadTask.on(
                    storage.TaskEvent.STATE_CHANGED,
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Upload is ${progress}% done`);
                        setVideoProgress(progress.toFixed());
                    },
                    (error) => {
                        console.error('Error during upload:', error);
                        reject(error);
                    },
                    async () => {
                        try {
                            const url = await uploadTask.snapshot.ref.getDownloadURL();
                            console.log('Video uploaded successfully. URL:', url);
                            resolve(url);
                        } catch (error) {
                            console.error('Error getting download URL:', error);
                            reject(error);
                        }
                    }
                );
            } catch (error) {
                console.error('Error uploading image:', error);
                reject(error);
            }
        });
    }

    const handlePublish = async () => {
        setModalVisible(true);
        const userInfo = await AsyncStorage.getItem('userInfo');
        const user = JSON.parse(userInfo);
        if (user) {
            if (Object.values(inputValues).includes('')) {
                ToastAndroid.show('Please fill all the fields', ToastAndroid.SHORT);
                return;
            } else {
                const uploadImageResponse = await uploadImage(inputValues.courseImage);
                console.log('uploadImageResponse', uploadImageResponse);
                if (uploadImageResponse) {
                    const uploadVideoResponse = await uploadVideo(inputValues.courseVideo);
                    console.log('uploadVideoResponse', uploadVideoResponse);
                    setUploading(true);
                    if (uploadVideoResponse) {
                        const add_Course = {
                            category: inputValues.courseCategory,
                            courseName: inputValues.courseName,
                            bookmark: false,
                            courseDescription: inputValues.courseDescription,
                            courseDuration: inputValues.courseDuration,
                            courseImage: uploadImageResponse,
                            courseLanguage: inputValues.courseLanguage,
                            courseLength: inputValues.courseLength,
                            coursePrice: inputValues.coursePrice,
                            courseVideo: uploadVideoResponse,
                            isFavourite: false,
                            rating: 0,
                            review: 0,
                            status: "Active",
                            totalStudent: 0,
                            publisherId: user?.id,
                            publisherName: user?.name,
                            publisherImage: user?.imgaeUrl,
                            timeStamps: new Date(),
                            enrolledStudents: [],
                        }
                        const addCourseResponse = await addCourse(add_Course);
                        console.log('addCourseResponse', addCourseResponse);
                        if (addCourseResponse) {
                            setUploading(false);
                            ToastAndroid.show('Course Published Successfully', ToastAndroid.SHORT);
                            navigation.goBack();
                        }
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
                    <Text style={styles.headerText}>Course Publish</Text>
                </View>
                <View style={styles.inputFiledView}>
                    <CusTextInput inputPlaceholder="Course Name" onInputChange={(text) => setInputValues({ ...inputValues, courseName: text })} />
                    <View style={styles.divider} />
                    <CusTextInput inputPlaceholder="Course (Free/Paid)" onInputChange={(text) => setInputValues({ ...inputValues, coursePrice: text })} />
                    <View style={styles.divider} />
                    <CusTextInput inputPlaceholder="Course Duration Hours" inputType="numeric" onInputChange={(text) => setInputValues({ ...inputValues, courseDuration: text })} />
                    <View style={styles.divider} />
                    <CusTextInput inputPlaceholder="Course Language" onInputChange={(text) => setInputValues({ ...inputValues, courseLanguage: text })} />
                    <View style={styles.divider} />
                    <CusTextInput inputPlaceholder="Course Category" onInputChange={(text) => setInputValues({ ...inputValues, courseCategory: text })} />
                    <View style={styles.divider} />
                    <CusTextInput inputPlaceholder="Course No. Video/Classes/Lectures" inputType="numeric" onInputChange={(text) => setInputValues({ ...inputValues, courseLength: text })} />
                    <View style={styles.divider} />
                    <TextInput
                        style={styles.inputStyle}
                        placeholder="Course Description"
                        placeholderTextColor={Colors.lightBlackColor}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={(text) => setInputValues({ ...inputValues, courseDescription: text })}
                    />
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.btnView} onPress={() => pickImage()}>
                        {
                            inputValues.courseImage === '' ?
                                <Text style={styles.btnText}>Pick Image</Text>
                                :
                                <AntDesign name="checkcircle" size={24} color={Colors.whiteColor} />
                        }
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.btnView} onPress={() => pickVideo()}>
                        {
                            inputValues.courseVideo === '' ?
                                <Text style={styles.btnText}>Pick Video</Text>
                                :
                                <AntDesign name="checkcircle" size={24} color={Colors.whiteColor} />
                        }
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.btnView} onPress={() => handlePublish()}>
                        <Text style={styles.btnText}>Publish Course</Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                </View>


                <Modal animationType="slide" transparent={true} visible={modalVisible}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <View style={{ width: "80%", backgroundColor: Colors.whiteColor, borderRadius: 8, justifyContent: "center", alignItems: "center", paddingVertical: '5%' }}>
                            <Text style={{ fontSize: FontSizes.heading, fontFamily: Fonts.MulishBold }}>Uploading...</Text>
                            <Text style={{ fontSize: FontSizes.paragraph, fontFamily: Fonts.MulishRegular, color: Colors.blackColor }}>Upload Image {imgProgress}%</Text>
                            <Text style={{ fontSize: FontSizes.paragraph, fontFamily: Fonts.MulishRegular, color: Colors.blackColor, paddingVertical: '5%' }}>Upload Video {videoProgress}%</Text>
                            {
                                uploading ?
                                    <Text style={{ fontSize: FontSizes.paragraph, fontFamily: Fonts.MulishRegular, color: Colors.blackColor }}>Please wait...</Text>
                                    :
                                    <Text style={{ fontSize: FontSizes.paragraph, fontFamily: Fonts.MulishRegular, color: Colors.blackColor }}>Course Published Successfully</Text>
                            }
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
    )
}

export default CoursePublish

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