import { FlatList, StyleSheet, TouchableOpacity, Text, View, ActivityIndicator } from 'react-native'
import React, { useState, useCallback } from 'react'
import { Colors } from '../../theme/colors'
import { FontSizes, Fonts } from '../../theme/fonts'
import { getChatParticipants, getLastMessagesWithParticipants, getUserDetailsByIds } from '../../db/MesgListGet'
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MesgList = ({ navigation }) => {

    const [chatUsers, setChatUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // const getUserInfo = async () => {
    //     const user = await AsyncStorage.getItem('userInfo');
    //     const parseUser = JSON.parse(user);
    //     if (parseUser) {
    //         const res = await getChatUsers(parseUser.id)
    //         if (res) {
    //             const idRes = await getUserDetailsByIds(res)
    //             const userList = Object.keys(idRes).map(userId => ({ id: userId, ...idRes[userId] }));
    //             if (userList) {
    //                 const lastmesg = await getLastMessagesForContactList(parseUser.id, res);
    //                 const userLast = userList.map((user) => { return { ...user, lastMessage: lastmesg[user.id] } });
    //                 if (userLast) {
    //                     const unreadCount = await getUnreadMessageCounts(parseUser.id, res);
    //                     const userUnread = userLast.map((user) => { return { ...user, unreadMessageCount: unreadCount[user.id] } });
    //                     const loginUserIdadd = userUnread.map((user) => { return { ...user, loginUserId: parseUser.id } });
    //                     setChatUsers(loginUserIdadd);
    //                     setLoading(false);
    //                 }
    //             }
    //         }
    //     }
    // }

    const getUserInfo = async () => {
        const user = await AsyncStorage.getItem('userInfo');
        const parseUser = JSON.parse(user);
        if (parseUser) {
            const res = await getChatParticipants(parseUser.id)
            setChatUsers([]);
            setLoading(false);
            if (!res.error) {
                const idRes = await getUserDetailsByIds(res)
                const userList = Object.keys(idRes).map(userId => ({ id: userId, ...idRes[userId] }));
                if (userList) {
                    const data = await getLastMessagesWithParticipants(parseUser.id, res);
                    const userCombine = userList.map((user) => { return { ...user, lastMessage: data[user.id] } });
                    if (userCombine) {
                        const passLoginUserId = userCombine.map((user) => { return { ...user, loginUserId: parseUser.id } });
                        setChatUsers(passLoginUserId);
                        setLoading(false);
                    }
                }
            }
        }
    }

    useFocusEffect(useCallback(() => { getUserInfo() }, []));


    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} color={Colors.mainColor} />
            </View>
        )
    }

    return (
        <View style={styles.mainContainer}>
            {chatUsers?.length > 0 ?
                <FlatList
                    data={chatUsers}
                    renderItem={({ item, index }) => MesgCard(item, () => navigation.navigate('ChatScreen', { itemData: item }))}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={() => <View style={styles.divider} />}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={() => headerView()}
                    contentContainerStyle={{ paddingBottom: '5%' }}
                />
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: Fonts.MulishMedium, fontSize: FontSizes.normalTitle, color: Colors.blackColor }}>No Messages</Text>
                </View>
            }
        </View>
    )
}

export default MesgList

const headerView = () => {
    return (
        <View style={styles.headerView}>
            <Text style={styles.headerText}>Messages</Text>
        </View>
    )
}

const MesgCard = (item, onPress) => {
    const date = new Date(item?.lastMessage?.timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const time = hours + ':' + minutes;
    return (
        <TouchableOpacity style={styles.mesgCard} onPress={onPress}>
            <View style={styles.imgView} />
            <View style={styles.mesgView}>
                <View style={styles.inRow}>
                    <Text style={styles.name}>{item?.name}</Text>
                    {/* {item?.unreadMessageCount != 0 && <View style={styles.unReadView}>
                        <Text style={styles.unRead}>{item?.unreadMessageCount}</Text>
                    </View>} */}
                </View>
                <View style={styles.inRow}>
                    <Text style={styles.mesg} numberOfLines={1} ellipsizeMode='tail' >{item?.lastMessage?.text}</Text>
                    <Text style={styles.time}>{time}</Text>
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
        marginHorizontal: '4%',
        marginVertical: '5%',
    },
    headerText: {
        fontFamily: Fonts.MulishBold,
        fontSize: FontSizes.normalTitle,
        color: Colors.blackColor,
    },
    mesgCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        marginHorizontal: '4%',
        paddingHorizontal: '2%',
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: Colors.whiteColor,
        elevation: 5,
        shadowColor: Colors.mainColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        marginBottom: '2%'

    },
    imgView: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        backgroundColor: Colors.blackColor
    },
    mesgView: {
        flex: 1,
        marginLeft: '2%',
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1%'
    },
    name: {
        fontFamily: Fonts.MulishMedium,
        fontSize: FontSizes.mediumFont,
        color: Colors.blackColor,
    },
    unReadView: {
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
        backgroundColor: Colors.mainColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    unRead: {
        fontFamily: Fonts.MulishMedium,
        fontSize: FontSizes.tinyText,
        color: Colors.whiteColor,
    },
    mesg: {
        fontFamily: Fonts.MulishMedium,
        fontSize: FontSizes.smallText,
        color: Colors.lightBlackColor,
        width: '80%'
    },
    time: {
        fontFamily: Fonts.MulishMedium,
        fontSize: FontSizes.tinyText,
        color: Colors.lightBlackColor,
    }

})