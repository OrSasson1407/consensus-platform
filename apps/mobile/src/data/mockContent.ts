export interface ContentItem {
  id: string;
  category_type: 'MOVIES' | 'RESTAURANTS' | 'ACTIVITIES';
  title: string;
  image_url: string;
  meta_data: {
    year?: string;
    rating?: string;
    cuisine?: string;
    price_range?: string;
    duration?: string;
    location?: string;
  };
}

export const MOCK_MOVIES: ContentItem[] = [
  {
    id: 'm1',
    category_type: 'MOVIES',
    title: 'Interstellar',
    image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80',
    meta_data: { year: '2014', rating: '⭐️ 8.7/10', duration: '169 min' }
  },
  {
    id: 'm2',
    category_type: 'MOVIES',
    title: 'Pulp Fiction',
    image_url: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&q=80',
    meta_data: { year: '1994', rating: '⭐️ 8.9/10', duration: '154 min' }
  },
  {
    id: 'm3',
    category_type: 'MOVIES',
    title: 'Inception',
    image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&q=80',
    meta_data: { year: '2010', rating: '⭐️ 8.8/10', duration: '148 min' }
  },
  {
    id: 'm4',
    category_type: 'MOVIES',
    title: 'Everything Everywhere All at Once',
    image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80',
    meta_data: { year: '2022', rating: '⭐️ 8.0/10', duration: '139 min' }
  },
  {
    id: 'm5',
    category_type: 'MOVIES',
    title: 'Spider-Man: Into the Spider-Verse',
    image_url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&q=80',
    meta_data: { year: '2018', rating: '⭐️ 8.4/10', duration: '117 min' }
  }
];

export const MOCK_RESTAURANTS: ContentItem[] = [
  {
    id: 'r1',
    category_type: 'RESTAURANTS',
    title: 'Pizzeria Margherita',
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
    meta_data: { cuisine: '🇮🇹 Italian', price_range: '$$', rating: '★ 4.8 (250+)' }
  },
  {
    id: 'r2',
    category_type: 'RESTAURANTS',
    title: 'Sakura Sushi Bar',
    image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80',
    meta_data: { cuisine: '🇯🇵 Japanese', price_range: '$$$', rating: '★ 4.9 (420+)' }
  },
  {
    id: 'r3',
    category_type: 'RESTAURANTS',
    title: 'The Golden Burger',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    meta_data: { cuisine: '🇺🇸 Gourmet Burgers', price_range: '$', rating: '★ 4.5 (180+)' }
  },
  {
    id: 'r4',
    category_type: 'RESTAURANTS',
    title: 'El Taco Loco',
    image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80',
    meta_data: { cuisine: '🇲🇽 Mexican Street', price_range: '$', rating: '★ 4.7 (310+)' }
  },
  {
    id: 'r5',
    category_type: 'RESTAURANTS',
    title: 'Le Bistro Parisian',
    image_url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&q=80',
    meta_data: { cuisine: '🇫🇷 French Bakery', price_range: '$$$$', rating: '★ 4.6 (95+)' }
  }
];

export const MOCK_ACTIVITIES: ContentItem[] = [
  {
    id: 'a1',
    category_type: 'ACTIVITIES',
    title: 'Laser Tag Arena',
    image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80',
    meta_data: { location: 'Downtown', duration: '2 Hours', rating: '★ 4.7' }
  },
  {
    id: 'a2',
    category_type: 'ACTIVITIES',
    title: 'Cosmic Bowling Lanes',
    image_url: 'https://images.unsplash.com/photo-1538388149142-f82307962824?w=600&q=80',
    meta_data: { location: 'East Side', duration: '3 Hours', rating: '★ 4.6' }
  },
  {
    id: 'a3',
    category_type: 'ACTIVITIES',
    title: 'Locked In: Escape Room',
    image_url: 'https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?w=600&q=80',
    meta_data: { location: 'West End', duration: '1.5 Hours', rating: '★ 4.9' }
  },
  {
    id: 'a4',
    category_type: 'ACTIVITIES',
    title: 'Sunset Arcade Bar',
    image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80',
    meta_data: { location: 'The Strip', duration: 'Flexible', rating: '★ 4.8' }
  },
  {
    id: 'b5',
    category_type: 'ACTIVITIES',
    title: 'Extreme Go-Kart Track',
    image_url: 'https://images.unsplash.com/photo-1518655061766-48f53ff57b76?w=600&q=80',
    meta_data: { location: 'Industrial Park', duration: '1 Hour', rating: '★ 4.7' }
  }
];
