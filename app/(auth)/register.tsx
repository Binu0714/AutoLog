import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <ScrollView className="px-8">
        
        {/* Header Section */}
        <View className="mt-10">
          <TouchableOpacity onPress={() => router.back()} className="mb-8">
            <Text className="text-[#FACC15] text-lg font-bold">← Back</Text>
          </TouchableOpacity>
          <Text className="text-white text-4xl font-bold">Sign Up</Text>
          <Text className="text-slate-400 text-lg mt-2">Create an account and simplify your ride.</Text>
        </View>

        {/* Form Section */}
        <View className="mt-10 gap-y-5">
          <View>
            <Text className="text-slate-400 mb-2 ml-1">Full Name</Text>
            <TextInput
              placeholder="Your full name"
              placeholderTextColor="#4b5563"
              value={name}
              onChangeText={setName}
              className="bg-[#1E1E1E] p-5 rounded-2xl text-white border border-white/5 focus:border-[#FACC15]"
            />
          </View>

          <View>
            <Text className="text-slate-400 mb-2 ml-1">Email Address</Text>
            <TextInput
              placeholder="Your email"
              placeholderTextColor="#4b5563"
              value={email}
              onChangeText={setEmail}
              className="bg-[#1E1E1E] p-5 rounded-2xl text-white border border-white/5 focus:border-[#FACC15]"
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text className="text-slate-400 mb-2 ml-1">Password</Text>
            <TextInput
              placeholder="Choose a password"
              placeholderTextColor="#4b5563"
              value={password}
              onChangeText={setPassword}
              className="bg-[#1E1E1E] p-5 rounded-2xl text-white border border-white/5 focus:border-[#FACC15]"
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            activeOpacity={0.8}
            className="bg-[#FACC15] py-5 rounded-full items-center mt-6 shadow-lg shadow-yellow-500/20"
          >
            <Text className="text-black font-extrabold text-lg">Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Social Logins Section */}
        <View className="mt-10">
            <Text className="text-slate-500 text-center mb-6">Or register with</Text>
            <View className="flex-row justify-between gap-x-4">
              <TouchableOpacity className="flex-1 bg-[#1E1E1E] py-4 rounded-2xl items-center border border-white/5">
                <Text className="text-white font-bold"> Apple</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-white py-4 rounded-2xl items-center">
                <Text className="text-black font-bold">G Google</Text>
              </TouchableOpacity>
            </View>
        </View>

        {/* Footer Link */}
        <View className="flex-row justify-center mt-12 mb-10">
          <Text className="text-slate-400">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className="text-[#FACC15] font-bold underline">Login</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}