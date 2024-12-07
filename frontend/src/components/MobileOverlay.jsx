import React from 'react';

const MobileOverlay = ({ isVisible, onClick }) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      onClick={onClick}
    />
  );
};

export default MobileOverlay;