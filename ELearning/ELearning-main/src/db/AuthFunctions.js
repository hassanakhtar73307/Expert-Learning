import firestore from '@react-native-firebase/firestore';
import { ToastAndroid } from 'react-native';
import Asyncstorage from '@react-native-async-storage/async-storage';

const addUserToFirestore = async (inputValue) => {
    try {
        const usersCollection = firestore().collection('users');

        const existingUser = await usersCollection.where('phone', '==', inputValue.phone).get();

        const existingEmail = await usersCollection.where('email', '==', inputValue.email).get();

        if (!existingUser.empty) {
            console.log('User with the same phone number already exists.');
            ToastAndroid.show('User with the same phone number already exists.', ToastAndroid.SHORT);
            return null;
        }

        if (!existingEmail.empty) {
            console.log('User with the same email already exists.');
            ToastAndroid.show('User with the same email already exists.', ToastAndroid.SHORT);
            return null;
        }

        const newUser = await usersCollection.add({
            email: inputValue.email,
            password: inputValue.password,
            phone: inputValue.phone,
            status: 'unVerified',
            name: inputValue.name,
            address: '',
            about: '',
            imgaeUrl: '',
            headline: '',
            role: inputValue.roleSelected,
        });

        console.log('User added to Firestore with ID:', newUser.id);
        Asyncstorage.setItem('userInfo', JSON.stringify({ id: newUser.id, ...inputValue }))
        ToastAndroid.show('User Created Successfully', ToastAndroid.SHORT);

        return newUser;
    } catch (error) {
        console.error('Error adding user to Firestore:', error);
        throw error;
    }
};

const updateUserInFirestore = async (userId, updateData) => {
    try {
        const userRef = firestore().collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            ToastAndroid.show('User not found.', ToastAndroid.SHORT);
            console.log('User not found.');
            return false;
        }

        await userRef.update(updateData);

        ToastAndroid.show('User updated successfully.', ToastAndroid.SHORT);
        console.log('User updated successfully.');
        return true;
    } catch (error) {
        ToastAndroid.show('Error updating user in Firestore.', ToastAndroid.SHORT);
        console.error('Error updating user in Firestore:', error);
        throw error;
    }
};

const loginUser = async (email, password) => {
    try {
        const usersCollection = firestore().collection('users');

        const userSnapshot = await usersCollection.where('email', '==', email).where('password', '==', password).get();

        if (userSnapshot.empty) {
            console.log('Invalid email or password');
            ToastAndroid.show('Invalid email or password', ToastAndroid.SHORT);
            return null;
        }

        const userData = userSnapshot.docs[0].data();
        const userId = userSnapshot.docs[0].id;
        Asyncstorage.setItem('userInfo', JSON.stringify({ id: userId, ...userData }))
        console.log('User logged in successfully:', userData);

        return userData;
    } catch (error) {
        console.error('Error logging in:', error);
        ToastAndroid.show('Error logging in. Please try again.', ToastAndroid.SHORT);
        throw error;
    }
};

const getUserRegInfo = async (userId) => {
    try {
        const userRef = firestore().collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            ToastAndroid.show('User not found.', ToastAndroid.SHORT);
            console.log('User not found.');
            return false;
        }

        const userData = userDoc.data();
        console.log('User data:', userData);
        const docIdCombine = { id: userId, ...userData }
        return docIdCombine;
    } catch (error) {
        ToastAndroid.show('Error getting user data.', ToastAndroid.SHORT);
        console.error('Error getting user data:', error);
        throw error;
    }
};

//check number and return user all information include its id
const getUserInfo = async (phone) => {
    try {
        const usersCollection = firestore().collection('users');

        const userSnapshot = await usersCollection.where('phone', '==', phone).get();

        if (userSnapshot.empty) {
            console.log('Invalid phone number');
            ToastAndroid.show('Invalid phone number', ToastAndroid.SHORT);
            return null;
        }

        const userData = userSnapshot.docs[0].data();
        const userId = userSnapshot.docs[0].id;
        console.log('User data:', userData);
        const docIdCombine = { id: userId, ...userData }
        return docIdCombine;
    } catch (error) {
        console.error('Error logging in:', error);
        ToastAndroid.show('Error logging in. Please try again.', ToastAndroid.SHORT);
        throw error;
    }
};

export { addUserToFirestore, updateUserInFirestore, loginUser, getUserRegInfo, getUserInfo };