import { toggleCheckOff } from "@/business/business";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Checkbox, Icon, Text, useTheme } from "react-native-paper";
import { ToDoEntry } from "../data/model/ToDoEntry";

type CardItemProps = {
    todo: ToDoEntry;
};

export default function CardItem(props: CardItemProps) {
    const [isCheckedOff, setCheckedOff] = useState<boolean>(props.todo.isCheckedOff);
    const theme = useTheme();
    const router = useRouter();

    const checkboxHandler = () => {
        const newValue = !isCheckedOff;
        setCheckedOff(newValue);
        toggleCheckOff(props.todo.uniqueId);
    };

    return (
        <Card
            style={{ padding: 16 }}
            onPress={() => { router.navigate(`/create-edit-screen?id=${props.todo.uniqueId}`); }}>
            <View
                style={{ flexDirection: 'row' }}>
                <View
                    style={{ alignContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <Checkbox
                        status={isCheckedOff ? 'checked' : 'unchecked'}
                        onPress={checkboxHandler} />
                </View>
                <View
                    style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 5 }}>
                    <Text
                        style={{ ...(isCheckedOff ? extraFontStyles.done : extraFontStyles.pending), ...theme.fonts.titleLarge }}>
                        {props.todo.title}
                    </Text>
                    {
                        props.todo.description ? (
                            <Text
                                style={{ ...(isCheckedOff ? extraFontStyles.done : extraFontStyles.pending), marginTop: 5 }}>
                                {props.todo.description}
                            </Text>
                        ) : (
                            <></>
                        )
                    }
                    {
                        props.todo.dueDate ? (
                            <Text
                                style={{ ...(isCheckedOff ? extraFontStyles.done : extraFontStyles.pending), marginTop: 5, fontStyle: 'italic' }}>
                                {new Date(props.todo.dueDate).toLocaleDateString()}
                            </Text>
                        ) : (
                            <></>
                        )
                    }
                </View>
                <View
                    style={{ alignContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    {
                        props.todo.priority == 'HIGH' ? (
                            <Icon
                                source="arrow-up"
                                size={theme.fonts.displaySmall.fontSize} />
                        ) : props.todo.priority == 'STANDARD' ? (
                            <Icon
                                source="equal"
                                size={theme.fonts.displaySmall.fontSize} />
                        ) : props.todo.priority == 'LOW' ? (
                            <Icon
                                source="arrow-down"
                                size={theme.fonts.displaySmall.fontSize} />
                        ) : (
                            <></>
                        )
                    }
                </View>
            </View>
        </Card >
    );
}

const extraFontStyles = StyleSheet.create({
    done: {
        fontStyle: 'italic',
        textDecorationLine: 'line-through'
    },
    pending: {}
});