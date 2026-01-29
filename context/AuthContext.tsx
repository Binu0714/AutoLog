import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { useLoader } from "@/hooks/useLoader";
import { auth } from "@/services/firebase";

interface AuthContextType {
    user : User | null
    loading: boolean
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false
})

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const {showLoader, hideLoader, isLoading } = useLoader()
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        showLoader();
        const unsubscribe = onAuthStateChanged(auth, (usr) => {
            setUser(usr);
            hideLoader();
        })
        // cleanup function
        return () => unsubscribe();
    }, [])

    return <AuthContext.Provider value={{user, loading: isLoading}}>{children}</AuthContext.Provider>
}