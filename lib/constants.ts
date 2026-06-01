export type Testimonial = {
  name: string
  quote: string
  quoteHE?: string
}

export type Instructor = {
  name: string
  role: string
  bio: string
  image: string
}

export type RetreatInfo = {
  location: string
  dates: string
  duration: string
  pricingILS: string
  pricingEUR: string
  spotsRemaining: number
  spotsTotal: number
  includes: string[]
  ctaUrl: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Sheli',
    quote: 'Deep in every sense — meaningful, joyful, meditative. A shift in perspective and a true blessing.',
    quoteHE: 'עמוק בכל מובן — משמעותי, כיפי ומדיטטיבי. שינוי פרספקטיבה וברכה אמיתית.',
  },
  {
    name: 'Roni',
    quote: 'I came to dedicate time for myself — and I truly achieved that goal. Both handstands and freediving demand relaxation, listening, and quiet. I felt I understood this a little better in both.',
    quoteHE: 'הגעתי להקדיש זמן לעצמי — והרגשתי שלגמרי הגשמתי את המטרה. שניהם דורשים רגיעה, הקשבה ושקט, ובשניהם הצלחתי להבין את זה קצת יותר.',
  },
  {
    name: 'Gali',
    quote: 'This was my second retreat with you — the first was excellent, and I worried this one couldn\'t match it. You managed to surpass it.',
    quoteHE: 'זה הריטריט השני שלי איתכם — הראשון היה מעולה, וחששתי שזה לא יהיה באותה רמה. הצלחתם להתעלות.',
  },
  {
    name: 'Gili',
    quote: 'Wonderful atmosphere, rare people, professional training, insanely delicious food. I didn\'t expect such a complete and rewarding experience.',
    quoteHE: 'אווירה נפלאה ואנשים נדירים, אימונים מקצועיים, אוכל טעים בטירוף. לא ציפיתי לחוויה כל כך שלמה ומתגמלת.',
  },
  {
    name: 'Doron',
    quote: 'An incredible, embracing atmosphere — professional workshops, great food, and exactly the right place.',
    quoteHE: 'אווירה מדהימה ומכילה, מקצועיות בסדנאות, אוכל טוב ולינה שהייתה בדיוק המקום הנכון.',
  },
  {
    name: 'Anat',
    quote: 'Super professional and yet with a pleasant, family-like calm. I felt it was exactly what I needed.',
    quoteHE: 'סופר מקצועי ועם זאת אווירה נעימה ומשפחתית ורגועה. הרגשתי שזה היה כל כך נחוץ.',
  },
  {
    name: 'Maya',
    quote: 'I loved the colors inside the water, the kind people who gave their hearts, and the toolbox I took home. I couldn\'t have imagined a better experience.',
    quoteHE: 'אהבתי את הצבעים בתוך המים, את האנשים החמודים שנתנו את ליבם, ואת ארגז הכלים שלקחתי הביתה.',
  },
  {
    name: 'Dana',
    quote: 'From the moment we arrived, I could disconnect. Quiet, calm, peaceful — and from there everything kept getting better. Professional and warm in equal measure.',
    quoteHE: 'כשהגענו כבר הרגשתי שיכולתי להתנתק. שקט, שלווה, נעים — ומשם הכל רק המשיך להיות יותר טוב.',
  },
  {
    name: 'Anya',
    quote: 'The combination of handstands and freediving is perfect. The team is excellent — instructors, additional guides, and the whole amazing family.',
    quoteHE: 'השילוב בין עמידות ידיים לצלילה מושלם. הצוות מעולה — המדריכים, המדריכים הנוספים, וכמובן המשפחה המדהימה.',
  },
  {
    name: 'Natali',
    quote: 'Open guidance without pressure or ego — a healthy mirror for physical and mental growth. You created an authentic space in the heart of the desert.',
    quoteHE: 'הנחיה פתוחה, בלי לחץ או אגו — מראה בריאה לצמיחה גופנית ומנטלית. יצרתם מרחב אותנטי בלב המדבר.',
  },
  {
    name: 'Yuval',
    quote: 'Spot on. The guidance was very professional, everything was simple, precise, and perfectly suited to the weekend.',
    quoteHE: 'היה בול. ההדרכות מאד מקצועיות, כל המסביב פשוט ומדויק ומאד הלם את התכנים של הסופש.',
  },
]

export const instructors: Instructor[] = [
  {
    name: 'Yuval',
    role: 'Handstand & Movement',
    bio: 'Yuval has spent years training bodies to find balance in the impossible — blending circus arts, calisthenics, and somatic awareness into a practice that feels like remembering something you always knew. He believes inversion is not a trick but a state of mind.',
    image: '/images/yuval-portrait.jpg',
  },
  {
    name: 'Gil',
    role: 'Freediving Instructor',
    bio: 'Gil teaches the ocean not as an obstacle but as a mirror. A certified freediving instructor with thousands of dives, his method is built on trust, breath, and the understanding that stillness underwater is the deepest form of presence.',
    image: '/images/gil-portrait.jpeg',
  },
]

export const upcomingRetreat: RetreatInfo = {
  location: 'Crete, Greece',
  dates: 'June 14–21, 2025',
  duration: '7 nights · 8 days',
  pricingILS: '₪3,500',
  pricingEUR: '€890',
  spotsRemaining: 4,
  spotsTotal: 12,
  includes: [
    'Daily handstand training sessions',
    'Freediving theory, pool & open water',
    'Full board accommodation',
    'All dive equipment included',
    'Airport transfers',
  ],
  ctaUrl: 'mailto:yuvaloz@gmail.com?subject=UpsideDown Retreat — Book My Spot',
}
