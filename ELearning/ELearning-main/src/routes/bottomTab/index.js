
import { StyleSheet, Image, View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Feed, Home, Jobs, Mesg, User } from '../../theme/images'
import { Colors } from '../../theme/colors'
import { HomeScreenBottomTab } from '../stack'
import MesgList from '../../pages/messages/MesgList'
import FeedsScreen from '../../pages/feeds'
import JobScreen from '../../pages/jobs'
import MyProfile from '../../pages/MyProfile'

const BottomTab = () => {

    const Tab = createBottomTabNavigator()

    return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarHideOnKeyboard: true }}>
            <Tab.Screen name='Home_Screen' component={HomeScreenBottomTab}
                options={{
                    tabBarIcon: ({ focused, size }) => (
                        <Image source={Home} resizeMode={'contain'} style={{ ...styles.ImgStyle, tintColor: focused ? Colors.greenColor : Colors.inActiveTab }} />
                    ),
                }}
            />
            <Tab.Screen name='FeedsScreen' component={FeedsScreen}
                options={{
                    tabBarIcon: ({ focused, size }) => (
                        <Image source={Feed} resizeMode={'contain'} style={{ ...styles.ImgStyle, tintColor: focused ? Colors.greenColor : Colors.inActiveTab }} />
                    ),
                }}
            />
            <Tab.Screen name='MesgList' component={MesgList}
                options={{
                    tabBarIcon: ({ focused, size }) => (
                        <Image source={Mesg} resizeMode={'contain'} style={{ ...styles.ImgStyle, tintColor: focused ? Colors.greenColor : Colors.inActiveTab }} />
                    ),
                }}
            />
            <Tab.Screen name='JobScreen' component={JobScreen}
                options={{
                    tabBarIcon: ({ focused, size }) => (
                        <Image source={Jobs} resizeMode={'contain'} style={{ ...styles.ImgStyle, tintColor: focused ? Colors.greenColor : Colors.inActiveTab }} />
                    ),
                }}
            />
            <Tab.Screen name='Profile' component={MyProfile}
                options={{
                    tabBarIcon: ({ focused, size }) => (
                        <Image source={User} resizeMode={'contain'} style={{ ...styles.ImgStyle, tintColor: focused ? Colors.greenColor : Colors.inActiveTab }} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}
export default BottomTab

const styles = StyleSheet.create({
    ImgStyle: {
        width: 22,
        height: 22,
    },
})