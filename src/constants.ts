import { VideoScene } from './types';

export const VIDEO_SCENES: VideoScene[] = [
  {
    id: '1',
    title: 'Autumn Forest',
    category: 'Forest',
    youtubeId: 'vS_v2vM4Z4',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Ocean Waves',
    category: 'Ocean',
    youtubeId: 'mOOC_6j19D4',
    thumbnail: 'https://images.unsplash.com/photo-1505118380757-91f5f45d8de0?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'Earth from Orbit',
    category: 'Space',
    youtubeId: '668n7G9f32w',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    title: 'Sand Dunes',
    category: 'Desert',
    youtubeId: 'W0LHTWG-UmQ',
    thumbnail: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    title: 'Mountain Sunset',
    category: 'Mountains',
    youtubeId: 'R1vR6zS-r-w',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '6',
    title: 'Tropical Beach',
    category: 'Ocean',
    youtubeId: 'v9-xidk0w1U',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800'
  }
];

export const CATEGORIES: string[] = ['All', 'Forest', 'Ocean', 'Space', 'Desert', 'Mountains'];
