// src/services/profileService.js
import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const profileService = {
  // Update profile in database AND storage
  async updateProfile(userId, updates) {
    try {
      // 1. Update in database
      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) {
        console.error('Database update error:', error);
        return { success: false, error: error.message };
      }
      
      // 2. Update in AsyncStorage
      const userString = await AsyncStorage.getItem('currentUser');
      if (userString) {
        const currentUser = JSON.parse(userString);
        const updatedUser = { 
          ...currentUser, 
          fullName: updates.full_name || currentUser.fullName,
          full_name: updates.full_name || currentUser.full_name,
          clinic_id: updates.clinic_id || currentUser.clinic_id
        };
        
        await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
        console.log('✅ Profile updated in storage:', updatedUser);
        
        return { success: true, user: updatedUser };
      }
      
      return { success: false, error: 'User not found in storage' };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Update failed' };
    }
  },
  
  // Get fresh data from database
  async getFreshUserData(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { 
        success: true, 
        data: {
          id: data.id,
          email: data.email,
          role: data.role,
          fullName: data.full_name,
          full_name: data.full_name,
          hasFile: data.has_file || false,
          clinic_id: data.clinic_id
        }
      };
    } catch (error) {
      return { success: false, error: 'Failed to fetch user data' };
    }
  }
};