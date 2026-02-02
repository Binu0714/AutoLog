import { View } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LoaderProvider } from '@/context/LoaderContext'
import { AuthProvider } from '@/context/AuthContext'
import { AlertProvider } from '@/context/alertContext'

const RootLayout = () => {

    const insets = useSafeAreaInsets()

    console.log(insets)

  return (
    <LoaderProvider>
      <AlertProvider>
      <AuthProvider>
        <View style={{flex: 1}}>
             <Slot />
        </View>
      </AuthProvider>
      </AlertProvider>
    </LoaderProvider>
  )
}

export default RootLayout