export type Testimonial = {
  name: string
  quote: string
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
    quote: 'A shift in perspective, a meditative state of being, and a true blessing',
  },
  {
    name: 'Doron',
    quote: 'Freediving and handstands — two things I love, brought together in the best way',
  },
  {
    name: 'Ayana',
    quote: 'A heartfelt space for connection, presence, and joy',
  },
  {
    name: 'Roni',
    quote: 'I came to dedicate time for myself — and I truly did',
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
