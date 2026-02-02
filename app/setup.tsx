import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const vehicleTypes = [
  { id: 'car', label: 'Car', icon: 'car' },
  { id: 'bike', label: 'Bike', icon: 'motorcycle' },
  { id: 'van', label: 'Van', icon: 'shuttle-van' },
  { id: 'lorry', label: 'Lorry', icon: 'truck' },
];

export default function VehicleSetup() {
  const [selectedType, setSelectedType] = useState('car');
  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');
  const [odo, setOdo] = useState('');
  const [nextService, setNextService] = useState('');
  
  const router = useRouter();

  const handleFinish = () => {
    if (!name || !plate || !odo || !nextService) {
      Alert.alert("Wait!", "Please fill in all details to finalize your profile.");
      return;
    }
    // Logic to save to Firestore will go here
    router.replace('/(dashboard)/home'); 
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ScrollView className="px-8 pt-6" showsVerticalScrollIndicator={false}>
          
          <Text className="text-white text-4xl font-extrabold tracking-tight">Setup Your Ride</Text>
          <Text className="text-slate-500 text-lg mt-2 mb-8">Let's get your vehicle ready.</Text>

          <View className="flex-row flex-wrap justify-between">
            {vehicleTypes.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedType(item.id)}
                activeOpacity={0.7}
                className={`w-[47%] p-8 rounded-[35px] mb-5 items-center border ${
                  selectedType === item.id ? 'bg-[#FACC15] border-[#FACC15]' : 'bg-[#1E1E1E] border-white/5'
                }`}
              >
                <FontAwesome5 
                  name={item.icon} 
                  size={32} 
                  color={selectedType === item.id ? 'black' : 'white'} 
                />
                <Text className={`mt-3 font-bold ${selectedType === item.id ? 'text-black' : 'text-white'}`}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 2. Form Inputs */}
          <View className="mt-4 gap-y-5">
            <View>
              <Text className="text-slate-400 mb-2 ml-1 uppercase text-[10px] font-bold tracking-widest">Vehicle Name</Text>
              <TextInput
                placeholder="e.g. Toyota Corolla"
                placeholderTextColor="#4b5563"
                value={name}
                onChangeText={setName}
                className="bg-[#1E1E1E] p-5 rounded-2xl text-white border border-white/5 focus:border-[#FACC15]"
              />
            </View>

            <View>
              <Text className="text-slate-400 mb-2 ml-1 uppercase text-[10px] font-bold tracking-widest">Plate Number</Text>
              <TextInput
                placeholder="CAS-XXXX"
                placeholderTextColor="#4b5563"
                value={plate}
                onChangeText={setPlate}
                className="bg-[#1E1E1E] p-5 rounded-2xl text-white border border-white/5 focus:border-[#FACC15]"
              />
            </View>

            {/* Odometer Row */}
            <View className="flex-row justify-between">
              <View className="w-[48%]">
                <Text className="text-slate-400 mb-2 ml-1 uppercase text-[10px] font-bold tracking-widest">Current OdoMeter</Text>
                <TextInput
                  placeholder="Km"
                  placeholderTextColor="#4b5563"
                  value={odo}
                  onChangeText={setOdo}
                  keyboardType="numeric"
                  className="bg-[#1E1E1E] p-5 rounded-2xl text-white border border-white/5 focus:border-[#FACC15]"
                />
              </View>
              <View className="w-[48%]">
                <Text className="text-slate-400 mb-2 ml-1 uppercase text-[10px] font-bold tracking-widest">Next Service At</Text>
                <TextInput
                  placeholder="Km"
                  placeholderTextColor="#4b5563"
                  value={nextService}
                  onChangeText={setNextService}
                  keyboardType="numeric"
                  className="bg-[#1E1E1E] p-5 rounded-2xl text-[#FACC15] border border-white/5 focus:border-[#FACC15] font-bold"
                />
              </View>
            </View>
          </View>

          {/* 3. Action Button */}
          <TouchableOpacity 
            onPress={handleFinish}
            activeOpacity={0.8}
            className="bg-[#FACC15] py-5 rounded-full items-center mt-12 mb-20 shadow-xl shadow-yellow-500/20"
          >
            <View className="flex-row items-center">
              <Text className="text-black font-black text-lg uppercase tracking-wider">Finish Setup</Text>
              <Ionicons name="chevron-forward" size={20} color="black" style={{ marginLeft: 8 }} />
            </View>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}