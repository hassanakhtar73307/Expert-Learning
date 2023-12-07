import { StyleSheet, FlatList, Text, TextInput, TouchableOpacity, Image, View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Colors } from '../../theme/colors';
import { FontSizes, Fonts } from '../../theme/fonts';
import { Close, Right } from '../../theme/images';
import { updatePost } from '../../db/FeedFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDistanceToNow, format } from 'date-fns';

const FeedComment = ({ navigation, route }) => {
    const { itemData } = route.params;

    const flatListRef = useRef();
    const [mesgcomment, setMesgComment] = useState(itemData?.commentsIds)
    const [comment, setComment] = useState('')
    const [loginUserId, setLoginUserId] = useState('')

    const handleComment = async () => {
        const postUpData = {
            comments: itemData.comments + 1,
            commentsIds: [
                ...itemData.commentsIds,
                {
                    userId: loginUserId?.id,
                    userName: loginUserId?.name,
                    userImg: '',
                    comment: comment,
                    commentTime: Date.now()
                }
            ]
        }
        if (loginUserId) {
            if (comment.trim() !== '') {
                const res = await updatePost(itemData.postsId, postUpData);
                if (res) {
                    setMesgComment(prevComments => [...prevComments, {
                        userId: loginUserId?.id,
                        userName: loginUserId?.name,
                        userImg: '',
                        comment: comment,
                        commentTime: Date.now()
                    }])
                    setComment('')
                    // navigation.goBack()
                }
            }
        }
    }

    const getUserId = async () => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const user = JSON.parse(userInfo);
        setLoginUserId(user)
    }

    useEffect(() => { getUserId() }, [])

    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerView}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Image source={Close} style={styles.backImg} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Write Your Comment</Text>
            </View>
            {itemData?.commentsIds?.length > 0 ?
                <FlatList
                    data={mesgcomment}
                    renderItem={({ item, index }) => <RenderList item={item} index={index} loginUserId={loginUserId} />}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onContentSizeChange={() => { flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 }) }}
                    onLayout={() => flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 })}
                    ref={flatListRef}
                /> :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.headerText}>No Comments Found</Text>
                </View>
            }
            <View style={styles.bottomView}>
                <View style={styles.inputView}>
                    <TextInput
                        value={comment}
                        placeholder={'Type a message'}
                        placeholderTextColor={Colors.blackColor}
                        style={styles.inputStyle}
                        multiline={true}
                        numberOfLines={3}
                        onChangeText={(text) => setComment(text)}
                    />
                </View>
                <TouchableOpacity style={styles.sendBtn} onPress={() => handleComment()}>
                    <Image source={Right} resizeMode={'contain'} style={styles.RIconStyle} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default FeedComment

const RenderList = ({ item, index, loginUserId }) => {

    const convertDateOrTime = () => {
        const dateDifference = Math.floor((new Date() - item?.commentTime) / 1000 / 60 / 60);
        if (dateDifference < 24) {
            return formatDistanceToNow(item?.commentTime, { addSuffix: true });
        } else {
            return format(item?.commentTime, 'MM/dd/yyyy HH:mm ');
        }
    };

    return (
        <View style={{
            flexDirection: item?.userId === loginUserId?.id ? 'row-reverse' : 'row', alignItems: 'flex-start', marginHorizontal: '4%', marginVertical: '2%'
        }}>
            <View style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: Colors.mainColor, }} />
            <View style={{
                backgroundColor: item?.userId === loginUserId?.id ? Colors.mainColor : Colors.whiteColor,
                padding: '3%',
                maxWidth: '70%',
                minWidth: '55%',
                marginHorizontal: '2%',
                borderTopLeftRadius: item?.userId === loginUserId?.id ? 10 : 0,
                borderTopRightRadius: item?.userId === loginUserId?.id ? 0 : 10,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
            }}>
                <Text style={{ fontFamily: Fonts.JostBold, fontSize: FontSizes.normalText, color: item?.userId === loginUserId?.id ? Colors.whiteColor : Colors.blackColor, marginBottom: 10 }}>{item?.userName}</Text>
                <Text style={{ fontFamily: Fonts.AliceRegular, fontSize: FontSizes.normalText, color: item?.userId === loginUserId?.id ? Colors.whiteColor : Colors.blackColor }}>{item?.comment}</Text>
                <Text style={{ fontFamily: Fonts.MulishMedium, fontSize: FontSizes.tinyText, color: item?.userId === loginUserId?.id ? Colors.whiteColor : Colors.blackColor, alignSelf: 'flex-end', marginTop: '2%' }}>{convertDateOrTime()}</Text>
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
        height: 60,
        backgroundColor: Colors.bgColor,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        fontSize: FontSizes.header,
        fontFamily: Fonts.JostBold,
        color: Colors.blackColor,
        marginLeft: '5%'
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
    bottomView: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginHorizontal: '4%',
        marginVertical: '2%',
        maxHeight: 60
    },
    inputView: {
        flex: 1,
        backgroundColor: Colors.whiteColor,
        borderRadius: 10,
        paddingHorizontal: '4%',
    },
    inputStyle: {
        fontFamily: Fonts.MulishRegular,
        fontSize: FontSizes.normalText,
        color: Colors.blackColor,
    },
    sendBtn: {
        backgroundColor: Colors.mainColor,
        marginLeft: '4%',
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    RIconStyle: {
        width: 16,
        height: 16,
        tintColor: Colors.whiteColor
    }
})