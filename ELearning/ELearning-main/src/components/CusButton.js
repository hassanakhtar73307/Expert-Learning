import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Right } from '../theme/images'
import { Colors } from '../theme/colors'
import { FontSizes, Fonts } from '../theme/fonts'

const CusButton = ({ btnTittle, onPress, disabled }) => {
    return (
        <TouchableOpacity style={styles.btnView} activeOpacity={0.8} onPress={onPress} disabled={disabled}>
            <Text style={styles.btnText}>{btnTittle}</Text>
            <View style={styles.rightView}>
                <Image source={Right} style={styles.rightImg} />
            </View>
        </TouchableOpacity>
    )
}

export default CusButton

const styles = StyleSheet.create({
    btnView: {
        flexDirection: "row",
        width: "92%",
        height: 50,
        backgroundColor: Colors.mainColor,
        borderRadius: 50 / 2,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        elevation: 1,
    },
    btnText: {
        fontFamily: Fonts.JostSemiBold,
        fontSize: FontSizes.btnText,
        color: Colors.whiteColor,
    },
    rightView: {
        width: 40,
        height: 40,
        backgroundColor: Colors.whiteColor,
        borderRadius: 40 / 2,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        right: '4%',

    },
    rightImg: {
        width: 15,
        height: 15,
        resizeMode: "contain",
    },
})