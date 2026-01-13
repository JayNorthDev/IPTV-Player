export type Channel = {
  id: string;
  title: string;
  description: string;
  image: string;
  videoUrl: string;
};

export const channels: Channel[] = [
  {
    id: 'space-station-live',
    title: 'Space Station Live',
    description: 'Live feed from the International Space Station. See Earth from orbit!',
    image: 'space-station',
    videoUrl: 'https://www.youtube.com/embed/P9C25Un7flg?autoplay=1&mute=1',
  },
  {
    id: 'lofi-hip-hop',
    title: 'Lofi Hip Hop Radio',
    description: 'Beats to relax/study to. Your 24/7 companion for focus and calm.',
    image: 'lofi-girl',
    videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1',
  },
  {
    id: 'news-network',
    title: 'Global News Network',
    description: 'Breaking news and in-depth analysis from around the world.',
    image: 'news-desk',
    videoUrl: 'https://www.youtube.com/embed/V9OKv9B6_gI?autoplay=1&mute=1',
  },
  {
    id: 'nature-channel',
    title: 'Nature\'s Whispers',
    description: 'Stunning 4K footage of wildlife and natural landscapes. Pure relaxation.',
    image: 'nature-stream',
    videoUrl: 'https://www.youtube.com/embed/6lt2kTs-g50?autoplay=1&mute=1',
  },
  {
    id: 'classic-cartoons',
    title: 'Retro Toons TV',
    description: 'A trip down memory lane with the best classic cartoons from the 20th century.',
    image: 'retro-tv',
    videoUrl: 'https://www.youtube.com/embed/S2pXBg1Kq-s?autoplay=1&mute=1',
  },
  {
    id: 'cooking-channel',
    title: 'The Chef\'s Table',
    description: 'Learn to cook like a pro with tutorials from world-renowned chefs.',
    image: 'kitchen-prep',
    videoUrl: 'https://www.youtube.com/embed/lB236-2I4tM?autoplay=1&mute=1',
  },
  {
    id: 'drive-and-listen',
    title: 'Drive & Listen',
    description: 'Experience cities around the world from a driver\'s perspective with local radio.',
    image: 'city-drive',
    videoUrl: 'https://www.youtube.com/embed/IySei22pE28?autoplay=1&mute=1',
  },
  {
    id: 'puppy-playroom',
    title: 'Puppy Playroom Live',
    description: 'Overload on cuteness with this 24/7 live stream of puppies playing.',
    image: 'puppies',
    videoUrl: 'https://www.youtube.com/embed/zgy6dC18gNQ?autoplay=1&mute=1',
  },
];
