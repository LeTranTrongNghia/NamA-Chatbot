# Nam A Bank Customer Support Chatbot  

## 📌 Overview  
The **Nam A Bank Customer Support Chatbot** is an AI-powered virtual assistant designed to **enhance customer service efficiency** by automating responses to customer inquiries. The system **leverages AI, NLP, and OCR** to provide real-time support, reducing the workload of human agents while improving customer experience.  

## 🚀 Features  
✅ **AI-powered chatbot** using **Gemini API** for intelligent responses  
✅ **Real-time customer interaction** with automated replies  
✅ **Speech-to-text conversion** using **Speechflow.io**  
✅ **OCR (Optical Character Recognition)** with **Tesseract.js** for extracting text from images  
✅ **Multi-platform accessibility** (Web and API-based integration)  
✅ **Admin Dashboard** for monitoring interactions, managing support tickets, and analyzing customer inquiries  
✅ **Database integration** with **MongoDB** for storing interactions and queries  

## 🛠️ Tech Stack  
### **Frontend**  
- **React.js** with **Tailwind CSS** for a modern and responsive UI  

### **Backend**  
- **Node.js** and **Express.js** for handling chatbot logic and API requests  

### **AI & NLP**  
- **Gemini API** for intelligent chatbot responses  
- **Speechflow.io** for converting voice to text  
- **Tesseract.js** for OCR-based text recognition  

### **Database**  
- **MongoDB** for efficient data storage and retrieval  

## 🏗️ Project Architecture  
The system follows a **client-server model**, where the **React.js frontend** communicates with the **Node.js backend**, which processes customer queries using **Gemini AI**. Responses are dynamically generated and delivered in **real-time**.  

## 🔧 Installation & Setup  
### **Prerequisites**  
Ensure you have the following installed:  
- Node.js  
- MongoDB  
- npm or yarn  

### **Steps to Run the Project**  
1. **Clone the repository**
  ```bash
  git clone https://github.com/LeTranTrongNghia/NamA-Chatbot.git 
  cd NamA-Chatbot
  ```
2. **Install dependencies** (In both backend and frontend)
  ```bash
  cd app 
  npm install
  ```
  ```bash
  cd server 
  npm install
  ```
3. **Start the application**
  * In server
  ```bash
  node --env-file=config.env server
  ```
  * In app
  ```bash
  npm run dev
  ```
4. **Access the application**
  * Open your browser and navigate to:
  ```bash
  http://localhost:5173
  ```

## 📞 Contact
For more information or support, reach out to:
📧 Email: trongnghiaa.work@gmail.com
