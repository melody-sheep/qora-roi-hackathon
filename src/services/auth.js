// src/services/auth.js - FULL UPDATED FILE
import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  // REGISTER - WITH FILE INFO IN DATABASE
  async register(email, password, userData, file = null) {
    try {
      console.log('📝 Registering:', email);
      
      // 1. Check if email exists
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      
      if (existing) {
        return { success: false, error: 'Email already registered' };
      }
      
      // 2. Prepare user record with file info
      const userRecord = {
        email: email,
        password: password,
        full_name: userData.fullName,
        role: userData.role,
        student_id: userData.studentId || null,
        clinic_id: userData.clinicId || null,
        created_at: new Date().toISOString()
      };
      
      // 3. If file exists, add file info
      if (file) {
        Object.assign(userRecord, {
          file_name: file.name || 'document.jpg',
          file_type: file.type || 'image/jpeg',
          file_size: file.size || 0,
          has_file: true
        });
      }
      
      // 4. Insert into database
      const { data, error } = await supabase
        .from('users')
        .insert(userRecord)
        .select()
        .single();
      
      if (error) {
        console.error('❌ DB Error:', error);
        return { success: false, error: 'Registration failed' };
      }
      
      console.log('✅ User created with ID:', data.id);
      
      return { 
        success: true, 
        user: {
          id: data.id,
          email: email,
          role: userData.role,
          fullName: userData.fullName,
          hasFile: !!file
        }
      };
    } catch (error) {
      console.error('🔥 Register error:', error);
      return { success: false, error: 'Registration failed' };
    }
  },
  
  // LOGIN - Check credentials in database
  async login(email, password) {
    try {
      console.log('🔐 Logging in:', email);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();
      
      if (error || !data) {
        console.log('Login failed for:', email);
        return { success: false, error: 'Invalid email or password' };
      }
      
      console.log('✅ Login successful for:', data.email);
      console.log('📋 User data:', data);
      
      // Prepare user object
      const userObject = {
        id: data.id,
        email: data.email,
        role: data.role,
        fullName: data.full_name,
        full_name: data.full_name,
        hasFile: data.has_file || false,
        clinic_id: data.clinic_id
      };
      
      // Store user data in async storage
      console.log('💾 Storing user:', userObject);
      await AsyncStorage.setItem('currentUser', JSON.stringify(userObject));
      
      return { 
        success: true, 
        user: userObject
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  },

  // Get stored user
  async getCurrentUser() {
    try {
      const userString = await AsyncStorage.getItem('currentUser');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  // Logout function to clear user
  async logout() {
    try {
      await AsyncStorage.removeItem('currentUser');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Logout failed' };
    }
  },
  
  // NEW FUNCTION: Update user in storage after profile update
  async updateUserInStorage(updates) {
    try {
      const currentUser = await this.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
        console.log('✅ User data updated in storage:', updatedUser);
        return { success: true, user: updatedUser };
      }
      return { success: false, error: 'No user found' };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'Update failed' };
    }
  },
  
  // NEW FUNCTION: Force refresh user from database
  async refreshUserFromDB() {
    try {
      const currentUser = await this.getCurrentUser();
      if (currentUser) {
        const { data: freshData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        if (error || !freshData) {
          return { success: false, error: 'Failed to fetch user' };
        }
        
        const updatedUser = {
          id: freshData.id,
          email: freshData.email,
          role: freshData.role,
          fullName: freshData.full_name,
          full_name: freshData.full_name,
          hasFile: freshData.has_file || false,
          clinic_id: freshData.clinic_id
        };
        
        await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
      }
      return { success: false, error: 'No user found' };
    } catch (error) {
      console.error('Error refreshing user:', error);
      return { success: false, error: 'Refresh failed' };
    }
  }
};