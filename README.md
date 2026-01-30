# 🏥 QORA - Queue-Oriented Access
## Medical Appointment System for USTP Students

> **Transforming healthcare access through intelligent scheduling**  
> *SITE Hack-IT-On 2026 Submission*

---

## 📋 Executive Summary

**QORA** addresses a critical challenge in university healthcare: the gap between available medical services and student access. Our system transforms manual scheduling into a transparent, efficient digital platform that serves both students and clinic staff with dignity and clarity.

**Core Philosophy**: Healthcare access should be straightforward, predictable, and equitable for every student.

---

## 👥 Development Team

**Alther Adrian Liga**  
**Jay Fahad Sultan**  
**Gio Niel Yecyec**  
**Vince Vistal**  
**Redante Sabio**

*Each team member contributed across all aspects of development—from architecture and coding to design and documentation—creating a truly collaborative build process.*

---

## 🎯 The Challenge We Address

University healthcare services face a fundamental tension: clinics have limited capacity, while students have urgent needs. Traditional systems create:

- **Administrative burden** on clinic staff managing manual schedules
- **Student anxiety** about appointment availability and wait times
- **Inequitable access** where some students struggle to secure appointments
- **Underutilized resources** during off-peak hours

QORA reimagines this relationship through technology that serves human needs first.

---

## 💡 Our Solution: Queue-Oriented Logic

QORA implements a **smart scheduling system** that:

### **For Students:**
- 📋 **Clear visibility** of available appointment slots
- 🔄 **Real-time updates** on slot availability
- 📝 **Simple booking process** with immediate confirmation
- 📊 **Appointment tracking** with history and status
- 📚 **Self-service FAQ** for common questions

### **For Clinic Staff:**
- 🏥 **Dashboard overview** of daily appointments and capacity
- ⚙️ **Availability management** for setting doctor schedules
- 👥 **Appointment management** for viewing and updating bookings
- 📱 **Efficient workflow** that reduces administrative tasks

### **Technical Innovation:**
- **Dynamic slot management** that prevents overbooking
- **Real-time synchronization** between student and clinic views
- **Role-based interfaces** tailored to specific user needs
- **Scalable architecture** ready for expansion

---

## 🏗️ System Architecture

### **Technology Stack:**
```
Frontend: React Native with Expo
Backend: Supabase (PostgreSQL + Authentication)
State Management: React Context + AsyncStorage
Navigation: React Navigation
Development: Expo Go for testing
Build System: EAS (Expo Application Services)
Design: Custom component library
```

### **Project Structure Implementation:**
Based on our organized codebase, we built:

#### **📱 Screen Components (17 Screens Created):**
- **Authentication**: LoginScreen, RegisterScreen
- **Student Experience**: 
  - studentDashboard.js (overview dashboard)
  - studentBooking.js (new appointments)
  - studentAppointment.js (appointment history)
  - myDocuments.js (document management)
  - faq.js (frequently asked questions)
- **Clinic Experience**:
  - clinicDashboard.js (clinic overview)
  - clinicProfile.js (profile management)
  - ManageAppointmentsScreen.js (appointment management)
  - SetAvailabilityScreen.js (schedule configuration)

#### **🔧 Services Layer:**
- **Database System**: Supabase integration with PostgreSQL backend
- **Mock Database**: AsyncStorage implementation for development
- **Authentication Services**: Secure login and registration via Supabase Auth
- **Database Interface**: Unified system for mock/real database switching
- **Utility Functions**: Validation, formatting, and storage helpers

#### **🎯 Navigation System:**
- AppNavigator.js (root navigation)
- StudentBottomTabs.js (student tab navigation)
- ClinicTabNavigator.js (clinic tab navigation)

---

## 🔐 Security & Privacy

### **Protection Framework:**
1. 🔒 **Authentication**: Supabase Auth with secure token management
2. 🛡️ **Data Isolation**: Student and clinic data kept separate with Row-Level Security
3. 📄 **Document Security**: Secure handling of student documents in Supabase Storage
4. 👁️ **Privacy First**: Minimal data collection focused on appointment needs
5. 🔄 **Session Management**: Secure token handling and session control

### **Verification Process:**
```
Student Registration → Document Verification → 
Access Grant → Booking Enabled
```

---

## 📊 Features Implemented

### **Student Portal:**
- ✅ **Dashboard**: Overview of appointments and clinic status
- 📅 **Appointment Booking**: Real-time slot selection and booking
- 📋 **Appointment Management**: View, cancel, and track appointments
- 📁 **Document Management**: Upload and manage student documents
- ❓ **FAQ System**: Answers to common questions
- 🔔 **Notifications**: Appointment reminders and updates

### **Clinic Portal:**
- 📊 **Clinic Dashboard**: Daily overview and metrics
- ⚙️ **Profile Management**: Clinic information and settings
- 👥 **Appointment Management**: View and manage student appointments
- 🕐 **Availability Setting**: Configure doctor schedules and slots
- 🔄 **Real-time Updates**: Live synchronization with student bookings

### **Shared Features:**
- 🔐 **Secure Authentication**: Role-based login system via Supabase
- 📱 **Responsive Design**: Mobile-optimized interfaces
- 🔄 **Data Synchronization**: Consistent data across views
- ⚡ **Performance Optimized**: Fast loading and smooth interactions

---

## 🚀 Development Journey (Less than 30 Hours)

### **Phase 1: Foundation & Architecture (Hours 0-8)**
- **Project initialization** with Expo and React Native
- **Authentication system** with role-based routing via Supabase
- **Navigation architecture** with separate student/clinic flows
- **Database design** with Supabase PostgreSQL schema
- **15+ screen components** created with consistent design

### **Phase 2: Core Functionality (Hours 8-20)**
- **Student booking flow** complete with real-time updates
- **Clinic management interface** for appointment oversight
- **Document upload system** for student verification with Supabase Storage
- **FAQ module** for self-service information
- **Dashboard implementations** for both user types

### **Phase 3: Polish & Deployment (Hours 20-30)**
- **Performance optimization** across all screens
- **Error handling** and user feedback systems
- **APK build** with Expo Application Services
- **Testing** on multiple devices and scenarios
- **Documentation** and submission preparation

### **Technical Achievement:**
- **17 fully implemented screens** with complete navigation
- **Supabase integration** with PostgreSQL database
- **Complete authentication system** with role management
- **Professional UI/UX** with consistent design patterns
- **Production-ready APK** for Android deployment

---

## 🌍 Impact & Value Proposition

### **For Students:**
- **Reduced anxiety** through clear appointment visibility
- **Time savings** with streamlined booking process
- **Equitable access** to clinic services
- **Convenience** of mobile access anytime, anywhere

### **For Clinic Staff:**
- **Administrative efficiency** through digital management
- **Better resource utilization** with optimized scheduling
- **Improved communication** with students
- **Data-driven insights** for service planning

### **For the University:**
- **Enhanced student wellbeing** through accessible healthcare
- **Operational efficiency** in clinic management
- **Scalable solution** that can grow with needs
- **Modern digital infrastructure** for student services

---

## 🛠️ Installation & Setup Guide

### **Prerequisites:**
- Node.js (v16 or higher)
- npm or yarn package manager
- Expo CLI (optional)
- Android Studio (for emulation) or physical Android device
- Git for version control
- Supabase account (for backend services)

### **Step-by-Step Installation:**

```bash
# 1. Clone the repository
git clone https://github.com/your-repo/QORA-ROI-HACKATHON.git
cd QORA-ROI-HACKATHON

# 2. Install dependencies
npm install

# 3. Configure Supabase
# - Create a new project at supabase.com
# - Set up your database tables
# - Configure authentication providers
# - Set up storage buckets for documents

# 4. Configure environment variables
# Create a .env file with:
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 5. Start the development server
npx expo start

# 6. Run on device/emulator
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app (physical device)

# 7. Build APK for distribution
eas build --platform android --profile preview
```

### **Required Packages:**
```json
{
  "dependencies": {
    "expo": "^51.0.0",
    "react-native": "0.74.0",
    "@supabase/supabase-js": "^2.39.0",
    "@react-navigation/native": "^6.1.0",
    "react-native-async-storage/async-storage": "^1.21.0",
    "@expo/vector-icons": "^13.0.0"
  }
}
```

### **Supabase Setup:**
1. **Create Project**: Go to supabase.com and create new project
2. **Database Schema**: Set up tables for users, appointments, availability, services
3. **Authentication**: Configure email/password auth with role management
4. **Storage**: Create buckets for document storage
5. **Row-Level Security**: Implement security policies for data protection

### **Troubleshooting:**
```bash
# Clear cache if experiencing issues
npx expo start --clear

# Reset Metro bundler
npx expo start --reset-cache

# Check for dependency issues
npm doctor
```

---

## 📞 Contact & Support

**Development Team Contact:**
- 📧 Email: team.qora@ustp.edu.ph
- 📱 GitHub: github.com/team-qora
- 🏫 Campus: University of Science and Technology of Southern Philippines

**Technical Support:**
For setup assistance or technical queries, please contact our development team with details about:
- The error message received
- Steps taken before the error occurred
- Device/emulator specifications
- Screenshots of the issue

---

## 🌟 Closing Note

**QORA represents more than just code—it represents our commitment to making healthcare accessible for every student.** In less than 30 hours, we transformed an idea into a functional solution that bridges the gap between need and care.

This project demonstrates that with the right technology stack—React Native for the frontend, Supabase for the backend, and Expo for deployment—we can create meaningful solutions to real-world problems. Our architecture is designed to scale, our interfaces are built for clarity, and our system is crafted with compassion.

*Faith + Curiosity + Persistence*

---

**All Rights Reserved © January 2026**  
**Team QORA – SITE Hack-IT-On 2026 Submission**  
*Building bridges between healthcare and hope*