import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '@/services/firebase';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212] p-6">
      <Text className="text-white text-3xl font-bold mb-8">Profile</Text>
      
      <TouchableOpacity 
        onPress={handleLogout}
        className="bg-red-500/10 p-5 rounded-2xl border border-red-500/20"
      >
        <Text className="text-red-500 font-bold text-center text-lg">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}