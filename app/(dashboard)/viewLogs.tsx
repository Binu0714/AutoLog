import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLogsByVehicle } from '@/services/logService';

export default function ViewLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchLogs();
    }, [])
  );

  const fetchLogs = async () => {
    setLoading(true);
    const activeId = await AsyncStorage.getItem('activeVehicleId');
    if (activeId) {
      const data = await getLogsByVehicle(activeId);
      setLogs(data);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" />
      <View className="px-6 py-4 mt-8 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#FACC15" />
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold">Activity Logs</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FACC15" className="mt-20" />
      ) : (
        <ScrollView className="px-6 mt-4" showsVerticalScrollIndicator={false}>
          {logs.map((log) => (
            <View key={log.id} className="bg-[#1E1E1E] p-5 rounded-[30px] border border-white/5 mb-4 flex-row items-center">
              <View className={`p-3 rounded-2xl mr-4 ${log.type === 'fuel' ? 'bg-blue-500/10' : 'bg-[#FACC15]/10'}`}>
                <MaterialCommunityIcons 
                  name={log.type === 'fuel' ? "gas-station" : "wrench"} 
                  size={24} 
                  color={log.type === 'fuel' ? "#3b82f6" : "#FACC15"} 
                />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-lg">
                  {log.type === 'fuel' ? 'Fuel Refill' : log.serviceCategory}
                </Text>
                <Text className="text-slate-500 text-xs">
                  {new Date(log.createdAt).toLocaleDateString()} • {log.odo} km
                </Text>
              </View>
              <Text className="text-white font-black text-base">LKR {log.cost}</Text>
            </View>
          ))}
          
          {logs.length === 0 && (
            <Text className="text-slate-500 text-center mt-20">No records found for this vehicle.</Text>
          )}
          <View className="h-20" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}