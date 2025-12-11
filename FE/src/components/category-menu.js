import { useState, useEffect } from 'react';

export default function CategoryMenu({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        'https://backendfish.mnhwua.id.vn/api/danh-muc'
      );
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.id);
    if (onSelectCategory) {
      onSelectCategory(category);
      console.log(category);
    }
    setIsOpen(false);
  };

  const getCategoryIcon = (index) => {
    const icons = [
      '🔥',
      '🎁',
      '🍣',
      '❄️',
      '💧',
      '✈️',
      '🐟',
      '🦞',
      '🐚',
      '🦀',
      '🦐',
      '🦑',
      '🔺',
      '🏠',
    ];
    return icons[index % icons.length];
  };

  return (
    <>
      {/* Desktop Menu */}
      <div className="hidden md:block bg-white shadow-lg rounded-2xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-white text-2xl">
            menu
          </span>
          <h2 className="text-white text-xl font-bold tracking-wide">
            DANH MỤC
          </h2>
        </div>

        <div className="py-2">
          <button
            onClick={() => {
              setSelectedCategory(null);
              if (onSelectCategory) onSelectCategory(null);
            }}
            className={`w-full px-6 py-3 flex items-center gap-3 hover:bg-cyan-50 transition-colors ${
              selectedCategory === null
                ? 'bg-cyan-50 border-r-4 border-cyan-500'
                : ''
            }`}
          >
            <span className="text-2xl">🌊</span>
            <span className="font-medium text-slate-700">Tất cả sản phẩm</span>
          </button>

          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={`w-full px-6 py-3 flex items-center gap-3 hover:bg-cyan-50 transition-colors ${
                selectedCategory === category.id
                  ? 'bg-cyan-50 border-r-4 border-cyan-500'
                  : ''
              }`}
            >
              <span className="text-2xl">{getCategoryIcon(index)}</span>
              <span className="font-medium text-slate-700">
                {category.ten_danh_muc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-4 rounded-2xl flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl">menu</span>
            <span className="font-bold text-lg">DANH MỤC</span>
          </div>
          <span className="material-symbols-outlined text-2xl">
            {isOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {isOpen && (
          <div className="mt-2 bg-white shadow-lg rounded-2xl overflow-hidden border border-slate-100">
            <button
              onClick={() => {
                setSelectedCategory(null);
                if (onSelectCategory) onSelectCategory(null);
                setIsOpen(false);
              }}
              className={`w-full px-6 py-3 flex items-center gap-3 hover:bg-cyan-50 transition-colors ${
                selectedCategory === null
                  ? 'bg-cyan-50 border-l-4 border-cyan-500'
                  : ''
              }`}
            >
              <span className="text-2xl">🌊</span>
              <span className="font-medium text-slate-700">
                Tất cả sản phẩm
              </span>
            </button>

            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`w-full px-6 py-3 flex items-center gap-3 hover:bg-cyan-50 transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-cyan-50 border-l-4 border-cyan-500'
                    : ''
                }`}
              >
                <span className="text-2xl">{getCategoryIcon(index)}</span>
                <span className="font-medium text-slate-700">
                  {category.ten_danh_muc}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
