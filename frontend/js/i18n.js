/**
 * Hall Khoj Finder — All-India Multilingual Engine (i18n)
 * Supports 14 Major Indian Languages:
 * Hindi (hi), English (en), Bengali (bn), Telugu (te), Marathi (mr),
 * Tamil (ta), Gujarati (gu), Urdu (ur), Kannada (kn), Odia (or),
 * Malayalam (ml), Punjabi (pa), Bhojpuri (bho), Maithili (mai).
 */

(function () {
  const LANGUAGES = [
    { code: 'hi', name: 'हिंदी', english: 'Hindi', flag: '🇮🇳' },
    { code: 'en', name: 'English', english: 'English', flag: '🌐' },
    { code: 'bho', name: 'भोजपुरी', english: 'Bhojpuri', flag: '🇮🇳' },
    { code: 'mai', name: 'मैथिली', english: 'Maithili', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', english: 'Bengali', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', english: 'Telugu', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', english: 'Marathi', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', english: 'Tamil', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', english: 'Gujarati', flag: '🇮🇳' },
    { code: 'ur', name: 'اردو', english: 'Urdu', flag: '🇮🇳', rtl: true },
    { code: 'kn', name: 'ಕನ್ನಡ', english: 'Kannada', flag: '🇮🇳' },
    { code: 'or', name: 'ଓଡ଼ିଆ', english: 'Odia', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', english: 'Malayalam', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', english: 'Punjabi', flag: '🇮🇳' }
  ];

  const TRANSLATIONS = {
    en: {
      nav_home: 'Home',
      nav_halls: 'Find Venues',
      nav_services: 'Services',
      nav_owner_portal: 'Owner Portal',
      nav_login: 'Login',
      nav_register: 'Register',
      nav_dashboard: 'Dashboard',
      nav_logout: 'Logout',
      hero_badge: '✨ India\'s #1 3D Event Services Marketplace',
      hero_title_1: 'Find Your Nearest Hall, Tent, Car',
      hero_title_2: '& Event Services in One Place',
      hero_subtitle: 'Explore 3D walkthroughs, verify live date availability, and book directly with owners with zero commission.',
      search_placeholder: 'Search marriage hall, tent, DJ, caterer...',
      city_placeholder: 'City / District / Near Me',
      search_btn: 'Search Now',
      ai_search_btn: '🤖 Ask Hall Khoj AI',
      ai_modal_title: 'Hall Khoj AI Natural Language Search',
      ai_modal_placeholder: 'Try: "Patna me 500 logo ke liye AC hall chahiye 2 lakh me" or "Wedding car in Lucknow"',
      ai_modal_submit: 'Search with AI',
      section_categories_title: 'Explore 19 Event Categories',
      section_categories_subtitle: 'Everything you need for your wedding, reception, or grand party',
      section_venues_title: 'Top Verified Venues',
      section_venues_subtitle: 'Hand-inspected, GST-registered venues with transparent pricing',
      cat_marriage_halls: 'Marriage Halls',
      cat_banquet_halls: 'Banquet Halls',
      cat_party_halls: 'Party Halls',
      cat_wedding_venues: 'Wedding Venues',
      cat_resorts: 'Resorts',
      cat_tent_houses: 'Tent Houses',
      cat_decoration: 'Decoration',
      cat_catering: 'Catering',
      cat_photography: 'Photography',
      cat_videography: 'Videography',
      cat_dj: 'DJ & Sound',
      cat_lighting: 'Lighting',
      cat_wedding_cars: 'Wedding Cars',
      view_details: 'View in 3D & Book',
      starting_from: 'Starting from',
      advance_badge: '25% Advance Booking',
      owner_cta_title: 'Are you a Venue or Event Business Owner?',
      owner_cta_desc: 'List your marriage hall, tent house, DJ, or catering service for free. Get direct customer inquiries and manage bookings with our AI Business Assistant.',
      owner_cta_btn: 'Register Business / List Hall',
      footer_tagline: 'Proudly Made in India for Every Celebration 🎉',
      footer_rights: 'All rights reserved.'
    },
    hi: {
      nav_home: 'होम',
      nav_halls: 'वेन्यू खोजें',
      nav_services: 'सेवाएं',
      nav_owner_portal: 'मालिक पोर्टल',
      nav_login: 'लॉग इन',
      nav_register: 'रजिस्टर करें',
      nav_dashboard: 'डैशबोर्ड',
      nav_logout: 'लॉग आउट',
      hero_badge: '✨ भारत का नंबर 1 3D इवेंट सर्विसेज प्लेटफॉर्म',
      hero_title_1: 'अपने पास का हॉल, टेंट, कार',
      hero_title_2: 'और इवेंट सर्विसेज एक जगह खोजिए',
      hero_subtitle: '3D में वॉकथ्रू देखें, लाइव उपलब्धता जांचें और बिना किसी दलाल के सीधे मालिक से बुक करें।',
      search_placeholder: 'मैरिज हॉल, टेंट, डीजे, हलवाई खोजें...',
      city_placeholder: 'शहर / जिला / मेरे पास',
      search_btn: 'खोजें',
      ai_search_btn: '🤖 हॉल खोज AI से पूछें',
      ai_modal_title: 'हॉल खोज AI नेचुरल लैंग्वेज सर्च',
      ai_modal_placeholder: 'जैसे: "लखनऊ में 500 लोगों के लिए एसी हॉल चाहिए 1.5 लाख में"',
      ai_modal_submit: 'AI से खोजें',
      section_categories_title: '19 इवेंट श्रेणियां देखें',
      section_categories_subtitle: 'आपकी शादी, रिसेप्शन या पार्टी के लिए सभी सुविधाएं',
      section_venues_title: 'शीर्ष सत्यापित वेन्यू',
      section_venues_subtitle: 'सत्यापित और पारदर्शी दरों के साथ सर्वोत्तम मैरिज हॉल',
      cat_marriage_halls: 'मैरिज हॉल',
      cat_banquet_halls: 'बैंक्वेट हॉल',
      cat_party_halls: 'पार्टी हॉल',
      cat_wedding_venues: 'वेडिंग वेन्यू',
      cat_resorts: 'रिसॉर्ट्स',
      cat_tent_houses: 'टेंट हाउस',
      cat_decoration: 'सजावट',
      cat_catering: 'कैटरिंग व खानपान',
      cat_photography: 'फोटोग्राफी',
      cat_videography: 'वीडियोग्राफी',
      cat_dj: 'डीजे और साउंड',
      cat_lighting: 'लाइटिंग व्यवस्था',
      cat_wedding_cars: 'शादी की गाड़ियां',
      view_details: '3D में देखें व बुक करें',
      starting_from: 'शुरुआती दर',
      advance_badge: '25% अग्रिम बुकिंग',
      owner_cta_title: 'क्या आप किसी हॉल या इवेंट सर्विस के मालिक हैं?',
      owner_cta_desc: 'अपना मैरिज हॉल, टेंट, डीजे या कैटरिंग फ्री में लिस्ट करें और सीधे ग्राहकों से बुकिंग प्राप्त करें।',
      owner_cta_btn: 'बिजनेस रजिस्टर करें / हॉल जोड़ें',
      footer_tagline: 'हर उत्सव और खुशी के लिए गर्व से भारत में निर्मित 🎉',
      footer_rights: 'सर्वाधिकार सुरक्षित।'
    },
    bho: {
      nav_home: 'होम',
      nav_halls: 'हॉल खोजीं',
      nav_services: 'सेवा सब',
      nav_owner_portal: 'मालिक पोर्टल',
      nav_login: 'लॉगिन करीं',
      nav_register: 'रजिस्टर करीं',
      nav_dashboard: 'डैशबोर्ड',
      nav_logout: 'लॉगआउट करीं',
      hero_badge: '✨ भारत के पहिला 3D बियाह-शादी पोर्टल',
      hero_title_1: 'अपना लगे के हॉल, टेंट, गाड़ी',
      hero_title_2: 'अउर इवेंट सर्विस एक्के जगहा खोजीं',
      hero_subtitle: '3D में देखीं, तुरंत तारीख जांचीं अउर बिना कवनो दलाल के सीधा मालिक से बात कऽ के बुक करीं।',
      search_placeholder: 'मैरिज हॉल, टेंट, डीजे, हलवाई खोजीं...',
      city_placeholder: 'शहर / जिला / हमरा लगे',
      search_btn: 'खोजीं',
      ai_search_btn: '🤖 हॉल खोज AI से पूछीं',
      ai_modal_title: 'हॉल खोज AI सर्च',
      ai_modal_placeholder: 'जैसे: "पटना में 400 आदमी खातिर एसी मैरिज हॉल चाहीं"',
      ai_modal_submit: 'AI से खोजीं',
      section_categories_title: '19 गो इवेंट श्रेणी',
      section_categories_subtitle: 'शादी, बियाह, तिलक आ पार्टी खातिर सब कुछ',
      section_venues_title: 'सत्यापित मैरिज हॉल',
      section_venues_subtitle: 'जांच-परखल अउर सही रेट वाला बढ़िया वेन्यू',
      cat_marriage_halls: 'मैरिज हॉल',
      cat_banquet_halls: 'बैंक्वेट हॉल',
      cat_party_halls: 'पार्टी हॉल',
      cat_wedding_venues: 'वेडिंग वेन्यू',
      cat_resorts: 'रिसॉर्ट',
      cat_tent_houses: 'टेंट हाउस',
      cat_decoration: 'सजावट',
      cat_catering: 'खाना-पीना (कैटरिंग)',
      cat_photography: 'फोटोग्राफी',
      cat_videography: 'वीडियोग्राफी',
      cat_dj: 'डीजे अउर बाजा',
      cat_lighting: 'लाइटिंग',
      cat_wedding_cars: 'विदाई वाली गाड़ी',
      view_details: '3D में देखीं व बुक करीं',
      starting_from: 'सुरुआती रेट',
      advance_badge: '25% एडवांस बुकिंग',
      owner_cta_title: 'का रउवा कवनो हॉल भा इवेंट सर्विस के मालिक बानी?',
      owner_cta_desc: 'अपना मैरिज हॉल, टेंट भा गाड़ी के मुफत में जोड़ीं अउर सीधा बुकिंग पाईं।',
      owner_cta_btn: 'हॉल जोड़ीं / बिजनेस खोलीं',
      footer_tagline: 'भारत में आपन लोगन के उत्सव खातिर बनल 🎉',
      footer_rights: 'सब अधिकार सुरक्षित बा।'
    },
    mai: {
      nav_home: 'होम',
      nav_halls: 'वेन्यू खोजू',
      nav_services: 'सेवा सभ',
      nav_owner_portal: 'मालिक पोर्टल',
      nav_login: 'लॉग इन',
      nav_register: 'रजिस्टर करू',
      nav_dashboard: 'डैशबोर्ड',
      nav_logout: 'लॉग आउट',
      hero_badge: '✨ मिथिला आ भारतक नंबर 1 3D इवेंट मंच',
      hero_title_1: 'अपन नजीकक हॉल, टेंट, गाड़ी',
      hero_title_2: 'आ विवाहक सभ सेवा एक्के ठाम खोजू',
      hero_subtitle: '3D मे देखू, तारीख जाँचल करू आ बिना कोनो बिचौलियाक सीधे मालिक सँ बुक करू।',
      search_placeholder: 'विवाह भवन, टेंट, डीजे, रसोइया खोजू...',
      city_placeholder: 'शहर / जिला / हमर नजीक',
      search_btn: 'खोजू',
      ai_search_btn: '🤖 हॉल खोज AI सँ पुछू',
      ai_modal_title: 'हॉल खोज AI सर्च',
      ai_modal_placeholder: 'जहिना: "दरभंगा मे 500 लोक लेल विवाह भवन चाही"',
      ai_modal_submit: 'AI सँ खोजू',
      section_categories_title: '19 टा इवेंट श्रेणी',
      section_categories_subtitle: 'विवाह, द्विरागमन, उपनयन आ उत्सव लेल सभ सेवा',
      section_venues_title: 'सत्यापित विवाह भवन',
      section_venues_subtitle: 'जाँचल-परखल आ उचित दर पर सर्वोत्तम वेन्यू',
      cat_marriage_halls: 'विवाह भवन',
      cat_banquet_halls: 'बैंक्वेट हॉल',
      cat_party_halls: 'उत्सव भवन',
      cat_wedding_venues: 'वेडिंग वेन्यू',
      cat_resorts: 'रिसॉर्ट',
      cat_tent_houses: 'टेंट हाउस',
      cat_decoration: 'सजावट',
      cat_catering: 'खान-पान (कैटरिंग)',
      cat_photography: 'फोटोग्राफी',
      cat_videography: 'वीडियोग्राफी',
      cat_dj: 'डीजे आ बाजा',
      cat_lighting: 'रोशनी व्यवस्था',
      cat_wedding_cars: 'विवाह गाड़ी',
      view_details: '3D मे देखू आ बुक करू',
      starting_from: 'शुरुआती दर',
      advance_badge: '25% अग्रिम बुकिंग',
      owner_cta_title: 'की अहाँ कोनो विवाह भवन अथवा इवेंटक मालिक छी?',
      owner_cta_desc: 'अपन विवाह भवन वा टेंटक नि:शुल्क सूचीकरण करू आ सीधे बुकिंग प्राप्त करू।',
      owner_cta_btn: 'अपन भवन जोडू',
      footer_tagline: 'मिथिला आ संपूर्ण भारतक उत्सव लेल समर्पित 🎉',
      footer_rights: 'सर्वाधिकार सुरक्षित।'
    },
    bn: {
      nav_home: 'হোম',
      nav_halls: 'ভেন্যু খুঁজুন',
      nav_services: 'পরিষেবা',
      nav_owner_portal: 'মালিক পোর্টাল',
      nav_login: 'লগইন',
      nav_register: 'নিবন্ধন',
      nav_dashboard: 'ড্যাশবোর্ড',
      nav_logout: 'লগআউট',
      hero_badge: '✨ ভারতের ১ নম্বর ৩ডি ইভেন্ট প্ল্যাটফর্ম',
      hero_title_1: 'আপনার কাছের হল, তাঁবু, গাড়ি',
      hero_title_2: 'এবং সমস্ত ইভেন্ট পরিষেবা এক জায়গায় খুঁজুন',
      hero_subtitle: '৩ডি ভিউ দেখুন, লাইভ বুকিং ডেট যাচাই করুন এবং সরাসরি মালিকের সাথে বুক করুন।',
      search_placeholder: 'ম্যারেজ হল, ক্যাটারিং, ডিজে খুঁজুন...',
      city_placeholder: 'শহর / জেলা / আমার কাছে',
      search_btn: 'খুঁজুন',
      ai_search_btn: '🤖 হল খোঁজ এআই দিয়ে খুঁজুন',
      section_categories_title: '১৯টি ইভেন্ট বিভাগ অন্বেষণ করুন',
      section_venues_title: 'যাচাইকৃত শীর্ষ ভেন্যু',
      cat_marriage_halls: 'ম্যারেজ হল',
      cat_banquet_halls: 'ভোজসভা হল',
      cat_tent_houses: 'তাঁবু ও প্যান্ডেল',
      cat_catering: 'ক্যাটারিং',
      cat_photography: 'ফটোগ্রাফি',
      cat_dj: 'ডিজে ও সাউন্ড',
      cat_wedding_cars: 'বিয়ের গাড়ি',
      view_details: '৩ডি দেখুন ও বুক করুন',
      starting_from: 'শুরু হচ্ছে',
      advance_badge: '২৫% অগ্রিম বুকিং',
      owner_cta_title: 'আপনি কি কোনো অনুষ্ঠান ভবনের মালিক?',
      owner_cta_desc: 'আপনার হল বা পরিষেবা বিনামূল্যে তালিকাভুক্ত করুন এবং সরাসরি বুকিং পান।',
      owner_cta_btn: 'মালিক হিসেবে যোগ দিন',
      footer_tagline: 'ভারতের প্রতিটি উৎসবের জন্য গর্বের সাথে তৈরি 🎉',
      footer_rights: 'সর্বস্বত্ব সংরক্ষিত।'
    },
    te: {
      nav_home: 'హోమ్',
      nav_halls: 'వేదికలను శోధించండి',
      nav_services: 'సేవలు',
      nav_owner_portal: 'ఓనర్ పోర్టల్',
      nav_login: 'లాగిన్',
      nav_register: 'రిజిస్టర్',
      nav_dashboard: 'డాష్‌బోర్డ్',
      nav_logout: 'లాగౌట్',
      hero_badge: '✨ భారతదేశపు నంబర్ 1 3D ఈవెంట్ వేదికల వేదిక',
      hero_title_1: 'మీ సమీప కళ్యాణ మండపం, టెంట్, కారు',
      hero_title_2: 'మరియు ఈవెంట్ సేవలను ఒకే చోట కనుగొనండి',
      hero_subtitle: '3D లో చూడండి, ఖాళీ తేదీలను తనిఖీ చేయండి మరియు మధ్యవర్తులు లేకుండా నేరుగా బుక్ చేయండి.',
      search_placeholder: 'కళ్యాణ మండపం, డెకరేషన్, క్యాటరింగ్...',
      city_placeholder: 'నగరం / జిల్లా / నా సమీపంలో',
      search_btn: 'శోధించండి',
      ai_search_btn: '🤖 హాల్ ఖోజ్ AI ని అడగండి',
      section_categories_title: '19 ఈవెంట్ వర్గాలు',
      section_venues_title: 'ధృవీకరించబడిన వేదికలు',
      cat_marriage_halls: 'కళ్యాణ మండపాలు',
      cat_banquet_halls: 'బ్యాంక్వెట్ హాల్స్',
      cat_tent_houses: 'టెంట్ హౌస్',
      cat_catering: 'క్యాటరింగ్',
      cat_photography: 'ఫోటోగ్రఫీ',
      cat_dj: 'DJ & సౌండ్',
      cat_wedding_cars: 'పెళ్లి కార్లు',
      view_details: '3D లో చూసి బుక్ చేయండి',
      starting_from: 'ప్రారంభ ధర',
      advance_badge: '25% అడ్వాన్స్ బుకింగ్',
      owner_cta_title: 'మీరు కళ్యాణ మండపం లేదా ఈవెంట్ సర్వీస్ ఓనరా?',
      owner_cta_desc: 'మీ వేదికను ఉచితంగా నమోదు చేయండి మరియు నేరుగా కస్టమర్ల నుండి బుకింగ్‌లను పొందండి.',
      owner_cta_btn: 'ఓనర్‌గా రిజిస్టర్ అవ్వండి',
      footer_tagline: 'భారతదేశంలోని ప్రతి వేడుక కోసం ప్రేమతో నిర్మించబడింది 🎉',
      footer_rights: 'అన్ని హక్కులు ప్రత్యేకించబడ్డాయి.'
    },
    mr: {
      nav_home: 'होम',
      nav_halls: 'हॉल शोधा',
      nav_services: 'सेवा',
      nav_owner_portal: 'मालक पोर्टल',
      nav_login: 'लॉगिन',
      nav_register: 'नोंदणी',
      nav_dashboard: 'डॅशबोर्ड',
      nav_logout: 'लॉगआउट',
      hero_badge: '✨ भारतातील नंबर १ ३डी इव्हेंट प्लॅटफॉर्म',
      hero_title_1: 'तुमच्या जवळील मंगल कार्यालय, टेंट, कार',
      hero_title_2: 'आणि इव्हेंट सेवा एकाच ठिकाणी शोधा',
      hero_subtitle: '३डी मध्ये पाहा, तारखा तपासा आणि मध्यस्थांशिवाय थेट मालकाकडून बुक करा.',
      search_placeholder: 'मंगल कार्यालय, टेंट, केटरिंग, डीजे शोधा...',
      city_placeholder: 'शहर / जिल्हा / माझ्या जवळ',
      search_btn: 'शोधा',
      ai_search_btn: '🤖 हॉल खोज AI ला विचारा',
      section_categories_title: '१९ इव्हेंट कॅटेगरी',
      section_venues_title: 'सत्यापित मंगल कार्यालये',
      cat_marriage_halls: 'मंगल कार्यालये',
      cat_banquet_halls: 'बँक्वेट हॉल्स',
      cat_tent_houses: 'मंडप व टेंट',
      cat_catering: 'केटरिंग',
      cat_photography: 'फोटोग्राफी',
      cat_dj: 'डीजे व ध्वनी व्यवस्था',
      cat_wedding_cars: 'लग्नाची गाडी',
      view_details: '३डी मध्ये पाहा व बुक करा',
      starting_from: 'किफायतशीर दर',
      advance_badge: '२५% ॲडव्हान्स बुकिंग',
      owner_cta_title: 'तुम्ही मंगल कार्यालय किंवा इव्हेंट सेवेचे मालक आहात का?',
      owner_cta_desc: 'आपला हॉल विनामूल्य जोडा आणि थेट ग्राहकांकडून बुकिंग मिळवा.',
      owner_cta_btn: 'हॉल जोडा / मालक नोंदणी',
      footer_tagline: 'प्रत्येक उत्सवासाठी अभिमानाने भारतात निर्मित 🎉',
      footer_rights: 'सर्व हक्क राखीव.'
    },
    ta: {
      nav_home: 'முகப்பு',
      nav_halls: 'மண்டபங்களை தேடுங்கள்',
      nav_services: 'சேவைகள்',
      nav_owner_portal: 'உரிமையாளர் பக்கம்',
      nav_login: 'உள்நுழைவு',
      nav_register: 'பதிவு',
      nav_dashboard: 'டாஷ்போர்டு',
      nav_logout: 'வெளியேறு',
      hero_badge: '✨ இந்தியாவின் நம்பர் 1 3D நிகழ்வு தளம்',
      hero_title_1: 'உங்கள் அருகிலுள்ள திருமண மண்டபம், டென்ட், கார்',
      hero_title_2: 'மற்றும் நிகழ்வு சேவைகளை ஒரே இடத்தில் கண்டறியவும்',
      hero_subtitle: '3D இல் பாருங்கள், கிடைக்கும் தேதிகளைச் சரிபார்த்து இடைத்தரகர் இன்றி நேரடியாக முன்பதிவு செய்யுங்கள்.',
      search_placeholder: 'திருமண மண்டபம், டென்ட், கேட்டரிங் தேடுங்கள்...',
      city_placeholder: 'நகரம் / மாவட்டம் / என் அருகில்',
      search_btn: 'தேடுக',
      ai_search_btn: '🤖 ஹால் கோஜ் AI இடம் கேளுங்கள்',
      section_categories_title: '19 நிகழ்வு வகைகள்',
      section_venues_title: 'சரிபார்க்கப்பட்ட சிறந்த மண்டபங்கள்',
      cat_marriage_halls: 'திருமண மண்டபங்கள்',
      cat_banquet_halls: 'பாங்க்வெட் ஹால்',
      cat_tent_houses: 'டென்ட் ஹவுஸ்',
      cat_catering: 'கேட்டரிங்',
      cat_photography: 'புகைப்படம்',
      cat_dj: 'டிஜே & ஒலி அமைப்பு',
      cat_wedding_cars: 'திருமண கார்கள்',
      view_details: '3D இல் பார்த்து முன்பதிவு செய்க',
      starting_from: 'தொடக்க விலை',
      advance_badge: '25% முன்பணம்',
      owner_cta_title: 'நீங்கள் மண்டபம் அல்லது நிகழ்வு வணிக உரிமையாளரா?',
      owner_cta_desc: 'உங்கள் மண்டபத்தை இலவசமாகப் பட்டியலிட்டு நேரடி வாடிக்கையாளர்களைப் பெறுங்கள்.',
      owner_cta_btn: 'உரிமையாளராக இணையுங்கள்',
      footer_tagline: 'ஒவ்வொரு கொண்டாட்டத்திற்கும் இந்தியாவில் உருவாக்கப்பட்டது 🎉',
      footer_rights: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.'
    },
    gu: {
      nav_home: 'હોમ',
      nav_halls: 'વેન્યુ શોધો',
      nav_services: 'સેવાઓ',
      nav_owner_portal: 'માલિક પોર્ટલ',
      nav_login: 'લૉગિન',
      nav_register: 'નોંધણી',
      nav_dashboard: 'ડેશબોર્ડ',
      nav_logout: 'લૉગઆઉટ',
      hero_badge: '✨ ભારતનું નંબર ૧ ૩D ઇવેન્ટ પ્લેટફોર્મ',
      hero_title_1: 'તમારી નજીકનો વાડી, હોલ, મંડપ, કાર',
      hero_title_2: 'અને ઇવેન્ટ સેવાઓ એક જ જગ્યાએ શોધો',
      hero_subtitle: '૩D માં જુઓ, તારીખો તપાસો અને દલાલ વગર સીધા માલિક પાસેથી બુક કરો.',
      search_placeholder: 'વાર્ષિક હોલ, પાર્ટી પ્લોટ, મંડપ, કેટરિંગ...',
      city_placeholder: 'શહેર / જિલ્લો / મારી નજીક',
      search_btn: 'શોધો',
      ai_search_btn: '🤖 હોલ ખોજ AI ને પૂછો',
      section_categories_title: '૧૯ ઇવેન્ટ શ્રેણીઓ',
      section_venues_title: 'ચકાસાયેલ શ્રેષ્ઠ સ્થળો',
      cat_marriage_halls: 'મેરેજ હોલ / વાડી',
      cat_banquet_halls: 'બેન્ક્વેટ હોલ',
      cat_tent_houses: 'મંડપ ડેકોરેશન',
      cat_catering: 'કેટરિંગ',
      cat_photography: 'ફોટોગ્રાફી',
      cat_dj: 'ડીજે અને સાઉન્ડ',
      cat_wedding_cars: 'લગ્નની કાર',
      view_details: '૩D માં જુઓ અને બુક કરો',
      starting_from: 'શરૂઆતનો દર',
      advance_badge: '૨૫% એડવાન્સ બુકિંગ',
      owner_cta_title: 'શું તમે હોલ અથવા ઇવેન્ટ બિઝનેસના માલિક છો?',
      owner_cta_desc: 'તમારો હોલ મફતમાં લિસ્ટ કરો અને સીધા ગ્રાહકો પાસેથી બુકિંગ મેળવો.',
      owner_cta_btn: 'માલિક તરીકે જોડાઓ',
      footer_tagline: 'દરેક ઉત્સવ માટે ગર્વથી ભારતમાં નિર્મિત 🎉',
      footer_rights: 'સર્વાધિકાર સુરક્ષિત.'
    },
    ur: {
      nav_home: 'ہوم',
      nav_halls: 'ہال تلاش کریں',
      nav_services: 'خدمات',
      nav_owner_portal: 'مالک پورٹل',
      nav_login: 'لاگ ان',
      nav_register: 'رجسٹر کریں',
      nav_dashboard: 'ڈیش بورڈ',
      nav_logout: 'لاگ آؤٹ',
      hero_badge: '✨ ہندوستان کا نمبر 1 تھری ڈی ایونٹ پلیٹ فارم',
      hero_title_1: 'اپنے قریب شادی ہال، شامیانہ، گاڑی',
      hero_title_2: 'اور ایونٹ کی تمام خدمات ایک جگہ تلاش کریں',
      hero_subtitle: 'تھری ڈی میں دیکھیں، تاریخوں کی تصدیق کریں اور بغیر کسی دلال کے براہ راست مالک سے بک کریں۔',
      search_placeholder: 'شادی ہال، شامیانہ، ڈی جے، کیٹرنگ...',
      city_placeholder: 'شہر / ضلع / میرے قریب',
      search_btn: 'تلاش کریں',
      ai_search_btn: '🤖 ہال کھوج اے آئی سے پوچھیں',
      section_categories_title: '19 ایونٹ کیٹگریز',
      section_venues_title: 'تصدیق شدہ شادی ہالز',
      cat_marriage_halls: 'شادی ہالز',
      cat_banquet_halls: 'بینکوئٹ ہالز',
      cat_tent_houses: 'ٹینٹ اور شامیانہ',
      cat_catering: 'کیٹرنگ اور طعام',
      cat_photography: 'فوٹوگرافی',
      cat_dj: 'ڈی جے اور ساؤنڈ',
      cat_wedding_cars: 'شادی کی گاڑیاں',
      view_details: 'تھری ڈی میں دیکھیں اور بک کریں',
      starting_from: 'ابتدائی قیمت',
      advance_badge: '25% پیشگی بکنگ',
      owner_cta_title: 'کیا آپ کسی ہال یا سروس کے مالک ہیں؟',
      owner_cta_desc: 'اپنا ہال مفت رجسٹر کریں اور براہ راست گاہکوں سے بکنگ حاصل کریں۔',
      owner_cta_btn: 'ہال رجسٹر کریں',
      footer_tagline: 'ہر تقریب اور جشن کے لیے ہندوستان میں تیار کردہ 🎉',
      footer_rights: 'جملہ حقوق محفوظ ہیں۔'
    },
    kn: {
      nav_home: 'ಮುಖಪುಟ',
      nav_halls: 'ಕಲ್ಯಾಣ ಮಂಟಪ ಹುಡುಕಿ',
      nav_services: 'ಸೇವೆಗಳು',
      nav_owner_portal: 'ಮಾಲೀಕರ ಪೋರ್ಟಲ್',
      nav_login: 'ಲಾಗಿನ್',
      nav_register: 'ನೋಂದಣಿ',
      nav_dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      nav_logout: 'ಲಾಗ್‌ಔಟ್',
      hero_badge: '✨ ಭಾರತದ ನಂ. 1 3D ಈವೆಂಟ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್',
      hero_title_1: 'ನಿಮ್ಮ ಸಮೀಪದ ಕಲ್ಯಾಣ ಮಂಟಪ, ಶಾಮಿಯಾನ, ಕಾರು',
      hero_title_2: 'ಮತ್ತು ಈವೆಂಟ್ ಸೇವೆಗಳನ್ನು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ಹುಡುಕಿ',
      hero_subtitle: '3D ಯಲ್ಲಿ ವೀಕ್ಷಿಸಿ, ದಿನಾಂಕ ಲಭ್ಯತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ನೇರವಾಗಿ ಬುಕ್ ಮಾಡಿ.',
      search_placeholder: 'ಕಲ್ಯಾಣ ಮಂಟಪ, ಡೆಕೋರೇಶನ್, ಕ್ಯಾಟರಿಂಗ್...',
      city_placeholder: 'ನಗರ / ಜಿಲ್ಲೆ / ನನ್ನ ಹತ್ತಿರ',
      search_btn: 'ಹುಡುಕಿ',
      ai_search_btn: '🤖 ಹಾಲ್ ಖೋಜ್ AI ಕೇಳಿ',
      section_categories_title: '19 ಈವೆಂಟ್ ವರ್ಗಗಳು',
      section_venues_title: 'ಪರಿಶೀಲಿಸಿದ ಪ್ರಮುಖ ಸ್ಥಳಗಳು',
      cat_marriage_halls: 'ಕಲ್ಯಾಣ ಮಂಟಪಗಳು',
      cat_banquet_halls: 'ಬ್ಯಾಂಕ್ವೆಟ್ ಹಾಲ್ಸ್',
      cat_tent_houses: 'ಶಾಮಿಯಾನ ಹೌಸ್',
      cat_catering: 'ಕ್ಯಾಟರಿಂಗ್',
      cat_photography: 'ಫೋಟೋಗ್ರಫಿ',
      cat_dj: 'ಡಿಜೆ ಮತ್ತು ಧ್ವನಿ ವ್ಯವಸ್ಥೆ',
      cat_wedding_cars: 'ಮದುವೆ ಕಾರುಗಳು',
      view_details: '3D ಯಲ್ಲಿ ನೋಡಿ ಬುಕ್ ಮಾಡಿ',
      starting_from: 'ಆರಂಭಿಕ ದರ',
      advance_badge: '25% ಮುಂಗಡ ಬುಕಿಂಗ್',
      owner_cta_title: 'ನೀವು ಕಲ್ಯಾಣ ಮಂಟಪ ಅಥವಾ ಈವೆಂಟ್ ಸೇವೆಗಳ ಮಾಲೀಕರೇ?',
      owner_cta_desc: 'ನಿಮ್ಮ ಮಂಟಪವನ್ನು ಉಚಿತವಾಗಿ ನೋಂದಾಯಿಸಿ ಮತ್ತು ನೇರ ಬುಕಿಂಗ್ ಪಡೆಯಿರಿ.',
      owner_cta_btn: 'ಮಾಲೀಕರಾಗಿ ನೋಂದಾಯಿಸಿ',
      footer_tagline: 'ಪ್ರತಿಯೊಂದು ಸಂಭ್ರಮಕ್ಕಾಗಿ ಭಾರತದಲ್ಲಿ ಹೆಮ್ಮೆಯಿಂದ ನಿರ್ಮಿಸಲಾಗಿದೆ 🎉',
      footer_rights: 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.'
    },
    or: {
      nav_home: 'ମୁଖ୍ୟ ପୃଷ୍ଠା',
      nav_halls: 'ମଣ୍ଡପ ଖୋଜନ୍ତୁ',
      nav_services: 'ସେବା ସମୂହ',
      nav_owner_portal: 'ମାଲିକ ପୋର୍ଟାଲ',
      nav_login: 'ଲଗଇନ୍',
      nav_register: 'ପଞ୍ଜୀକରଣ',
      nav_dashboard: 'ଡ୍ୟାସବୋର୍ଡ',
      nav_logout: 'ଲଗଆଉଟ୍',
      hero_badge: '✨ ଭାରତର ନଂ ୧ ୩D ଇଭେଣ୍ଟ ପ୍ଲାଟଫର୍ମ',
      hero_title_1: 'ଆପଣଙ୍କ ନିକଟସ୍ଥ କଲ୍ୟାଣ ମଣ୍ଡପ, ଟେଣ୍ଟ, ଗାଡ଼ି',
      hero_title_2: 'ଏବଂ ଇଭେଣ୍ଟ ସେବା ଗୋଟିଏ ସ୍ଥାନରେ ଖୋଜନ୍ତୁ',
      hero_subtitle: '୩D ରେ ଦେଖନ୍ତୁ, ତାରିଖ ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ ବିନା ମଧ୍ୟସ୍ଥିରେ ସିଧାସଳଖ ବୁକ୍ କରନ୍ତୁ।',
      search_placeholder: 'କଲ୍ୟାଣ ମଣ୍ଡପ, ଟେଣ୍ଟ, ଡିଜେ, କ୍ୟାଟରିଂ ଖୋଜନ୍ତୁ...',
      city_placeholder: 'ସହର / ଜିଲ୍ଲା / ମୋ ପାଖରେ',
      search_btn: 'ଖୋଜନ୍ତୁ',
      ai_search_btn: '🤖 ହଲ୍ ଖୋଜ୍ AI କୁ ପଚାରନ୍ତୁ',
      section_categories_title: '୧୯ ଇଭେଣ୍ଟ ବର୍ଗ',
      section_venues_title: 'ପ୍ରମାଣିତ ଶ୍ରେଷ୍ଠ ମଣ୍ଡପ',
      cat_marriage_halls: 'କଲ୍ୟାଣ ମଣ୍ଡପ',
      cat_banquet_halls: 'ବ୍ୟାଙ୍କ୍ୱେଟ୍ ହଲ୍',
      cat_tent_houses: 'ଟେଣ୍ଟ ହାଉସ୍',
      cat_catering: 'କ୍ୟାଟରିଂ',
      cat_photography: 'ଫଟୋଗ୍ରାଫି',
      cat_dj: 'ଡିଜେ ଏବଂ ସାଉଣ୍ଡ',
      cat_wedding_cars: 'ବିବାହ ଗାଡ଼ି',
      view_details: '୩D ରେ ଦେଖନ୍ତୁ ଓ ବୁକ୍ କରନ୍ତୁ',
      starting_from: 'ପ୍ରାରମ୍ଭିକ ମୂଲ୍ୟ',
      advance_badge: '୨୫% ଅଗ୍ରୀମ ବୁକିଂ',
      owner_cta_title: 'ଆପଣ ଜଣେ ମଣ୍ଡପ କିମ୍ବା ଇଭେଣ୍ଟ ବ୍ୟବସାୟୀ କି?',
      owner_cta_desc: 'ନିଜର ମଣ୍ଡପକୁ ମାଗଣାରେ ତାଲିକାଭୁକ୍ତ କରନ୍ତୁ ଏବଂ ସିଧାସଳଖ ବୁକିଂ ପାଆନ୍ତୁ।',
      owner_cta_btn: 'ମଣ୍ଡପ ଯୋଡନ୍ତୁ',
      footer_tagline: 'ପ୍ରତ୍ୟେକ ଉତ୍ସବ ପାଇଁ ଭାରତରେ ଗର୍ବର ସହିତ ନିର୍ମିତ 🎉',
      footer_rights: 'ସମସ୍ତ ଅଧିକାର ସଂରକ୍ଷିତ।'
    },
    ml: {
      nav_home: 'ഹോം',
      nav_halls: 'ഓഡിറ്റോറിയങ്ങൾ കണ്ടെത്തുക',
      nav_services: 'സേവനങ്ങൾ',
      nav_owner_portal: 'ഉടമസ്ഥ പോർട്ടൽ',
      nav_login: 'ലോഗിൻ',
      nav_register: 'രജിസ്റ്റർ',
      nav_dashboard: 'ഡാഷ്‌ബോർഡ്',
      nav_logout: 'ലോഗൗട്ട്',
      hero_badge: '✨ ഇന്ത്യയിലെ നമ്പർ 1 3D ഇവന്റ് പ്ലാറ്റ്‌ഫോം',
      hero_title_1: 'നിങ്ങളുടെ അടുത്തുള്ള കല്യാണമണ്ഡപം, ടെന്റ്, കാർ',
      hero_title_2: 'കൂടാതെ എല്ലാ ഇവന്റ് സേവനങ്ങളും ഒരിടത്ത് കണ്ടെത്തൂ',
      hero_subtitle: '3D യിൽ കാണൂ, തീയതികൾ പരിശോധിച്ച് ഇടനിലക്കാരില്ലാതെ നേരിട്ട് ബുക്ക് ചെയ്യൂ.',
      search_placeholder: 'കല്യാണമണ്ഡപം, കാറ്ററിംഗ്, ഡെക്കറേഷൻ...',
      city_placeholder: 'നഗരം / ജില്ല / എന്റെ അടുത്ത്',
      search_btn: 'തിരയുക',
      ai_search_btn: '🤖 ഹാൾ ഖോജ് AI യോട് ചോദിക്കൂ',
      section_categories_title: '19 ഇവന്റ് വിഭാഗങ്ങൾ',
      section_venues_title: 'പരിശോധിച്ചുറപ്പിച്ച മികച്ച ഹാളുകൾ',
      cat_marriage_halls: 'കല്യാണമണ്ഡപങ്ങൾ',
      cat_banquet_halls: 'വിരുന്ന് ഹാളുകൾ',
      cat_tent_houses: 'ടെന്റ് ഹൗസ്',
      cat_catering: 'കാറ്ററിംഗ്',
      cat_photography: 'ഫോട്ടോഗ്രാഫി',
      cat_dj: 'ഡിജെ & സൗണ്ട് സിസ്റ്റം',
      cat_wedding_cars: 'വിവാഹ കാറുകൾ',
      view_details: '3D യിൽ കണ്ടു ബുക്ക് ചെയ്യുക',
      starting_from: 'തുടക്ക നിരക്ക്',
      advance_badge: '25% അഡ്വാൻസ് ബുക്കിംഗ്',
      owner_cta_title: 'നിങ്ങൾ ഒരു കല്യാണമണ്ഡപത്തിന്റെ ഉടമയാണോ?',
      owner_cta_desc: 'നിങ്ങളുടെ ഹാൾ സൗജന്യമായി ലിസ്റ്റ് ചെയ്യൂ, ഉപഭോക്താക്കളിൽ നിന്ന് നേരിട്ട് ബുക്കിംഗ് നേടൂ.',
      owner_cta_btn: 'ഉടമയായി രജിസ്റ്റർ ചെയ്യുക',
      footer_tagline: 'ഓരോ ആഘോഷങ്ങൾക്കുമായി ഇന്ത്യയിൽ അഭിമാനത്തോടെ നിർമ്മിച്ചത് 🎉',
      footer_rights: 'എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.'
    },
    pa: {
      nav_home: 'ਹੋਮ',
      nav_halls: 'ਪੈਲੇਸ ਲੱਭੋ',
      nav_services: 'ਸੇਵਾਵਾਂ',
      nav_owner_portal: 'ਮਾਲਕ ਪੋਰਟਲ',
      nav_login: 'ਲਾਗਇਨ',
      nav_register: 'ਰਜਿਸਟਰ',
      nav_dashboard: 'ਡੈਸ਼ਬੋਰਡ',
      nav_logout: 'ਲਾਗਆਊਟ',
      hero_badge: '✨ ਭਾਰਤ ਦਾ ਨੰਬਰ 1 3D ਈਵੈਂਟ ਪਲੇਟਫਾਰਮ',
      hero_title_1: 'ਆਪਣੇ ਨੇੜਲਾ ਮੈਰਿਜ ਪੈਲੇਸ, ਟੈਂਟ, ਕਾਰ',
      hero_title_2: 'ਅਤੇ ਸਾਰੀਆਂ ਈਵੈਂਟ ਸੇਵਾਵਾਂ ਇੱਕੋ ਥਾਂ ਲੱਭੋ',
      hero_subtitle: '3D ਵਿਚ ਦੇਖੋ, ਤਾਰੀਖਾਂ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਬਿਨਾਂ ਕਿਸੇ ਵਿਚੋਲੇ ਦੇ ਸਿੱਧਾ ਮਾਲਕ ਤੋਂ ਬੁੱਕ ਕਰੋ।',
      search_placeholder: 'ਮੈਰਿਜ ਪੈਲੇਸ, ਟੈਂਟ, ਡੀਜੇ, ਕੈਟਰਿੰਗ ਲੱਭੋ...',
      city_placeholder: 'ਸ਼ਹਿਰ / ਜ਼ਿਲ੍ਹਾ / ਮੇਰੇ ਨੇੜੇ',
      search_btn: 'ਲੱਭੋ',
      ai_search_btn: '🤖 ਹਾਲ ਖੋਜ AI ਨੂੰ ਪੁੱਛੋ',
      section_categories_title: '19 ਈਵੈਂਟ ਸ਼੍ਰੇਣੀਆਂ',
      section_venues_title: 'ਤਸਦੀਕਸ਼ੁਦਾ ਟੌਪ ਪੈਲੇਸ',
      cat_marriage_halls: 'ਮੈਰਿਜ ਪੈਲੇਸ',
      cat_banquet_halls: 'ਬੈਂਕੁਇਟ ਹਾਲ',
      cat_tent_houses: 'ਟੈਂਟ ਹਾਊਸ',
      cat_catering: 'ਕੈਟਰਿੰਗ',
      cat_photography: 'ਫੋਟੋਗ੍ਰਾਫੀ',
      cat_dj: 'ਡੀਜੇ ਤੇ ਸਾਊਂਡ',
      cat_wedding_cars: 'ਵਿਆਹ ਵਾਲੀ ਕਾਰ',
      view_details: '3D ਵਿਚ ਦੇਖੋ ਤੇ ਬੁੱਕ ਕਰੋ',
      starting_from: 'ਸ਼ੁਰੂਆਤੀ ਰੇਟ',
      advance_badge: '25% ਐਡਵਾਂਸ ਬੁਕਿੰਗ',
      owner_cta_title: 'ਕੀ ਤੁਸੀਂ ਕਿਸੇ ਪੈਲੇਸ ਜਾਂ ਈਵੈਂਟ ਸੇਵਾ ਦੇ ਮਾਲਕ ਹੋ?',
      owner_cta_desc: 'ਆਪਣਾ ਪੈਲੇਸ ਜਾਂ ਟੈਂਟ ਮੁਫ਼ਤ ਰਜਿਸਟਰ ਕਰੋ ਅਤੇ ਗਾਹਕਾਂ ਤੋਂ ਸਿੱਧੀ ਬੁਕਿੰਗ ਪਾਓ।',
      owner_cta_btn: 'ਪੈਲੇਸ ਰਜਿਸਟਰ ਕਰੋ',
      footer_tagline: 'ਹਰ ਜਸ਼ਨ ਤੇ ਖੁਸ਼ੀ ਲਈ ਮਾਣ ਨਾਲ ਭਾਰਤ ਵਿਚ ਬਣਾਇਆ ਗਿਆ 🎉',
      footer_rights: 'ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।'
    }
  };

  const STORAGE_KEY = 'hkf_selected_language';

  function getCurrentLang() {
    return localStorage.getItem(STORAGE_KEY) || 'hi';
  }

  function setLanguage(langCode) {
    if (!TRANSLATIONS[langCode]) {
      langCode = 'hi';
    }
    localStorage.setItem(STORAGE_KEY, langCode);
    applyTranslations(langCode);

    // RTL support for Urdu
    const langObj = LANGUAGES.find(l => l.code === langCode);
    if (langObj && langObj.rtl) {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.removeAttribute('dir');
    }

    // Update select element if present
    const select = document.getElementById('hkf-language-select');
    if (select && select.value !== langCode) {
      select.value = langCode;
    }

    window.dispatchEvent(new CustomEvent('hkf:languageChanged', { detail: { lang: langCode } }));
  }

  function t(key, defaultText = '') {
    const lang = getCurrentLang();
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      return TRANSLATIONS[lang][key];
    }
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return defaultText || key;
  }

  function applyTranslations(langCode) {
    const currentDict = TRANSLATIONS[langCode] || TRANSLATIONS.hi;
    const fallbackDict = TRANSLATIONS.en;

    // Elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = currentDict[key] || fallbackDict[key];
      if (val) {
        el.textContent = val;
      }
    });

    // Elements with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = currentDict[key] || fallbackDict[key];
      if (val) {
        el.setAttribute('placeholder', val);
      }
    });

    // Elements with data-i18n-html
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const val = currentDict[key] || fallbackDict[key];
      if (val) {
        el.innerHTML = val;
      }
    });
  }

  // Inject sleek Language Switcher Widget into Navbar
  function renderLanguageSwitcher() {
    const targetContainers = document.querySelectorAll('.language-switcher-container, #language-selector-mount');
    const current = getCurrentLang();

    targetContainers.forEach(container => {
      if (container.querySelector('#hkf-language-select')) return; // already rendered

      const wrapper = document.createElement('div');
      wrapper.className = 'hkf-lang-picker-wrapper';
      wrapper.innerHTML = `
        <label for="hkf-language-select" class="hkf-lang-label" title="Change Language">
          <span class="lang-icon">🌐</span>
          <select id="hkf-language-select" class="hkf-lang-select" aria-label="Select Language">
            ${LANGUAGES.map(l => `
              <option value="${l.code}" ${l.code === current ? 'selected' : ''}>
                ${l.flag} ${l.name} (${l.english})
              </option>
            `).join('')}
          </select>
        </label>
      `;

      const select = wrapper.querySelector('select');
      select.addEventListener('change', (e) => {
        setLanguage(e.target.value);
      });

      container.appendChild(wrapper);
    });
  }

  // Expose globally
  window.HKF_i18n = {
    LANGUAGES,
    setLanguage,
    getCurrentLang,
    t,
    applyTranslations,
    renderLanguageSwitcher
  };

  // Auto-init on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    const current = getCurrentLang();
    renderLanguageSwitcher();
    applyTranslations(current);
  });
})();
