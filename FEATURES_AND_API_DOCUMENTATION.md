# Hall Khoj Finder — सम्पूर्ण फीचर्स, API Keys और MongoDB बैकएंड गाइड
**Hall Khoj Finder — Complete Features, API Keys & MongoDB Backend Documentation**

---

## 📑 अनुक्रमणिका (Table of Contents)
1. [सारे एरर जो फिक्स किए गए (All Fixed Errors)](#1-सारे-एरर-जो-फिक्स-किए-गए-all-fixed-errors)
2. [MongoDB डेटाबेस और बैकएंड इंटीग्रेशन (MongoDB Database & Server Setup)](#2-mongodb-डेटाबेस-और-बैकएंड-इंटीग्रेशन)
3. [इस प्रोजेक्ट में कौन-कौन से फीचर्स हैं (Complete Features List)](#3-इस-प्रोजेक्ट-में-कौन-कौन-से-फीचर्स-हैं)
4. [कौन-कौन सी API Keys लगेंगी और कहाँ से मिलेंगी (API Keys Guide)](#4-कौन-कौन-सी-api-keys-लगेंगी-और-कहाँ-से-मिलेंगी)
5. [प्रोजेक्ट कैसे रन करें (How to Run the Project)](#5-प्रोजेक्ट-कैसे-रन-करें)

---

## 1. सारे एरर जो फिक्स किए गए (All Fixed Errors)

| एरर / कमी (Issue) | समाधान (Resolution / Fix) | स्टेटस |
|---|---|---|
| **Node.js Environment Missing in System Path** | Node.js v24.21.0 & npm 11.19.0 को यूजर प्रोग्राम्स और PATH एनवायरनमेंट में कॉन्फ़िगर किया गया। | ✅ Fixed |
| **Missing `GET /api/reviews` Endpoint** | `reviews.routes.js`, `reviews.controller.js` और `review.service.js` में `getAllReviews` / `getAll` मेथड जोड़ा गया, जिससे 404 Not Found खत्म हो गया। | ✅ Fixed |
| **Missing `/css/index.css` Bundle** | `frontend/css/index.css` बंडल फाइल बनाई गई जो `main.css`, `components.css`, `3d.css`, और `animations.css` को एक साथ लोड करती है। | ✅ Fixed |
| **Frontend `HKF_API` Static Server Port Fallback** | `frontend/js/api.js` में `API_BASE` को इंटेलिजेंट बनाया गया ताकि Live Server (5500) या `file:///` से भी `http://localhost:3000/api` सीधे कनेक्ट हो। | ✅ Fixed |
| **Duplicate Object Keys in `api.js`** | `frontend/js/api.js` में `categories` और `search` के डुप्लिकेट डेफिनिशन हटाकर क्लीन किया गया। | ✅ Fixed |
| **Missing MongoDB Support** | `mongoose` पैकेज इंस्टॉल किया गया और पूरा MongoDB कनेक्शन मैनेजर व 14 Mongoose मॉडल्स तैयार किए गए। | ✅ Fixed |
| **Server Crash Protection (Resilient Boot)** | यदि MongoDB बंद हो या URI न दी गई हो, तब भी सर्वर क्रैश नहीं होता, बल्कि लोकल ट्रांजेक्शनल JSON लेयर पर स्मूथली रन करता है। | ✅ Fixed |

---

## 2. MongoDB डेटाबेस और बैकएंड इंटीग्रेशन

### 2.1 आर्किटेक्चर (Dual-Storage Architecture)
इस प्रोजेक्ट में अब **Hybrid MongoDB Architecture** है:
- **Primary Store:** MongoDB (via Mongoose ODM)
- **Fallback Store:** Local Transactional JSON Layer (Offline / Dev Mode)
- **Firebase Store:** Optional Cloud Firestore SDK bridge

### 2.2 तैयार किए गए Mongoose Models (`backend/models/index.js`)
प्रोजेक्ट के सभी डेटा कलेक्शन्स के लिए Mongoose मॉडल्स तैयार किए गए हैं:
1. `User` — कस्टमर्स, ओनर्स और एडमिन के प्रोफाइल्स
2. `Owner` — वेन्यू/सर्विस ओनर्स की KYC, GST, बैंक डिटेल्स
3. `Hall` — मैरिज हॉल्स, बैंक्वेट हॉल्स, रिज़ॉर्ट्स, क्षमता, सुविधाएं
4. `Car` — लग्जरी वेडिंग कार्स, ब्रांड, सीटिंग, रेट्स
5. `TentHouse` — टेंट, शामियाना, वाटरप्रूफ हैंगर, सोफा सेट्स
6. `Service` — केटरिंग, डेकोरेशन, DJ, फोटोग्राफी आदि
7. `Booking` — बुकिंग्स, एडवांस पेमेंट, इवेंट डेट, गेस्ट काउंट
8. `Review` — 100% वेरिफाइड रिव्यूज और ओनर के रिप्लाई
9. `Category` — 19 इवेंट कैटेगरीज
10. `Staff` — वेन्यू स्टाफ (मैनेजर, सिक्योरिटी, रिसेप्शनिस्ट)
11. `Notification` — रियल-टाइम अलर्ट्स और नोटिफिकेशन्स
12. `Message` — कस्टमर और ओनर के बीच चैट/मैसेजिंग
13. `AuditLog` — एडमिन सुरक्षा व ऑडिट लॉग्स
14. `Transaction` — Razorpay पेमेंट्स और ट्रांजेक्शन रिकॉर्ड्स

### 2.3 ऑटो-सिंक (Automatic Seeding)
- जब आप MongoDB कनेक्ट करते हैं, तो सर्वर चेक करता है कि क्या कलेक्शन्स खाली हैं। यदि खाली हैं, तो `backend/data/*.json` से सारा वेरिफाइड डेटा **ऑटोमैटिकली MongoDB में सिंक** हो जाता है।
- मैन्युअल सिंक के लिए टर्मिनल में कमांड रन करें:
  ```bash
  npm run seed
  ```
- या API कॉल करें: `POST /api/database/sync`

---

## 3. इस प्रोजेक्ट में कौन-कौन से फीचर्स हैं

### 🌟 मुख्य फीचर्स (Core Features)

1. **3D Interactive Venue Layout Walkthrough (Three.js)**
   - असली 3D आर्किटेक्चरल मॉडल जिसमें यूजर माउस या टच से घूमकर स्टेज (Stage), सीटिंग (Seating Area), डाइनिंग (Dining Area), और ब्राइडल रूम्स (Bridal Rooms) का 360° लेआउट देख सकता है।
   - WebGL न होने पर सुंदर 2D फोटो गैलरी का ऑटोमैटिक फॉलबैक।

2. **19+ Event Categories Marketplace**
   - Marriage Halls (विवाह भवन / पैलेस)
   - Banquet Halls (बैंक्वेट हॉल)
   - Luxury Wedding Cars (मर्सिडीज, ऑडी, विंटेज कार्स)
   - Tent Houses & Shamiana (जर्मन हैंगर, शामियाना)
   - Catering & Food Services (हलवाई और केटरिंग)
   - Wedding Decorators (थीम डेकोरेशन)
   - DJ & Sound Systems
   - Photography & Videography (ड्रोन शूट)
   - Bridal Makeup Artists
   - Event Organizers & Band Baaja

3. **Real-Time Date Availability Calendar**
   - किसी भी वेन्यू की तारीखवार उपलब्धता तुरंत चेक करें:
     - 🟢 **AVAILABLE**: तारीख खाली है, तुरंत बुक कर सकते हैं।
     - 🟡 **PENDING**: किसी अन्य ग्राहक की पूछताछ चल रही है।
     - 🔴 **BOOKED**: पहले से बुक हो चुका है।
     - ⚫ **BLOCKED**: मालिक द्वारा तारीख ब्लॉक कर दी गई है।

4. **Booking & Advance Token Payment System**
   - तारीख, गेस्ट काउंट और टाइम स्लॉट सिलेक्ट करें।
   - कुल खर्च और 25%-30% एडवांस टोकन का ऑटो-कैलकुलेशन।
   - **Razorpay Integration**: डेबिट/क्रेडिट कार्ड, UPI (GPay, PhonePe, Paytm), नेटबैंकिंग से सुरक्षित भुगतान।
   - सर्वर-साइड HMAC-SHA256 सिग्नेचर वेरिफिकेशन।

5. **Multi-Role Authentication & Access Control (RBAC)**
   - 👤 **Customer (ग्राहक)**: हॉल खोजना, 3D व्यू देखना, तारीख चेक करना, बुकिंग करना, रिव्यु देना।
   - 🏢 **Venue Owner (मालिक)**: अपने हॉल/कार/टेंट लिस्ट करना, बुकिंग अप्रूव/रिजेक्ट करना, कैलेंडर डेट्स ब्लॉक/अनब्लॉक करना, स्टाफ मैनेज करना, कमाई (Analytics) देखना।
   - 🛡️ **Admin (सुपर एडमिन)**: सभी वेन्यूज को वेरिफाई/अप्रूव करना, ओनर KYC चेक करना, फ्रॉड रोकना, ऑडिट लॉग्स देखना।

6. **Full-Featured Dashboards**
   - **Customer Dashboard** (`/dashboard.html`): मेरी बुकिंग्स, टोकन स्लिप, पसंदीदा हॉल (Favorites), लोकेशन।
   - **Owner Dashboard** (`/owner/dashboard.html`): बुकिंग रिक्वेस्ट्स, लाइव कैलेंडर, कमाई का ग्राफ, वेन्यू एडिट, स्टाफ लिस्टिंग।
   - **Admin Dashboard** (`/admin/dashboard.html`): प्लेटफॉर्म स्टेट्स, पेंडिंग KYC वेरिफिकेशन, फ्लैग्ड रिव्यूज, लिस्टिंग्स मॉडरेशन।

7. **AI Venue Finder & Matchmaker (Google Gemini AI)**
   - प्राकृतिक भाषा (Natural Language / Hinglish) में सर्च: *"Mujhe Lucknow me 500 logo ke liye 80 hazar me AC hall chahiye"*
   - AI तुरंत बजट, शहर और क्षमता पहचान कर सटीक हॉल सुझाता है।
   - ओनर के लिए AI असिस्टेंट जो वेन्यू का डिस्क्रिप्शन और प्राइसिंग स्ट्रेटेजी खुद लिख सकता है।

8. **100% Verified Reviews & Ratings System**
   - केवल वही ग्राहक रिव्यु दे सकते हैं जिनकी बुकिंग **COMPLETED** हो चुकी है। (फेक रिव्यूज की कोई संभावना नहीं)
   - वेन्यू ओनर ग्राहक के रिव्यु का रिप्लाई दे सकते हैं।

9. **Multi-Language Support (i18n)**
   - English, Hindi (हिंदी), और Hinglish में एक क्लिक में स्विच करें।

10. **SEO & Performance Hardened**
    - Dynamic XML Sitemap (`/sitemap.xml`)
    - Dynamic Robots.txt (`/robots.txt`)
    - XSS और NoSQL Injection सैनिटाइजेशन
    - Rate Limiting (DDoS प्रोटेक्शन)

---

## 4. कौन-कौन सी API Keys लगेंगी और कहाँ से मिलेंगी

प्रोजेक्ट में उपयोग होने वाली सभी चाभियों (API Keys) की विस्तृत सूची:

| API Key का नाम | फाइल में वेरिएबल नाम | आवश्यक या वैकल्पिक? | कहाँ से प्राप्त करें (Where to Get) | यदि न डालें तो क्या होगा? |
|---|---|---|---|---|
| **MongoDB Database URI** | `MONGODB_URI` | **अत्यंत अनुशंसित (Recommended)** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (मुफ़्त 512MB क्लाउड क्लस्टर) या लोकल MongoDB (`mongodb://127.0.0.1:27017/hallkhoj`) | सर्वर ऑटोमैटिकली लोकल JSON फाइल सिस्टम पर चलता रहेगा, कोई क्रैश नहीं होगा। |
| **JWT Secret Key** | `AUTH_SECRET` | **आवश्यक (Default सेट है)** | कोई भी 32 से 64 अक्षरों का रैंडम स्ट्रिंग (जैसे: `hall_khoj_secret_key_2026`) | डिफ़ॉल्ट डेव सीक्रेट मौजूद है, तुरंत काम करेगा। |
| **Google Gemini AI API Key** | `AI_API_KEY` | **ऐच्छिक (AI सर्च के लिए)** | [Google AI Studio](https://aistudio.google.com/app/apikey) (बिल्कुल फ्री में 1 मिनट में बनती है) | यदि न हो, तो भी बिल्ट-इन स्मार्ट रूल-बेस्ड AI सर्च इंजन काम करता रहेगा। |
| **Razorpay Payment Keys** | `PAYMENT_KEY_ID`<br>`PAYMENT_KEY_SECRET` | **ऐच्छिक (ऑनलाइन पेमेंट के लिए)** | [Razorpay Dashboard](https://dashboard.razorpay.com/#/app/keys) (Settings > API Keys) | यदि न हो, तो सिस्टम ऑटोमैटिक डेवलपमेंट सिमुलेशन मोड में सुरक्षित टोकन जनरेट करेगा। |
| **Google Maps API Key** | `GOOGLE_MAPS_API_KEY` | **वैकल्पिक (Optional)** | [Google Cloud Console](https://console.cloud.google.com/google/maps-apis) | यदि न हो, तो भी प्रोजेक्ट का Leaflet + OpenStreetMap बिना किसी शुल्क के मुफ़्त चलता है। |
| **Email / SMS API Key** | `EMAIL_API_KEY`<br>`SMS_API_KEY` | **वैकल्पिक (Optional)** | Resend.com / SendGrid या Fast2SMS | बुकिंग अलर्ट्स इन-ऐप नोटिफिकेशन सेंटर में रियल-टाइम दिखते रहेंगे। |
| **Firebase Admin Keys** | `FIREBASE_PROJECT_ID` आदि | **वैकल्पिक (Optional)** | [Firebase Console](https://console.firebase.google.com/) | MongoDB इस्तेमाल होने पर Firebase की बिल्कुल आवश्यकता नहीं है। |

---

## 5. प्रोजेक्ट कैसे रन करें

### स्टेप 1: MongoDB सेटअप (2 विकल्प)

#### विकल्प A: MongoDB Atlas (क्लाउड - सबसे आसान व मुफ़्त)
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) पर मुफ़्त अकाउंट बनाएं।
2. एक फ्री M0 क्लस्टर बनाएं।
3. **Connect** पर क्लिक करके **Drivers** चुनें और अपनी कनेक्शन स्ट्रिंग कॉपी करें।
4. `.env` फाइल खोलकर अपनी स्ट्रिंग पेस्ट कर दें:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/hallkhoj?retryWrites=true&w=majority
   ```

#### विकल्प B: लोकल MongoDB
यदि आपके कंप्यूटर पर MongoDB Community Server इंस्टॉल है:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/hallkhoj
```

---

### स्टेप 2: सर्वर स्टार्ट करें
टर्मिनल में रन करें:
```bash
npm start
```
या
```bash
npm run dev
```

आउटपुट दिखेगा:
```
🍃 [MongoDB] Connecting to: mongodb://127.0.0.1:27017/hallkhoj ...
====================================================
✨ HALL KHOJ FINDER — EXPRESS BACKEND RUNNING
🌐 Local API Base: http://localhost:3000/api
📁 Serving Frontend: D:\Desktop\hall khoj f\frontend
🍃 Database Mode: MongoDB (with JSON local fallback)
====================================================
```

### स्टेप 3: डेटाबेस में डेटा सिंक करें (Seeder)
MongoDB में सारे टेस्ट हॉल्स, कार्स, टेंट और बुकिंग्स डालने के लिए:
```bash
npm run seed
```

### स्टेप 4: ब्राउज़र में खोलें
- **होमपेज:** [http://localhost:3000](http://localhost:3000)
- **सर्च पेज:** [http://localhost:3000/search.html](http://localhost:3000/search.html)
- **हॉल डिटेल्स व 3D व्यू:** [http://localhost:3000/hall-details.html?id=h-101](http://localhost:3000/hall-details.html?id=h-101)
- **ग्राहक डैशबोर्ड:** [http://localhost:3000/dashboard.html](http://localhost:3000/dashboard.html)
- **वेन्यू ओनर डैशबोर्ड:** [http://localhost:3000/owner/dashboard.html](http://localhost:3000/owner/dashboard.html)
- **सुपर एडमिन डैशबोर्ड:** [http://localhost:3000/admin/dashboard.html](http://localhost:3000/admin/dashboard.html)
- **डेटाबेस व सर्वर हेल्थ स्टेटस:** [http://localhost:3000/api/health](http://localhost:3000/api/health)
