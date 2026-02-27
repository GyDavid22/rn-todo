import { ToDoEntry, ToDoEntryDto } from "../data/model/ToDoEntry";
import { AsyncStorageRepo, IToDoRepo } from "../data/repo";

const REPO: IToDoRepo = await AsyncStorageRepo.getInstance();

export const addItem = async (t: ToDoEntryDto) => {
    await REPO.add(t);
};

export const updateItem = async (id: number, updated: ToDoEntryDto) => {
    await REPO.update(id, updated);
};

export const deleteItem = async (id: number) => {
    await REPO.delete(id);
};

export const getItem = async (id: number) => {
    return await REPO.get(id);
};

export const getAllItem = async () => {
    return await REPO.getAll();
};

export const toDto = (t: ToDoEntry) => {
    return {
        ...t
    } as ToDoEntryDto;
};

export const toggleCheckOff = async (id: number) => {
    const item = await REPO.get(id);
    item.isCheckedOff = !item.isCheckedOff;
    await REPO.update(id, toDto(item));
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