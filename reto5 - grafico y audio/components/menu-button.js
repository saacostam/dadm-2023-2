import {Text, TouchableHighlight, View} from "react-native";
import {COLOR} from "../constants";

export const MenuButton = ({ title, emoji, onPress }) => {
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
                flex: 1,
            }}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: 'space-evenly',
                }}
            >
                <Text
                    style={{
                        color: COLOR.SECONDARY,
                        fontSize: 32,
                        textAlign: 'center',
                    }}
                >{ emoji }</Text>
                <Text
                    style={{
                        color: COLOR.SECONDARY,
                        fontSize: 18,
                        textAlign: 'center',
                    }}
                >{ title }</Text>
            </View>
        </TouchableHighlight>
    )
}
