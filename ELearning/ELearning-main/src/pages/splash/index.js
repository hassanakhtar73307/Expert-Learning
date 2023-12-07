import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../theme/colors'
import { splashLogo } from '../../theme/images';

const Splash = ({ navigation }) => {

    setTimeout(() => {
        navigation.navigate('Login')
    }, 3000);

    return (
        <View style={styles.mainContainer}>
            <Image source={splashLogo} style={styles.imgStyle} />
        </View>
    )
}

export default Splash

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.mainColor,
        justifyContent: 'center',
    },
    imgStyle: {
        width: '80%',
        height: '50%',
        resizeMode: 'contain',
        alignSelf: 'center',
    }
})