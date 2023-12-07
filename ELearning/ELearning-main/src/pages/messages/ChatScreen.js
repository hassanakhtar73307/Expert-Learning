import { StyleSheet, Text, Image, FlatList, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Right, backIcon } from '../../theme/images'
import { Colors } from '../../theme/colors'
import { FontSizes, Fonts } from '../../theme/fonts'
import { getChatMessages, sendMessage } from '../../db/MesgListGet'

const ChatScreen = ({ navigation, route }) => {
    const { itemData } = route.params;

    const [mesgArray, setMesgArray] = useState([]);
    const [mesg, setMesg] = useState('');
    const flatListRef = React.useRef();

    useEffect(() => {
        fetchChatMessages();
    }, []);

    const fetchChatMessages = async () => {
        try {
            // console.log('itemData?.loginUserId', itemData?.loginUserId, itemData?.id);
            const messages = await getChatMessages(itemData?.loginUserId, itemData?.id);
            setMesgArray(messages);
        } catch (error) {
            console.error('Error fetching chat messages:', error);
        }
    };

    const SendMesg = async () => {
        try {
            if (mesg.trim() !== '') {
                const sentMessage = await sendMessage(itemData?.loginUserId, itemData?.id, mesg);
                setMesgArray(prevMessages => [...prevMessages, sentMessage]);
                setMesg('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const RenderList = ({ item, index }) => {
        const date = new Date(item?.timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const time = hours + ':' + minutes;
        return (
            <View style={{
                backgroundColor: item?.senderId === itemData?.loginUserId ? Colors.mainColor : Colors.whiteColor,
                borderRadius: 10,
                padding: '3%',
                maxWidth: '70%',
                minWidth: '50%',
                marginHorizontal: '4%',
                marginVertical: '2%',
                alignSelf: item?.senderId === itemData?.loginUserId ? 'flex-end' : 'flex-start',
                justifyContent: item?.senderId === itemData?.loginUserId ? 'flex-end' : 'flex-start',
            }}>
                <Text style={{ fontFamily: Fonts.AliceRegular, fontSize: FontSizes.normalText, color: item?.senderId === itemData?.loginUserId ? Colors.whiteColor : Colors.blackColor }}>{item?.text}</Text>
                <Text style={{ fontFamily: Fonts.MulishMedium, fontSize: FontSizes.tinyText, color: item?.senderId === itemData?.loginUserId ? Colors.whiteColor : Colors.blackColor, alignSelf: 'flex-end', marginTop: '2%' }}>{time}</Text>
            </View>
        )
    }


    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerView}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={backIcon} resizeMode={'contain'} style={styles.IconStyle} />
                </TouchableOpacity>
                <Text style={styles.headerText}>{itemData?.name}</Text>
            </View>

            <FlatList
                data={mesgArray}
                renderItem={({ item, index }) => <RenderList item={item} index={index} />}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                inverted={false}
                onContentSizeChange={() => { flatListRef?.current?.scrollToEnd({ animated: true }) }}
                onLayout={() => flatListRef?.current?.scrollToEnd({ animated: true })}
                ref={flatListRef}
            />
            <View style={styles.bottomView}>
                <View style={styles.inputView}>
                    <TextInput
                        value={mesg}
                        placeholder={'Type a message'}
                        placeholderTextColor={Colors.blackColor}
                        style={styles.inputStyle}
                        multiline={true}
                        numberOfLines={3}
                        onChangeText={(text) => setMesg(text)}
                    />
                </View>
                <TouchableOpacity style={styles.sendBtn} onPress={() => SendMesg()}>
                    <Image source={Right} resizeMode={'contain'} style={styles.RIconStyle} />
                </TouchableOpacity>
            </View>
        </View>
    )
}


export default ChatScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.bgColor
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: '4%',
        marginVertical: '4%',
    },
    IconStyle: {
        width: 20,
        height: 20,
        tintColor: Colors.blackColor
    },
    headerText: {
        fontFamily: Fonts.JostSemiBold,
        fontSize: FontSizes.btnText,
        color: Colors.blackColor,
        marginLeft: '5%'
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