import { getAuth } from "firebase/auth";
import { addDoc, collection, orderBy, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const auth = getAuth();
const logCollection = collection(db, "logs");

export const addLog = async (logData: any, vehicleId: string) => {
    const user = auth.currentUser;

    if (!user || !vehicleId) return;

    await addDoc(logCollection, {
        ...logData,
        vehicleId,
        userId: user.uid,
        createdAt: new Date().toISOString()
    });
};

export const getLogsByVehicle = async (vehicleId: string) => {
    const user = auth.currentUser;

    if (!user || !vehicleId) return [];

    const q = query(
        logCollection,
        where("vehicleId", "==", vehicleId),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}