import {Text, TouchableHighlight} from "react-native";
import {COLOR} from "../constants";

export const Button = ({ title, onPress }) => {
    return (
        <TouchableHighlight
            onPress={onPress}
            style={{
                fontSize: 20,
                fontWeight: 400,
                marginVertical: 32,
                marginHorizontal: 8,
                borderStyle: 'solid',
                borderWidth: 2,
                borderRadius: 10,
                borderColor: COLOR.SECONDARY,
                backgroundColor: COLOR.PRIMARY,
                paddingVertical: 8,
                paddingHorizontal: 16,
            }}
        >
            <Text
                style={{
                    color: COLOR.SECONDARY,
                    fontSize: 18,
                }}
            >{ title }</Text>
        </TouchableHighlight>
    )
}
