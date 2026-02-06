import { getAuth } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";

const auth = getAuth();
const logCollection = collection(db, "logs");

export const addLog = async (logData:{
    type: 'fuel' | 'service',
    cost: number,
    odo: number,
    liters?: number,
    serviceCategory?: string,
    notes?: string
}) => {
    const user = auth.currentUser;

    if (!user) return;

    await addDoc(logCollection, {
        ...logData,
        userId: user.uid,
        createdAt: new Date().toISOString()
    });
};