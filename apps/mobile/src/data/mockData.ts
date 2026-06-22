export interface CategoryItem {
  id: string;
  title: string;
  department: string;
  emoji: string;
  image: string;
}

export interface ActivityCard {
  id: number;
  title: string;
  meta: string;
  badge: string;
  image: string;
  tags: string[];
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'movies',
    title: 'Movies',
    department: 'ENTERTAINMENT',
    emoji: '🎬',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'restaurants',
    title: 'Restaurants',
    department: 'DINING',
    emoji: '🍕',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'activities',
    title: 'Activities',
    department: 'LIFESTYLE',
    emoji: '🎯',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600'
  }
];

export const CARDS_POOL: Record<string, ActivityCard[]> = {
  movies: [
    {
      id: 1,
      title: 'Inception',
      meta: '2010 • 8.8/10 • Sci-Fi/Action',
      badge: 'JOINED',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=600',
      tags: ['🌀 Dreamy', '🧠 Smart']
    },
    {
      id: 2,
      title: 'Interstellar',
      meta: '2014 • 8.7/10 • Sci-Fi/Adventure',
      badge: '100% COMPATIBLE',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
      tags: ['🚀 Space', '⏳ Quantum']
    },
    {
      id: 3,
      title: 'Blade Runner 2049',
      meta: '2017 • 8.0/10 • Sci-Fi/Noir',
      badge: '',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
      tags: ['🌃 Neon', '🤖 Cyberpunk']
    }
  ],
  restaurants: [
    {
      id: 4,
      title: 'Cinematic Pizza Lounge',
      meta: '$$ • 4.8★ • Italian Craft',
      badge: 'POPULAR',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
      tags: ['🍕 Woodfire', '🍷 Fine Wine']
    },
    {
      id: 5,
      title: 'Neon Sushi Street',
      meta: '$$$ • 4.9★ • Japanese Fusion',
      badge: 'MATCH RECOMMENDED',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=600',
      tags: ['🍣 Fresh Sashimi', '🍶 Sake Bar']
    }
  ],
  activities: [
    {
      id: 6,
      title: 'Cyber Dart Lounge',
      meta: 'Active • 4.7★ • Tech-Gaming',
      badge: 'NEW VENUE',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
      tags: ['🎯 Glowing Darts', '🍹 Cocktail Lounge']
    },
    {
      id: 7,
      title: 'Retro Arcade Arena',
      meta: 'Casual • 4.6★ • Nostalgia Play',
      badge: '',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600',
      tags: ['🕹️ Pac-Man', '🍕 Party Room']
    }
  ]
};
