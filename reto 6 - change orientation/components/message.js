import {Text} from "react-native";
import {COLOR} from "../constants";

export const Message = ({content, isSecondary}) => {
    return (
        <Text style={{
            fontSize: 20,
            fontWeight: 400,
            color: isSecondary ? COLOR.SECONDARY : COLOR.WHITE,
        }}>
            {content}
        </Text>
    )
}
