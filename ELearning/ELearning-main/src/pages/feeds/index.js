import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../theme/colors'
import { FontSizes, Fonts } from '../../theme/fonts'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { getAllPosts, updatePost } from '../../db/FeedFunction'
import { useFocusEffect } from '@react-navigation/native'
import { formatDistanceToNow, format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage'

const FeedsScreen = ({ navigation }) => {

    const [feeds, setFeeds] = useState([])
    const [loader, setLoader] = useState(true)

    const getFeedData = async () => {
        const res = await getAllPosts();
        if (res) {
            setFeeds(res)
            setLoader(false)
        } else {
            setLoader(false)
        }
    }

    const handlePress = (item) => {
        navigation.navigate('FeedComment', { itemData: item })
    }

    const handleProfilePress = (item) => {
        navigation.navigate('userProfile', { itemData: item?.publisherId, userName: item?.publisherName })
    }

    useFocusEffect(React.useCallback(() => {
        getFeedData()
    }, []))


    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerView}>
                <Text style={styles.headerText}>Feeds</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('FeedPublish')}>
                    <AntDesign name="plus" size={24} color={Colors.whiteColor} />
                </TouchableOpacity>
            </View>
            {loader ? <ActivityIndicator size="large" color={Colors.mainColor} /> :
                <>
                    {feeds?.length > 0 ?
                        <FlatList
                            data={feeds}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => <FeedCard item={item} onCommentPress={handlePress} onProfilePress={handleProfilePress} />}
                            showsVerticalScrollIndicator={false}
                            style={{ paddingBottom: 20 }}
                        />
                        :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.headerText}>No Feeds Found</Text>
                        </View>
                    }
                </>
            }
        </View>
    )
}

export default FeedsScreen


export const FeedCard = ({ item, onProfilePress, onCommentPress }) => {

    const [likeCount, setLikeCount] = useState(0)
    const [presentLikes, setPresentLikes] = useState(item?.likes)

    const convertDateOrTime = () => {
        const dateDifference = Math.floor((new Date() - item?.createdAt) / 1000 / 60 / 60);
        if (dateDifference < 24) {
            return formatDistanceToNow(item?.createdAt, { addSuffix: true });
        } else {
            return format(item?.createdAt, 'MM/dd/yyyy HH:mm a');
        }
    };

    const likeUpdate = async ({ e }) => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const user = JSON.parse(userInfo);
        if (user) {
            const postData = {
                likes: presentLikes + 1,
                likesIds: [
                    ...e?.likesIds,
                    {
                        userId: user?.id,
                        userName: user?.name,
                        userImg: ''
                    }
                ]
            }
            const res = await updatePost(e?.postsId, postData);
            if (res) {
                setPresentLikes(presentLikes + 1)
                setLikeCount(1)
            }
        }
    }

    const dislikeUpdate = async ({ e }) => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const user = JSON.parse(userInfo);
        if (user) {
            const postData = {
                likes: presentLikes - 1,
                likesIds: e?.likesIds?.filter((item) => item?.userId !== user?.id)
            }
            const res = await updatePost(e?.postsId, postData);
            if (res) {
                setLikeCount(0)
                setPresentLikes(presentLikes - 1)
            }
        }
    }

    const checkLike = async ({ e }) => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const user = JSON.parse(userInfo);
        if (user) {
            if (likeCount === 0) {
                const isLiked = e?.likesIds?.findIndex((item) => item?.userId === user?.id)
                if (isLiked !== -1) {
                    dislikeUpdate({ e })
                    return true
                } else {
                    likeUpdate({ e })
                    return false
                }
            } else {
                if (likeCount === 1) {
                    dislikeUpdate({ e })
                    return true
                } else {
                    likeUpdate({ e })
                    return false
                }
            }
        }
    }

    return (
        <View style={styles.cardView}>
            <TouchableOpacity style={styles.cardHeaderView} onPress={() => onProfilePress(item)} activeOpacity={.8}>
                <Image source={{ uri: item?.publisherImg }} style={styles.cricleImg} />
                <View style={styles.cardHeaderTextView}>
                    <Text style={styles.cardHeaderText}>{item?.publisherName}</Text>
                    <Text style={styles.cardHeaderSubText}>{convertDateOrTime()}</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.cardBodyView}>
                <Text style={styles.cardBodyText}>{item?.postText}</Text>
                {item?.postImg && <Image source={{ uri: item?.postImg }} style={styles.cardBodyImgView} />}
            </View>
            <View style={styles.cardFooterView}>
                <TouchableOpacity style={{ ...styles.cardFooterLeftView, backgroundColor: likeCount === 1 ? Colors.mainColor : "#c4c4c4" }}
                    onPress={() => checkLike({ e: item })}>
                    <AntDesign name="like2" size={24} color={Colors.whiteColor} />
                    <Text style={{
                        ...styles.cardFooterText, color: likeCount === 1 ? Colors.whiteColor : Colors.blackColor
                    }}>{parseInt(item?.likes) + parseInt(likeCount)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cardFooterRightView} onPress={() => onCommentPress(item)}>
                    <AntDesign name="message1" size={24} color={Colors.whiteColor} />
                    <Text style={styles.cardFooterText}>{item?.comments}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.bgColor
    },
    headerView: {
        height: 50,
        backgroundColor: Colors.headerColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerText: {
        fontSize: FontSizes.header,
        fontWeight: '500',
        fontFamily: Fonts.JostBold,
        color: Colors.blackColor
    },
    addBtn: {
        position: 'absolute',
        right: '4%',
        height: 30,
        width: 30,
        borderRadius: 5,
        backgroundColor: Colors.mainColor,
        justifyContent: 'center',
        alignItems: 'center'
    },

    cardView: {
        marginTop: '4%',
        marginBottom: '2%',
        marginHorizontal: '4%',
        borderRadius: 10,
        backgroundColor: Colors.whiteColor,
        elevation: 2,
        shadowColor: Colors.blackColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    cardHeaderView: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    cricleImg: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: Colors.mainColor
    },
    cardHeaderTextView: {
        marginLeft: 10
    },
    cardHeaderText: {
        fontSize: FontSizes.header,
        fontWeight: '500',
        fontFamily: Fonts.JostBold,
        color: Colors.blackColor
    },
    cardHeaderSubText: {
        fontSize: FontSizes.normalText,
        fontFamily: Fonts.JostMedium,
        color: Colors.blackColor
    },
    cardBodyView: {
        padding: 10
    },
    cardBodyText: {
        fontSize: FontSizes.mediumFont,
        fontFamily: Fonts.JostMedium,
        color: Colors.blackColor,
        textAlign: 'justify'
    },
    cardBodyImgView: {
        height: 200,
        width: '100%',
        borderRadius: 10,
        backgroundColor: Colors.mainColor,
        marginTop: 10,
        resizeMode: 'cover'
    },
    cardFooterView: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    cardFooterLeftView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#c4c4c4",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    cardFooterRightView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#d4c4d7",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginLeft: 10
    },
    cardFooterText: {
        fontSize: FontSizes.normalText,
        fontFamily: Fonts.JostMedium,
        color: Colors.blackColor,
        marginLeft: 5
    }


})