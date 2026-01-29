import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function FAQScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const [activeCategory, setActiveCategory] = useState('all');

  // FAQ Categories
  const categories = [
    { id: 'all', label: 'All', icon: 'grid-outline' },
    { id: 'booking', label: 'Booking', icon: 'calendar-outline' },
    { id: 'account', label: 'Account', icon: 'person-outline' },
    { id: 'medical', label: 'Medical', icon: 'medical-outline' },
    { id: 'technical', label: 'Technical', icon: 'settings-outline' },
  ];

  // FAQ Data
  const faqData = [
    {
      id: '1',
      question: 'How do I book an appointment?',
      answer: 'To book an appointment:\n1. Go to "Available Doctors" from your dashboard\n2. Select a service (Medical/Dental)\n3. Choose a doctor and available time slot\n4. Confirm your booking in the pop-up\n5. You\'ll receive a confirmation with appointment details',
      category: 'booking',
      popular: true,
    },
    {
      id: '2',
      question: 'Is healthcare free for students?',
      answer: 'Yes! All basic healthcare services through QORA are completely free for verified students. This includes:\n• Medical consultations\n• Dental check-ups\n• Basic prescriptions\n• Regular health screenings\n\nNote: Specialized treatments may have different policies.',
      category: 'medical',
      popular: true,
    },
    {
      id: '3',
      question: 'How do I verify my student account?',
      answer: 'Account verification requires:\n1. Valid student ID number\n2. Certificate of Registration (CoR)\n3. School email address\n\nUpload these documents during registration or from your dashboard. Verification typically takes 24-48 hours.',
      category: 'account',
      popular: true,
    },
    {
      id: '4',
      question: 'Can I cancel or reschedule an appointment?',
      answer: 'Yes! You can cancel appointments up to 24 hours before the scheduled time:\n1. Go to "My Appointments"\n2. Select the appointment\n3. Tap "Cancel"\n4. Confirm cancellation\n\nTo reschedule: Cancel your current appointment and book a new one. Late cancellations may affect future bookings.',
      category: 'booking',
    },
    {
      id: '5',
      question: 'What should I bring to my appointment?',
      answer: 'Please bring:\n1. Student ID card\n2. QORA appointment confirmation\n3. Any previous medical records (if applicable)\n4. List of current medications\n\nArrive 10 minutes early for check-in procedures.',
      category: 'medical',
    },
    {
      id: '6',
      question: 'How do I upload verification documents?',
      answer: 'To upload documents:\n1. Go to Student Dashboard\n2. Tap "My Documents" in verification section\n3. Select file from gallery or take photo\n4. Upload CoR and Student ID\n5. Submit for review\n\nSupported formats: JPG, PNG, PDF (Max 10MB)',
      category: 'account',
    },
    {
      id: '7',
      question: 'What if I forget my password?',
      answer: 'Reset your password:\n1. On login screen, tap "Forgot Password?"\n2. Enter your registered email\n3. Check email for reset link\n4. Create new password\n5. Login with new credentials\n\nIf issues persist, contact support.',
      category: 'account',
    },
    {
      id: '8',
      question: 'Are there any appointment limits?',
      answer: 'To ensure fair access:\n• Maximum 2 upcoming appointments at a time\n• 24-hour cancellation notice required\n• No-show policy: 3 no-shows may restrict booking for 30 days\n\nEmergency cases are handled separately.',
      category: 'booking',
    },
    {
      id: '9',
      question: 'What services are available?',
      answer: 'Available services:\n\nMEDICAL:\n• General consultations\n• Prescription refills\n• Basic lab tests\n• Health education\n\nDENTAL:\n• Check-ups & cleanings\n• Fillings\n• Extractions\n• Oral health advice\n\nAll services are free for verified students.',
      category: 'medical',
    },
    {
      id: '10',
      question: 'How do I contact support?',
      answer: 'Contact options:\n\n📞 Emergency: 911\n🏥 Clinic: (082) 123-4567\n📧 Email: support@qorahealth.edu\n📍 Location: USTP Medical Center\n🕒 Hours: Mon-Fri 8AM-5PM\n\nFor app issues, use the feedback form below.',
      category: 'technical',
    },
  ];

  // Contact Information
  const contactInfo = {
    emergency: '911',
    clinicPhone: '(082) 123-4567',
    clinicEmail: 'support@qorahealth.edu',
    clinicHours: 'Monday-Friday: 8:00 AM - 5:00 PM\nSaturday: 9:00 AM - 12:00 PM',
    clinicLocation: 'USTP Medical and Dental Clinic\nUniversity of Science and Technology of Southern Philippines\nCagayan de Oro City',
  };

  // Filter FAQs based on search and category
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleContactPress = (type, value) => {
    switch (type) {
      case 'phone':
        Linking.openURL(`tel:${value}`);
        break;
      case 'email':
        Linking.openURL(`mailto:${value}`);
        break;
      case 'emergency':
        Alert.alert(
          'Emergency Contact',
          'Call 911 for emergencies only.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Call 911', onPress: () => Linking.openURL('tel:911') }
          ]
        );
        break;
    }
  };

  const handleSendFeedback = () => {
    Alert.alert(
      'Send Feedback',
      'Your feedback is important to us! Would you like to:\n\n1. Report a bug\n2. Suggest improvement\n3. Share experience\n\nEmail us at feedback@qorahealth.edu',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Email', onPress: () => Linking.openURL('mailto:feedback@qorahealth.edu') }
      ]
    );
  };

  const PopularQuestions = () => (
    <View style={styles.popularSection}>
      <Text style={styles.sectionTitle}>Popular Questions</Text>
      <View style={styles.popularGrid}>
        {faqData
          .filter(faq => faq.popular)
          .slice(0, 4)
          .map(faq => (
            <TouchableOpacity
              key={faq.id}
              style={styles.popularCard}
              onPress={() => {
                setActiveCategory(faq.category);
                setExpandedSections({ [faq.id]: true });
                // Scroll to FAQ after a brief delay
                setTimeout(() => {
                  // In a real app, you'd use refs to scroll to the FAQ
                  // For now, we'll just expand it
                }, 100);
              }}
            >
              <View style={styles.popularIcon}>
                <Ionicons 
                  name={
                    faq.category === 'booking' ? 'calendar-outline' :
                    faq.category === 'medical' ? 'medical-outline' :
                    faq.category === 'account' ? 'person-outline' :
                    'help-circle-outline'
                  } 
                  size={20} 
                  color="#2563EB" 
                />
              </View>
              <Text style={styles.popularQuestion} numberOfLines={2}>
                {faq.question}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );

  const FAQItem = ({ faq }) => (
    <View style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqQuestion}
        onPress={() => toggleSection(faq.id)}
      >
        <View style={styles.questionHeader}>
          <View style={[styles.categoryBadge, { 
            backgroundColor: 
              faq.category === 'booking' ? '#EFF6FF' :
              faq.category === 'medical' ? '#F0F9FF' :
              faq.category === 'account' ? '#FEF3C7' :
              '#F3E8FF'
          }]}>
            <Text style={[styles.categoryText, {
              color: 
                faq.category === 'booking' ? '#2563EB' :
                faq.category === 'medical' ? '#0EA5E9' :
                faq.category === 'account' ? '#D97706' :
                '#8B5CF6'
            }]}>
              {faq.category.toUpperCase()}
            </Text>
          </View>
          {faq.popular && (
            <View style={styles.popularBadge}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.popularBadgeText}>POPULAR</Text>
            </View>
          )}
        </View>
        
        <View style={styles.questionContent}>
          <Text style={styles.questionText}>{faq.question}</Text>
          <Ionicons 
            name={expandedSections[faq.id] ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color="#64748B" 
          />
        </View>
      </TouchableOpacity>
      
      {expandedSections[faq.id] && (
        <View style={styles.faqAnswer}>
          <Text style={styles.answerText}>{faq.answer}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>FAQ & Help Center</Text>
          <View style={styles.headerRight} />
        </View>
        
        <Text style={styles.headerSubtitle}>
          Get answers to common questions about QORA healthcare services
        </Text>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search questions..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* CATEGORIES */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                activeCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Ionicons 
                name={category.icon} 
                size={18} 
                color={activeCategory === category.id ? '#2563EB' : '#64748B'} 
              />
              <Text style={[
                styles.categoryButtonText,
                activeCategory === category.id && styles.categoryButtonTextActive,
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* POPULAR QUESTIONS */}
        <PopularQuestions />

        {/* FAQ LIST */}
        <View style={styles.faqSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {filteredFAQs.length} {activeCategory === 'all' ? 'Questions' : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Found
            </Text>
            {searchQuery && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearSearch}>Clear Search</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {filteredFAQs.length === 0 ? (
            <View style={styles.noResults}>
              <Ionicons name="search-outline" size={48} color="#CBD5E1" />
              <Text style={styles.noResultsTitle}>No questions found</Text>
              <Text style={styles.noResultsText}>
                Try a different search term or browse by category
              </Text>
            </View>
          ) : (
            filteredFAQs.map((faq) => (
              <FAQItem key={faq.id} faq={faq} />
            ))
          )}
        </View>

        {/* CONTACT INFORMATION */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.contactCard}>
            {/* Emergency Contact */}
            <TouchableOpacity 
              style={[styles.contactItem, styles.emergencyItem]}
              onPress={() => handleContactPress('emergency', contactInfo.emergency)}
            >
              <View style={styles.contactIcon}>
                <Ionicons name="warning" size={24} color="#DC2626" />
              </View>
              <View style={styles.contactDetails}>
                <Text style={styles.contactLabel}>Emergency Contact</Text>
                <Text style={[styles.contactValue, styles.emergencyText]}>
                  {contactInfo.emergency}
                </Text>
                <Text style={styles.contactNote}>For medical emergencies only</Text>
              </View>
              <Ionicons name="call" size={20} color="#DC2626" />
            </TouchableOpacity>

            {/* Clinic Phone */}
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => handleContactPress('phone', contactInfo.clinicPhone)}
            >
              <View style={styles.contactIcon}>
                <Ionicons name="call-outline" size={22} color="#2563EB" />
              </View>
              <View style={styles.contactDetails}>
                <Text style={styles.contactLabel}>Clinic Phone</Text>
                <Text style={styles.contactValue}>{contactInfo.clinicPhone}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>

            {/* Clinic Email */}
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => handleContactPress('email', contactInfo.clinicEmail)}
            >
              <View style={styles.contactIcon}>
                <Ionicons name="mail-outline" size={22} color="#2563EB" />
              </View>
              <View style={styles.contactDetails}>
                <Text style={styles.contactLabel}>Clinic Email</Text>
                <Text style={styles.contactValue}>{contactInfo.clinicEmail}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>

            {/* Clinic Hours */}
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <Ionicons name="time-outline" size={22} color="#2563EB" />
              </View>
              <View style={styles.contactDetails}>
                <Text style={styles.contactLabel}>Clinic Hours</Text>
                <Text style={styles.contactValue}>{contactInfo.clinicHours}</Text>
              </View>
            </View>

            {/* Clinic Location */}
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <Ionicons name="location-outline" size={22} color="#2563EB" />
              </View>
              <View style={styles.contactDetails}>
                <Text style={styles.contactLabel}>Location</Text>
                <Text style={styles.contactValue}>{contactInfo.clinicLocation}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* FEEDBACK SECTION */}
        <View style={styles.feedbackSection}>
          <View style={styles.feedbackCard}>
            <Ionicons name="chatbubble-ellipses-outline" size={40} color="#2563EB" />
            <Text style={styles.feedbackTitle}>Still Need Help?</Text>
            <Text style={styles.feedbackText}>
              Can't find what you're looking for? Send us your question or feedback.
            </Text>
            <TouchableOpacity 
              style={styles.feedbackButton}
              onPress={handleSendFeedback}
            >
              <Text style={styles.feedbackButtonText}>Send Feedback</Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>QORA Healthcare v1.0</Text>
          <Text style={styles.footerSubtext}>For USTP Students • 24/7 Support Available</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  
  // HEADER
  header: {
    backgroundColor: '#0F172A',
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  headerRight: {
    width: 40,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  
  // SEARCH
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  
  // CONTAINER
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // CATEGORIES
  categoriesScroll: {
    marginTop: 8,
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryButtonActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  categoryButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryButtonTextActive: {
    color: '#2563EB',
  },
  
  // POPULAR QUESTIONS
  popularSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  popularCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: '1%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  popularIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  popularQuestion: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginBottom: 12,
    lineHeight: 18,
  },
  
  // FAQ SECTION
  faqSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  clearSearch: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // FAQ ITEM
  faqItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  faqQuestion: {
    padding: 20,
  },
  questionHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
    marginLeft: 4,
  },
  questionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  answerText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
  },
  
  // NO RESULTS
  noResults: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  
  // CONTACT SECTION
  contactSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  contactCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  emergencyItem: {
    backgroundColor: '#FEF2F2',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FECACA',
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactDetails: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  emergencyText: {
    color: '#DC2626',
    fontWeight: '700',
  },
  contactNote: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 2,
  },
  
  // FEEDBACK SECTION
  feedbackSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  feedbackCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  feedbackButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  
  // FOOTER
  footer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
});