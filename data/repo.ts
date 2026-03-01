import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToDoEntry, ToDoEntryDto } from "./model/ToDoEntry";

/**
 * Base interface of any repository implementations
 */
export interface IToDoRepo {
    /**
     * Adds a new ToDoEntry to the repository
     * @param t Dto object to store
     * @returns The ID of the new entry
     */
    add(t: ToDoEntryDto): Promise<number>;

    /**
     * Updates an existing entry
     * @param id ID of the object to update
     * @param updated Updated dto object
     * @throws NotFoundError if not found
     */
    update(id: number, updated: ToDoEntryDto): Promise<void>;

    /**
     * Returns a deep copy of a single ToDoEntry
     * @param id ID of the object to get
     * @throws NotFoundError if not found
     * @returns The found ToDoEntry
     */
    get(id: number): Promise<ToDoEntry>;

    /**
     * Returns a deep copy of all stored ToDoEntries
     * @returns All ToDoEntries
     */
    getAll(): Promise<ToDoEntry[]>;

    /**
     * Deletes a single ToDoEntry
     * @param id ID of the object to delete
     * @throws NotFoundError if not found
     */
    delete(id: number): Promise<void>;
}

class NotFoundError extends Error {
    constructor() {
        super('Element not found');
    }
}

const ITEMS_KEY = 'TODO_ITEMS';
const ID_KEY = 'NEXT_ID';

/**
 * Implementation of the interface using AsyncStorage
 */
export class AsyncStorageRepo implements IToDoRepo {
    private static _instance: AsyncStorageRepo | undefined;

    private items: ToDoEntry[] = [];
    private nextId: number = 0;

    private constructor() { }

    private async init() {
        const items = await AsyncStorage.getItem(ITEMS_KEY);
        if (items) {
            this.items = JSON.parse(items);
        }
        const nextId = await AsyncStorage.getItem(ID_KEY);
        if (nextId) {
            this.nextId = JSON.parse(nextId);
        }
    }

    static async getInstance() {
        if (!AsyncStorageRepo._instance) {
            AsyncStorageRepo._instance = new AsyncStorageRepo();
            await AsyncStorageRepo._instance.init();
        }
        return AsyncStorageRepo._instance;
    }

    async add(t: ToDoEntryDto): Promise<number> {
        const newId = this.nextId++;

        this.items.push({
            uniqueId: newId,
            ...t
        });

        await this.saveState();
        return newId;
    }

    async update(id: number, updated: ToDoEntryDto): Promise<void> {
        const index = this.items.findIndex(t => t.uniqueId === id);
        if (index === -1) {
            throw new NotFoundError();
        }

        this.items[index] = {
            ...this.items[index],
            ...updated
        };
        await this.saveState();
    }

    async get(id: number): Promise<ToDoEntry> {
        const item = this.items.find(t => t.uniqueId === id);
        if (!item) {
            throw new NotFoundError();
        }

        return {
            ...item
        };
    }

    async getAll(): Promise<ToDoEntry[]> {
        return this.items.map(t => ({ ...t }));
    }

    async delete(id: number): Promise<void> {
        const index = this.items.findIndex(t => t.uniqueId === id);
        if (index === -1) {
            throw new NotFoundError();
        }

        this.items.splice(index, 1);
        await this.saveState();
    }

    private async saveState() {
        await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(this.items));
        await AsyncStorage.setItem(ID_KEY, JSON.stringify(this.nextId));
    }
}