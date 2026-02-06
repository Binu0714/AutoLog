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
import { updateProfile } from 'firebase/auth';
import { updateVehicle } from '@/services/vehicleService';

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
  const [selectedVehicle,setSelectedVehicle] = useState<any>(null);
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

  const handleUpdateUser = async() => {
    if(!userName.trim()){
      showAlert("Wait!", "Display name cannot be empty.", "warning");
      return;
    }

    showLoader();

    try{
      if(auth.currentUser){
        await updateProfile(auth.currentUser, { displayName: userName });

        setUserModalVisible(false);
        showAlert("Success!", "Profile updated successfully.", "success");
      }
    }catch(error){
      showAlert("Error", "Failed to update profile. Please try again.");
    }finally{
      hideLoader();
    }
  };

  const saveVehicleChanges = async () => {
   if (!vName.trim() || !vPlate.trim() || !vOdo.trim()) {
      showAlert("Wait!", "Please fill in all vehicle details.", "warning");
      return;
    }

    if (!selectedVehicle.id) {
      showAlert("Error", "No vehicle selected.", "error");
      return;
    }

    showLoader();

    try {
      await updateVehicle(selectedVehicle.id, vName, vPlate, parseInt(vOdo));

      await fetchProfileData();

      setVehicleModalVisible(false);
      showAlert("Success!", "Vehicle details updated successfully.", "success");

    }catch(error){
      showAlert("Error", "Failed to update vehicle. Please try again.");
      console.error("Update Vehicle Error: ", error);
    }finally{
      hideLoader();
    }
  };

  const handleLogout = () => {
    showAlert(
      "Confirm Logout",
      "Are you sure you want to sign out?",
      "warning",

      async () => {
        showLoader();

        try {
          await auth.signOut();
          router.replace('/');
        }catch(error){
          showAlert("Error", "Failed to sign out. Please try again.", "error");
        }finally{
          hideLoader();
        }
      }
    )
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" />
      <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false}>

        <View className="mt-4 mb-2">
            <Text className="text-white text-4xl font-bold tracking-tight">User Profile</Text>
            <Text className="text-slate-500 text-lg mt-1 font-medium">Manage your account details</Text>
        </View>
        
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
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View className="bg-[#1E1E1E] rounded-t-[45px] p-10 border-t border-white/10 shadow-2xl">
              <Text className="text-white text-2xl font-black mb-8 uppercase tracking-widest text-center">Update Profile</Text>

              <View className="gap-y-6 mb-10">
                {/* Display Name Group */}
                <View>
                  <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[2px] mb-2 ml-1">Full Name</Text>
                  <TextInput 
                    value={userName} 
                    onChangeText={setUserName}
                    className="bg-[#121212] p-5 rounded-2xl text-white border border-white/5 font-bold"
                    placeholder="Display Name" 
                    placeholderTextColor="#4b5563"
                  />
                </View>

                {/* Email Group */}
                <View>
                  <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[2px] mb-2 ml-1">Email Address</Text>
                  <TextInput 
                    value={email} 
                    className="bg-[#121212] p-5 rounded-2xl text-white border border-white/5 font-bold"
                    placeholder="Email" 
                    placeholderTextColor="#4b5563"
                    keyboardType="email-address"
                    autoCapitalize="none"  
                    editable={false}
                  />
                  <Text className="text-slate-600 text-[10px] mt-2 ml-1 italic lowercase">
                    * Email address is linked to your account and cannot be changed here.
                  </Text>
                  
                </View>
              </View>

              <TouchableOpacity 
                onPress={handleUpdateUser} 
                className="bg-[#FACC15] py-5 rounded-full items-center shadow-lg shadow-yellow-500/20"
              >
                <Text className="text-black font-black uppercase tracking-widest">Save Changes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setUserModalVisible(false)} 
                className="mt-6 items-center"
              >
                <Text className="text-slate-500 font-bold uppercase tracking-widest text-xs">Close</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* --- MODAL: EDIT VEHICLE --- */}
      <Modal visible={vehicleModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/80">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View className="bg-[#1E1E1E] rounded-t-[45px] p-10 border-t border-white/10">
              <Text className="text-white text-2xl font-black mb-8 uppercase tracking-widest text-center">Manage Vehicle</Text>
              
              <View className="gap-y-6 mb-10">
                <View>
                  <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[2px] mb-2 ml-1">Vehicle Name</Text>
                  <TextInput 
                    value={vName} onChangeText={setVName}
                    className="bg-[#121212] p-5 rounded-2xl text-white border border-white/5 font-bold"
                    placeholder="e.g. My Beast" placeholderTextColor="#4b5563"
                  />
                </View>

                <View>
                  <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[2px] mb-2 ml-1">Plate Number</Text>
                  <TextInput 
                    value={vPlate} onChangeText={setVPlate}
                    className="bg-[#121212] p-5 rounded-2xl text-white border border-white/5 font-bold"
                    placeholder="e.g. CAS-XXXX" placeholderTextColor="#4b5563"
                  />
                </View>

                <View>
                  <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[2px] mb-2 ml-1">Current Odometer (KM)</Text>
                  <TextInput 
                    value={vOdo} onChangeText={setVOdo}
                    keyboardType="numeric"
                    className="bg-[#121212] p-5 rounded-2xl text-[#FACC15] border border-white/5 font-bold"
                    placeholder="0" placeholderTextColor="#4b5563"
                  />
                </View>
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