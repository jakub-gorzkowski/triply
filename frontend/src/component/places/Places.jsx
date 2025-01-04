import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import CreatePlaceModal from './CreatePlaceModal';
import axios from 'axios';
import AuthenticationService from '../service/AuthenticationService';
import Sidebar from '../general/Sidebar';
import PlacesList from './PlacesList';
import SearchBar from './SearchBar';
import PlaceCard from "./PlaceCard.jsx";

const API_BASE_URL = 'http://localhost:8080/api/v1';

const Places = () => {
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState(null);
    const [searchError, setSearchError] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth || AuthenticationService.isTokenExpired(auth.token)) {
            navigate('/login');
            return;
        }
    }, [navigate]);

    const handleSearch = async ({ query, categoryId }) => {
        if (!query.trim() && !categoryId) {
            setSearchResults(null);
            return;
        }

        const auth = AuthenticationService.getCurrentUser();
        if (!auth) return;

        try {
            setIsSearching(true);
            setSearchError(null);

            const response = await axios.get(`${API_BASE_URL}/place/search`, {
                params: {
                    ...(query.trim() && { city: query }),
                    ...(categoryId && { category_id: categoryId }),
                    offset: 0,
                    size: 10
                },
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });

            setSearchResults(response.data.content);
        } catch (err) {
            setSearchError(err.response?.data?.message || 'Search failed');
            console.error('Search error:', err);
        } finally {
            setIsSearching(false);
        }
    };

    const showSearchResults = searchResults !== null;

    return (
        <div className="flex min-h-screen bg-gray-50 overflow-hidden p-4 gap-4">
            <Sidebar currentPage="places" />
            <div className="flex-1 w-full overflow-x-hidden">
                <div className="fixed top-0 left-0 right-0 z-50 md:hidden bg-white shadow-sm">
                    <div className="px-4 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Triply</h1>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 pt-20 pb-24">
                    <div className="flex justify-center items-center gap-4 overflow-x-auto">
                        <div className="flex items-center gap-3 w-full">
                            <SearchBar onSearch={handleSearch} />
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex-shrink-0"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {showSearchResults ? (
                        <section className="mt-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Search Results</h2>
                            {searchError ? (
                                <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                                    {searchError}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {searchResults.map((place) => (
                                        <PlaceCard key={place.id} {...place} />
                                    ))}
                                </div>
                            )}
                        </section>
                    ) : (
                        <div className="space-y-8 mt-8">
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Popular places</h2>
                                <PlacesList type="popular" key={`popular-${refreshTrigger}`} />
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Latest places</h2>
                                <PlacesList type="latest" key={`latest-${refreshTrigger}`} />
                            </section>
                        </div>
                    )}
                </div>
            </div>

            <CreatePlaceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPlaceCreated={() => setRefreshTrigger(prev => prev + 1)}
            />
        </div>
    );
};

export default Places;