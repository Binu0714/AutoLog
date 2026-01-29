// context/LoaderContext.tsx
import React, { createContext, useState, ReactNode, useContext } from "react"
import { View, ActivityIndicator } from "react-native"

interface LoaderContextProps {
  showLoader: () => void
  hideLoader: () => void
  isLoading: boolean
}

export const LoaderContext = createContext<LoaderContextProps>({
  showLoader: () => {},
  hideLoader: () => {},
  isLoading: false
})

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false)

  const showLoader = () => setIsLoading(true)
  const hideLoader = () => setIsLoading(false)

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, isLoading }}>
      {children}

      {/* --- CUSTOM DARK & YELLOW LOADER --- */}
      {isLoading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-black/80 z-50">
          <View className="bg-[#1E1E1E] p-10 rounded-[30px] items-center border border-white/10 shadow-2xl">
            
            {/* The Spinner - Uses your brand Yellow */}
            <ActivityIndicator size="large" color="#FACC15" />
            
          </View>
        </View>
      )}
    </LoaderContext.Provider>
  )
}
