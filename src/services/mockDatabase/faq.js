import AsyncStorage from '@react-native-async-storage/async-storage';
import { TABLES, SEED_DATA } from './constants';

export const getFAQ = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const faqKeys = keys.filter(key => key.startsWith(TABLES.FAQ));
    
    if (faqKeys.length === 0) {
      // Seed initial FAQ if none exist
      await seedFAQ();
      return SEED_DATA.faq;
    }
    
    const items = await AsyncStorage.multiGet(faqKeys);
    const faqs = items.map(([key, value]) => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }).filter(item => item !== null);
    
    // Sort by category, then by question
    faqs.sort((a, b) => {
      const categoryCompare = a.category.localeCompare(b.category);
      if (categoryCompare !== 0) return categoryCompare;
      return a.question.localeCompare(b.question);
    });
    
    return faqs;
  } catch (error) {
    console.error('Error getting FAQ:', error);
    // Return seed data as fallback
    return SEED_DATA.faq;
  }
};

export const getFAQByCategory = async (category) => {
  try {
    const allFAQ = await getFAQ();
    return allFAQ.filter(faq => faq.category === category);
  } catch (error) {
    console.error('Error getting FAQ by category:', error);
    return [];
  }
};

export const getFAQCategories = async () => {
  try {
    const allFAQ = await getFAQ();
    const categories = [...new Set(allFAQ.map(faq => faq.category))];
    return categories;
  } catch (error) {
    console.error('Error getting FAQ categories:', error);
    return ['General', 'Booking', 'Documents', 'Services'];
  }
};

export const createFAQ = async (faqData) => {
  try {
    const id = `faq_${Date.now()}`;
    const faq = {
      id,
      ...faqData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await AsyncStorage.setItem(
      `${TABLES.FAQ}_${id}`,
      JSON.stringify(faq)
    );
    
    return { success: true, id, faq };
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return { success: false, error: error.message };
  }
};

export const updateFAQ = async (faqId, updates) => {
  try {
    const key = `${TABLES.FAQ}_${faqId}`;
    const existing = await AsyncStorage.getItem(key);
    
    if (!existing) {
      return { success: false, error: 'FAQ not found' };
    }
    
    const faq = JSON.parse(existing);
    const updatedFAQ = {
      ...faq,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await AsyncStorage.setItem(key, JSON.stringify(updatedFAQ));
    return { success: true, faq: updatedFAQ };
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return { success: false, error: error.message };
  }
};

export const deleteFAQ = async (faqId) => {
  try {
    await AsyncStorage.removeItem(`${TABLES.FAQ}_${faqId}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return { success: false, error: error.message };
  }
};

// Search FAQ by keyword
export const searchFAQ = async (keyword) => {
  try {
    const allFAQ = await getFAQ();
    const searchTerm = keyword.toLowerCase();
    
    return allFAQ.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm) ||
      faq.answer.toLowerCase().includes(searchTerm) ||
      faq.category.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching FAQ:', error);
    return [];
  }
};

// Helper function to seed initial FAQ
const seedFAQ = async () => {
  try {
    for (const faq of SEED_DATA.faq) {
      await AsyncStorage.setItem(
        `${TABLES.FAQ}_${faq.id}`,
        JSON.stringify(faq)
      );
    }
    console.log('FAQ seeded successfully');
  } catch (error) {
    console.error('Error seeding FAQ:', error);
  }
};