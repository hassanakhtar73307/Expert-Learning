import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native"
import Splash from '../../pages/splash';
import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';
import BottomTab from '../bottomTab';
import SeeAll from '../../pages/seeAll';
import Home from '../../pages/home';
import OTPVerify from '../../pages/auth/OTPVerify';
import ChatScreen from '../../pages/messages/ChatScreen';
import CoursePublish from '../../pages/CoursePublis';
import CourseDetails from '../../pages/CourseDetails';
import VideoPlayer from '../../pages/VideoPlayer';
import FeedPublish from '../../pages/feedPost';
import FeedComment from '../../pages/feedComment';
import JobPublish from '../../pages/publishJobs';
import JobDetails from '../../pages/jobDetails';
import ProfileScreen from '../../pages/profile';
import EditProfile from '../../pages/EditProfile';
import EnterEmail from '../../pages/auth/EnterEmail';
import ForgotPassword from '../../pages/auth/ForgotPassword';

const Stack = createStackNavigator();
const StackNav = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={Splash} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name='OTPVerify' component={OTPVerify} />
                <Stack.Screen name="EnterEmail" component={EnterEmail} />
                <Stack.Screen name="Home" component={BottomTab} />
                <Stack.Screen name='ChatScreen' component={ChatScreen} />
                <Stack.Screen name='CoursePublish' component={CoursePublish} />
                <Stack.Screen name='CourseDetails' component={CourseDetails} />
                <Stack.Screen name='VideoPlayer' component={VideoPlayer} />
                <Stack.Screen name='FeedPublish' component={FeedPublish} />
                <Stack.Screen name='FeedComment' component={FeedComment} />
                <Stack.Screen name='JobPublish' component={JobPublish} />
                <Stack.Screen name="JobDetails" component={JobDetails} />
                <Stack.Screen name="userProfile" component={ProfileScreen} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default StackNav


export const HomeScreenBottomTab = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeBTab" component={Home} />
            <Stack.Screen name='SeeAll' component={SeeAll} />
        </Stack.Navigator>
    )
}

