import { ActivityIndicator, Modal, PermissionsAndroid, StyleSheet, ScrollView, ToastAndroid, TouchableOpacity, TextInput, Text, Image, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../theme/colors'
import { Close } from '../../theme/images'
import { FontSizes, Fonts } from '../../theme/fonts'
import Feather from 'react-native-vector-icons/Feather'
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { addNewFeeds, uploadImage } from '../../db/FeedFunction'

const FeedPublish = ({ navigation }) => {

    const [filedHeight, setFiledHeight] = useState(0)
    const [imageUpload, setImageUpload] = useState('')
    const [postText, setPostText] = useState('')
    const [loader, setLoader] = useState(false)

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
            setImageUpload(response.assets[0].uri)
        }
    }

    const arrangeTextFiledHeight = (event) => {
        const { height } = event.nativeEvent.contentSize
        setFiledHeight(height)
    }

    const handlePost = async () => {
        setLoader(true)
        const userInfo = await AsyncStorage.getItem('userInfo');
        const user = JSON.parse(userInfo);
        const postData = {
            createdAt: Date.now(),
            publisherId: user?.id,
            publisherName: user?.name,
            publisherImg: user?.imgaeUrl,
            postText: postText,
            likes: 0,
            comments: 0,
            likesIds: [],
            commentsIds: []
        }
        if (user) {
            if (imageUpload === '') {
                const newFeedPostRef = await addNewFeeds(postData);
                console.log('Post added with ID:', newFeedPostRef.id);
                ToastAndroid.show('Post added successfully', ToastAndroid.SHORT);
                setLoader(false)
            } else {
                const uploadImageResponse = await uploadImage(imageUpload);
                if (uploadImageResponse) {
                    postData.postImg = uploadImageResponse;
                    const newFeedPostRef = await addNewFeeds(postData);
                    console.log('Post added with ID:', newFeedPostRef.id);
                    ToastAndroid.show('Post added successfully', ToastAndroid.SHORT);
                    setLoader(false)
                }
            }

        }
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerView}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Image source={Close} style={styles.backImg} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Publish Feed</Text>
                <TouchableOpacity style={styles.postBtn} onPress={() => handlePost()}>
                    <Text style={styles.postText}>Post</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.bodyView}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <TextInput
                        placeholder="Write something..."
                        placeholderTextColor={Colors.blackColor}
                        onChangeText={(text) => setPostText(text)}
                        multiline={true}
                        style={{ ...styles.textInput, height: Math.max(35, filedHeight) }}
                        onContentSizeChange={(event) => arrangeTextFiledHeight(event)}
                    />
                    {imageUpload !== '' && <Image source={{ uri: imageUpload }} style={styles.imgView} />}
                </ScrollView>
            </View>
            <View style={styles.footerView}>
                <TouchableOpacity style={styles.pickImgView} onPress={() => pickImage()}>
                    <Feather name="image" size={24} color={Colors.whiteColor} />
                </TouchableOpacity>
            </View>

            <Modal visible={loader} transparent={true}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.mainColor} />
                </View>
            </Modal>
        </View>
    )
}

export default FeedPublish

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.bgColor
    },
    headerView: {
        height: 60,
        backgroundColor: Colors.bgColor,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerText: {
        fontSize: 20,
        fontWeight: '500',
        fontFamily: 'Jost-Bold',
        color: Colors.blackColor,
        marginLeft: 35
    },
    postBtn: {
        height: 30,
        width: 50,
        borderRadius: 5,
        backgroundColor: Colors.mainColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    postText: {
        fontSize: 15,
        fontWeight: '500',
        fontFamily: 'Jost-Bold',
        color: Colors.whiteColor
    },
    backBtn: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    backImg: {
        height: 18,
        width: 18,
        resizeMode: 'contain'
    },
    bodyView: {
        flex: 1,
        backgroundColor: Colors.whiteColor,
        paddingHorizontal: 20,
    },
    textInput: {
        fontSize: FontSizes.normalText,
        fontFamily: Fonts.MulishMedium,
        color: Colors.blackColor,
        textAlignVertical: 'top',
    },
    imgView: {
        height: 200,
        width: '100%',
        borderRadius: 10,
        backgroundColor: Colors.mainColor,
        marginTop: 10,
        marginBottom: '25%'
    },
    footerView: {
        height: 50,
        width: '100%',
        backgroundColor: Colors.bgColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '6%'
    },
    pickImgView: {
        height: 30,
        width: 30,
        borderRadius: 4,
        backgroundColor: Colors.mainColor,
        justifyContent: 'center',
        alignItems: 'center'
    },



})