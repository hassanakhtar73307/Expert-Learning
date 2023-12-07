import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../theme/colors'
import { Bookmark, Star } from '../theme/images'
import { FontSizes, Fonts } from '../theme/fonts'

const CourseCard = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={{ ...styles.mainContainer, marginRight: 15 }} onPress={onPress}>
            <Image source={{ uri: item?.courseImage }} style={styles.imgStyle} />
            <View style={styles.categoryView}>
                <Text style={styles.categoryText}>{item?.category}</Text>
                <Image source={Bookmark} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
            </View>
            <Text style={styles.courseTittle}>{item?.courseName}</Text>
            <View style={styles.ratingView}>
                <Text style={styles.ratingText}>Rating</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.ratingText, { paddingRight: '2%' }]}>{item?.rating}</Text>
                    <Image source={Star} style={{ width: 16, height: 16, resizeMode: 'contain' }} />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default CourseCard

const styles = StyleSheet.create({
    mainContainer: {
        width: 260,
        height: 220,
        backgroundColor: Colors.whiteColor,
        borderRadius: 16,
        elevation: 1,
        marginLeft: 10,
        marginBottom: 4,
    },
    imgStyle: {
        width: '100%',
        height: 110,
        backgroundColor: "#A42A2A",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    categoryView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '5%',
        marginHorizontal: '4%',
    },
    categoryText: {
        fontFamily: Fonts.MulishBold,
        fontSize: FontSizes.tinyText,
        color: Colors.orangeColor,
    },
    courseTittle: {
        fontFamily: Fonts.JostSemiBold,
        fontSize: FontSizes.mediumFont,
        color: Colors.blackColor,
        marginTop: '2%',
        marginHorizontal: '4%',
    },
    ratingView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '2%',
        marginHorizontal: '4%',
    },
    ratingText: {
        fontFamily: Fonts.MulishMedium,
        fontSize: FontSizes.tinyText,
        color: Colors.lightBlackColor,
    }
})