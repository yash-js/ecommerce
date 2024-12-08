import { motion } from "framer-motion";

export const toggleAnimations = {
  circle: {
    initial: false,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
  background: {
    initial: false,
    transition: {
      duration: 0.2,
    },
  },
};
export const ToggleButton = ({ isActive, onChange, label }) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="block text-[#4d3900]">{label}</label>}
      <button
        onClick={() => onChange(!isActive)}
        className="relative w-12 h-8 rounded-full bg-gray-200 cursor-pointer"
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          {...toggleAnimations.background}
          animate={{
            backgroundColor: isActive ? "#febe03" : "#dbdde0",
          }}
        />
        <motion.div
          className="absolute w-6 h-6 bottom-0 top-1 m-0 p-0 rounded-full bg-white shadow-lg "
          {...toggleAnimations.circle}
          animate={{
            x: isActive ? 20 : 2,
            backgroundColor:"#ffffff",
          }}
        />
      </button>
    </div>
  );
};
