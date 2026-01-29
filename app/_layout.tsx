import { View } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LoaderProvider } from '@/context/LoaderContext'
import { AuthProvider } from '@/context/AuthContext'

const RootLayout = () => {

    const insets = useSafeAreaInsets()

    console.log(insets)

  return (
    // <SafeAreaView className='flex-1'>
    <LoaderProvider>
      <AuthProvider>
        <View style={{flex: 1}}>
             <Slot />
        </View>
      </AuthProvider>
    </LoaderProvider>
    // </SafeAreaView>
  )
}

export default RootLayout