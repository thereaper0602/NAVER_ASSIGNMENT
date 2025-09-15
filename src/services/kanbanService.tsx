import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import type { Column, Task } from "../types/kanban";
import { db } from "./firebase";

const COLUMNS_COLLECTION = "columns";
const TASKS_COLLECTION = "tasks";

export const getColumns = async () : Promise<Column[]> => {
    const columnSnapshot = await getDocs(collection(db, COLUMNS_COLLECTION));
    const columns: Column[] = [];

    for (const columnDoc of columnSnapshot.docs){
        const columnData = columnDoc.data();
        const taskQuery = query(
            collection(db, TASKS_COLLECTION),
            where("columnId", "==", columnDoc.id),
            orderBy('createdAt')
        );

        const tasksSnapshot = await getDocs(taskQuery);
        const tasks = tasksSnapshot.docs.map(taskDoc => ({
            id: taskDoc.id,
            ...taskDoc.data()
        })) as Task[];

        columns.push({
            id: columnDoc.id,
            title: columnData.title,
            tasks
        });
    }
    return columns;
}

export const addColumn = async (title: string): Promise<string> => {
  const docRef = await addDoc(collection(db, COLUMNS_COLLECTION), {
    title
  });
  return docRef.id;
};

export const updateColumn = async (columnId: string, title: string): Promise<void> => {
  await updateDoc(doc(db, COLUMNS_COLLECTION, columnId), { title });
};

export const deleteColumn = async (columnId: string): Promise<void> => {
  // Delete all tasks in the column first
  const tasksQuery = query(
    collection(db, TASKS_COLLECTION),
    where('columnId', '==', columnId)
  );
  
  const tasksSnapshot = await getDocs(tasksQuery);
  const deletePromises = tasksSnapshot.docs.map(taskDoc => 
    deleteDoc(doc(db, TASKS_COLLECTION, taskDoc.id))
  );
  
  await Promise.all(deletePromises);
  
  // Then delete the column
  await deleteDoc(doc(db, COLUMNS_COLLECTION, columnId));
};

// Task operations
export const addTask = async (content: string, columnId: string): Promise<string> => {
  const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
    content,
    columnId,
    createdAt: Date.now()
  });
  return docRef.id;
};

export const updateTask = async (taskId: string, data: Partial<Task>): Promise<void> => {
  await updateDoc(doc(db, TASKS_COLLECTION, taskId), data);
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
};

export const moveTask = async (taskId: string, newColumnId: string): Promise<void> => {
  await updateDoc(doc(db, TASKS_COLLECTION, taskId), { columnId: newColumnId });
};