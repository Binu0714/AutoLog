import React, { createContext, useState, useContext } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type AlertType = 'success' | 'error' | 'warning';

interface AlertContextType {
  showAlert: (title: string, message: string, type?: AlertType, onConfirm?: () => void) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ title: '', message: '', type: 'success' as AlertType });
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

  const showAlert = (title: string, message: string, type: AlertType = 'success', onConfirm?: () => void) => {
    setData({ title, message, type });
    setOnConfirmCallback(() => onConfirm || null);
    setVisible(true);
  };

  const handleConfirm = () => {
    setVisible(false);
    if (onConfirmCallback) onConfirmCallback();
  };

  const handleCancel = () => {
    setVisible(false);
    // We don't trigger the callback on cancel
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
        <View className="flex-1 justify-center items-center bg-black/80 px-10">
          <View className="bg-[#1E1E1E] w-full rounded-[40px] p-8 items-center border border-white/10 shadow-2xl">
            
            {/* Dynamic Icon Group */}
            <View className={`w-20 h-20 rounded-full items-center justify-center mb-6 
              ${data.type === 'success' ? 'bg-[#FACC15]' : data.type === 'error' ? 'bg-red-500' : 'bg-orange-500'}`}>
              <Ionicons 
                name={data.type === 'success' ? "checkmark-done" : data.type === 'error' ? "close" : "trash-outline"} 
                size={40} 
                color={data.type === 'success' ? 'black' : 'white'} 
              />
            </View>

            <Text className="text-white text-2xl font-bold text-center mb-2">
              {data.title}
            </Text>
            
            <Text className="text-slate-400 text-center text-lg leading-6 mb-8 font-medium">
              {data.message}
            </Text>

            {/* BUTTON SECTION */}
            <View className="flex-row w-full gap-x-3">
              
              {/* Only show Cancel button for warnings (deletions) */}
              {data.type === 'warning' && (
                <TouchableOpacity 
                  onPress={handleCancel}
                  activeOpacity={0.7}
                  className="flex-1 bg-[#262626] py-5 rounded-full items-center border border-white/5"
                >
                  <Text className="text-slate-400 font-bold uppercase tracking-widest text-xs">Cancel</Text>
                </TouchableOpacity>
              )}

              {/* Confirm/Primary Button */}
              <TouchableOpacity 
                onPress={handleConfirm}
                activeOpacity={0.8}
                className={`flex-1 py-5 rounded-full items-center shadow-lg 
                  ${data.type === 'error' ? 'bg-red-500 shadow-red-500/20' : 'bg-[#FACC15] shadow-yellow-500/20'}`}
              >
                <Text className="text-black font-black uppercase tracking-widest text-xs">
                  {data.type === 'warning' ? 'Delete' : 'Got it'}
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlert must be used within AlertProvider');
  return context;
};