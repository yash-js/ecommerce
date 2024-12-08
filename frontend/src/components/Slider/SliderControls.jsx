import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSlider } from './SliderContext';

export const SliderControls = () => {
  const { prevSlide, nextSlide, isStartDisabled, isEndDisabled } = useSlider();

  return (
    <>
      <button
        onClick={prevSlide}
        disabled={isStartDisabled}
        className={`absolute top-1/2 -left-8 transform -translate-y-1/2 p-3 rounded-full shadow-md transition-colors duration-300 ${
          isStartDisabled
            ? "bg-[#fcd34d] text-gray-500 cursor-not-allowed"
            : "bg-[#febe03] hover:bg-[#fcbf44] text-white"
        }`}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isEndDisabled}
        className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-3 rounded-full shadow-md transition-colors duration-300 ${
          isEndDisabled
            ? "bg-[#fcd34d] text-gray-500 cursor-not-allowed"
            : "bg-[#febe03] hover:bg-[#fcbf44] text-white"
        }`}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </>
  );
};