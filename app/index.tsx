import "../global.css"
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter,Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { getVehicleDetails } from '@/services/vehicleService';
import { useLoader } from '@/hooks/useLoader';
import { useAlert } from '@/context/alertContext'

function WelcomeScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const { showAlert } = useAlert();

  useEffect(() => {
    const checkVehicleAndNavigate = async () => {
      if(!loading && user){
        showLoader();

        try{
          const vehicle = await getVehicleDetails();

          if(vehicle){
            router.replace('/(dashboard)/home');
          }else{
            router.replace('/setup');
          }
        }catch(error){
          console.log("Error fetching vehicle details: ", error);
          showAlert("Error", "There was an issue retrieving your vehicle details. Please try again.");
          router.replace('/setup');
        }finally{
          hideLoader();
        }
      }
    }
    checkVehicleAndNavigate();
  }, [user, loading]);

  if (loading) {
    return (
      <View className="flex-1 bg-[#121212] justify-center items-center">
        <ActivityIndicator size="large" color="#FACC15" />
      </View>
    );
  }
  
  return (
    <View className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" />
      
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop' }} 
        className="flex-1 justify-end"
        resizeMode="cover"
      >
       
        <View className="bg-black/40 absolute inset-0" />

        <SafeAreaView className="p-8 pb-12">
          
          {/* Logo Placeholder */}
          <View className="flex-row items-center mb-6">
            <View className="bg-[#FACC15] w-8 h-8 rounded-lg items-center justify-center mr-2">
              <Text className="font-bold text-black text-xs">AL</Text>
            </View>
            <Text className="text-white font-bold tracking-widest">AUTOLOG</Text>
          </View>

          {/* Heading */}
          <Text className="text-white text-5xl font-bold leading-[55px] mb-4">
            Track Your Ride.{"\n"}We've Got You Covered!
          </Text>

          {/* Subtext */}
          <Text className="text-slate-300 text-lg leading-7 mb-10">
            Whether it's a quick drive around the city or a weekend getaway, keep your vehicle data in perfect side for you.
          </Text>

          {/* Progress Indicators (Dots from the image) */}
          <View className="flex-row mb-10">
            <View className="h-1 w-8 bg-[#FACC15] rounded-full mr-2" />
            <View className="h-1 w-4 bg-white/30 rounded-full mr-2" />
            <View className="h-1 w-4 bg-white/30 rounded-full mr-2" />
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity 
            activeOpacity={0.9}
            className="bg-[#FACC15] py-5 rounded-full items-center mb-6"
            onPress={() => router.push('/register')}
          >
            <Text className="text-black font-extrabold text-lg">Get Started</Text>
          </TouchableOpacity>

          {/* Secondary Link */}
          <TouchableOpacity className="items-center" onPress={() => router.push('/login')}>
            <Text className="text-white/60 text-base">
              Already have an account? <Text className="text-[#FACC15] font-bold">Login</Text>
            </Text>
          </TouchableOpacity>

        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

export default WelcomeScreen;