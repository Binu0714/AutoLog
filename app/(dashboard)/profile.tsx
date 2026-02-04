import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  TextInput, Modal, StatusBar, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/context/alertContext'; 
import { useLoader } from '@/hooks/useLoader';
import { getVehicleDetails } from '@/services/vehicleService';
import { auth } from '@/services/firebase';

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { showLoader, hideLoader } = useLoader();

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  
  const [userName, setUserName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [vName, setVName] = useState('');
  const [vPlate, setVPlate] = useState('');
  const [vOdo, setVOdo] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const data = await getVehicleDetails();
    if (data) setVehicles([data]);
  };

  const handleUpdateUser = () => {
    showLoader();
    setTimeout(() => {
      hideLoader();
      setUserModalVisible(false);
      showAlert("Success", "Profile updated.", "success");
    }, 1000);
  };

  const saveVehicleChanges = () => {
    showLoader();
    setTimeout(() => {
      hideLoader();
      setVehicleModalVisible(false);
      showAlert("Success", "Vehicle details updated.", "success");
    }, 1000);
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" />
      <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
        
        {/* --- 1. USER PROFILE HEADER --- */}
        <View className="bg-[#1E1E1E] p-8 rounded-[40px] border border-white/5 items-center mt-6 mb-8">
          <View className="w-24 h-24 bg-[#121212] rounded-full items-center justify-center border-4 border-[#FACC15] mb-4">
             <Text className="text-[#FACC15] text-4xl font-black">
                {user?.displayName?.charAt(0) || 'D'}
             </Text>
          </View>
          <Text className="text-white text-2xl font-bold">{user?.displayName || 'Driver'}</Text>
          <Text className="text-slate-500 mb-6 font-medium">{user?.email}</Text>
          
          <TouchableOpacity 
            onPress={() => setUserModalVisible(true)}
            className="bg-[#FACC15] px-8 py-3 rounded-full"
          >
            <Text className="text-black font-black text-xs uppercase tracking-widest">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* --- 2. GARAGE INSIGHTS --- */}
        <View className="flex-row justify-between mb-10">
            <View className="bg-[#1E1E1E] w-[48%] p-6 rounded-[35px] border border-white/5 items-center">
                <Text className="text-[#FACC15] text-2xl font-black">{vehicles.length}</Text>
                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-1">Vehicles</Text>
            </View>
            <View className="bg-[#1E1E1E] w-[48%] p-6 rounded-[35px] border border-white/5 items-center">
                <Text className="text-green-500 text-2xl font-black">Active</Text>
                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-1">Status</Text>
            </View>
        </View>

        {/* --- 3. MY GARAGE --- */}
        <View className="mb-10">
          <Text className="text-slate-400 text-xs font-black uppercase tracking-[3px] mb-6 ml-2">My Garage</Text>
          
          {vehicles.map((veh) => (
            <TouchableOpacity 
              key={veh.id}
              onPress={() => {
                setSelectedVehicle(veh);
                setVName(veh.name);
                setVPlate(veh.plate);
                setVOdo(veh.odo.toString());
                setVehicleModalVisible(true);
              }}
              className="bg-[#1E1E1E] p-6 rounded-[35px] border border-white/5 mb-5 flex-row items-center justify-between shadow-sm"
            >
              <View className="flex-row items-center">
                <View className="bg-[#121212] p-4 rounded-2xl mr-4">
                  <FontAwesome5 name={veh.type === 'bike' ? 'motorcycle' : 'car'} size={24} color="#FACC15" />
                </View>
                <View>
                  <Text className="text-white font-bold text-lg">{veh.name}</Text>
                  <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest">{veh.plate}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#334155" />
            </TouchableOpacity>
          ))}

          {/* ADD NEW VEHICLE BUTTON (Placed below current vehicles) */}
          <TouchableOpacity 
            onPress={() => router.push('/setup')}
            className="border-2 border-dashed border-white/10 p-8 rounded-[35px] items-center flex-row justify-center mt-2"
          >
            <Ionicons name="add-circle-outline" size={28} color="#FACC15" />
            <View className="ml-3">
                <Text className="text-[#FACC15] font-black uppercase tracking-widest text-xs">Add New Vehicle</Text>
                <Text className="text-slate-600 text-[10px] font-medium">Expand your digital garage</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* --- 4. LOGOUT --- */}
        <View className="mb-20">
          <TouchableOpacity 
            onPress={handleLogout}
            className="bg-red-500/10 p-6 rounded-[30px] border border-red-500/20 flex-row items-center justify-center"
          >
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            <Text className="text-red-500 font-black ml-3 text-lg uppercase tracking-widest">Sign Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* --- MODAL: EDIT USER --- */}
      <Modal visible={userModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/80">
          <View className="bg-[#1E1E1E] rounded-t-[45px] p-10 border-t border-white/10">
            <Text className="text-white text-2xl font-black mb-8 uppercase tracking-widest text-center">Update Profile</Text>
            <TextInput 
              value={userName} onChangeText={setUserName}
              className="bg-[#121212] p-5 rounded-2xl text-white border border-white/5 mb-8 font-bold"
              placeholder="Display Name" placeholderTextColor="#4b5563"
            />
            <TextInput 
              value={email} onChangeText={setEmail}
              className="bg-[#121212] p-5 rounded-2xl text-white border border-white/5 mb-8 font-bold"
              placeholder="Email" placeholderTextColor="#4b5563"
            />
            <TouchableOpacity onPress={handleUpdateUser} className="bg-[#FACC15] py-5 rounded-full items-center shadow-lg shadow-yellow-500/20">
              <Text className="text-black font-black uppercase tracking-widest">Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setUserModalVisible(false)} className="mt-6 items-center">
              <Text className="text-slate-500 font-bold uppercase tracking-widest text-xs">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- MODAL: EDIT VEHICLE --- */}
      <Modal visible={vehicleModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/80">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View className="bg-[#1E1E1E] rounded-t-[45px] p-10 border-t border-white/10">
              <Text className="text-white text-2xl font-black mb-8 uppercase tracking-widest text-center">Manage Vehicle</Text>
              
              <View className="gap-y-5 mb-10">
                <TextInput 
                  value={vName} onChangeText={setVName}
                  className="bg-[#121212] p-5 rounded-2xl text-white border border-white/5 font-bold"
                  placeholder="Nickname" placeholderTextColor="#4b5563"
                />
                <TextInput 
                  value={vPlate} onChangeText={setVPlate}
                  className="bg-[#121212] p-5 rounded-2xl text-white border border-white/5 font-bold"
                  placeholder="Plate No" placeholderTextColor="#4b5563"
                />
                <TextInput 
                  value={vOdo} onChangeText={setVOdo}
                  keyboardType="numeric"
                  className="bg-[#121212] p-5 rounded-2xl text-white border border-white/5 font-bold"
                  placeholder="Odometer" placeholderTextColor="#4b5563"
                />
              </View>

              <TouchableOpacity onPress={saveVehicleChanges} className="bg-[#FACC15] py-5 rounded-full items-center shadow-lg shadow-yellow-500/20">
                <Text className="text-black font-black uppercase tracking-widest">Update Specs</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setVehicleModalVisible(false)} className="mt-6 items-center">
                <Text className="text-slate-500 font-bold uppercase tracking-widest text-xs">Go Back</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

    </SafeAreaView>
  );
}