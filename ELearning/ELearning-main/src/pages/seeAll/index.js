import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontSizes, Fonts } from '../../theme/fonts'
import { Colors } from '../../theme/colors'
import { SearchBg, Star, backIcon, courseImg } from '../../theme/images'
import { getAllCourses } from '../../db/CourseFunction'

const SeeAll = ({ navigation }) => {

    const [inputValue, setInputValue] = useState('');
    const [arrayLength, setArrayLength] = useState(0);
    const [courses, setCourses] = useState([]);
    const [filterArrayData, setFilterData] = useState([]);

    const getAllData = async () => {
        const res = await getAllCourses();
        if (res) {
            setCourses(res);
        }
    }

    const filterData = (text) => {
        if (text.length >= 1) {
            setInputValue(text);
            const filteredData = courses.filter((item) => {
                const itemData = item.category.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilterData(filteredData);
            setArrayLength(filteredData.length);
        }
    }

    const handlePres = (item) => {
        navigation.navigate('CourseDetails', { itemData: item })
    }

    useEffect(() => { getAllData() }, [])

    return (
        <>
            <View style={styles.headerView}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={backIcon} style={styles.IconStyle} />
                </TouchableOpacity>
                <Text style={styles.headingText}>Online Courses</Text>
            </View>
            <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.mainContainer}>
                    <View style={styles.searchBarStyle}>
                        <TextInput
                            style={styles.searchInputStyle}
                            placeholder="Search"
                            placeholderTextColor={Colors.lightBlackColor}
                            onChangeText={(text) => filterData(text)}
                        />
                        <Image source={SearchBg} style={styles.searchIconStyle} />
                    </View>
                    {inputValue.length >= 4 && <View style={styles.resultView}>
                        <View style={styles.inRow}>
                            <Text style={styles.resultText}>Result for</Text>
                            <Text style={styles.searchText}>"{`${inputValue}`}"</Text>
                        </View>
                        <View style={styles.inRow}>
                            <Text style={styles.searchText}>{arrayLength}</Text>
                            <Text style={styles.searchText}>Founds</Text>
                        </View>
                    </View>}
                    <View style={{ marginTop: '4%' }}>
                        <FlatList
                            data={filterArrayData}
                            renderItem={({ item }) => <CourseHZCard item={item} onPress={handlePres} />}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </ScrollView>
        </>
    )
}

export default SeeAll

export const CourseHZCard = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={styles.CardView} activeOpacity={0.8} onPress={() => onPress(item)}>
            <Image source={{ uri: item?.courseImage }} style={styles.courseImgStyle} />
            <View style={{ marginHorizontal: '5%', width: '56%' }}>
                <Text style={styles.courseName}>{item?.category}</Text>
                <Text style={styles.courseTitle} numberOfLines={2} ellipsizeMode="tail">{item?.courseName}</Text>
                <View style={styles.inRow}>
                    <Image source={Star} style={styles.starStyle} />
                    <Text style={styles.ratingText}>4.5</Text>
                </View>
            </View>
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.bgColor
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: '4%',
        marginHorizontal: '4%',

    },
    headingText: {
        fontFamily: Fonts.JostSemiBold,
        fontSize: FontSizes.normalTitle,
        color: Colors.blackColor,
        marginLeft: '5%',
    },
    IconStyle: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: Colors.blackColor,
    },

    searchIconStyle: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
    },
    searchInputStyle: {
        flex: 1,
        fontFamily: Fonts.JostRegular,
        fontSize: FontSizes.paragraph,
        color: Colors.lightBlackColor,
        marginLeft: '2%',
        paddingHorizontal: '1%',
    },
    searchBarStyle: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        borderRadius: 10,
        marginHorizontal: '4%',
        marginTop: '5%',
        paddingHorizontal: '2%',
    },
    resultView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: '4%',
        marginTop: '5%',
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resultText: {
        fontFamily: Fonts.JostBold,
        fontSize: FontSizes.paragraph,
        color: Colors.lightBlackColor,
    },
    searchText: {
        fontFamily: Fonts.JostBold,
        fontSize: FontSizes.paragraph,
        color: Colors.mainColor,
        marginLeft: '2%',
    },

    CardView: {
        height: 120,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        borderRadius: 12,
        marginHorizontal: '4%',
        marginVertical: '2%',
        elevation: 5,
        shadowColor: Colors.blackColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    courseImgStyle: {
        width: '35%',
        height: 120,
        resizeMode: 'cover',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    courseName: {
        fontFamily: Fonts.JostBold,
        fontSize: FontSizes.paragraph,
        color: Colors.orangeColor,
    },
    courseTitle: {
        fontFamily: Fonts.JostMedium,
        fontSize: FontSizes.paragraph,
        color: Colors.blackColor,
        marginVertical: '4%',
        width: '100%',
    },
    starStyle: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    ratingText: {
        fontFamily: Fonts.JostMedium,
        fontSize: FontSizes.paragraph,
        color: Colors.blackColor,
        marginLeft: '2%',
    },

})