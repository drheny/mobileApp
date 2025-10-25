
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MOCK_CONTENT } from '../services/mockData';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, Search, X, ChevronDown } from 'lucide-react';

const interests = ['Tous', 'nutrition', 'fievre', 'toux', 'gastro', 'immunite', 'psychologie', 'developpement'];
const ages = ['Tous', 'nouveau ne', '1-4 mois', '4-6 mois', '6-12 mois', '12-24 mois', 'enfant'];
const seasons = ['toutes', 'hiver', 'printemps', 'ete'];
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const FilterSelect: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder: string;
}> = ({ value, onChange, options, placeholder }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="w-full appearance-none bg-white border border-gray-200 text-text-secondary text-sm rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
    >
      <option value={options[0]}>{placeholder}</option>
      {options.slice(1).map(opt => (
        <option key={opt} value={opt}>{capitalize(opt)}</option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
      <ChevronDown className="h-4 w-4" />
    </div>
  </div>
);


const LibraryScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInterest, setActiveInterest] = useState('Tous');
  const [activeAge, setActiveAge] = useState('Tous');
  const [activeSeason, setActiveSeason] = useState('toutes');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (!mainEl) return;

    const handleScroll = () => {
      const currentScrollY = mainEl.scrollTop;
      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsHeaderVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    mainEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => mainEl.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredContent = useMemo(() => {
    return MOCK_CONTENT.filter(item => {
      const interestMatch = activeInterest === 'Tous' || item.tags.interest === activeInterest;
      const ageMatch = activeAge === 'Tous' || item.tags.age === activeAge;
      const seasonMatch = activeSeason === 'toutes' || item.tags.season === activeSeason;
      
      const query = searchQuery.toLowerCase();
      const searchMatch = !query ||
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.tags.interest.toLowerCase().includes(query) ||
        item.tags.age.toLowerCase().includes(query) ||
        item.tags.season.toLowerCase().includes(query);

      return interestMatch && ageMatch && seasonMatch && searchMatch;
    });
  }, [searchQuery, activeInterest, activeAge, activeSeason]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dark">Bibliothèque</h2>
      
      <motion.div
        className="sticky top-0 bg-light/95 backdrop-blur-sm pt-2 pb-4 -mx-4 px-4 z-10 border-b border-gray-100"
        animate={{ y: isHeaderVisible ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par mot-clé..."
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-full bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
           <FilterSelect 
             value={activeInterest}
             onChange={(e) => setActiveInterest(e.target.value)}
             options={interests}
             placeholder="Par intérêt"
           />
           <FilterSelect 
             value={activeAge}
             onChange={(e) => setActiveAge(e.target.value)}
             options={ages}
             placeholder="Par âge"
           />
           <FilterSelect 
             value={activeSeason}
             onChange={(e) => setActiveSeason(e.target.value)}
             options={seasons}
             placeholder="Par saison"
           />
        </div>
      </motion.div>
      
      <div className="space-y-4">
        {filteredContent.length > 0 ? (
          filteredContent.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              layout
              className="bg-white rounded-2xl shadow-xl shadow-primary/5 border border-gray-50 overflow-hidden"
            >
              <div className="relative">
                <img src={item.thumbnail} alt={item.title} className="w-full h-32 object-cover" />
                <div className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white">
                  {item.type === 'video' ? <PlayCircle className="h-5 w-5" /> : <FileText className="h-5 w-5" /> }
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold text-primary">{capitalize(item.tags.interest)} • {capitalize(item.tags.age)} • {capitalize(item.tags.season)}</p>
                <h3 className="font-bold text-text-primary mt-1">{item.title}</h3>
                <p className="text-sm text-text-secondary mt-2">{item.summary}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-10">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-text-secondary">Aucun article ne correspond à votre recherche.</p>
            <p className="text-sm text-gray-400 mt-1">Essayez de modifier vos filtres ou vos mots-clés.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryScreen;