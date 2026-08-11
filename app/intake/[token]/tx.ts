type L = 'en' | 'he'

const EN = {
  dir: 'ltr' as 'ltr' | 'rtl',
  docLabel: 'UPSIDEDOWN RETREAT',
  docTitle: 'Participant Agreement, Health Declaration & Liability Waiver',
  step1: 'Step 1 of 2 — Agreement & Health Declaration',
  step2: 'Step 2 of 2 — Practical Details',
  back: '← Back',
  continue: 'Continue →',
  submit: 'Submit my details',
  submitting: 'Submitting...',
  allSet: 'All set!',
  allSetMsg: (name: string) => `Thank you ${name}. We have everything we need. See you at the retreat!`,
  invalidLink: 'This link is invalid or has expired.',
  contactUs: 'Contact us at info@upsidedown-retreat.com',
  loading: 'Loading...',

  // Participant Info
  participantInfo: 'Participant Information',
  fullName: 'Full Name',
  dob: 'Date of Birth',
  email: 'Email',
  emergencyName: 'Emergency Contact Name',
  emergencyPhone: 'Emergency Contact Phone',

  // Health Declaration
  healthTitle: 'Health Declaration',
  healthIntro: 'The UpsideDown Retreat includes physical activities such as freediving, breathwork, swimming, handstand training, mobility practice, yoga, strength training, hiking, and other movement-based activities.',
  healthConfirm: 'By signing this document, I confirm that:',
  healthPoints: [
    'I am participating voluntarily.',
    'I am in sufficient physical and mental health to participate in retreat activities.',
    'I have disclosed any relevant medical conditions, injuries, medications, or limitations that may affect my participation.',
    'I understand that I am responsible for informing the retreat staff of any changes in my health before or during the retreat.',
  ],
  healthConditionsTitle: 'Please answer Yes or No for each of the following:',
  conditionYes: 'Yes',
  conditionNo: 'No',
  conditions: [
    { key: 'asthma',    label: 'Asthma or respiratory condition' },
    { key: 'heart',     label: 'Heart or cardiovascular condition' },
    { key: 'epilepsy',  label: 'Epilepsy, seizures, or history of loss of consciousness' },
    { key: 'diabetes',  label: 'Diabetes' },
    { key: 'surgery',   label: 'Recent surgery or significant injury' },
    { key: 'pregnancy', label: 'Pregnancy' },
    { key: 'anxiety',   label: 'Anxiety, panic disorder, or other condition that may affect participation' },
    { key: 'other',     label: 'Other medical condition(s) that retreat staff should be aware of' },
  ],
  conditionDetails: 'You answered Yes to one or more conditions — please provide details:',
  conditionDetailsPlaceholder: 'Please describe your condition(s)...',

  // Assumption of Risk
  riskTitle: 'Assumption of Risk',
  riskText: 'I understand that participation in physical and water-based activities involves inherent risks that cannot be completely eliminated.\n\nThese risks may include physical exertion, muscle soreness, strains, falls, impact injuries, environmental conditions, water-related incidents, and other unforeseen circumstances that may result in injury, illness, or discomfort.\n\nI acknowledge that participation is voluntary and that I am responsible for exercising reasonable judgment regarding my own capabilities and limitations throughout the retreat.\n\nI agree to follow all safety instructions provided by the retreat staff and instructors.',

  // Release of Liability
  releaseTitle: 'Release of Liability',
  releaseText: 'To the fullest extent permitted by applicable law, I voluntarily assume responsibility for the risks associated with my participation in the UpsideDown Retreat.\n\nI release and hold harmless UpsideDown Retreat, its organizers, instructors, assistants, contractors, venue partners, and service providers from claims, demands, liabilities, damages, costs, or expenses arising from my participation, except where caused by gross negligence or intentional misconduct.',

  // Medical Assistance
  medAidTitle: 'Medical Assistance',
  medAidText: 'In the event of an accident, illness, or emergency, I authorize the retreat organizers to obtain appropriate medical assistance on my behalf if I am unable to do so myself.\n\nI understand that any medical treatment, transportation, rescue services, or related expenses remain my responsibility.',

  // Photography
  photoTitle: 'Photography & Media Release',
  photoIntro: 'During the retreat, photographs and video recordings may be taken for educational, promotional, and marketing purposes.',
  photoYes: 'Yes — I consent to the use of photographs and videos that may include my image.',
  photoNo: 'No — I do not consent to the use of photographs and videos that may include my image.',

  // Acknowledgment
  ackTitle: 'Participant Acknowledgment',
  ackPoints: [
    'I confirm that I have read and understood this document.',
    'I understand the nature of the activities offered during the retreat and choose to participate voluntarily.',
    'I acknowledge that I have had the opportunity to ask questions and that all questions have been answered to my satisfaction.',
  ],
  ackCheck: 'I confirm all of the above.',
  signatureName: 'Participant Name (typed signature) *',
  signatureDraw: 'Signature (draw below)',
  signatureClear: 'Clear',
  signatureHint: 'Draw your signature above, or type your name as a digital signature.',
  signatureDate: 'Date',

  // Practical Details
  practicalTitle: 'Practical Details',
  practicalSub: 'Help us prepare your gear and meals.',
  height: 'Height (cm)',
  weight: 'Weight (kg)',
  shoeSize: 'Shoe size (EU)',
  gearQ: 'Do you have your own freediving gear?',
  gearYes: 'Yes',
  gearNo: 'No',
  gearWhich: 'Which gear do you have?',
  food: 'Food allergies or dietary restrictions',
  foodPlaceholder: 'None / Vegetarian / Gluten-free...',

  // Validation
  validationMsg: 'Please complete all required fields to continue.',
  missingDob: 'Date of birth',
  missingEmergencyName: 'Emergency contact name',
  missingEmergencyPhone: 'Emergency contact phone',
  missingPhoto: 'Photography consent',
  missingAck: 'Participant acknowledgment',
  missingSig: 'Signature or typed name',
  missingMedical: 'Answer all medical condition questions (Yes or No)',
  missingConditionDetails: 'Details for medical conditions answered Yes',

  // Gear items
  gearItems: [
    { value: 'mask', label: 'Mask' },
    { value: 'snorkel', label: 'Snorkel' },
    { value: 'wetsuit', label: 'Wetsuit' },
    { value: 'fins', label: 'Fins' },
    { value: 'weight_belt', label: 'Weight belt' },
  ],
}

const HE: typeof EN = {
  dir: 'rtl',
  docLabel: 'ריטריט UPSIDEDOWN',
  docTitle: 'הסכם משתתף, הצהרת בריאות ומסמך ויתור',
  step1: 'שלב 1 מתוך 2 — הסכם והצהרת בריאות',
  step2: 'שלב 2 מתוך 2 — פרטים לוגיסטיים',
  back: '→ חזרה',
  continue: '← המשך',
  submit: 'שליחת הפרטים שלי',
  submitting: 'שולח...',
  allSet: 'הכול מוכן!',
  allSetMsg: (name: string) => `תודה ${name}. יש לנו את כל מה שאנחנו צריכים. נתראה בריטריט!`,
  invalidLink: 'הקישור אינו תקף או שפג תוקפו.',
  contactUs: 'צרו קשר בכתובת info@upsidedown-retreat.com',
  loading: 'טוען...',

  participantInfo: 'פרטי משתתף',
  fullName: 'שם מלא',
  dob: 'תאריך לידה',
  email: 'דוא"ל',
  emergencyName: 'שם איש קשר לחירום',
  emergencyPhone: 'טלפון איש קשר לחירום',

  healthTitle: 'הצהרת בריאות',
  healthIntro: 'ריטריט UpsideDown כולל פעילויות גופניות: צלילה חופשית, עבודת נשימה, שחייה, אימוני הנדסטנד, תרגול מוביליות, יוגה, אימוני כוח, טיולים ופעילויות תנועה נוספות.',
  healthConfirm: 'בחתימתי על מסמך זה, אני מאשר/ת כי:',
  healthPoints: [
    'אני משתתף/ת מרצון חופשי.',
    'אני במצב גופני ונפשי המאפשר השתתפות בפעילויות הריטריט.',
    'גיליתי כל מצב רפואי, פציעה, תרופה או מגבלה העלולה להשפיע על השתתפותי.',
    'אני אחראי/ת ליידע את צוות הריטריט על שינויים במצב בריאותי לפני ובמהלך הריטריט.',
  ],
  healthConditionsTitle: 'אנא ענו כן או לא על כל אחד מהמצבים הבאים:',
  conditionYes: 'כן',
  conditionNo: 'לא',
  conditions: [
    { key: 'asthma',    label: 'אסתמה או מצב נשימתי' },
    { key: 'heart',     label: 'מצב לב או מחלה קרדיווסקולרית' },
    { key: 'epilepsy',  label: 'אפילפסיה, פרכוסים, או היסטוריה של אובדן הכרה' },
    { key: 'diabetes',  label: 'סוכרת' },
    { key: 'surgery',   label: 'ניתוח לאחרונה או פציעה משמעותית' },
    { key: 'pregnancy', label: 'הריון' },
    { key: 'anxiety',   label: 'חרדה, הפרעת פאניקה, או מצב אחר שעלול להשפיע על ההשתתפות' },
    { key: 'other',     label: 'מצב רפואי אחר שצוות הריטריט צריך לדעת עליו' },
  ],
  conditionDetails: 'ענית כן לאחד או יותר מהמצבים — אנא פרט/י:',
  conditionDetailsPlaceholder: 'אנא תארו את המצב/ים...',

  riskTitle: 'הנחת סיכון',
  riskText: 'אני מבין/ה כי השתתפות בפעילויות גופניות ומבוססות מים כרוכה בסיכונים מובנים שלא ניתן לבטל לחלוטין.\n\nסיכונים אלה עשויים לכלול מאמץ גופני, כאבי שרירים, נקעים, נפילות, פגיעות מאימפקט, תנאים סביבתיים, אירועים הקשורים למים ונסיבות בלתי צפויות אחרות שעלולות לגרום לפציעה, מחלה או אי-נוחות.\n\nאני מכיר/ה בכך שההשתתפות היא מרצון ושאני אחראי/ת לשפוט שיקול דעת סביר לגבי יכולותיי ומגבלותיי לאורך הריטריט.\n\nאני מסכים/ה לפעול על פי כל הוראות הבטיחות שנמסרות על ידי צוות הריטריט והמדריכים.',

  releaseTitle: 'שחרור מאחריות',
  releaseText: 'במידה המרבית המותרת על פי החוק החל, אני מקבל/ת על עצמי מרצון את האחריות לסיכונים הכרוכים בהשתתפותי בריטריט UpsideDown.\n\nאני משחרר/ת ומפטיר/ה מאחריות את ריטריט UpsideDown, מארגניו, מדריכיו, עוזריו, קבלניו, שותפי המקום ונותני השירות, מכל תביעה, דרישה, אחריות, נזק, עלות או הוצאה הנובעת מהשתתפותי, למעט במקרה של רשלנות חמורה או התנהגות מכוונת.',

  medAidTitle: 'סיוע רפואי',
  medAidText: 'במקרה של תאונה, מחלה, או חירום, אני מסמיך/ה את מארגני הריטריט לדאוג לסיוע רפואי מתאים בשמי אם איני מסוגל/ת לעשות זאת בעצמי.\n\nאני מבין/ה שכל טיפול רפואי, הסעה, שירותי הצלה, או הוצאות נלוות נותרות באחריותי.',

  photoTitle: 'צילום ושחרור מדיה',
  photoIntro: 'במהלך הריטריט ייתכן שיצולמו תמונות וסרטונים למטרות חינוכיות, קידום ושיווק.',
  photoYes: 'כן — אני מסכים/ה לשימוש בתמונות וסרטונים שעשויים לכלול את דמותי.',
  photoNo: 'לא — איני מסכים/ה לשימוש בתמונות וסרטונים שעשויים לכלול את דמותי.',

  ackTitle: 'אישור משתתף',
  ackPoints: [
    'אני מאשר/ת שקראתי והבנתי מסמך זה.',
    'אני מבין/ה את אופי הפעילויות המוצעות במהלך הריטריט ובוחר/ת להשתתף מרצון.',
    'אני מכיר/ה בכך שהייתה לי הזדמנות לשאול שאלות וכי כל שאלותיי נענו לשביעות רצוני.',
  ],
  ackCheck: 'אני מאשר/ת את כל האמור לעיל.',
  signatureName: 'שם משתתף (חתימה דיגיטלית) *',
  signatureDraw: 'חתימה (ציור למטה)',
  signatureClear: 'נקה',
  signatureHint: 'צייר/י את חתימתך למעלה, או הקלד/י את שמך כחתימה דיגיטלית.',
  signatureDate: 'תאריך',

  practicalTitle: 'פרטים לוגיסטיים',
  practicalSub: 'עזרו לנו להכין את הציוד והארוחות שלכם.',
  height: 'גובה (ס"מ)',
  weight: 'משקל (ק"ג)',
  shoeSize: 'מידת נעל (EU)',
  gearQ: 'האם יש לכם ציוד צלילה חופשית משלכם?',
  gearYes: 'כן',
  gearNo: 'לא',
  gearWhich: 'איזה ציוד יש לכם?',
  food: 'אלרגיות למזון או העדפות תזונתיות',
  foodPlaceholder: 'ללא / צמחוני / ללא גלוטן...',

  validationMsg: 'אנא מלאו את כל השדות הנדרשים להמשך.',
  missingDob: 'תאריך לידה',
  missingEmergencyName: 'שם איש קשר לחירום',
  missingEmergencyPhone: 'טלפון איש קשר לחירום',
  missingPhoto: 'הסכמה לצילום',
  missingAck: 'אישור משתתף',
  missingSig: 'חתימה או שם',
  missingMedical: 'יש לענות כן או לא על כל שאלה רפואית',
  missingConditionDetails: 'פרטים על מצבים רפואיים שענית עליהם כן',

  gearItems: [
    { value: 'mask', label: 'מסיכה' },
    { value: 'snorkel', label: 'שנורקל' },
    { value: 'wetsuit', label: 'חליפה' },
    { value: 'fins', label: 'סנפירים' },
    { value: 'weight_belt', label: 'חגורת משקולות' },
  ],
}

export function tx(locale: string) {
  return locale === 'he' ? HE : EN
}
