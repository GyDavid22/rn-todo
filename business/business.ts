import { Priority, ToDoEntry, ToDoEntryDto } from "../data/model/ToDoEntry";
import { AsyncStorageRepo, IToDoRepo } from "../data/repo";

const PRIORITY_VALUES: { [x in Priority]: number } = {
    'LOW': 0,
    'STANDARD': 1,
    'HIGH': 2
};

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
    return (await (await getRepo()).getAll()).sort((a, b) => {
        if (a.isCheckedOff !== b.isCheckedOff) {
            return Number(a.isCheckedOff) - Number(b.isCheckedOff);
        }

        if (a.priority !== b.priority) {
            return PRIORITY_VALUES[b.priority] - PRIORITY_VALUES[a.priority];
        }

        if (a.dueDate === null && b.dueDate !== null) {
            return 1;
        }
        if (b.dueDate === null && a.dueDate !== null) {
            return -1;
        }
        if (a.dueDate !== b.dueDate) {
            return a.dueDate!.localeCompare(b.dueDate!);
        }

        return a.uniqueId - b.uniqueId;
    });
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