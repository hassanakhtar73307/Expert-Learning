import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { Colors } from '../../theme/colors'
import { CarouselBg, FilterBg, Notification, Search, seeAll } from '../../theme/images'
import { FontSizes, Fonts } from '../../theme/fonts'
import CourseCard from '../../components/CourseCard'
import { getAllCourses } from '../../db/CourseFunction'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AntDesign from 'react-native-vector-icons/AntDesign'

const Home = ({ navigation }) => {
    const scrollRef = useRef();
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeCategory, setActiveCategory] = useState(0);
    const [courses, setCourses] = useState([]);
    const [userInfo, setUserInfo] = useState({});

    const handleScrollEnd = (event) => {
        const position = event.nativeEvent.contentOffset.x / width;
        setActiveIndex(Math.round(position));
    };

    const CraouselRender = ({ OFF }) => (
        <View style={styles.CarouselView}>
            <Image source={CarouselBg} style={styles.CarouselView} />
            <Text style={[styles.CarouselTittle, { marginTop: '11%', fontSize: FontSizes.normalText }]}>{`${OFF}% Off*`}</Text>
            <Text style={styles.CarouselTittle}>Today’s Special</Text>
            <Text style={styles.CarouselSubTittle}>Get a Discount for Every Course Order only Valid for Today.!</Text>
        </View>
    )

    const getCoursesList = async () => {
        const res = await getAllCourses()
        if (res) {
            setCourses(res)
            // FilterTop3totalStudents(res)
        }
    }

    const getUserInfo = async () => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const user = JSON.parse(userInfo);
        setUserInfo(user)
    }

    const FilterTop3totalStudents = (resPass) => {
        const top3 = resPass.sort((a, b) => b.totalStudent - a.totalStudent).slice(0, 2)
        return top3
    }

    React.useEffect(() => { getUserInfo() }, [])

    useFocusEffect(React.useCallback(() => {
        getCoursesList()
    }, []))


    return (
        <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.mainContainer}>
                <View style={styles.headerView}>
                    <View style={styles.headerTextView}>
                        <Text style={styles.headingText}>Hi, {userInfo?.name}</Text>
                        <Text style={styles.subheadingText}>What Would you like to learn Today? Search Below.</Text>
                    </View>
                    <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('CoursePublish')}>
                        <AntDesign name="plus" size={24} color={Colors.whiteColor} />
                    </TouchableOpacity>
                    {/* <Image source={Notification} style={styles.notifyImg} /> */}
                </View>
                <TouchableOpacity style={styles.searchView} activeOpacity={0.9} onPress={() => navigation.navigate('SeeAll')}>
                    <Image source={Search} style={styles.searchImg} />
                    <Text style={styles.searchText}>Search for ...</Text>
                    <Image source={FilterBg} style={styles.filterImg} />
                </TouchableOpacity>

                <View style={{ marginTop: '4%', marginLeft: '1%' }}>
                    <ScrollView ref={scrollRef} horizontal={true} showsHorizontalScrollIndicator={false} pagingEnabled={true} onMomentumScrollEnd={handleScrollEnd} scrollEventThrottle={16}>
                        {OFFArr.map((item, index) => <CraouselRender OFF={item} key={index} />)}
                    </ScrollView>
                    <View style={styles.dotView}>
                        {OFFArr.map((item, index) => <View key={index} style={{ ...styles.dotStyle, backgroundColor: activeIndex === index ? Colors.orangeColor : Colors.lightMainColor }} />)}
                    </View>
                </View>
                <View style={styles.categoryView}>
                    <Text style={styles.subText}>Categories</Text>
                    <TouchableOpacity style={styles.seelAllView} onPress={() => navigation.navigate('SeeAll')}>
                        <Text style={styles.normalText}>See All</Text>
                        <Image source={seeAll} style={styles.seeAllImg} />
                    </TouchableOpacity>
                </View>
                {/* <View style={{ marginTop: '2%' }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} scrollEventThrottle={16}>
                        {categoryArr.map((item, index) => (
                            <TouchableOpacity key={index} style={{ marginRight: 10, paddingHorizontal: 14 }} activeOpacity={0.8} onPress={() => setActiveCategory(index)}>
                                <Text style={{ fontFamily: Fonts.MulishBold, fontSize: FontSizes.normalText, color: activeCategory === index ? Colors.mainColor : Colors.grayColor }}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View> */}
                <View style={styles.CardView}>
                    <FlatList
                        data={courses}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => <CourseCard item={item} onPress={() => navigation.navigate('CourseDetails', { itemData: item })} />}
                        keyExtractor={(item, index) => index.toString()} />
                </View>
                <View style={styles.categoryView}>
                    <Text style={styles.subText}>Popular Courses</Text>
                    <TouchableOpacity style={styles.seelAllView} onPress={() => navigation.navigate('SeeAll')}>
                        <Text style={styles.normalText}>See All</Text>
                        <Image source={seeAll} style={styles.seeAllImg} />
                    </TouchableOpacity>
                </View>
                <View style={styles.CardView}>
                    <FlatList
                        data={FilterTop3totalStudents(courses)}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => <CourseCard item={item} onPress={() => navigation.navigate('CourseDetails', { itemData: item })} />}
                        keyExtractor={(item, index) => index.toString()} />
                </View>
                <View style={styles.divider} />
            </View>
        </ScrollView>
    )
}

export default Home

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.bgColor
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '5%',
        marginHorizontal: '4%',
    },
    headerTextView: {
        width: '75%',
    },
    headingText: {
        fontFamily: Fonts.JostSemiBold,
        fontSize: FontSizes.normalTitle,
        color: Colors.blackColor,
    },
    subheadingText: {
        fontFamily: Fonts.MulishMedium,
        fontSize: FontSizes.normalText,
        color: Colors.lightBlackColor,
        marginTop: '2%'
    },
    notifyImg: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    searchView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '5%',
        marginHorizontal: '4%',
        backgroundColor: Colors.whiteColor,
        borderRadius: 6,
        height: 50,
        paddingHorizontal: '4%',
        elevation: 1
    },
    searchImg: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    searchText: {
        marginLeft: 10,
        fontFamily: Fonts.MulishMedium,
        fontSize: FontSizes.normalText,
        color: Colors.lightBlackColor,
    },
    filterImg: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        position: 'absolute',
        right: 10
    },
    CarouselView: {
        width: width / 1.07,
        height: height / 4,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginHorizontal: 10,
    },
    CarouselTittle: {
        fontFamily: Fonts.MulishBold,
        fontSize: FontSizes.normalTitle,
        color: Colors.whiteColor,
        position: 'absolute',
        marginTop: '16%',
        left: '7%'
    },
    CarouselSubTittle: {
        width: '50%',
        fontFamily: Fonts.MulishBold,
        fontSize: FontSizes.normalText,
        color: Colors.whiteColor,
        position: 'absolute',
        marginTop: '25%',
        left: '7%'
    },
    dotView: {
        flexDirection: 'row',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 20
    },
    dotStyle: {
        width: 20,
        height: 8,
        borderRadius: 20 / 2,
        marginHorizontal: 5
    },
    categoryView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '5%',
        marginHorizontal: '4%',
    },
    subText: {
        fontFamily: Fonts.JostBold,
        fontSize: FontSizes.btnText,
        color: Colors.blackColor,
    },
    seelAllView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    normalText: {
        fontFamily: Fonts.MulishBold,
        fontSize: FontSizes.smallText,
        color: Colors.mainColor,
        paddingRight: '2%'
    },
    CardView: {
        marginTop: '3%',
    },
    seeAllImg: {
        width: 12,
        height: 12,
        resizeMode: 'contain'
    },
    divider: {
        height: 20,
    },
    addBtn: {
        position: 'absolute',
        right: '1%',
        height: 30,
        width: 30,
        borderRadius: 5,
        backgroundColor: Colors.mainColor,
        justifyContent: 'center',
        alignItems: 'center'
    },

})

const OFFArr = [10, 20, 30]
const categoryArr = ['3D Design', 'Graphic Design', 'Web Design', 'UI/UX Design', 'Photography', 'Video Editing', 'Animation', 'Motion Graphics', 'Game Design', 'Architecture', 'Product Design', 'Design Thinking', 'Design Tools']
const PopularArry = [
    { category: 'Graphic Design', courseTittle: 'Graphic Design Advanced', rating: '4.5' },
    { category: '3D Design', courseTittle: '3D Design Advanced', rating: '4.5' },
    { category: 'Game Design', courseTittle: 'Game Design Advanced', rating: '4.5' },
]
