import React, { useState,useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { registerUser } from '@/services/authService';
import { useLoader } from '../../hooks/useLoader';  
import { useAlert } from '@/context/alertContext';

const Register = () => {

  const router = useRouter();
  const { showLoader, hideLoader, isLoading} = useLoader()
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { showAlert } = useAlert();

  const handleRegister = async () => {
    if(!name || !email || !password || isLoading){
        showAlert("Wait!", "All Fields are Required. Please fill all the fields.");
        return;
      }

      if(password.length < 6){
        showAlert("Wait!", "Password should be at least 6 characters long.");
        return;
      }

    showLoader();

    try{
      await registerUser(name, email, password);
      
      showAlert(
        "Success! 🏁", 
        "Account created successfully. Let's get started.", 
        "success", 
        () => {
           
           router.replace('/login'); 
        }
      );

    }catch(error: any){

      if(error.code === 'auth/email-already-in-use'){
        showAlert("Error", "The email address is already in use by another account.");
      }else{
        showAlert("Error", "Registration failed. Please try again.");
        console.log("Registration Error: ", error);
      }
    }finally{
      hideLoader();
    }
  };

  const handleSocialLogin = (provider: string) => {
    showAlert(
      "Coming Soon",
      `${provider} login is currently under development. Please use your Email and Password for now.`,
      "warning"
    );
  };
  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <ScrollView className="px-8">
        
        <View className="mt-10">
          <TouchableOpacity onPress={() => router.back()} className="mb-8">
            <Text className="text-[#FACC15] text-lg font-bold">← Back</Text>
          </TouchableOpacity>
          <Text className="text-white text-4xl font-bold">Sign Up</Text>
          <Text className="text-slate-400 text-lg mt-2">Create an account and simplify your ride.</Text>
        </View>

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
            <View className="relative justify-center">
              <TextInput
                placeholder="Choose a password"
                placeholderTextColor="#4b5563"
                value={password}
                onChangeText={setPassword}
               
                secureTextEntry={!showPassword}
                className="bg-[#1E1E1E] p-5 pr-14 rounded-2xl text-white border border-white/5 focus:border-[#FACC15]"
              />
              
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 p-2"
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={22} 
                  color="#FACC15" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            activeOpacity={0.8}
            className="bg-[#FACC15] py-5 rounded-full items-center mt-6 shadow-lg shadow-yellow-500/20"
            onPress={handleRegister}
          >
            <Text className="text-black font-extrabold text-lg">Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Social Logins Section */}
                  <View className="mt-10 mb-6">
                    <Text className="text-slate-500 text-center mb-8 font-medium">Or continue with</Text>
                    
                    <View className="flex-row justify-center gap-x-8">
                      
                      {/* Facebook Circular Button */}
                      <TouchableOpacity 
                        onPress={() => handleSocialLogin('Facebook')}
                        activeOpacity={0.7}
                        className="w-16 h-16 rounded-full bg-white/5 items-center justify-center border border-white/10 shadow-sm"
                      >
                        <Ionicons name="logo-facebook" size={28} color="#1877F2" />
                      </TouchableOpacity>
        
                      {/* Apple Circular Button */}
                      <TouchableOpacity 
                        onPress={() => handleSocialLogin('Apple')}
                        activeOpacity={0.7}
                        className="w-16 h-16 rounded-full bg-white/5 items-center justify-center border border-white/10 shadow-sm"
                      >
                        <Ionicons name="logo-apple" size={28} color="white" />
                      </TouchableOpacity>
        
                      {/* Google Circular Button */}
                      <TouchableOpacity 
                        onPress={() => handleSocialLogin('Google')}
                        activeOpacity={0.7}
                        className="w-16 h-16 rounded-full bg-white/5 items-center justify-center border border-white/10 shadow-sm"
                      >
                        <Ionicons name="logo-google" size={28} color="#EA4335" />
                      </TouchableOpacity>
        
                    </View>
                  </View>

        <View className="flex-row justify-center mt-12 mb-10">
          <Text className="text-slate-400">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text className="text-[#FACC15] font-bold underline">Login</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default Register;