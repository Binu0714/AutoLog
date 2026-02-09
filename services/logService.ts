import { getAuth } from "firebase/auth";
import { addDoc, collection, orderBy, query, where, getDocs, doc, limit } from "firebase/firestore";
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

export const getTotalSpent = async (vehicleId: string) => {
    const user = auth.currentUser;

    if (!user || !vehicleId) return 0;

    const q = query(
        collection(db, "logs"),
        where("vehicleId", "==", vehicleId),
    );

    const snapshot = await getDocs(q);

    const total = snapshot.docs.reduce((sum, doc) => {
        const data = doc.data();
        return sum + (Number(data.cost) || 0);
    },0);

    return total;
}

export const getRecentLogs = async (vehiclid: string) => {
    if (!vehiclid) return [];

    const logsCollection = collection(db, "logs");

    const q = query(
        logsCollection,
        where("vehicleId", "==", vehiclid),
        orderBy("createdAt", "desc"),
        limit(2)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}