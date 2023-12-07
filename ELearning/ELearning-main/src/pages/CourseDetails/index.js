import { ScrollView, StyleSheet, TouchableOpacity, Text, Image, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../../theme/colors';
import { FontSizes, Fonts } from '../../theme/fonts';
import { Mesg, Video, backIcon } from '../../theme/images';
import CusButton from '../../components/CusButton';
import { updateCourse } from '../../db/CourseFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CourseDetails = ({ navigation, route }) => {

    const { itemData } = route.params;
    const [isResponse, setIsResponse] = useState(false);
    const [isIdCheck, setIsIdCheck] = useState(true);

    const handleEnroll = async () => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const user = JSON.parse(userInfo);
        const totalStudent = itemData.totalStudent + 1;
        if (user) {
            const res = await updateCourse(itemData.courseId, {
                totalStudent: totalStudent,
                enrolledStudents: [...itemData.enrolledStudents, user?.id]
            })
            console.log('res', res);
            if (res) {
                setIsResponse(true);
            }
        }
    }

    const checkEnroll = async () => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const user = JSON.parse(userInfo);
        if (user) {
            const isEnrolled = itemData.enrolledStudents.includes(user?.id);
            isEnrolled ? setIsResponse(true) : setIsResponse(false);
        }
        if (user) {
            const isIdCheck = itemData.publisherId === user?.id;
            isIdCheck ? setIsIdCheck(false) : setIsIdCheck(true);
        }
    }

    const handleChats = async () => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const user = JSON.parse(userInfo);
        if (user) {
            const passData = {
                id: itemData.publisherId,
                loginUserId: user?.id,
                name: itemData.publisherName,
            }
            navigation.navigate('ChatScreen', { itemData: passData })
        }

    }

    useEffect(() => {
        checkEnroll();
    }, [])

    return (
        <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.mainContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={backIcon} style={styles.backIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Course Details </Text>
                </View>
                <Image source={{ uri: itemData.courseImage }} style={{ height: 200, width: '100%' }} />
                <View style={styles.videoBtn}>
                    <View>
                        <Text style={styles.categoryText}>{itemData.category}</Text>
                        <Text style={styles.courseTitle}>{itemData.courseName}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('VideoPlayer', { url: itemData.courseVideo })}>
                        <Image source={Video} style={styles.imgStyle} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.descHeading}>Description</Text>
                <Text style={styles.descText}>{itemData.courseDescription}</Text>
                {isIdCheck &&
                    <>
                        <Text style={styles.descHeading}>Instructor</Text>
                        <TouchableOpacity style={styles.InstructorView} onPress={() => handleChats()}>
                            <Image source={{ uri: itemData.publisherImage }} style={styles.imgCricle} />
                            <View style={styles.instDetail}>
                                <Text style={styles.instrName}>{itemData.publisherName}</Text>
                                <Text style={styles.instrProf}>{itemData.category}</Text>
                            </View>
                            <Image source={Mesg} style={styles.msgImg} />
                        </TouchableOpacity>
                        <View style={{ height: 25 }} />
                        {isResponse ?
                            <CusButton
                                btnTittle="Enrolled"
                                disabled={true}
                            /> :
                            <CusButton
                                btnTittle="Enroll Course"
                                onPress={() => handleEnroll()}
                            />
                        }
                    </>}
                <View style={{ height: 30 }} />

            </View>
        </ScrollView>
    )
}

export default CourseDetails

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
    videoBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    imgStyle: {
        height: 80,
        width: 80,
        resizeMode: 'contain',
        marginRight: 20,
    },
    categoryText: {
        color: Colors.orangeColor,
        fontSize: FontSizes.mediumFont,
        fontFamily: Fonts.AliceRegular,
        marginHorizontal: 20,
        marginTop: 10,
    },
    courseTitle: {
        color: Colors.blackColor,
        fontSize: FontSizes.header,
        fontFamily: Fonts.MulishBold,
        marginHorizontal: 20,
        marginTop: 2,
    },
    descHeading: {
        color: Colors.blackColor,
        fontSize: FontSizes.header,
        fontFamily: Fonts.MulishBold,
        marginHorizontal: 20,
        marginTop: 10,
    },
    descText: {
        color: Colors.lightBlackColor,
        fontSize: FontSizes.normalText,
        fontFamily: Fonts.MulishRegular,
        marginHorizontal: 20,
        marginTop: 5,
        textAlign: 'justify',
    },

    InstructorView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        marginHorizontal: 20,
    },
    imgCricle: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        backgroundColor: Colors.blackColor,
    },
    instDetail: {
        marginLeft: 5,
        width: '70%',
    },
    instrName: {
        color: Colors.blackColor,
        fontSize: FontSizes.header,
        fontFamily: Fonts.MulishBold,
    },
    instrProf: {
        color: Colors.lightBlackColor,
        fontSize: FontSizes.normalText,
        fontFamily: Fonts.MulishRegular,
    },
    msgImg: {
        height: 26,
        width: 26,
        resizeMode: 'contain',
    },

})