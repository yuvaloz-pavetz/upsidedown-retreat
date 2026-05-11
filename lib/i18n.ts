export type Locale = 'en' | 'he'

export const i18n = {
  en: {
    dir: 'ltr' as const,
    nav: {
      logo: 'UpsideDown',
      book: 'Book Now',
      events: 'Events',
    },
    hero: {
      eyebrow: 'A Luxury Retreat',
      words: ['THE', 'UPSIDEDOWN', 'RETREAT'] as [string, string, string],
      subtitle: 'The UpsideDown Retreat is where strength meets stillness. We combine handstand training and freediving in stunning locations, with nourishing food and an incredible community.',
      cta: 'Next Events',
      titleLine1: 'Inverted',
      titleLine2: 'Perspective.',
      titleLine3: 'Deeper Connection.',
      essence: 'Strength. Stillness. Connection.',
      above: 'Above — Strength',
      below: 'Below — Stillness',
    },
    concept: {
      label: 'The Concept',
      title: 'Stronger body.\nCalmer mind.',
      body: 'A unique retreat experience that balances inverted perspectives and deep immersion. We combine handstand training, freediving, nourishing food, and an incredible community — in stunning locations.',
      quote: 'One discipline demands perfect control. The other asks you to let go completely. Together, they create something rare.',
      pillars: [
        { name: 'Handstands', trait: 'Empowering', desc: 'Strength, balance, and precise control. Handstands build strength, discipline, and a new perspective.' },
        { name: 'Freediving', trait: 'Exploratory', desc: 'Breath-hold diving into clear water. Freediving is about trust, calm, and going within.' },
        { name: 'Great Food', trait: 'Nourishing', desc: 'Plant-based, locally sourced. Great food fuels the body and brings people together.' },
        { name: 'Amazing People', trait: 'Connected', desc: 'A small circle that shares something real. Good people, real conversations, lifelong memories.' },
      ] as { name: string; trait: string; desc: string }[],
    },
    experience: {
      sectionLabel: 'The Experience',
      above: {
        eyebrow: 'Above the Surface',
        heading: 'The Art of Inversion',
        body: 'Discover the meditation hidden inside movement. Through handstands, we learn to be comfortable in discomfort — to find stillness in the impossible, and to see the world differently, one breath at a time.',
      },
      below: {
        eyebrow: 'Below the Surface',
        heading: 'The Silence of Depth',
        body: 'In the ocean, everything becomes clear. Freediving strips away noise and leaves only the present moment — the pressure of depth, the warmth of sunlight from above, and the profound quiet of being completely still.',
      },
    },
    timeline: {
      label: 'The Schedule',
      title: 'What happens\nduring the retreat?',
      body: 'A day designed to deepen — not rush. Every session connects to the next.',
      items: [
        { time: 'Early Morning', icon: '○', title: 'Handstand Practice', desc: 'Strength, technique, and balance. A slow, focused session with real progression and lots of play.' },
        { time: 'Mid Morning', icon: '◇', title: 'Breath & Mobility', desc: 'Connecting breath to movement. Preparing the body and nervous system for what\'s ahead.' },
        { time: 'Midday', icon: '◯', title: 'Freediving in Open Water', desc: 'Into clear water. Guided, safe, and profoundly quiet. No rush. No performance.' },
        { time: 'Afternoon', icon: '△', title: 'Shared Meals', desc: 'Long tables, real food, real conversations. The meals are part of the retreat.' },
        { time: 'Late Afternoon', icon: '□', title: 'Rest & Integration', desc: 'Unscheduled time. The body absorbs what it learned. Walk, swim, lie in the sun.' },
        { time: 'Evening', icon: '◎', title: 'Connection & Talks', desc: 'Small group conversations, reflections, or just quiet togetherness. No program.' },
      ] as { time: string; icon: string; title: string; desc: string }[],
    },
    why: {
      label: 'Why This Is Different',
      title: 'Not just\nanother retreat',
      items: [
        { heading: 'A rare combination', desc: "Handstands and freediving don't usually share the same week. They should. Both require stillness, breath, and full presence." },
        { heading: 'Structure and freedom', desc: 'Each day has shape, but not a schedule packed with obligations. Room to go deep.' },
        { heading: 'Genuinely small', desc: 'Not "boutique" as a marketing word. Limited to 15 people max. You won\'t disappear.' },
        { heading: 'Real experience', desc: "Both founders have built careers in their disciplines. This isn't a course — it's immersion." },
        { heading: 'Grounded, not spiritual-bypassy', desc: "We take the body and the practice seriously. You'll be challenged. You'll also feel seen." },
      ] as { heading: string; desc: string }[],
      stats: [
        { num: '15 Max', label: 'People per retreat' },
        { num: '3–6', label: 'Days of immersion' },
        { num: '2', label: 'Disciplines, one world' },
        { num: '1st', label: 'Combination of its kind' },
      ] as { num: string; label: string }[],
    },
    who: {
      label: "Who It's For",
      title: 'Made for\ncurious bodies',
      cards: [
        { title: 'Movement Lovers', desc: 'Anyone who already has a practice — yoga, climbing, dance — and wants to add new depth to it.' },
        { title: 'Curious Beginners', desc: "You don't need to already stand on your hands. You need to want to try. That's enough." },
        { title: 'Challenge Seekers', desc: 'People who want real challenge, without competitiveness or ego. The bar is yours to set.' },
        { title: 'Presence Seekers', desc: 'Those looking for a real experience — not Instagram content. Something to carry home.' },
      ] as { title: string; desc: string }[],
      reassurance: 'No advanced level required. Both handstands and freediving are taught progressively — from wherever you are. Everything adapts to you.',
    },
    testimonials: {
      sectionLabel: 'Participants',
      heading: 'What They Say',
    },
    retreat: {
      sectionLabel: 'Upcoming Retreat',
      investment: 'Investment',
      spotsLabel: 'spots remaining',
      filledTemplate: (filled: number, total: number) => `${filled} of ${total} places filled`,
      includesLabel: "What's Included",
      cta: 'Reserve My Spot',
      disclaimer: 'Deposits accepted · Full balance due 30 days before retreat',
    },
    instructors: {
      label: 'The Guides',
      title: 'Guided by\nexperience',
      yuval: {
        name: 'Yuval Oz',
        role: 'Hand Balancer · Movement Teacher · Performer',
        bio: 'Yuval has spent years at the edge of what a body can balance. His work lives between circus, street performance, and deep movement teaching. He brings precision without rigidity — and play without losing control.',
        tags: ['Hand Balancing', 'Circus Arts', 'Movement', 'Performance'] as string[],
      },
      gil: {
        name: 'Gil Fox',
        role: 'Freediving Instructor · National Record Holder',
        bio: 'Gil knows what it means to go below the surface — literally and metaphorically. A national record holder and certified instructor, he creates a space where depth feels safe. His teaching is calm, methodical, and deeply human.',
        tags: ['Freediving', 'Breath Work', 'Safety', 'Depth'] as string[],
      },
      bridge: 'Together, we bring two complementary worlds:\none above water, one below.\nOne built on precision and control,\nthe other on letting go and going deeper.',
    },
    faq: {
      label: 'Questions',
      title: 'Answers worth\nreading',
      items: [
        { q: 'Do I need to know how to do a handstand to join?', a: "No. You need curiosity and a willingness to work. We teach from the very beginning — wall handstands, shoulder conditioning, balance progressions. If you can already hold a freestanding handstand, we'll take you further." },
        { q: 'Do I need freediving experience?', a: "No experience required. We work with complete beginners through pool breathing and shallow water dives. If you're already a diver, we'll work with your existing skills and take you deeper — technically and experientially." },
        { q: "What's the physical fitness requirement?", a: "You should be generally healthy and active. No specific fitness level needed. The retreat is progressive — each session builds on the last. We've had participants from competitive athletes to people recovering from injuries." },
        { q: 'What does the price include?', a: "All sessions (handstands, freediving, breath work), accommodation, 3 meals per day, equipment use, and small group instruction. Travel is not included." },
        { q: 'How big is the group?', a: "Maximum 15 people. This isn't a number we adjust for revenue. Small groups mean real teaching, real relationships, and an experience that actually changes something." },
        { q: "What's the cancellation policy?", a: "Full refund up to 60 days before the retreat. 50% refund 30–59 days before. No refund within 30 days, but we'll do our best to find you a spot on a future retreat." },
      ] as { q: string; a: string }[],
    },
    newsletter: {
      sectionLabel: 'Stay Informed',
      heading: 'Stay in the Loop',
      subtext: 'New dates, new locations. No noise.',
      placeholder: 'your@email.com',
      button: 'Subscribe',
      success: "You're on the list. See you in the water.",
      error: 'Something went wrong. Try again or email yuvaloz@gmail.com',
    },
    gallery: {
      label: 'The World',
      title: 'In images',
    },
    finalCta: {
      label: 'Be Part of It',
      title: 'Ready to turn your\nworld upside down?',
      sub: 'A few spots remain for 2025. Don\'t wait.',
      btn1: 'View Retreats',
    },
    footer: {
      copyright: '© 2025 UpsideDown Retreat. All rights reserved.',
    },
    events: {
      pageTitle: 'Upcoming Retreats',
      pageSubtext: 'Choose your moment of transformation.',
      noEvents: 'No upcoming events at this time. Stay tuned.',
      registerCta: 'Register',
      learnMore: 'View Details',
      spotsLeft: 'spots left',
      soldOut: 'Sold Out',
      comingSoon: 'Coming Soon',
      lastSpots: 'Last Spots',
      backToEvents: '← All Retreats',
      investment: 'Investment',
      includes: "What's Included",
      registerNow: 'Reserve My Spot',
      disclaimer: 'Deposits accepted · Full balance due 30 days before retreat',
      dates: 'Dates',
      duration: 'Duration',
      location: 'Location',
      gallery: 'Gallery',
      aboutRetreat: 'About This Retreat',
    },
    about: {
      pageTitle: 'About',
      foundersLabel: 'The Founders',
      teamLabel: 'The Team',
      teamSubtext: 'Our freediving instructors bring depth, calm, and expertise to every retreat.',
      noTeam: '',
      yuval: {
        name: 'Yuval Oz',
        role: 'Handstand teacher, movement artist & performer',
        bio: `Yuval teaches handstands through an approach that combines technique, exploration, creativity, and enjoyment of the process.\n\nWith years of experience teaching and performing, he works with practitioners of all levels — from complete beginners to advanced students — focusing on awareness, control, breathing, and efficient movement rather than simply "holding a handstand."\n\nComing from a background in acrobatics, physical theater, and performance, Yuval brings a playful, dynamic, and artistic perspective into his teaching. During the retreat, he will guide handstand sessions, technical drills, and movement exploration practices designed to help participants develop greater balance, freedom, and confidence in their bodies.`,
      },
      gil: {
        name: 'Gil Fox',
        role: 'Freediving instructor & Israeli national record holder',
        bio: `Gil is a freediving instructor and Israeli national record holder with years of experience teaching, coaching, and guiding people both in and out of the water.\n\nHis approach to freediving combines technique, relaxation, breathing, and a deep connection to the body and the sea.\n\nBeyond the athletic aspect of freediving, Gil brings a strong sense of calm, presence, and connection to nature into his teaching. At the retreat, he will guide breathing sessions, water adaptation practices, freediving techniques, and mental training exercises designed to help participants feel more relaxed, confident, and connected in the water.`,
      },
    },
  },

  he: {
    dir: 'rtl' as const,
    nav: {
      logo: 'UpsideDown',
      book: 'הזמן מקום',
      events: 'אירועים',
    },
    hero: {
      eyebrow: 'ריטריט יוקרתי',
      words: ['ה', 'UPSIDEDOWN', 'ריטריט'] as [string, string, string],
      subtitle: 'ריטריט שמשלב דיוק, נשימה, משחק וטבע — לאנשים שרוצים לנוע, לחקור ולראות את העולם מזווית אחרת.',
      cta: 'אירועים קרובים',
      titleLine1: 'Inverted',
      titleLine2: 'Perspective.',
      titleLine3: 'Deeper Connection.',
      essence: 'כוח. שקט. חיבור.',
      above: 'מעל',
      below: 'מתחת',
    },
    concept: {
      label: 'הרעיון',
      title: 'להפוך את עולמך\nראש בתחת',
      body: 'ריטריט ייחודי שמשלב דיוק, נשימה, משחק וטבע. לא בריחה מהחיים — אלא חוויה אחרת שלהם.',
      quote: 'דיסציפלינה אחת דורשת שליטה מוחלטת. השנייה מבקשת שתרפה לחלוטין. ביחד, הן יוצרות משהו נדיר.',
      pillars: [
        { name: 'עמידת ידיים', trait: 'מעצים', desc: 'כוח, שיווי משקל ושליטה מדויקת. עמידות ידיים בונות כוח, משמעת ופרספקטיבה חדשה.' },
        { name: 'צלילה חופשית', trait: 'מגלה', desc: 'צלילת ספיגת נשימה למים צלולים. צלילה היא אמון, שלווה והתכנסות פנימה.' },
        { name: 'אוכל טוב', trait: 'מזין', desc: 'אוכל מלא השראה מהמקום. אוכל טוב מזין את הגוף ומחבר אנשים.' },
        { name: 'אנשים טובים', trait: 'מחובר', desc: 'מעגל קטן שחולק משהו אמיתי. שיחות אמיתיות, זכרונות לכל החיים.' },
      ] as { name: string; trait: string; desc: string }[],
    },
    experience: {
      sectionLabel: 'החוויה',
      above: {
        eyebrow: 'מעל פני השטח',
        heading: 'אמנות ההיפוך',
        body: 'גלו את המדיטציה הטמונה בתנועה. דרך עמידות על ידיים, אנו לומדים להיות בנוח עם האי-נוחות — למצוא שקט במה שנראה בלתי אפשרי, ולראות את העולם אחרת, נשימה אחת בכל פעם.',
      },
      below: {
        eyebrow: 'מתחת לפני השטח',
        heading: 'שקט העומק',
        body: 'באוקיינוס, הכל מתבהר. הצלילה החופשית מסירה את כל הרעש ומותירה רק את הרגע הנוכחי — לחץ העומק, חמימות אור השמש מלמעלה, והשקט העמוק של נוכחות מלאה.',
      },
    },
    timeline: {
      label: 'לוח הזמנים',
      title: 'מה קורה\nבמהלך הריטריט?',
      body: 'יום שמיועד להעמקה — לא לרוץ. כל סשן מתחבר לבא אחריו.',
      items: [
        { time: 'בוקר מוקדם', icon: '○', title: 'אימון עמידת ידיים', desc: 'כוח, טכניקה ושיווי משקל. סשן ממוקד ואיטי עם התקדמות אמיתית והרבה משחק.' },
        { time: 'אמצע הבוקר', icon: '◇', title: 'נשימה וניידות', desc: 'חיבור נשימה לתנועה. הכנת הגוף והמערכת העצבית למה שעומד לפניה.' },
        { time: 'צהריים', icon: '◯', title: 'צלילה חופשית במים פתוחים', desc: 'אל תוך מים צלולים. מודרך, בטוח ושקט עמוקות. ללא מהירות. ללא ביצועים.' },
        { time: 'אחר הצהריים', icon: '△', title: 'ארוחות משותפות', desc: 'שולחנות ארוכים, אוכל אמיתי, שיחות אמיתיות. הארוחות הן חלק מהריטריט.' },
        { time: 'סוף אחר הצהריים', icon: '□', title: 'מנוחה ושילוב', desc: 'זמן לא מתוכנן. הגוף קולט מה שלמד. ללכת, לשחות, לשכב בשמש.' },
        { time: 'ערב', icon: '◎', title: 'חיבור ושיחות', desc: 'שיחות קבוצה קטנה, השתקפויות, או פשוט שקט משותף. ללא תכנית.' },
      ] as { time: string; icon: string; title: string; desc: string }[],
    },
    why: {
      label: 'למה זה שונה',
      title: 'לא עוד\nריטריט',
      items: [
        { heading: 'שילוב נדיר', desc: 'עמידות ידיים וצלילה חופשית בדרך כלל לא חולקות את אותו שבוע. הן צריכות. שתיהן דורשות שקט, נשימה ונוכחות מלאה.' },
        { heading: 'מבנה וחופש', desc: 'לכל יום יש צורה, אבל לא לוח זמנים עמוס בחובות. מקום להעמיק.' },
        { heading: 'קטן באמת', desc: 'לא "בוטיק" כמילת שיווק. מוגבל ל-8-12 אנשים. לא תיעלם.' },
        { heading: 'ניסיון אמיתי', desc: 'שני המייסדים בנו קריירות בדיסציפלינות שלהם. זה לא קורס — זו השקעה.' },
        { heading: 'מוצק, לא רוחני-מניפולטיבי', desc: 'אנחנו לוקחים את הגוף ואת הפרקטיקה ברצינות. תאותגר. גם תרגיש נראה.' },
      ] as { heading: string; desc: string }[],
      stats: [
        { num: '8-12', label: 'משתתפים לריטריט' },
        { num: '6', label: 'ימים של השקעה' },
        { num: '2', label: 'דיסציפלינות, עולם אחד' },
        { num: 'ראשון', label: 'שילוב מסוגו' },
      ] as { num: string; label: string }[],
    },
    who: {
      label: 'למי זה מיועד',
      title: 'עבור\nגופות סקרניות',
      cards: [
        { title: 'אוהבי תנועה', desc: 'כל מי שכבר יש לו פרקטיקה — יוגה, טיפוס, ריקוד — ורוצה להוסיף לה עומק חדש.' },
        { title: 'מתחילים סקרנים', desc: 'לא צריך לעמוד על הידיים. צריך לרצות לנסות. זה מספיק.' },
        { title: 'מחפשי אתגר', desc: 'אנשים שרוצים אתגר אמיתי, ללא תחרותיות או אגו. הרף שלך לקבוע.' },
        { title: 'מחפשי נוכחות', desc: 'אלה שמחפשים חוויה אמיתית — לא תוכן לאינסטגרם. משהו לקחת הביתה.' },
      ] as { title: string; desc: string }[],
      reassurance: 'לא נדרש רמה מתקדמת. גם עמידות ידיים וגם צלילה חופשית מלומדים בהדרגה — מאיפה שאתה. הכל מתאים אליך.',
    },
    testimonials: {
      sectionLabel: 'משתתפים',
      heading: 'מה אומרים עלינו',
    },
    retreat: {
      sectionLabel: 'ריטריט קרוב',
      investment: 'השקעה',
      spotsLabel: 'מקומות נותרים',
      filledTemplate: (filled: number, total: number) => `${filled} מתוך ${total} מקומות מלאים`,
      includesLabel: 'מה כלול',
      cta: 'שמור את מקומי',
      disclaimer: 'מקדמות מתקבלות · יתרת התשלום 30 יום לפני הריטריט',
    },
    instructors: {
      label: 'המדריכים',
      title: 'מונחים על ידי\nניסיון',
      yuval: {
        name: 'יובל עוז',
        role: 'מאזן ידיים · מורה תנועה · אמן בידור',
        bio: 'יובל בילה שנים על הקצה של מה שגוף יכול לאזן. עבודתו חיה בין קרקס, הופעות רחוב והוראת תנועה עמוקה. הוא מביא דיוק ללא נוקשות — ומשחק מבלי לאבד שליטה.',
        tags: ['איזון ידיים', 'אמנויות קרקס', 'תנועה', 'הופעה'] as string[],
      },
      gil: {
        name: 'גיל פוקס',
        role: 'מדריך צלילה חופשית · שיאן לאומי',
        bio: 'גיל יודע מה זה לרדת מתחת לפני השטח — פשוטו כמשמעו ומטאפורית. שיאן לאומי ומדריך מוסמך, הוא יוצר מרחב בו עומק מרגיש בטוח. הוראתו שקטה, מתודית ועמוקות אנושית.',
        tags: ['צלילה חופשית', 'עבודת נשימה', 'בטיחות', 'עומק'] as string[],
      },
      bridge: 'ביחד, אנחנו מביאים שני עולמות משלימים:\nאחד מעל המים, אחד מתחתיהם.\nאחד בנוי על דיוק ושליטה,\nהאחר על שחרור והעמקה.',
    },
    faq: {
      label: 'שאלות',
      title: 'תשובות שכדאי\nלקרוא',
      items: [
        { q: 'האם אני צריך לדעת לעמוד על הידיים?', a: 'לא. אתה צריך סקרנות ורצון לעבוד. אנחנו מלמדים מההתחלה — עמידות קיר, הכנת כתפיים, התקדמות שיווי משקל. אם אתה כבר יודע לעמוד, ניקח אותך קדימה.' },
        { q: 'האם אני צריך ניסיון בצלילה חופשית?', a: 'לא נדרש ניסיון. אנחנו עובדים עם מתחילים מוחלטים דרך נשימה בבריכה וצלילות רדודות. אם אתה כבר צולל, נעבוד עם הכישורים הקיימים שלך.' },
        { q: 'מה דרישות הכושר הגופני?', a: 'עליך להיות בריא ופעיל באופן כללי. לא נדרשת רמת כושר ספציפית. הריטריט הוא הדרגתי — כל סשן בונה על הקודם.' },
        { q: 'מה כולל המחיר?', a: 'כל הסשנים (עמידות ידיים, צלילה חופשית, עבודת נשימה), לינה, 3 ארוחות ביום, שימוש בציוד, והוראה בקבוצה קטנה. טיסות אינן כלולות.' },
        { q: 'כמה גדולה הקבוצה?', a: 'בדיוק 8-12 אנשים. זה לא מספר שאנחנו מתאימים לרווחים. קבוצות קטנות אומרות הוראה אמיתית, יחסים אמיתיים וחוויה שמשנה משהו.' },
        { q: 'מה מדיניות הביטול?', a: 'החזר מלא עד 60 יום לפני הריטריט. החזר של 50% בין 30-59 ימים לפני. אין החזר בתוך 30 יום, אך נשתדל למצוא לך מקום בריטריט עתידי.' },
      ] as { q: string; a: string }[],
    },
    newsletter: {
      sectionLabel: 'הישארו מעודכנים',
      heading: 'הישארו בלולאה',
      subtext: 'תאריכים חדשים, מיקומים חדשים. ללא רעש.',
      placeholder: 'האימייל שלכם',
      button: 'הרשמה',
      success: 'אתם ברשימה. נתראה במים.',
      error: 'משהו השתבש. נסו שוב או כתבו ל yuvaloz@gmail.com',
    },
    gallery: {
      label: 'העולם',
      title: 'בתמונות',
    },
    finalCta: {
      label: 'היה חלק מזה',
      title: 'מוכן להפוך\nאת עולמך ראש בתחת?',
      sub: 'נותרו מספר מקומות לשנת 2025. אל תחכה.',
      btn1: 'לריטריטים',
    },
    footer: {
      copyright: '© 2025 UpsideDown Retreat. כל הזכויות שמורות.',
    },
    events: {
      pageTitle: 'ריטריטים קרובים',
      pageSubtext: 'בחרו את רגע הטרנספורמציה שלכם.',
      noEvents: 'אין אירועים קרובים כרגע. בקרוב.',
      registerCta: 'הרשמה',
      learnMore: 'לפרטים',
      spotsLeft: 'מקומות נותרו',
      soldOut: 'אזל',
      comingSoon: 'בקרוב',
      lastSpots: 'מקומות אחרונים',
      backToEvents: 'כל הריטריטים ←',
      investment: 'השקעה',
      includes: 'מה כלול',
      registerNow: 'שמור את מקומי',
      disclaimer: 'מקדמות מתקבלות · יתרת התשלום 30 יום לפני הריטריט',
      dates: 'תאריכים',
      duration: 'משך',
      location: 'מיקום',
      gallery: 'גלריה',
      aboutRetreat: 'על הריטריט',
    },
    about: {
      pageTitle: 'About',
      foundersLabel: 'The Founders',
      teamLabel: 'The Team',
      teamSubtext: 'המדריכים שלנו מביאים עומק, רוגע ומקצועיות לכל ריטריט.',
      noTeam: '',
      yuval: {
        name: 'Yuval Oz',
        role: 'Handstand teacher, movement artist & performer',
        bio: `יובל מלמד עמידות ידיים מתוך גישה שמחברת בין טכניקה, חקירה, יצירתיות והנאה מהדרך.\n\nעם שנים של ניסיון בהוראה, פרפורמנס ועבודה עם תלמידים מכל הרמות — מהצעדים הראשונים ועד עבודה מתקדמת — הוא שם דגש על פיתוח מודעות, שליטה, נשימה ועבודה חכמה עם הגוף, ולא רק על "להחזיק עמידת ידיים".\n\nמעבר לעולם עמידות הידיים, יובל מגיע מרקע של אקרובטיקה, פרפורמנס ותיאטרון פיזי, מה שמביא לתרגולים שלו גישה משחקית, מוזיקלית ודינמית יותר. בריטריט הוא יוביל סשנים של עמידות ידיים, עבודה טכנית וחקירת תנועה — עם מטרה לעזור לכל משתתף למצוא יותר יציבות, חופש וביטחון בגוף שלו.`,
      },
      gil: {
        name: 'Gil Fox',
        role: 'Freediving instructor & Israeli national record holder',
        bio: `גיל הוא מדריך צלילה חופשית ושיאן ישראל בצלילה חופשית, עם שנים של ניסיון בהדרכה, אימון ועבודה עם אנשים בתוך המים ומחוץ להם.\n\nהגישה שלו לצלילה משלבת טכניקה, רוגע, נשימה והיכרות עמוקה עם הגוף והים.\n\nמעבר לפן הספורטיבי, גיל מביא איתו חיבור אמיתי לטבע, לשקט ולחוויה האנושית שמאחורי הצלילה החופשית. בריטריט הוא יוביל סשנים של נשימה, הסתגלות למים, טכניקות צלילה ועבודה מנטלית — מתוך רצון לאפשר לאנשים להרגיש נינוחים, בטוחים ומחוברים יותר בתוך המים.`,
      },
    },
  },
}

export type I18n = {
  dir: 'ltr' | 'rtl'
  nav: { logo: string; book: string; events: string }
  hero: {
    eyebrow: string
    words: [string, string, string]
    subtitle: string
    cta: string
    titleLine1: string
    titleLine2: string
    titleLine3: string
    essence: string
    above: string
    below: string
  }
  concept: {
    label: string
    title: string
    body: string
    quote: string
    pillars: { name: string; trait: string; desc: string }[]
  }
  experience: {
    sectionLabel: string
    above: { eyebrow: string; heading: string; body: string }
    below: { eyebrow: string; heading: string; body: string }
  }
  timeline: {
    label: string
    title: string
    body: string
    items: { time: string; icon: string; title: string; desc: string }[]
  }
  why: {
    label: string
    title: string
    items: { heading: string; desc: string }[]
    stats: { num: string; label: string }[]
  }
  who: {
    label: string
    title: string
    cards: { title: string; desc: string }[]
    reassurance: string
  }
  testimonials: { sectionLabel: string; heading: string }
  retreat: {
    sectionLabel: string
    investment: string
    spotsLabel: string
    filledTemplate: (filled: number, total: number) => string
    includesLabel: string
    cta: string
    disclaimer: string
  }
  instructors: {
    label: string
    title: string
    yuval: { name: string; role: string; bio: string; tags: string[] }
    gil: { name: string; role: string; bio: string; tags: string[] }
    bridge: string
  }
  faq: {
    label: string
    title: string
    items: { q: string; a: string }[]
  }
  newsletter: {
    sectionLabel: string
    heading: string
    subtext: string
    placeholder: string
    button: string
    success: string
    error: string
  }
  gallery: { label: string; title: string }
  finalCta: { label: string; title: string; sub: string; btn1: string }
  footer: { copyright: string }
  events: {
    pageTitle: string
    pageSubtext: string
    noEvents: string
    registerCta: string
    learnMore: string
    spotsLeft: string
    soldOut: string
    comingSoon: string
    lastSpots: string
    backToEvents: string
    investment: string
    includes: string
    registerNow: string
    disclaimer: string
    dates: string
    duration: string
    location: string
    gallery: string
    aboutRetreat: string
  }
}
