import {StyleSheet, Text, TouchableHighlight} from "react-native";
import {COLOR} from "../constants";
import {useState} from "react";

const highLightStyle = {
    backgroundColor: COLOR.SUCCESS,
}

export const Field = ({label, highlighted, onPress, gameOver}) => {
    return (
        <TouchableHighlight
            onPress={onPress}
            style={{
                ...styles.container,
                ...(highlighted ? highLightStyle: null),
            }}
            underlayColor={COLOR.LIGHTHER}
            disabled={gameOver}
        >
            <Text
                style={styles.field}
            >
                {label.toUpperCase()}
            </Text>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 80,
        height: 80,
        borderStyle: 'solid',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: COLOR.SECONDARY,
        backgroundColor: COLOR.PRIMARY,
        margin: 5,
    },
    field: {
        flex: 1,
        color: COLOR.SECONDARY,
        fontSize: 36,
        textAlign: 'center',
        textAlignVertical: 'center',
    }
});
