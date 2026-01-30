import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zmqytwnvzljmacrcbbvm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptcXl0d252emxqbWFjcmNiYnZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDQyMjQsImV4cCI6MjA4NTI4MDIyNH0.Gn56lQoySn1lPjp4Bq2Y1Mol0Cwx0Ixe_I6jWr21Lzs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});