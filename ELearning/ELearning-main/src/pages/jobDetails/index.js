import { ScrollView, StyleSheet, TouchableOpacity, Text, Image, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { backIcon } from '../../theme/images'
import { Colors } from '../../theme/colors'
import { FontSizes, Fonts } from '../../theme/fonts'
import AsyncStorage from '@react-native-async-storage/async-storage'

const JobDetails = ({ navigation, route }) => {
    const { itemData } = route.params

    const [loginUserId, setLoginUserId] = useState('')
    const handleChat = async () => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const user = JSON.parse(userInfo);
        if (user) {
            const passData = {
                id: itemData.userId,
                loginUserId: user?.id,
                name: itemData.userName,
            }
            navigation.navigate('ChatScreen', { itemData: passData })
        }
    }

    const checkLogin = async () => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const user = JSON.parse(userInfo);
        if (user) {
            setLoginUserId(user?.id)
        }
    }

    useEffect(() => { checkLogin() }, [])

    return (
        <>
            <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.mainContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={backIcon} style={styles.backIcon} />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Job Details</Text>
                    </View>
                    <Image source={{ uri: itemData.jobImage }} style={{ height: 200, width: '100%' }} />
                    <Text style={styles.jobTitle}>{itemData.jobTitle}</Text>
                    <Text style={styles.jobProvider}>{itemData.companyName}</Text>
                    <Text style={styles.descHeading}>Description</Text>
                    <Text style={styles.descText}>{itemData.jobDescription}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'space-between' }}>
                        <Text style={styles.descHeading}>Salary</Text>
                        <Text style={{ ...styles.descText, marginTop: 10 }}>{itemData.jobBudget}</Text>
                    </View>
                </View>
            </ScrollView>
            {loginUserId !== itemData.userId &&
                <View style={styles.floatingButton}>
                    <TouchableOpacity style={styles.btnStyle} onPress={handleChat}>
                        <Text style={styles.btnText}>Message </Text>
                    </TouchableOpacity>
                </View>
            }
        </>
    )
}

export default JobDetails

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
    jobProvider: {
        color: Colors.orangeColor,
        fontSize: FontSizes.mediumFont,
        fontFamily: Fonts.AliceRegular,
        marginHorizontal: 20,
        marginTop: 2,
    },
    jobTitle: {
        color: Colors.blackColor,
        fontSize: FontSizes.header,
        fontFamily: Fonts.MulishBold,
        marginHorizontal: 20,
        marginTop: 10,
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

    floatingButton: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        alignItems: 'center',
    },

    btnStyle: {
        backgroundColor: Colors.mainColor,
        height: 50,
        width: '90%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    btnText: {
        color: Colors.whiteColor,
        fontSize: FontSizes.header,
        fontFamily: Fonts.MulishBold,
    },

})