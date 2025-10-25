
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { View } from '../../types';

const ChildSelector: React.FC = () => {
  const { children, selectedChild, selectChild, setActiveView } = useContext(AppContext);

  const handleSelectChild = (id: number) => {
    selectChild(id);
    setActiveView(View.ChildProfile);
  };

  const handleAddChild = () => {
    selectChild(null); // Clear selected child for "add" mode
    setActiveView(View.ChildProfile);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-text-primary mb-3">Mes enfants</h3>
      <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
        {children.map(child => (
          <motion.div
            key={child.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectChild(child.id)}
            className={`cursor-pointer flex-shrink-0 flex flex-col items-center space-y-2 transition-all duration-200 ${selectedChild?.id !== child.id ? 'opacity-60' : ''}`}
          >
            <div className={`relative rounded-full p-1 ${selectedChild?.id === child.id ? 'bg-gradient-to-tr from-secondary to-primary' : 'bg-gray-200'}`}>
              <img src={child.avatar} alt={child.name} className="w-16 h-16 rounded-full object-cover border-2 border-white" />
            </div>
            <span className={`text-sm font-semibold ${selectedChild?.id === child.id ? 'text-primary' : 'text-text-secondary'}`}>{child.name}</span>
          </motion.div>
        ))}
        <button onClick={handleAddChild} className="flex-shrink-0 flex flex-col items-center space-y-2 text-gray-500 hover:text-primary transition-colors">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed">
            <PlusCircle className="h-8 w-8" />
          </div>
          <span className="text-sm font-semibold">Ajouter</span>
        </button>
      </div>
    </div>
  );
};

export default ChildSelector;
