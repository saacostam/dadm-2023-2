import {Text} from "react-native";
import {COLOR} from "../constants";

export const Header = ({label, isSecondary}) => {
    return (
        <Text style={{
            fontSize: 32,
            fontWeight: 700,
            color: isSecondary ? COLOR.SECONDARY : COLOR.PRIMARY,
            marginVertical: 32,
        }}>
            {label}
        </Text>
    )
}
