import { getAuth } from "firebase/auth";
import { addDoc, collection, deleteDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

const auth = getAuth();
const documentCollection = collection(db, "documents");

export const saveDocument = async (title: string, expiryDate: string, docId?: string) => {
    const user = auth.currentUser;

    if (!user) return;

    if (docId) {
        // update existing document

        const docRef = doc(db, "documents", docId);
        await updateDoc(docRef, {
            title,
            expiryDate
        });
    }else{
        // add new document

        await addDoc(documentCollection, {
            title,
            expiryDate,
            userId: user.uid,
            createdAt: new Date().toISOString()
        });
    }
}

export const getDocuments = async () => {
    const user = auth.currentUser;

    if (!user) return [];

    const q = query(documentCollection, where("userId", "==", user.uid));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

export const deleteDocument = async (docId: string) => {
    try{
        const docRef = doc(db, "documents", docId);
        await deleteDoc(docRef);
    }catch(error){
        console.log("Delete Document Error: ", error);
    }
}