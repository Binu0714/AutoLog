import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-8">
          
          {/* Header Section */}
          <View className="mt-10">
            <TouchableOpacity onPress={() => router.back()} className="mb-8">
              <Text className="text-[#FACC15] text-lg font-bold">← Back</Text>
            </TouchableOpacity>
            <Text className="text-white text-4xl font-bold">Log In</Text>
            <Text className="text-slate-400 text-lg mt-2">Log in to stay on top of your ride.</Text>
          </View>

          {/* Form Section */}
          <View className="mt-12 gap-y-5">
            <View>
              <Text className="text-slate-400 mb-2 ml-1">Email Address</Text>
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#4b5563"
                value={email}
                onChangeText={setEmail}
                className="bg-[#1E1E1E] p-5 rounded-2xl text-white border border-white/5 focus:border-[#FACC15]"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text className="text-slate-400 mb-2 ml-1">Password</Text>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#4b5563"
                value={password}
                onChangeText={setPassword}
                className="bg-[#1E1E1E] p-5 rounded-2xl text-white border border-white/5 focus:border-[#FACC15]"
                secureTextEntry
              />
            </View>

            <TouchableOpacity className="items-end">
              <Text className="text-[#FACC15] font-semibold">Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.8}
              className="bg-[#FACC15] py-5 rounded-full items-center mt-4 shadow-lg shadow-yellow-500/20"
            >
              <Text className="text-black font-extrabold text-lg">Log In</Text>
            </TouchableOpacity>
          </View>

          {/* Social Logins Section */}
          <View className="mt-10">
            <Text className="text-slate-500 text-center mb-6">Or continue with</Text>
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
          <View className="flex-row justify-center mt-auto mb-10">
            <Text className="text-slate-400">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="text-[#FACC15] font-bold underline">Sign Up</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}