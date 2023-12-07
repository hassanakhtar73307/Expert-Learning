import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Colors } from '../../theme/colors'
import CusButton from '../../components/CusButton'
import { FontSizes, Fonts } from '../../theme/fonts'
import { getAllCourses } from '../../db/CourseFunction'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CourseHZCard } from '../seeAll'
import { getAllPosts } from '../../db/FeedFunction'
import { FeedCard } from '../feeds'
import { Edit } from '../../theme/images'
import { useFocusEffect } from '@react-navigation/native'

const MyProfile = ({ navigation }) => {

    const [isActive, setIsActive] = useState('Courses');
    const [coutsesData, setCoursesData] = useState([]);
    const [feeds, setFeeds] = useState([]);
    const [userInfo, setUserInfo] = useState({});

    const getCourses = async () => {
        const user = await AsyncStorage.getItem('userInfo');
        const parseUser = JSON.parse(user);
        const res = await getAllCourses();
        //publisherId
        if (res) {
            const filterData = res.filter(item => item.publisherId === parseUser.id);
            setCoursesData(filterData);
        }
    }

    const handlePres = (item) => {
        navigation.navigate('CourseDetails', { itemData: item })
    }

    const getFeeds = async () => {
        const user = await AsyncStorage.getItem('userInfo');
        const parseUser = JSON.parse(user);
        const res = await getAllPosts();
        if (res) {
            const filterData = res.filter(item => item.publisherId === parseUser.id);
            setFeeds(filterData);
        }
    }

    const handleCommentPress = (item) => { }

    const getUserInfo = async () => {
        const user = await AsyncStorage.getItem('userInfo');
        const parseUser = JSON.parse(user);
        console.log(parseUser);
        setUserInfo(parseUser);
    }

    useFocusEffect(useCallback(() => {
        getUserInfo()
        getCourses()
    }, []));

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
                {
                    userInfo?.imgaeUrl ?
                        <Image source={{ uri: userInfo?.imgaeUrl }} style={styles.imgCricle} />
                        :
                        <View style={styles.imgCricle} />
                }
                <Text style={styles.headingText}>{userInfo?.name}</Text>
                <Text style={styles.headLine}>{userInfo?.headline ?? 'No Headline'}</Text>
                <Text style={styles.Address}>{userInfo?.address ?? "No Address"}</Text>
                <TouchableOpacity style={{ position: 'absolute', right: '5%', top: '5%' }} onPress={() => navigation.navigate('EditProfile')}>
                    <Image source={Edit} style={{ width: 40, height: 40 }} />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginHorizontal: '4%', backgroundColor: '#C60000', paddingVertical: 16, borderRadius: 6, marginTop: '5%', alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.replace('Login')}>
                    <Text style={{ fontFamily: Fonts.JostSemiBold, fontSize: FontSizes.paragraph, color: Colors.whiteColor }}>Logout</Text>
                </TouchableOpacity>
                <View style={styles.tabView}>
                    <TouchableOpacity style={{ ...styles.tabBtn, backgroundColor: isActive === 'Courses' ? Colors.mainColor : Colors.whiteColor, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }} onPress={() => setIsActive('Courses')}>
                        <Text style={{ ...styles.tabText, color: isActive === 'Courses' ? Colors.whiteColor : Colors.blackColor }}>Courses</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...styles.tabBtn, backgroundColor: isActive === 'Posts' ? Colors.mainColor : Colors.whiteColor, borderTopRightRadius: 10, borderBottomRightRadius: 10 }} onPress={() => setIsActive('Posts') + getFeeds()}>
                        <Text style={{ ...styles.tabText, color: isActive === 'Posts' ? Colors.whiteColor : Colors.blackColor }}>Posts</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: '5%' }} />
                {
                    isActive === 'Courses' ?
                        <>
                            {coutsesData.length > 0 ?
                                <FlatList
                                    data={coutsesData}
                                    renderItem={({ item }) => <CourseHZCard item={item} onPress={handlePres} />}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ ...styles.headLine, marginTop: '30%' }}>No Courses Found</Text>
                                </View>
                            }
                        </>
                        :
                        <>
                            {
                                feeds.length > 0 ?
                                    <FlatList
                                        data={feeds}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => <FeedCard item={item} onCommentPress={handleCommentPress} onProfilePress={() => { }} />}
                                        showsVerticalScrollIndicator={false}
                                        style={{ paddingBottom: 20 }}
                                    />
                                    :
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ ...styles.headLine, marginTop: '30%' }}>No Posts Found</Text>
                                    </View>
                            }
                        </>
                }
            </ScrollView>
        </View>
    )
}

export default MyProfile

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    imgCricle: {
        width: 70,
        height: 70,
        borderRadius: 70 / 2,
        backgroundColor: Colors.blackColor,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'left',
        marginTop: '10%',
        marginLeft: '5%',
    },
    headingText: {
        fontFamily: Fonts.JostSemiBold,
        fontSize: FontSizes.normalTitle,
        color: Colors.blackColor,
        alignSelf: 'left',
        marginTop: '2%',
        marginLeft: '5%',
    },
    headLine: {
        fontFamily: Fonts.MulishMedium,
        fontSize: FontSizes.normalText,
        color: Colors.lightBlackColor,
        alignSelf: 'left',
        marginTop: '1%',
        marginLeft: '5%',
    },
    Address: {
        fontFamily: Fonts.MulishMedium,
        fontSize: FontSizes.normalText,
        color: Colors.lightBlackColor,
        alignSelf: 'left',
        marginTop: '1%',
        marginLeft: '5%',
    },
    tabView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: '5%',
        backgroundColor: Colors.lightWhiteColor,
        height: 50,
        marginHorizontal: '5%',
        borderRadius: 10,
    },
    tabBtn: {
        width: '50%',
        height: 50,
        backgroundColor: Colors.whiteColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontFamily: Fonts.JostSemiBold,
        fontSize: FontSizes.paragraph,
        color: Colors.blackColor,
    },
})