import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../theme/colors'
import { CloseEye, OpenEye } from '../theme/images'

const CusTextInput = ({ isSecureType, inputValue, inputIcon, inputPlaceholder, inputType, onInputChange, typePass }) => {
    // const [inputValue, setInputValue] = useState("")
    const [isSecure, setIsSecure] = useState(isSecureType)

    const handleTextChange = (text) => {
        // setInputValue(text);
        onInputChange(text);
    };

    return (
        <View style={styles.inputView}>
            {inputIcon && <Image source={inputIcon} style={styles.inputImg} />}
            <TextInput
                style={styles.inputStyle}
                value={inputValue}
                onChangeText={handleTextChange}
                placeholder={inputPlaceholder}
                placeholderTextColor={Colors.lightBlackColor}
                keyboardType={inputType}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={isSecure}
            />
            {typePass && <TouchableOpacity onPress={() => setIsSecure(!isSecure)}><Image source={isSecure ? CloseEye : OpenEye} style={{ ...styles.inputImg, marginLeft: 0, marginRight: 6 }} /></TouchableOpacity>}
        </View>
    )
}

export default CusTextInput

const styles = StyleSheet.create({
    inputView: {
        flexDirection: "row",
        width: "92%",
        height: 48,
        backgroundColor: Colors.whiteColor,
        borderRadius: 8,
        alignSelf: "center",
        alignItems: "center",
        elevation: 1,
    },
    inputImg: {
        width: 20,
        height: 20,
        resizeMode: "contain",
        marginLeft: 10,
    },
    inputStyle: {
        flex: 1,
        fontSize: 16,
        marginHorizontal: '4%',
        color: Colors.blackColor,
    },
})