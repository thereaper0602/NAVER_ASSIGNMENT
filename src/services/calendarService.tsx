import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { CalendarEvent } from "../types/calendar";

const EVENTS_COLLECTION = "calendar_events";

export const getCalendarEvents = async (): Promise<CalendarEvent[]> => {
    const eventsQuery = query(
        collection(db, EVENTS_COLLECTION),
        orderBy('start', 'asc')
    );
    const snapshot = await getDocs(eventsQuery);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        start: new Date(doc.data().start),
        end: new Date(doc.data().end)
    })) as CalendarEvent[];
};

export const addCalendarEvent = async (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const now = Date.now();
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION),{
        ...event,
        start: event.start.getTime(),
        end: event.end.getTime(),
        createdAt: now,
        updatedAt: now
    });
    return docRef.id;
};

export const updateCalendarEvent = async (eventId: string, data: Partial<Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
    const updateData: any = {
        ...data,
        updatedAt: Date.now()
    };

    if (data.start){
        updateData.start = data.start.getTime();
    }
    if(data.end){
        updateData.end = data.end.getTime();
    }

    await updateDoc(doc(db, EVENTS_COLLECTION, eventId), updateData);
};

export const deleteCalendarEvent = async (eventId : string): Promise<void> => {
    await deleteDoc(doc(db, EVENTS_COLLECTION, eventId));
}