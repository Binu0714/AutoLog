import { getAuth } from "firebase/auth";
import { addDoc, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

const auth = getAuth();
const vehiclesCollection = collection(db, "vehicles");

export const addVehicle = async (
    type: string,
    name: string,
    plate: string,
    odo: number,
    nextService: number
) => {
    const user = auth.currentUser;

    if (!user) return;

    await addDoc(vehiclesCollection, {
        type,
        name,
        plate,
        odo,
        nextService,
        userId: user.uid,
        createdAt: new Date().toISOString()
    });
};

export const getVehicleDetails = async () => {
    const user = auth.currentUser;

    if (!user) return null;

    const q = query(
        vehiclesCollection,
        where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return null;
    }

    const vehicles = snapshot.docs.map((doc) => {
        const data = doc.data();
        return{
            id: doc.id,
            type: data.type,
            name: data.name,
            plate: data.plate,
            odo: data.odo,
            nextService: data.nextService,
            createdAt: data.createdAt
        };
    });

    return vehicles[0]
}

export const updateVehicle = async (docId: string, name:string, plate:string, odo:number) => {
    try{
        const vehicleRef = doc(db, "vehicles", docId);
        await updateDoc(vehicleRef, {
            name,
            plate,
            odo: Number(odo)
        });
    }catch(error){
        console.error("Error updating vehicle",error)
    }
}