import { Dog } from 'lucide-react';

export const ProductHeader = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dog className="w-8 h-8 text-[#febe03]" />
            <span className="text-2xl font-bold text-white">YellowWallDog</span>
          </div>
        </div>
      </div>
    </header>
  );
};