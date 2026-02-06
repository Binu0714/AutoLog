import React, { useEffect, useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  StatusBar, Modal, TextInput, KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useAlert } from '@/context/alertContext';
import { useLoader } from '@/hooks/useLoader';
import { saveDocument,getDocuments } from '@/services/documentService';

const getStatusDetails = (expiryDate: string) => {
  if (!expiryDate) return { status: 'n/a', days: 0, color: 'text-slate-500', barWidth: '0%' };

  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return { status: 'expired', days: 0, color: 'text-red-500', barWidth: '0%', bg: 'bg-red-500/10' };
  if (diffDays <= 30) return { status: 'expiring', days: diffDays, color: 'text-yellow-500', barWidth: '30%', bg: 'bg-yellow-500/10'};

  return { status: 'valid', days: diffDays, color: 'text-green-500', barWidth: '100%', bg: 'bg-green-500/10' };
  
};

const getDocIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('insurance')) return 'shield-check';
  if (t.includes('license')) return 'file-certificate';
  if (t.includes('emission')) return 'smog';
  if (t.includes('tax')) return 'bank';
  return 'file-document'; 
};

export default function GloveBox() {
  const { showAlert } = useAlert();
  const { showLoader, hideLoader } = useLoader();

  const [documents, setDocuments] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempDate, setTempDate] = useState('');

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    const data = await getDocuments();
    setDocuments(data);
  }

  const handleEdit = (doc: any) => {
    setSelectedDoc(doc);
    setTempTitle(doc.title);
    setTempDate(doc.expiryDate);
    setModalVisible(true);
  };

  const handleUpdate = async() => {
    if (!tempTitle || !tempDate) {
      showAlert("Wait!", "Please fill in all details.", "warning");
      return;
    }

    // date can only be in ISO Format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(tempDate)) {
      showAlert(
        "Invalid Date Format", 
        "Please enter the expiry date in the format YYYY-MM-DD.", 
        "warning"
      );
      return;
    }

    const timestamp = Date.parse(tempDate);

    if (isNaN(timestamp)) {
      showAlert(
        "Invalid Date", 
        "The expiry date you entered is not a valid date. Please check and try again.", 
        "warning"
      );
      return;
    }

    showLoader();

    try{
      await saveDocument(tempTitle, tempDate, selectedDoc?.id);
      await fetchDocs();
      setModalVisible(false);
      showAlert("Success!", "Document saved successfully.", "success");
    }catch(e){
      showAlert("Error", "Failed to save document. Please try again.");
    }finally{
      hideLoader();
    }
  };

  return (
      <SafeAreaView className="flex-1 bg-[#121212]">
        <StatusBar barStyle="light-content" />
        
        <View className="flex-1">
          <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false}>
            
            <View className="mt-4 mb-8">
              <Text className="text-white text-4xl font-bold tracking-tight">GloveBox</Text>
              <Text className="text-slate-500 text-lg mt-1 font-medium">Digital Document Vault.</Text>
            </View>

            <View className="gap-y-6 mb-32">
              {documents.map((doc) => {
                // 3. RUN LOGIC FOR EVERY DOCUMENT
                const info = getStatusDetails(doc.expiryDate);
                const iconName = getDocIcon(doc.title);

                return (
                  <TouchableOpacity 
                    key={doc.id} 
                    activeOpacity={0.9}
                    onPress={() => handleEdit(doc)} 
                    className="bg-[#1E1E1E] p-6 rounded-[35px] border border-white/5 shadow-sm"
                  >
                    <View className="flex-row justify-between items-center mb-4">
                      <View className="flex-row items-center">
                        <View className="bg-[#121212] p-3 rounded-2xl mr-4">
                          <MaterialCommunityIcons name={iconName as any} size={26} color="#FACC15" />
                        </View>
                        <Text className="text-white font-bold text-xl">{doc.title}</Text>
                      </View>
                      
                      {/* Dynamic Status Badge */}
                      <View className={`px-3 py-1 rounded-full ${info.bg}`}>
                        <Text className={`text-[10px] font-black uppercase tracking-widest ${info.color}`}>
                          {info.status}
                        </Text>
                      </View>
                    </View>

                    <View>
                      <View className="flex-row justify-between items-end mb-2">
                        <Text className="text-slate-500 text-sm font-medium">Expires: {doc.expiryDate}</Text>
                        <Text className={`text-xs font-bold ${info.color}`}>
                          {info.status === 'expired' ? 'Expired' : `${info.days} days remaining`}
                        </Text>
                      </View>
                      
                      {/* Progress Bar mapped to calculated status */}
                      <View className="h-1.5 bg-[#121212] rounded-full overflow-hidden w-full">
                        <View 
                          className={`h-full rounded-full ${info.status === 'valid' ? 'bg-green-500' : info.status === 'expiring' ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: info.barWidth }}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}

              {/* Empty State */}
              {documents.length === 0 && (
                  <View className="mt-20 items-center">
                      <Ionicons name="folder-open-outline" size={60} color="#1E1E1E" />
                      <Text className="text-slate-600 font-bold mt-4">No documents found</Text>
                  </View>
              )}
            </View>
          </ScrollView>

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

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View className="flex-1 justify-end bg-black/70">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <View className="bg-[#1E1E1E] rounded-t-[45px] p-10 border-t border-white/10 shadow-2xl">
                <View className="flex-row justify-between items-center mb-8">
                    <Text className="text-white text-2xl font-black uppercase tracking-widest">
                      {selectedDoc ? 'Edit Record' : 'New Document'}
                    </Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Ionicons name="close-circle" size={35} color="#4b5563" />
                    </TouchableOpacity>
                </View>

                <View className="gap-y-6">
                    <View>
                        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[3px] mb-2 ml-1">Type</Text>
                        <TextInput
                            placeholder="e.g. Insurance"
                            placeholderTextColor="#4b5563"
                            value={tempTitle}
                            onChangeText={setTempTitle}
                            className="bg-[#121212] p-5 rounded-2xl text-white border border-white/5 font-bold"
                        />
                    </View>

                    <View>
                        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-[3px] mb-2 ml-1">Expiry (YYYY-MM-DD)</Text>
                        <TextInput
                            placeholder="2026-12-31"
                            placeholderTextColor="#4b5563"
                            value={tempDate}
                            onChangeText={setTempDate}
                            className="bg-[#121212] p-5 rounded-2xl text-[#FACC15] border border-white/5 font-black text-lg"
                        />
                    </View>

                    <TouchableOpacity 
                        onPress={handleUpdate}
                        className="bg-[#FACC15] py-5 rounded-[20px] items-center mt-4 mb-6"
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