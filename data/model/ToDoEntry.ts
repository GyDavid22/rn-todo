export type Priority = 'LOW' | 'STANDARD' | 'HIGH';

/**
 * Interface to represent a ToDo Entry
 */
export interface ToDoEntry {
    uniqueId: number,
    title: string,
    description: string | null,
    priority: Priority,
    dueDate: string | null,
    isCheckedOff: boolean;
}

/**
 * Has all fields except uniqueId
 */
export type ToDoEntryDto = Omit<ToDoEntry, 'uniqueId'>;
