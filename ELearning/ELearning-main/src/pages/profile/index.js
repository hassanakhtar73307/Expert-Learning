import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../../theme/colors'
import { FontSizes, Fonts } from '../../theme/fonts'
import { getAllCourses } from '../../db/CourseFunction'
import { CourseHZCard } from '../seeAll'
import { getAllPosts } from '../../db/FeedFunction'
import { FeedCard } from '../feeds'
import { getUserRegInfo } from '../../db/AuthFunctions'

const ProfileScreen = ({ navigation, route }) => {

    const { itemData: userId, userName } = route?.params;
    const [isActive, setIsActive] = useState('Courses');
    const [coutsesData, setCoursesData] = useState([]);
    const [feeds, setFeeds] = useState([]);
    const [userInfo, setUserInfo] = useState({});

    const getCourses = async () => {
        const res = await getAllCourses();
        //publisherId
        if (res) {
            const filterData = res.filter(item => item.publisherId === userId);
            setCoursesData(filterData);
        }
    }

    const handlePres = (item) => {
        navigation.navigate('CourseDetails', { itemData: item })
    }

    const getFeeds = async () => {
        const res = await getAllPosts();
        if (res) {
            const filterData = res.filter(item => item.publisherId === userId);
            setFeeds(filterData);
        }
    }

    const getUserInfo = async () => {
        const user = await getUserRegInfo(userId);
        setUserInfo(user);
    }


    const handleCommentPress = (item) => { }

    useEffect(() => {
        getUserInfo()
        getCourses()
    }, []);

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
                {/* <View style={styles.imgCricle} />
                <Text style={styles.headingText}>{userName}</Text> */}
                {
                    userInfo?.imgaeUrl ?
                        <Image source={{ uri: userInfo?.imgaeUrl }} style={styles.imgCricle} />
                        :
                        <View style={styles.imgCricle} />
                }
                <Text style={styles.headingText}>{userInfo?.name}</Text>
                <Text style={styles.headLine}>{userInfo?.headline ?? 'No Headline'}</Text>
                <Text style={styles.Address}>{userInfo?.address ?? 'No Address'}</Text>
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
                            <FlatList
                                data={coutsesData}
                                renderItem={({ item }) => <CourseHZCard item={item} onPress={handlePres} />}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                            />
                        </>
                        :
                        <>
                            <FlatList
                                data={feeds}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => <FeedCard item={item} onCommentPress={handleCommentPress} />}
                                showsVerticalScrollIndicator={false}
                                style={{ paddingBottom: 20 }}
                            />
                        </>
                }
            </ScrollView>
        </View>
    )
}

export default ProfileScreen

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
})