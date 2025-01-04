import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const categories = [
    { id: null, name: 'Any' },
    { id: 1, name: 'Monument' },
    { id: 2, name: 'Hotel' },
    { id: 3, name: 'Eatery' }
];

const CategoryDropdown = ({ selectedCategory, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative w-full md:w-48">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 flex items-center justify-between bg-white hover:border-rose-300 transition-colors"
            >
                <span className="text-gray-900">
                    {selectedCategory ? selectedCategory.name : 'Any'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute w-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                        {categories.map(category => (
                            <button
                                key={category.id ?? 'any'}
                                onClick={() => {
                                    onSelect(category);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-3 py-2 text-left hover:bg-rose-50 transition-colors ${
                                    selectedCategory?.id === category.id ? 'bg-rose-50 text-rose-600' : 'text-gray-900'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const SearchBar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        onSearch({
            query,
            categoryId: selectedCategory?.id
        });
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        onSearch({
            query: searchQuery,
            categoryId: category?.id
        });
    };

    return (
        <div className="flex justify-center items-center w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full">
                <CategoryDropdown
                    selectedCategory={selectedCategory}
                    onSelect={handleCategoryChange}
                />
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-rose-300 focus:ring-1 focus:ring-rose-300 outline-none transition-colors"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-500"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;