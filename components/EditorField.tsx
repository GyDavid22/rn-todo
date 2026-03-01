import { Priority, ToDoEntryDto } from "@/data/model/ToDoEntry";
import { StyleSheet, View } from "react-native";
import { Checkbox, Text, TextInput } from "react-native-paper";
import { DatePickerInput } from 'react-native-paper-dates';
import { Dropdown, Option } from 'react-native-paper-dropdown';

type EditorFielsProps = {
    todo: ToDoEntryDto,
    onChange: (t: ToDoEntryDto) => void;
};

export default function EditorField(props: EditorFielsProps) {
    const isDue = props.todo.dueDate !== null;

    const updateTodo = (t: ToDoEntryDto) => {
        props.onChange(t);
    };

    const dueDateCheckboxHandler = (setToFalse: boolean) => {
        if (setToFalse) {
            updateTodo({ ...props.todo, dueDate: null });
        } else {
            updateTodo({ ...props.todo, dueDate: new Date().toISOString() });
        }
    };

    return (
        <View>
            <TextInput
                label="Title"
                value={props.todo.title}
                onChangeText={text => updateTodo({ ...props.todo, title: text })}
                mode="outlined"
                style={fieldStyle.input}
            />
            <TextInput
                label="Description"
                value={props.todo.description ?? ''}
                onChangeText={text => updateTodo({ ...props.todo, description: text === '' ? null : text })}
                mode="outlined"
                multiline={true}
                style={{ ...fieldStyle.input, height: 200 }}
            />
            <View style={fieldStyle.input}>
                <Dropdown
                    options={options}
                    mode="outlined"
                    value={props.todo.priority}
                    onSelect={v => updateTodo({ ...props.todo, priority: v as Priority })}
                    label={'Priority'}
                />
            </View>
            <View style={{ ...fieldStyle.input, flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                    status={isDue ? 'checked' : 'unchecked'}
                    // nem jól állít
                    onPress={() => { dueDateCheckboxHandler(isDue); }} />
                <Text>Has a due date</Text>
            </View>
            {
                isDue ? (
                    <View style={fieldStyle.input}>
                        <DatePickerInput
                            locale="en"
                            label="Due date"
                            value={props.todo.dueDate ? new Date(props.todo.dueDate) : new Date()}
                            onChange={(d) => { updateTodo({ ...props.todo, dueDate: d === undefined ? null : d.toISOString() }); }}
                            inputMode="start"
                            mode="outlined"
                            withDateFormatInLabel={false}
                            saveLabel="Save"
                        />
                    </View>
                ) : (
                    <></>
                )
            }
        </View>
    );
}

const options: Option[] = [
    {
        label: 'High',
        value: 'HIGH'
    },
    {
        label: 'Standard',
        value: 'STANDARD'
    },
    {
        label: 'Low',
        value: 'LOW'
    }
];

const fieldStyle = StyleSheet.create({
    input: {
        margin: 5
    }
});