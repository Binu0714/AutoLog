import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "@/services/firebase";

interface AuthContextType {
    user : User | null
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
})

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (usr) => {
            setUser(usr);
        })
        // cleanup function
        return () => unsubscribe();
    }, [])

    return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>
}