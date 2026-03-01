import { addItem, deleteItem, getDefaultItem, getItem, updateItem } from "@/business/business";
import EditorField from "@/components/EditorField";
import { ToDoEntryDto } from "@/data/model/ToDoEntry";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { BackHandler, ScrollView, View } from "react-native";
import { Appbar, Button, Dialog, Portal, Text, useTheme } from "react-native-paper";

export default function Index() {
    const theme = useTheme();
    const router = useRouter();
    const idRaw = useSearchParams().get('id');
    const id = idRaw ? parseInt(idRaw) : null;
    const isCreating = id === null;

    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [modalDescription, setModalDescription] = useState<string>('');
    const [modalOkAction, setModalOkAction] = useState<() => void>(() => { });
    const [todo, setTodo] = useState<ToDoEntryDto>(getDefaultItem());

    useEffect(() => {
        const subscription = BackHandler.addEventListener('hardwareBackPress', () => { backHandler(); return true; });
        if (!isCreating) {
            (async () => {
                setTodo(await getItem(id));
            })();
        }
        return () => subscription.remove();
    }, [id]);

    const activateModal = (title: string, description: string, okAction: () => void) => {
        setModalTitle(title);
        setModalDescription(description);
        setModalOkAction(() => okAction);
        setShowModal(true);
    };
    const dismissModal = () => setShowModal(false);

    const backHandler = () => {
        activateModal('Warning', 'Are you sure you want do dismiss the current changes?', exitScreen);
    };
    const deleteHandler = () => {
        activateModal('Warning', 'Are you sure you want to delete this item?', async () => { await deleteItem(id!); exitScreen(); });
    };
    const saveHandler = async () => {
        if (isCreating) {
            await addItem(todo);
        } else {
            await updateItem(id, todo);
        }
        exitScreen();
    };
    const exitScreen = () => {
        router.back();
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={backHandler} />
                <Appbar.Content title={isCreating ? 'Create' : 'Edit'} />
                {
                    isCreating ? (
                        <></>
                    ) : (
                        <Appbar.Action icon="delete" onPress={deleteHandler} />
                    )
                }
                <Appbar.Action icon="check" onPress={saveHandler} />
            </Appbar.Header>
            <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 16 }}>
                <EditorField todo={todo} onChange={t => setTodo(t)}></EditorField>
            </ScrollView>
            <Portal>
                <Dialog visible={showModal} onDismiss={dismissModal}>
                    <Dialog.Title>{modalTitle}</Dialog.Title>
                    <Dialog.Content>
                        <Text style={theme.fonts.bodyMedium}>{modalDescription}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={dismissModal}>Cancel</Button>
                        <Button onPress={modalOkAction}>Yes</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View >
    );
}