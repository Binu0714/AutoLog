import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { getVehicleDetails } from '@/services/vehicleService';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTotalSpent } from '@/services/logService';

const Home = () => {
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const allVehicles = await getVehicleDetails();

      if (allVehicles.length === 0){
        setVehicle(null);
        setIsLoading(false);
        return;
      }

      const activeId = await AsyncStorage.getItem('activeVehicleId');

      const currentVehicle = allVehicles.find(v => v.id === activeId) || allVehicles[0];

      setVehicle(currentVehicle);

      if(currentVehicle?.id){
        const costSum = await getTotalSpent(currentVehicle.id);
        setTotalSpent(costSum);
      }

    }catch(error){
      console.error("Error fetching vehicle details", error);
    }finally{
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#121212] justify-center items-center">
        <ActivityIndicator size="large" color="#FACC15" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" />
      <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
       
        {/* Header Section with Highlighted Name and Gap */}
        <View className="flex-row justify-between items-center mb-8 mt-2">
          <View>
            <Text className="text-slate-500 text-lg font-medium mb-2">
                Hello, <Text className="text-[#FACC15] font-bold">{user?.displayName || 'Driver'}</Text>!
            </Text>
           
            <Text className="text-white text-3xl font-extrabold tracking-tight">
                {vehicle?.name || "No Vehicle"}
            </Text>
          </View>
          <TouchableOpacity className="bg-[#1E1E1E] p-3 rounded-2xl border border-white/5">
            <Ionicons name="notifications-outline" size={24} color="#FACC15" />
          </TouchableOpacity>
        </View>

       
        {/* Stats Grid - Centered Content */}
        <View className="flex-row justify-between gap-x-4 mb-6">
        
          {/* Odometer Card */}
          <View className="flex-1 bg-[#1E1E1E] p-6 rounded-[30px] border border-white/5 items-center">
            <View className="bg-[#FACC15]/10 w-12 h-12 rounded-full items-center justify-center mb-4">
              <MaterialIcons name="speed" size={24} color="#FACC15" />
            </View>
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center">Odometer</Text>
            <Text className="text-white text-xl font-bold mt-1 text-center">
                {vehicle?.odo ? vehicle.odo.toLocaleString() : '0'} km
            </Text>
          </View>

          {/* Plate No Card */}
          <View className="flex-1 bg-[#1E1E1E] p-6 rounded-[30px] border border-white/5 items-center">

            <View className="bg-blue-500/10 w-12 h-12 rounded-full items-center justify-center mb-4">
              <Ionicons name="card-outline" size={24} color="#3b82f6" />
            </View>
            
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center">Plate No.</Text>
            <Text className="text-white text-xl font-bold mt-1 text-center">
                {vehicle?.plate || 'N/A'}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between gap-x-4 mb-6">
        {/* Fuel Economy Card */}
        <View className="flex-1 bg-[#1E1E1E] p-6 rounded-[30px] border border-white/5 items-center">

          <View className="bg-orange-500/10 w-12 h-12 rounded-full items-center justify-center mb-4">
            <MaterialIcons name="local-gas-station" size={24} color="#f97316" />
          </View>

          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center">Avg. Fuel</Text>
          <Text className="text-white text-xl font-bold mt-1 text-center">
           
            14.2 <Text className="text-xs text-slate-500">km/L</Text>
          </Text>

        </View>

        {/* Total Expense Card */}
        <View className="flex-1 bg-[#1E1E1E] p-6 rounded-[30px] border border-white/5 items-center">

          <View className="bg-emerald-500/10 w-12 h-12 rounded-full items-center justify-center mb-4">
            <Ionicons name="wallet-outline" size={24} color="#10b981" />
          </View>

          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center">Total Spent</Text>
  
          <Text className="text-white text-xl font-bold mt-1 text-center" numberOfLines={1}>
            <Text className="text-x text-slate-500 font-normal uppercase">LKR  </Text>
            {totalSpent > 100000 
              ? `${(totalSpent / 1000).toFixed(1)}k` 
              : totalSpent.toLocaleString()} 
          </Text>

        </View>
        
      </View>

        {/* Maintenance Card */}
        <View className="bg-[#FACC15] p-6 rounded-[35px] mb-8 shadow-lg shadow-yellow-500/20">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-black/50 font-bold uppercase text-[10px] tracking-[2px]">Next Maintenance Due</Text>
              <Text className="text-black text-2xl font-black mt-1">
                {vehicle?.nextService ? vehicle.nextService.toLocaleString() : '0'} km
              </Text>
            </View>
            <View className="bg-black/10 p-2 rounded-full">
              <Ionicons name="build-outline" size={24} color="black" />
            </View>
          </View>
          
          <View className="h-[1px] bg-black/10 my-4" />
          
          <View className="flex-row justify-between items-center">
             <Text className="text-black/70 font-medium">Type: {vehicle?.type?.toUpperCase() || 'UNKNOWN'}</Text>
             <TouchableOpacity className="bg-black px-5 py-2 rounded-full">
                <Text className="text-white font-bold text-xs uppercase">Check Now</Text>
             </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity Section */}
        <View className="mb-10">
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-white text-xl font-bold tracking-tight">Recent Activity</Text>
            <TouchableOpacity>
              <Text className="text-[#FACC15] font-bold">See All</Text>
            </TouchableOpacity>
          </View>
          
          <View className="bg-[#1E1E1E] p-8 rounded-3xl items-center border border-white/5">
            <Text className="text-slate-500 font-medium">No logs recorded yet.</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;