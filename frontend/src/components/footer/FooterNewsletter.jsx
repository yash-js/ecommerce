import { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const FooterNewsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <div className="w-full md:w-1/3 mb-8 md:mb-0">
      <h3 className="text-xl font-semibold text-white mb-4">Stay Updated</h3>
      <p className="text-gray-300 mb-4">
        Subscribe to our newsletter for exclusive offers and updates
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-[#febe03] transition-colors"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#febe03] hover:bg-[#fcbf44] text-white rounded-lg transition-colors duration-300 flex items-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};