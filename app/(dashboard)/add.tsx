import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, TextInput, 
  ScrollView, KeyboardAvoidingView, Platform, StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useAlert } from '@/context/alertContext';
import { addLog } from '@/services/logService';
import { useLoader } from '@/hooks/useLoader';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddLog() {
  const [logType, setLogType] = useState<'fuel' | 'service'>('fuel');
  const router = useRouter();
  
  const [cost, setCost] = useState('');
  const [odo, setOdo] = useState('');
  const [liters, setLiters] = useState(''); 
  const [serviceCategory, setServiceCategory] = useState(''); 
  const [notes, setNotes] = useState('');

  const { showAlert } = useAlert();
  const { showLoader, hideLoader } = useLoader();

  const handleSave = async () => {

    const activeVehicleId = await AsyncStorage.getItem('activeVehicleId');

    if (!activeVehicleId) {
        showAlert("Error", "Please select a vehicle in Profile first.", "error");
        return;
    }

    if(!cost || !odo){
      showAlert("Wait!", "Please fill in the required fields: Cost and Odometer.");
      return;
    }

    if(logType === 'fuel' && !liters){
      showAlert("Wait!", "Please enter the fuel quantity in liters.");
      return;
    }

    if(logType === 'service' && !serviceCategory){
      showAlert("Wait!", "Please specify the service category.");
      return;
    }

    showLoader();

    try{
      const logData = {
        type: logType,
        cost: parseFloat(cost),
        odo: parseInt(odo),
        notes: notes,
        ...(logType === 'fuel' ? {liters: parseFloat(liters)} : {serviceCategory: serviceCategory})
      };

      await addLog(logData, activeVehicleId);

      showAlert("Success!", `${logType === 'fuel' ? 'Fuel' : 'Service'} log added successfully.`,"success");

      setCost('');
      setOdo('');
      setLiters('');
      setServiceCategory('');
      setNotes('');

    }catch(error){
      showAlert("Error", "Failed to save log. Please try again.");
      console.log("Add Log Error: ", error);
    }finally{
      hideLoader();
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
          
          <View className="mt-8 mb-8 flex-row justify-between items-center">
          <View>
            <Text className="text-white text-4xl font-bold tracking-tight">Add Log</Text>
            <Text className="text-slate-500 text-lg font-medium">Keep records updated.</Text>
          </View>
          
          {/* NEW VIEW LOGS BUTTON */}
          <TouchableOpacity 
            onPress={() => router.push('/(dashboard)/viewLogs')}
            className="bg-[#1E1E1E] p-3 rounded-2xl border border-white/5"
          >
            <MaterialCommunityIcons name="history" size={24} color="#FACC15" />
          </TouchableOpacity>
        </View>

          

          {/* 1. CUSTOM TOGGLE (Segmented Control) */}
          <View className="flex-row bg-[#1E1E1E] p-1.5 rounded-[25px] mb-10 border border-white/5">
            <TouchableOpacity 
              onPress={() => setLogType('fuel')}
              className={`flex-1 py-4 rounded-[20px] flex-row justify-center items-center ${logType === 'fuel' ? 'bg-[#FACC15]' : ''}`}
            >
              <MaterialCommunityIcons name="gas-station" size={20} color={logType === 'fuel' ? 'black' : '#64748b'} />
              <Text className={`ml-2 font-bold uppercase tracking-wider ${logType === 'fuel' ? 'text-black' : 'text-slate-500'}`}>Fuel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setLogType('service')}
              className={`flex-1 py-4 rounded-[20px] flex-row justify-center items-center ${logType === 'service' ? 'bg-[#FACC15]' : ''}`}
            >
              <MaterialCommunityIcons name="wrench" size={18} color={logType === 'service' ? 'black' : '#64748b'} />
              <Text className={`ml-2 font-bold uppercase tracking-wider ${logType === 'service' ? 'text-black' : 'text-slate-500'}`}>Service</Text>
            </TouchableOpacity>
          </View>

          {/* 2. DYNAMIC FORM CARD */}
          <View className="bg-[#1E1E1E] rounded-[35px] p-6 border border-white/5 mb-10">
            
            {/* COMMON FIELD: Cost */}
            <View className="mb-6">
                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[2px] mb-2 ml-1">Total Cost (RS)</Text>
                <TextInput
                    placeholder="0.00"
                    placeholderTextColor="#4b5563"
                    keyboardType="numeric"
                    value={cost}
                    onChangeText={setCost}
                    className="bg-[#121212] p-5 rounded-2xl text-white border border-white/5 font-bold text-xl"
                />
            </View>

            {/* COMMON FIELD: Odometer */}
            <View className="mb-6">
                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[2px] mb-2 ml-1">Current Odometer (km)</Text>
                <TextInput
                    placeholder="e.g. 12500"
                    placeholderTextColor="#4b5563"
                    keyboardType="numeric"
                    value={odo}
                    onChangeText={setOdo}
                    className="bg-[#121212] p-5 rounded-2xl text-white border border-white/5 font-semibold"
                />
            </View>

            {/* DYNAMIC FIELD: Liters (Only for Fuel) */}
            {logType === 'fuel' && (
                <View className="mb-6 animate-fade-in">
                    <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[2px] mb-2 ml-1">Fuel Quantity (Liters)</Text>
                    <TextInput
                        placeholder="0.0"
                        placeholderTextColor="#4b5563"
                        keyboardType="numeric"
                        value={liters}
                        onChangeText={setLiters}
                        className="bg-[#121212] p-5 rounded-2xl text-white border border-white/5 font-semibold"
                    />
                </View>
            )}

            {/* DYNAMIC FIELD: Service Selection (Only for Service) */}
            {logType === 'service' && (
                <View className="mb-6">
                    <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[2px] mb-2 ml-1">Service Category</Text>
                    <TextInput
                        placeholder="e.g. Oil Change"
                        placeholderTextColor="#4b5563"
                        keyboardType="default"
                        value={serviceCategory}
                        onChangeText={setServiceCategory}
                        className="bg-[#121212] p-5 rounded-2xl text-white border border-white/5 font-semibold"
                    />
                </View>
            )}

            {/* NOTES FIELD */}
            <View>
                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[2px] mb-2 ml-1">Notes / Station Name</Text>
                <TextInput
                    placeholder="Add details here..."
                    placeholderTextColor="#4b5563"
                    multiline
                    value={notes}
                    onChangeText={setNotes}
                    className="bg-[#121212] p-5 rounded-2xl text-white border border-white/5 font-medium h-24"
                    textAlignVertical="top"
                />
            </View>
          </View>

          {/* 3. SAVE BUTTON */}
          <TouchableOpacity 
            onPress={handleSave}
            activeOpacity={0.8}
            className="bg-[#FACC15] py-6 rounded-[25px] items-center mb-20 shadow-xl shadow-yellow-500/20"
          >
            <View className="flex-row items-center">
                <Text className="text-black font-black text-lg uppercase tracking-widest mr-2">Save {logType} Log</Text>
                <Ionicons name="arrow-forward" size={20} color="black" />
            </View>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}