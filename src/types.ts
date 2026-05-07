export interface VideoScene {
  id: string;
  title: string;
  category: string;
  youtubeId: string;
  thumbnail: string;
}

export type Category = 'All' | 'Forest' | 'Ocean' | 'Space' | 'Desert' | 'Mountains' | 'Waterfalls' | 'Winter Landscapes';
