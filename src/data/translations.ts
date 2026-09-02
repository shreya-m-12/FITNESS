import { LanguageCode } from '../types';

export interface TranslationDictionary {
  appTitle: string;
  tagline: string;
  citizenPortal: string;
  officerDashboard: string;
  ministryPortal: string;
  voiceSearchPlaceholder: string;
  speakButton: string;
  listening: string;
  findActivities: string;
  filterTitle: string;
  duration: string;
  duration15: string;
  duration30: string;
  duration45: string;
  duration60: string;
  spaceType: string;
  allSpaces: string;
  indoor: string;
  outdoor: string;
  coveredTurf: string;
  openGymSpace: string;
  homeBalcony: string;
  equipment: string;
  noEquipment: string;
  basicEquipment: string;
  fullEquipment: string;
  racquetBall: string;
  fitnessWear: string;
  budget: string;
  freeOnly: string;
  anyBudget: string;
  reportDamageBtn: string;
  facilitiesFound: string;
  conditionScore: string;
  kheloIndia: string;
  fitIndia: string;
  verifiedULB: string;
  activeNow: string;
  navigate: string;
  freeBadge: string;
  paidBadge: string;
  slaBreachWarning: string;
  issueWorkOrder: string;
  budgetOptimizer: string;
  aesScore: string;
  desertWard: string;
  aiScanning: string;
  submitReport: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appTitle: 'OPENMOVE India',
    tagline: 'National Activity Equity & Sports Infrastructure Intelligence Platform',
    citizenPortal: 'Citizen Activity Finder',
    officerDashboard: 'Municipal Officer SLA Desk',
    ministryPortal: 'Apex Ministry & AES Heatmap',
    voiceSearchPlaceholder: 'Ask in any language: e.g. "Free badminton or jogging track near me for 30 mins"...',
    speakButton: 'Speak',
    listening: 'Listening to your voice...',
    findActivities: 'Find Active Spaces',
    filterTitle: 'Constraint Questionnaire',
    duration: 'Available Time',
    duration15: 'Quick 15 Min',
    duration30: 'Standard 30 Min',
    duration45: 'Extended 45 Min',
    duration60: 'Full 60+ Min',
    spaceType: 'Space Preference',
    allSpaces: 'All Spaces',
    indoor: 'Indoor Stadium',
    outdoor: 'Outdoor / Open Park',
    coveredTurf: 'Covered Turf',
    openGymSpace: 'Open Gym / Calisthenics',
    homeBalcony: 'Indoor Home / Balcony Space',
    equipment: 'Equipment on Hand',
    noEquipment: 'None (Bodyweight / Running)',
    basicEquipment: 'Basic (Rope / Band / Mat)',
    fullEquipment: 'Full (Racket / Ball / Gear)',
    racquetBall: 'Racquet / Ball',
    fitnessWear: 'Fitness Wear / Shoes',
    budget: 'Budget Constraint',
    freeOnly: '100% Free Public',
    anyBudget: 'Subsidized & Paid Pass',
    reportDamageBtn: 'Report Broken Facility (AI Verified)',
    facilitiesFound: 'Verified Active Facilities Nearby',
    conditionScore: 'AI Condition Score',
    kheloIndia: 'Khelo India Partner',
    fitIndia: 'Fit India Certified',
    verifiedULB: 'ULB Municipal Verified',
    activeNow: 'Citizens active now',
    navigate: 'Get Directions',
    freeBadge: 'FREE PUBLIC',
    paidBadge: 'COMMUNITY PASS',
    slaBreachWarning: 'SLA Breach Threat (< 12h)',
    issueWorkOrder: 'Generate AI Work Order',
    budgetOptimizer: 'Predictive Infrastructure Budget Optimizer',
    aesScore: 'Activity Equity Score',
    desertWard: 'Physical Activity Desert',
    aiScanning: 'AI Computer Vision Scanning Image...',
    submitReport: 'Submit Verified Grievance'
  },
  hi: {
    appTitle: 'ओपन-मूव इंडिया',
    tagline: 'राष्ट्रीय खेल एवं गतिविधि समानता आसूचना मंच (MYAS / MoHUA)',
    citizenPortal: 'नागरिक गतिविधि खोजक',
    officerDashboard: 'नगर निगम अधिकारी एसएलए पटल',
    ministryPortal: 'मंत्रालय एवं एईएस समता हीटमैप',
    voiceSearchPlaceholder: 'अपनी भाषा में बोलें या लिखें: जैसे "मुझे 30 मिनट के लिए पास में मुफ्त बैडमिंटन या रनिंग ट्रैक चाहिए"...',
    speakButton: 'बोलें',
    listening: 'आपकी आवाज सुनी जा रही है...',
    findActivities: 'खेल व व्यायाम स्थल खोजें',
    filterTitle: 'सुविधा प्रश्नावली',
    duration: 'उपलब्ध समय',
    duration15: '15 मिनट त्वरित',
    duration30: '30 मिनट सामान्य',
    duration45: '45 मिनट सघन',
    duration60: '60+ मिनट पूर्ण',
    spaceType: 'स्थान का प्रकार',
    allSpaces: 'सभी स्थान',
    indoor: 'इनडोर स्टेडियम',
    outdoor: 'ओपन पार्क / आउटडोर',
    coveredTurf: 'कवर्ड टर्फ',
    openGymSpace: 'ओपन जिम / पार्क',
    homeBalcony: 'घर / बालकनी स्थान',
    equipment: 'उपलब्ध खेल सामग्री',
    noEquipment: 'कुछ नहीं (केवल शारीरिक वजन)',
    basicEquipment: 'सामान्य (रस्सी / बैंड / चटाई)',
    fullEquipment: 'पूर्ण (रैकेट / बॉल / किट)',
    racquetBall: 'रैकेट / गेंद',
    fitnessWear: 'स्पोर्ट्स जूते / ट्रैकसूट',
    budget: 'बजट सीमा',
    freeOnly: '100% निःशुल्क सार्वजनिक',
    anyBudget: 'रियायती पास सहित',
    reportDamageBtn: 'क्षतिग्रस्त सुविधा रिपोर्ट करें (एआई सत्यापित)',
    facilitiesFound: 'सत्यापित खेल एवं फिटनेस स्थल',
    conditionScore: 'एआई स्थिति स्कोर',
    kheloIndia: 'खेलो इंडिया पार्टनर',
    fitIndia: 'फिट इंडिया प्रमाणित',
    verifiedULB: 'नगर निगम द्वारा सत्यापित',
    activeNow: 'नागरिक अभी सक्रिय',
    navigate: 'दिशा-निर्देश पाएं',
    freeBadge: 'निःशुल्क सार्वजनिक',
    paidBadge: 'सामुदायिक पास',
    slaBreachWarning: 'एसएलए समय सीमा चेतावनी (< 12 घंटे)',
    issueWorkOrder: 'कार्य आदेश (वर्क आर्डर) जारी करें',
    budgetOptimizer: 'एआई बजट एवं नवीन अवसंरचना अनुकूलक',
    aesScore: 'गतिविधि समता स्कोर (AES)',
    desertWard: 'शारीरिक गतिविधि मरुस्थल (कम सुविधा)',
    aiScanning: 'एआई कंप्यूटर विज़न फोटो की जांच कर रहा है...',
    submitReport: 'सत्यापित शिकायत दर्ज करें'
  },
  mr: {
    appTitle: 'ओपन-मूव्ह इंडिया',
    tagline: 'राष्ट्रीय क्रीडा व क्रियाकलाप समानता गुप्तवार्ता व्यासपीठ',
    citizenPortal: 'नागरिक क्रीडा शोधक',
    officerDashboard: 'महानगरपालिका अधिकारी डॅशबोर्ड',
    ministryPortal: 'मंत्रालय व एईएस समता विश्लेषण',
    voiceSearchPlaceholder: 'मराठीत विचारा: उदा. "मला जवळच 30 मिनिटांसाठी मोफत धावण्याचा ट्रॅक हवा आहे"...',
    speakButton: 'बोला',
    listening: 'ऐकत आहे...',
    findActivities: 'क्रीडांगणे शोधा',
    filterTitle: 'पसंती प्रश्नावली',
    duration: 'वेळ',
    duration15: '15 मिनिटे',
    duration30: '30 मिनिटे',
    duration45: '45 मिनिटे',
    duration60: '60+ मिनिटे',
    spaceType: 'जागा प्रकार',
    allSpaces: 'सर्व मैदाने',
    indoor: 'इनडोअर स्टेडियम',
    outdoor: 'खुली मैदाने',
    coveredTurf: 'कव्हर टर्फ',
    openGymSpace: 'ओपन जिम / मैदान',
    homeBalcony: 'घरातील जागा / बाल्कनी',
    equipment: 'साहित्य',
    noEquipment: 'काही नाही (बॉडीवेट)',
    basicEquipment: 'मूलभूत (दौरी / बँड)',
    fullEquipment: 'पूर्ण (रॅकेट / बॉल / गियर)',
    racquetBall: 'रॅकेट / बॉल',
    fitnessWear: 'क्रीडा पोशाख',
    budget: 'बजेट',
    freeOnly: 'मोफत सार्वजनिक',
    anyBudget: 'सर्व',
    reportDamageBtn: 'तक्रार नोंदवा (AI तपासणी)',
    facilitiesFound: 'जवळची उपलब्ध क्रीडांगणे',
    conditionScore: 'AI गुणवत्ता गुण',
    kheloIndia: 'खेलो इंडिया भागीदार',
    fitIndia: 'फिट इंडिया प्रमाणित',
    verifiedULB: 'महापालिका प्रमाणित',
    activeNow: 'सध्या कार्यरत',
    navigate: 'मार्ग पहा',
    freeBadge: 'मोफत',
    paidBadge: 'शुल्क पास',
    slaBreachWarning: 'SLA मुदत चेतावणी',
    issueWorkOrder: 'वर्क ऑर्डर जारी करा',
    budgetOptimizer: 'AI बजेट ऑप्टिमायझर',
    aesScore: 'समानता निर्देशांक (AES)',
    desertWard: 'कमी क्रीडा सुविधा विभाग',
    aiScanning: 'AI फोटो तपासणी चालू आहे...',
    submitReport: 'तक्रार सबमिट करा'
  },
  ta: {
    appTitle: 'ஓபன்-மூவ் இந்தியா',
    tagline: 'தேசிய விளையாட்டு உள்கட்டமைப்பு சமத்துவ தளம்',
    citizenPortal: 'குடிமக்கள் விளையாட்டு தேடல்',
    officerDashboard: 'நகராட்சி அதிகாரி கட்டுப்பாட்டு அறை',
    ministryPortal: 'அமைச்சக ஆய்வு மற்றும் AES வரைபடம்',
    voiceSearchPlaceholder: 'தமிழில் பேசுங்கள்: "30 நிமிட நடைப்பயிற்சி அல்லது இறகுப்பந்து அரங்கம் அருகில் உள்ளதா"...',
    speakButton: 'பேசுங்கள்',
    listening: 'கேட்கிறது...',
    findActivities: 'மைதானங்களை கண்டறியவும்',
    filterTitle: 'தேவை விவரங்கள்',
    duration: 'கிடைக்கும் நேரம்',
    duration15: '15 நிமிடம்',
    duration30: '30 நிமிடம்',
    duration45: '45 நிமிடம்',
    duration60: '60+ நிமிடம்',
    spaceType: 'இட வகை',
    allSpaces: 'அனைத்தும்',
    indoor: 'உள்விளையாட்டரங்கம்',
    outdoor: 'வெளிப்புற மைதானம்',
    coveredTurf: 'செயற்கை புல்வெளி',
    openGymSpace: 'திறந்தவெளி உடற்பயிற்சிக்கூடம்',
    homeBalcony: 'வீட்டு இடம் / பால்கனி',
    equipment: 'உபகரணங்கள்',
    noEquipment: 'ஏதுமில்லை (உடல் எடை)',
    basicEquipment: 'அடிப்படை (கயிறு / பட்டை)',
    fullEquipment: 'முழுமையானது (மட்டை / பந்து)',
    racquetBall: 'மட்டை / பந்து',
    fitnessWear: 'விளையாட்டு காலணி',
    budget: 'கட்டணம்',
    freeOnly: 'இலவச பொது மைதானம்',
    anyBudget: 'அனைத்தும்',
    reportDamageBtn: 'சேதத்தை புகாரளிக்கவும் (AI ஆய்வு)',
    facilitiesFound: 'அருகிலுள்ள சரிபார்க்கப்பட்ட மைதானங்கள்',
    conditionScore: 'AI நிலை மதிப்பெண்',
    kheloIndia: 'கேலோ இந்தியா பங்குதாரர்',
    fitIndia: 'ஃபிட் இந்தியா சான்றளிக்கப்பட்டது',
    verifiedULB: 'நகராட்சி சரிபார்க்கப்பட்டது',
    activeNow: 'தற்போது விளையாடுவோர்',
    navigate: 'வழித்தடம்',
    freeBadge: 'இலவசம்',
    paidBadge: 'கட்டண பாஸ்',
    slaBreachWarning: 'SLA காலக்கெடு எச்சரிக்கை',
    issueWorkOrder: 'பணி ஆணை பிறப்பிக்கவும்',
    budgetOptimizer: 'AI நிதி ஒதுக்கீட்டு உகப்பாக்கி',
    aesScore: 'செயல்பாட்டு சமத்துவ மதிப்பெண் (AES)',
    desertWard: 'விளையாட்டு வசதி பற்றாக்குறை பகுதி',
    aiScanning: 'AI புகைப்படத்தை பகுப்பாய்வு செய்கிறது...',
    submitReport: 'புகாரை பதிவு செய்யவும்'
  },
  bn: {
    appTitle: 'ওপেন-মুভ ইন্ডিয়া',
    tagline: 'জাতীয় ক্রীড়া পরিকাঠামো সমতা প্ল্যাটফর্ম (MYAS / MoHUA)',
    citizenPortal: 'নাগরিক কার্যকলাপ অনুসন্ধান',
    officerDashboard: 'পৌর আধিকারিক ড্যাশবোর্ড',
    ministryPortal: 'মন্ত্রক ও AES সমতা মানচিত্র',
    voiceSearchPlaceholder: 'বাংলায় বলুন: "আমার কাছাকাছি ৩০ মিনিটের জন্য ফ্রি ব্যাডমিন্টন বা জগিং ট্র্যাক"...',
    speakButton: 'বলুন',
    listening: 'শুনছি...',
    findActivities: 'খেলার স্থান খুঁজুন',
    filterTitle: 'পছন্দ তালিকা',
    duration: 'সময়',
    duration15: '১৫ মিনিট',
    duration30: '৩০ মিনিট',
    duration45: '৪৫ মিনিট',
    duration60: '৬০+ মিনিট',
    spaceType: 'স্থানের ধরন',
    allSpaces: 'সকল স্থান',
    indoor: 'ইনডোর স্টেডিয়াম',
    outdoor: 'খোলা পার্ক / মাঠ',
    coveredTurf: 'কভার্ড টার্ফ',
    openGymSpace: 'ওপেন জিম / মাঠ',
    homeBalcony: 'ঘরের পরিবেশ / বারান্দা',
    equipment: 'সরঞ্জাম',
    noEquipment: 'কিছুই নেই (বডিওয়েট)',
    basicEquipment: 'প্রাথমিক (দড়ি / ব্যান্ড / মাদুর)',
    fullEquipment: 'সম্পূর্ণ (র‍্যাকেট / বল / গিয়ার)',
    racquetBall: 'র‍্যাकेट / বল',
    fitnessWear: 'স্পোর্টস জুতো',
    budget: 'বাজেট',
    freeOnly: 'সম্পূর্ণ ফ্রি',
    anyBudget: 'সব ধরনের',
    reportDamageBtn: 'ক্ষতিগ্রস্ত মাঠ রিপোর্ট করুন (AI যাচাই)',
    facilitiesFound: 'কাছাকাছি অনুমোদিত খেলার মাঠ',
    conditionScore: 'AI গুণমান স্কোর',
    kheloIndia: 'খেলো ইন্ডিয়া পার্টনার',
    fitIndia: 'ফিট ইন্ডিয়া প্রত্যয়িত',
    verifiedULB: 'পৌরসভা দ্বারা যাচাইকৃত',
    activeNow: 'বর্তমানে সক্রিয়',
    navigate: 'দিকনির্দেশ পান',
    freeBadge: 'ফ্রি পাবলিক',
    paidBadge: 'কমিউনিটি পাস',
    slaBreachWarning: 'SLA সময়সীমা সতর্কতা',
    issueWorkOrder: 'ওয়ার্ক অর্ডার তৈরি করুন',
    budgetOptimizer: 'AI বাজেট অপ্টিমাইজার',
    aesScore: 'অ্যাক্টিভিটি ইক্যুইটি স্কোর (AES)',
    desertWard: 'ক্রীড়া পরিকাঠামো শূন্য এলাকা',
    aiScanning: 'AI ছবি স্ক্যান করছে...',
    submitReport: 'অভিযোগ দায়ের করুন'
  }
};
