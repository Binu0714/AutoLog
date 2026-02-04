import React, { useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  StatusBar, Modal, TextInput, KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useAlert } from '@/context/alertContext';
import { useLoader } from '@/hooks/useLoader';

export default function GloveBox() {
  const { showAlert } = useAlert();
  const { showLoader, hideLoader } = useLoader();

  const [documents, setDocuments] = useState([
    { id: '1', title: 'Vehicle Insurance', expiryDate: '24 May 2026', daysLeft: 108, status: 'valid', icon: 'shield-check' },
    { id: '2', title: 'Revenue License', expiryDate: '10 Feb 2026', daysLeft: 6, status: 'expiring', icon: 'file-certificate' },
    { id: '3', title: 'Emission Test', expiryDate: '15 Oct 2025', daysLeft: 0, status: 'expired', icon: 'smog' },
  ]);


  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempDate, setTempDate] = useState('');

  const handleEdit = (doc: any) => {
    setSelectedDoc(doc);
    setTempTitle(doc.title);
    setTempDate(doc.expiryDate);
    setModalVisible(true);
  };

  const handleUpdate = () => {
    if (!tempTitle || !tempDate) {
      showAlert("Wait!", "Please fill in all details.", "warning");
      return;
    }

    showLoader();
    // Simulate updating logic
    setTimeout(() => {
      hideLoader();
      setModalVisible(false);
      showAlert("Success! 📂", `${tempTitle} has been updated.`, "success");
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" />
      
      <View className="flex-1">
        <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false}>
          
          {/* Header Section */}
          <View className="mt-4 mb-8">
            <Text className="text-white text-4xl font-bold tracking-tight">Glovebox</Text>
            <Text className="text-slate-500 text-lg mt-1 font-medium">Keep Your Documents Safe</Text>
          </View>

          {/* Medium Sized Document Cards */}
          <View className="gap-y-6 mb-32">
            {documents.map((doc) => (
              <TouchableOpacity 
                key={doc.id} 
                activeOpacity={0.9}
                onPress={() => handleEdit(doc)} // Clicking the card opens the popup
                className="bg-[#1E1E1E] p-6 rounded-[35px] border border-white/5 shadow-sm"
              >
                {/* Top Row: Icon and Status */}
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center">
                    <View className="bg-[#121212] p-3 rounded-2xl mr-4">
                      <MaterialCommunityIcons name={doc.icon as any} size={26} color="#FACC15" />
                    </View>
                    <Text className="text-white font-bold text-xl">{doc.title}</Text>
                  </View>
                  
                  <View className={`px-3 py-1 rounded-full ${
                    doc.status === 'valid' ? 'bg-green-500/10' : 
                    doc.status === 'expiring' ? 'bg-yellow-500/10' : 'bg-red-500/10'
                  }`}>
                    <Text className={`text-[10px] font-black uppercase tracking-widest ${
                      doc.status === 'valid' ? 'text-green-500' : 
                      doc.status === 'expiring' ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {doc.status}
                    </Text>
                  </View>
                </View>

                {/* Middle Row: Info & Progress Bar */}
                <View>
                  <View className="flex-row justify-between items-end mb-2">
                    <Text className="text-slate-500 text-sm font-medium">Expires: {doc.expiryDate}</Text>
                    <Text className="text-white/80 text-xs font-bold">
                      {doc.status === 'expired' ? 'Expired' : `${doc.daysLeft} days remaining`}
                    </Text>
                  </View>
                  
                  <View className="h-1.5 bg-[#121212] rounded-full overflow-hidden w-full">
                    <View 
                      className={`h-full rounded-full ${
                        doc.status === 'valid' ? 'bg-green-500' : 
                        doc.status === 'expiring' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: doc.status === 'valid' ? '75%' : doc.status === 'expiring' ? '15%' : '100%' }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* --- FLOATING ACTION BUTTON (FAB) --- */}
        <TouchableOpacity 
          activeOpacity={0.9}
          className="absolute bottom-10 right-8 bg-[#FACC15] w-16 h-16 rounded-full items-center justify-center shadow-2xl shadow-yellow-500/50 border-4 border-[#121212]"
          onPress={() => {
            setSelectedDoc(null);
            setTempTitle('');
            setTempDate('');
            setModalVisible(true);
          }}
        >
          <Ionicons name="add" size={32} color="black" />
        </TouchableOpacity>
      </View>

      {/* --- UPDATE POPUP (BOTTOM SHEET MODAL) --- */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/70">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View className="bg-[#1E1E1E] rounded-t-[45px] p-10 border-t border-white/10 shadow-2xl">
              <View className="flex-row justify-between items-center mb-8">
                  <Text className="text-white text-2xl font-black uppercase tracking-widest">
                    {selectedDoc ? 'Update Vault' : 'New Document'}
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Ionicons name="close-circle" size={35} color="#4b5563" />
                  </TouchableOpacity>
              </View>

              <View className="gap-y-6">
                  {/* Input: Document Name */}
                  <View>
                      <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[3px] mb-2 ml-1">Document Type</Text>
                      <TextInput
                          placeholder="e.g. Insurance"
                          placeholderTextColor="#4b5563"
                          value={tempTitle}
                          onChangeText={setTempTitle}
                          className="bg-[#121212] p-5 rounded-2xl text-white border border-white/5 font-bold"
                      />
                  </View>

                  {/* Input: Expiry Date */}
                  <View>
                      <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[3px] mb-2 ml-1">Expiry Date</Text>
                      <TextInput
                          placeholder="YYYY-MM-DD"
                          placeholderTextColor="#4b5563"
                          value={tempDate}
                          onChangeText={setTempDate}
                          className="bg-[#121212] p-5 rounded-2xl text-[#FACC15] border border-white/5 font-black text-lg"
                      />
                  </View>

                  <TouchableOpacity 
                      onPress={handleUpdate}
                      className="bg-[#FACC15] py-5 rounded-[20px] items-center mt-4 mb-6 shadow-xl shadow-yellow-500/20"
                  >
                      <Text className="text-black font-black text-lg uppercase tracking-widest">Save Changes</Text>
                  </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

    </SafeAreaView>
  );
}