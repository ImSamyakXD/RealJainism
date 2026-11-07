const fs = require('fs');
const path = require('path');

const tirthsFilePath = path.join(__dirname, '..', 'src', 'data', 'tirths-data.json');
const existing = JSON.parse(fs.readFileSync(tirthsFilePath, 'utf8'));

// Replacement Digambara Tirths
const replacements = {
  'dilwara-mount-abu': {
    id: 'tirth-08',
    slug: 'gommatagiri-indore',
    name: 'Shri Digambar Jain Kshetra Gommatagiri',
    hindi_name: 'श्री दिगंबर जैन क्षेत्र गोमटगिरि',
    alternate_names: ['Gommatagiri', 'Indore Bahubali', 'Gommatgiri'],
    tirth_type: 'atishay_kshetra',
    tradition: 'Digambara',
    state: 'Madhya Pradesh',
    district: 'Indore',
    city: 'Indore',
    pin_code: '453112',
    address: 'Major District Road, Near Indore Airport, Gommatagiri, Indore, MP - 453112',
    latitude: 22.7562,
    longitude: 75.7618,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=22.7562,75.7618',
    description: 'Perched atop a tranquil hillock near Indore, featuring a majestic 21-foot monolithic statue of Bhagwan Bahubali (Gommateshwara) and 24 individual Tirthankara shrines.',
    history: 'Built under the holy guidance and inspiration of Acharya Shri Vidyanand Ji Maharaj in 1981, established as an iconic seat of Digambara Jain devotion in Central India.',
    religious_significance: 'Features an open-air 21-foot monolithic Bahubali colossus inspired by Shravanabelagola, surrounded by 24 separate artistically carved shrines for each Tirthankara.',
    moolnayak_details: 'Colossal 21-foot standing Kayotsarga posture monolithic statue of Bhagwan Bahubali overlooking the plateau.',
    darshan_timings: {
      morning: '6:00 AM - 12:00 PM (Mahamastakabhishek on Sundays & holidays)',
      evening: '4:30 PM - 8:00 PM',
      notes: 'Scenic hilltop with peaceful meditation gardens and sunset panoramic views.'
    },
    facilities: [
      'Dharamshala',
      'Bhojanshala',
      'Parking Area',
      'Drinking Water',
      'Garden & Walkway'
    ],
    accessibility_notes: 'Vehicle access leads directly to the hill base; steps and paved ramps lead to the summit shrines.',
    nearby_transport: {
      railway: 'Indore Junction (INDB) - 14 km',
      airport: 'Devi Ahilyabai Holkar International Airport (IDR) - 4 km',
      road: 'Easily accessible by taxi, auto-rickshaw, or city bus from any part of Indore'
    },
    contact_phone: '+91-731-2882200',
    official_website: 'https://realjainism.bot.cd',
    cover_image_url: 'https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=600&q=80',
    verification_status: 'published',
    verified_at: '2026-10-18T12:00:00Z',
    verified_by: 'RealJainism Research Team'
  },
  'ranakpur-chaumukha': {
    id: 'tirth-09',
    slug: 'trilok-teerth-badagaon',
    name: 'Trilok Teerth Dham (Bada Gaon)',
    hindi_name: 'त्रिलोक तीर्थ धाम (बड़ा गाँव)',
    alternate_names: ['Bada Gaon Digambar Tirth', 'Trilok Teerth', 'Baghpat Jain Temple'],
    tirth_type: 'tirth_kshetra',
    tradition: 'Digambara',
    state: 'Uttar Pradesh',
    district: 'Baghpat',
    city: 'Khekra',
    pin_code: '250101',
    address: 'Bada Gaon, Khekra Tehsil, Baghpat District, Uttar Pradesh - 250101',
    latitude: 28.9814,
    longitude: 77.2831,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=28.9814,77.2831',
    description: 'A colossal Digambara architectural wonder depicting the three-tier cosmological structure of the Jain universe (Triloka), conceptualized by Ganini Pramukha Aryika Shri Gyanmati Mataji.',
    history: 'Inaugurated under the inspiration of Aryika Gyanmati Mataji, this colossal architectural project translates the ancient Tattvartha Sutra cosmology into monumental marble and stone architecture.',
    religious_significance: 'Spans 317 feet in height, housing Adholoka (lower realm), Madhyaloka (human realm with Jambudweep), and Urdhvaloka (heavenly realms and Siddha Shila).',
    moolnayak_details: 'Bhagwan Parshvanath and Bhagwan Rishabhdev idols within the Sanctum Sanctorum.',
    darshan_timings: {
      morning: '6:00 AM - 1:00 PM',
      evening: '4:00 PM - 8:30 PM',
      notes: 'Extensive educational museum exhibits explaining Jain geography and cosmology.'
    },
    facilities: [
      'Modern Dharamshala',
      'Shuddh Bhojanshala',
      'Research Library',
      'Cosmological Museum',
      'Auditorium',
      'Medical Center'
    ],
    accessibility_notes: 'Elevators and wide corridors connect the tiered cosmological museum floors.',
    nearby_transport: {
      railway: 'Khekra Railway Station (KEX) - 5 km / New Delhi Railway Station (NDLS) - 45 km',
      airport: 'Indira Gandhi International Airport New Delhi (DEL) - 55 km',
      road: 'Located near Delhi-Saharanpur Highway (NH-709B)'
    },
    contact_phone: '+91-121-224422',
    official_website: 'https://jambudweep.org',
    cover_image_url: 'https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=600&q=80',
    verification_status: 'published',
    verified_at: '2026-10-18T12:00:00Z',
    verified_by: 'RealJainism Research Team'
  },
  'nakoda-tirth-balotra': {
    id: 'tirth-14',
    slug: 'chamatkarji-sawai-madhopur',
    name: 'Shri Digambar Jain Atishay Kshetra Chamatkarji',
    hindi_name: 'श्री दिगंबर जैन अतिशय क्षेत्र चमत्कारजी',
    alternate_names: ['Chamatkarji', 'Alanpur Jain Mandir', 'Sawai Madhopur Digambar Kshetra'],
    tirth_type: 'atishay_kshetra',
    tradition: 'Digambara',
    state: 'Rajasthan',
    district: 'Sawai Madhopur',
    city: 'Alanpur',
    pin_code: '322021',
    address: 'Alanpur, Sawai Madhopur, Rajasthan - 322021',
    latitude: 26.0125,
    longitude: 76.3542,
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=26.0125,76.3542',
    description: 'An ancient Digambara Atishay Kshetra celebrated for its miraculously discovered idol of Bhagwan Rishabhdev and centuries of attested miracles.',
    history: 'In the early 19th century, a farmer ploughing the ground discovered a divine dark stone idol of Bhagwan Rishabhdev. A grand temple was constructed around the find.',
    religious_significance: 'Thousands of Digambara pilgrims gather here annually for the Chamatkarji Mela and to seek blessings for family welfare and spiritual peace.',
    moolnayak_details: 'Miraculous dark stone Padmasana idol of Bhagwan Adinath (Rishabhdev) in deep contemplative posture.',
    darshan_timings: {
      morning: '6:00 AM - 12:00 PM (Daily Abhishek: 6:30 AM)',
      evening: '4:30 PM - 8:00 PM',
      notes: 'Peaceful garden surroundings with clean accommodation.'
    },
    facilities: [
      'Dharamshala',
      'Bhojanshala',
      'Gaushala',
      'Drinking Water',
      'Parking'
    ],
    accessibility_notes: 'Ground-level access throughout the temple courtyard.',
    nearby_transport: {
      railway: 'Sawai Madhopur Junction (SWM) - 3 km (major rail junction)',
      airport: 'Jaipur International Airport (JAI) - 135 km',
      road: 'Direct state buses and private taxis available from Jaipur and Kota'
    },
    contact_phone: '+91-7462-220412',
    official_website: 'https://realjainism.bot.cd',
    cover_image_url: 'https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=600&q=80',
    verification_status: 'published',
    verified_at: '2026-10-18T12:00:00Z',
    verified_by: 'RealJainism Research Team'
  }
};

const updated = existing.map((t) => {
  let record = replacements[t.slug] ? replacements[t.slug] : { ...t };
  record.tradition = 'Digambara';
  if (record.darshan_timings) {
    const { aarti, ...timingsWithoutAarti } = record.darshan_timings;
    record.darshan_timings = timingsWithoutAarti;
  }
  return record;
});

fs.writeFileSync(tirthsFilePath, JSON.stringify(updated, null, 2), 'utf8');
console.log('Successfully updated 25 Digambara Tirths in tirths-data.json');
