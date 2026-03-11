import { getAllItems } from "@/business/business";
import CardItem from "@/components/CardItem";
import { ToDoEntry } from "@/data/model/ToDoEntry";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Appbar, FAB, Text, useTheme } from "react-native-paper";

export default function Index() {
    const router = useRouter();
    const theme = useTheme();

    const [items, setItems] = useState<ToDoEntry[]>([]);

    useFocusEffect(useCallback(() => {
        (async () => {
            setItems(await getAllItems());
        })();
    }, []));

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header>
                <Appbar.Content title="Productive Day!" />
            </Appbar.Header>
            <View style={{ flex: 1 }}>
                {
                    items.length > 0 ? (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            style={{ paddingHorizontal: 16 }}
                            data={items}
                            renderItem={t => (
                                <>
                                    {
                                        t.index === 0 ? (
                                            <View style={{ height: 2 }} /> // Or else the shadow on top is cut down
                                        ) : (
                                            <View style={{ height: 10 }} />
                                        )
                                    }
                                    <CardItem todo={t.item} key={t.item.uniqueId} />
                                    {
                                        t.index === items.length - 1 ? (
                                            <View style={{ height: 90 }} />
                                        ) : (
                                            <></>
                                        )
                                    }
                                </>
                            )} />
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontStyle: 'italic' }}>There are no items. Add your first one below!</Text>
                        </View>
                    )
                }
            </View>
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => router.navigate('/create-edit-screen')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});