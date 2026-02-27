import { ToDoEntry, ToDoEntryDto } from "../data/model/ToDoEntry";
import { AsyncStorageRepo, IToDoRepo } from "../data/repo";

const getRepo = async (): Promise<IToDoRepo> => {
    return AsyncStorageRepo.getInstance();
};

export const addItem = async (t: ToDoEntryDto) => {
    await (await getRepo()).add(t);
};

export const updateItem = async (id: number, updated: ToDoEntryDto) => {
    await (await getRepo()).update(id, updated);
};

export const deleteItem = async (id: number) => {
    await (await getRepo()).delete(id);
};

export const getItem = async (id: number) => {
    return (await getRepo()).get(id);
};

export const getAllItems = async () => {
    return (await getRepo()).getAll();
};

export const toDto = (t: ToDoEntry) => {
    return {
        ...t
    } as ToDoEntryDto;
};

export const toggleCheckOff = async (id: number) => {
    const item = await (await getRepo()).get(id);
    item.isCheckedOff = !item.isCheckedOff;
    await (await getRepo()).update(id, toDto(item));
};

export const getDefaultItem = (): ToDoEntryDto => {
    return {
        title: '',
        description: null,
        priority: 'STANDARD',
        dueDate: null,
        isCheckedOff: false
    };
};