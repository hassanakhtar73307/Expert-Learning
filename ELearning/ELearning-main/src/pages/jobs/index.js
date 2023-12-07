import { ActivityIndicator, StyleSheet, Text, Image, TouchableOpacity, View } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Colors } from '../../theme/colors'
import { FontSizes, Fonts } from '../../theme/fonts'
import { FlatList } from 'react-native-gesture-handler'
import { getAllJobs } from '../../db/JobFunctions'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const JobScreen = ({ navigation }) => {

    const [jobs, setJobs] = useState([])
    const [loader, setLoader] = useState(true)
    const [userInfo, setUserInfo] = useState({});

    const getJobs = async () => {
        const jobs = await getAllJobs();
        if (jobs) {
            setJobs(jobs)
            setLoader(false)
        }
    }

    const handlePress = (item) => {
        navigation.navigate('JobDetails', { itemData: item })
    }

    const getUserInfo = async () => {
        const user = await AsyncStorage.getItem('userInfo');
        const parseUser = JSON.parse(user);
        console.log(parseUser);
        setUserInfo(parseUser);
    }

    useFocusEffect(useCallback(() => { getJobs() }, []));
    useEffect(() => { getUserInfo() }, []);

    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerView}>
                <Text style={styles.headerText}>Jobs</Text>
                {userInfo?.role === "Teacher" &&
                    <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('JobPublish')}>
                        <AntDesign name="plus" size={24} color={Colors.whiteColor} />
                    </TouchableOpacity>}
            </View>
            {
                loader ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={Colors.mainColor} />
                    </View>
                    :
                    <>
                        {jobs.length === 0 ?
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontFamily: Fonts.MulishBold, fontSize: FontSizes.header }}>No Jobs Found</Text>
                            </View> :
                            <FlatList
                                data={jobs}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => <JobCard item={item} onPress={handlePress} />}
                                showsVerticalScrollIndicator={false}
                                style={{ paddingBottom: 20 }}
                            />
                        }
                    </>
            }
        </View>
    )
}

export default JobScreen


const JobCard = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={styles.cardView} onPress={() => onPress(item)}>
            <View style={styles.inRow}>
                <Image source={{ uri: item?.jobImage }} style={styles.cricleImg} />
                <View>
                    <Text style={styles.nameText}>{item?.jobTitle}</Text>
                    <Text style={styles.subName}>{item?.companyName}</Text>
                </View>
            </View>
            <View style={styles.inRowJustify}>
                <View style={styles.budgetView}>
                    <Text style={styles.budgetText}>Budget</Text>
                </View>
                <Text style={styles.budgetPrice}>{item?.jobBudget}</Text>
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
    inRow: {
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
    nameText: {
        marginLeft: 10,
        fontFamily: Fonts.JostBold,
        fontSize: FontSizes.header,
        color: Colors.blackColor
    },
    subName: {
        marginLeft: 10,
        fontFamily: Fonts.MulishMedium,
        fontSize: FontSizes.normalText,
        color: Colors.lightBlackColor
    },
    inRowJustify: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10
    },
    budgetView: {
        backgroundColor: Colors.mainColor,
        borderRadius: 5,
        padding: 5
    },
    budgetText: {
        fontFamily: Fonts.MulishMedium,
        fontSize: FontSizes.smallText,
        color: Colors.whiteColor
    },
    budgetPrice: {
        fontFamily: Fonts.JostBold,
        fontSize: FontSizes.smallText,
        color: Colors.blackColor
    }
})