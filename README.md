# ChiCrimeWatch
# ChiCrimeWatch — Interactive Crime & Demographic Dashboard

ChiCrimeWatch is an interactive web application that allows users to explore crime trends and demographic estimates across Chicago’s 77 community areas. Users can search by ZIP code, neighborhood name, address, or area number and instantly view crime totals, crime-type breakdowns, demographics, and visual comparisons against citywide averages.

This application was built as part of a data mining and AI integration project. It uses a cleaned version of the Chicago Police Department’s public crime dataset, census-style demographic estimates, and AI-assisted components generated with Google AI Studio.

---

## 🔍 Features

### **✔ Multi-Input Search**
Search by:
- ZIP code  
- Street address  
- Chicago community area number (1–77)  
- Neighborhood name  

The app resolves each input to the correct Chicago community area.

---

### **✔ Demographic Overview**
Displays AI-estimated approximate 2022 census metrics:
- Median age  
- Median household income  
- Average household size  

---

### **✔ Crime Analytics**
For each area, the dashboard shows:
- Total crimes in selected area  
- Crime types present  
- Area crime ranking (1–100) based on crime density  
- Total crimes citywide  
- Number of community areas in dataset  

---

### **✔ Visual Charts**
Clean, modern charts show:
- Total crimes (area vs. city average)
- Crime types (area vs. city average)

Charts are reduced in size for better readability.

---

### **✔ Background + UI**
- High-resolution Chicago skyline background  
- Slim cards with soft shadows  
- Improved readability and layout spacing  
- Fully responsive design  

---

## 🧠 Technology Stack

**Frontend**
- React  
- TypeScript  
- Vite  
- Recharts (visualizations)  

**Data Processing**
- CSV parsing (custom helper functions)  
- Google AI Studio (for demographic estimates + UI assistance)

**Deployment**
- Vercel (recommended)
- Hosted directly from GitHub

---

## 📁 Project Structure

