import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const Home = () => {
  // Mock data - This will be replaced with real Firebase data later
  const vehicleStats = {
    model: "BMW M4 Coupe",
    mileage: "12,450 km",
    totalSpent: "$2,850.00",
    lastService: "05 Jan 2026"
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" />
      <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
        
        {/* Top Header Section */}
        <View className="flex-row justify-between items-center mb-8 mt-2">
          <View>
            <Text className="text-slate-500 text-lg font-medium">Hello, Driver!</Text>
            <Text className="text-white text-3xl font-bold">{vehicleStats.model}</Text>
          </View>
          <TouchableOpacity className="bg-[#1E1E1E] p-3 rounded-2xl border border-white/5">
            <Ionicons name="notifications-outline" size={24} color="#FACC15" />
          </TouchableOpacity>
        </View>

        {/* Stats Grid - Two Cards Side-by-Side */}
        <View className="flex-row justify-between gap-x-4 mb-6">
          {/* Mileage Card */}
          <View className="flex-1 bg-[#1E1E1E] p-6 rounded-[30px] border border-white/5">
            <View className="bg-[#FACC15]/10 w-10 h-10 rounded-full items-center justify-center mb-4">
              <MaterialIcons name="speed" size={22} color="#FACC15" />
            </View>
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">Odometer</Text>
            <Text className="text-white text-xl font-bold mt-1">{vehicleStats.mileage}</Text>
          </View>

          {/* Expenses Card */}
          <View className="flex-1 bg-[#1E1E1E] p-6 rounded-[30px] border border-white/5">
            <View className="bg-green-500/10 w-10 h-10 rounded-full items-center justify-center mb-4">
              <Ionicons name="card-outline" size={22} color="#4ade80" />
            </View>
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">Expenses</Text>
            <Text className="text-white text-xl font-bold mt-1">{vehicleStats.totalSpent}</Text>
          </View>
        </View>

        {/* Large Service Reminder - Yellow Accent */}
        <View className="bg-[#FACC15] p-6 rounded-[35px] mb-8 shadow-lg shadow-yellow-500/20">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-black/50 font-bold uppercase text-[10px] tracking-[2px]">Next Maintenance Due</Text>
              <Text className="text-black text-2xl font-black mt-1">15,000 km</Text>
            </View>
            <View className="bg-black/10 p-2 rounded-full">
              <Ionicons name="build-outline" size={24} color="black" />
            </View>
          </View>
          
          <View className="h-[1px] bg-black/10 my-4" />
          
          <View className="flex-row justify-between items-center">
             <Text className="text-black/70 font-medium">Last: {vehicleStats.lastService}</Text>
             <TouchableOpacity className="bg-black px-5 py-2 rounded-full">
                <Text className="text-white font-bold text-xs uppercase">Book Now</Text>
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
          
          {/* Activity Row 1 */}
          <View className="bg-[#1E1E1E] p-4 rounded-3xl flex-row items-center mb-4 border border-white/5">
            <View className="bg-blue-500/20 p-3 rounded-2xl mr-4">
              <MaterialIcons name="local-gas-station" size={20} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-base">Full Tank Refill</Text>
              <Text className="text-slate-500 text-xs">Yesterday • Shell Station</Text>
            </View>
            <Text className="text-white font-bold text-lg">$64.00</Text>
          </View>

          {/* Activity Row 2 */}
          <View className="bg-[#1E1E1E] p-4 rounded-3xl flex-row items-center mb-4 border border-white/5">
            <View className="bg-purple-500/20 p-3 rounded-2xl mr-4">
              <MaterialIcons name="wash" size={20} color="#a855f7" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-base">Exterior Wash</Text>
              <Text className="text-slate-500 text-xs">03 Jan • AutoSpa</Text>
            </View>
            <Text className="text-white font-bold text-lg">$25.00</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;