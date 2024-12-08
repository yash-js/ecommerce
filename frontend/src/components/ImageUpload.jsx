import React, { useState } from "react";

const ImageUpload = ({ value, onChange, label }) => {
  const [imagePreview, setImagePreview] = useState(value || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result);
        onChange(reader.result); // passing the base64 string back to parent
      };

      reader.readAsDataURL(file); // Convert file to Base64
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[#4d3900] mb-2">{label}</label>
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            className="h-[250px] w-full object-contain rounded-lg border border-gray-300"
          />
        ) : (
          <span className="text-sm font-semibold">Not uploaded yet.</span>
        )}
      </div>
      <div className="mt-1 flex items-center">
        <input
          type="file"
          id="image"
          className="sr-only"
          accept="image/*"
          onChange={handleImageChange}
        />
        <label
          htmlFor="image"
          className="cursor-pointer bg-[#fef4d7] py-2 px-3 border border-yellow-200 rounded-md shadow-sm text-sm leading-4 font-medium text-[#4d3900] hover:bg-[#fbe203] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#febe03]"
        >
          Upload Image
        </label>
      </div>
      {imagePreview && (
        <span className="ml-3 text-sm text-[#4d3900]">Image uploaded</span>
      )}
    </div>
  );
};

export default ImageUpload;
