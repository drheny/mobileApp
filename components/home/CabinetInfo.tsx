import React from 'react';
import { MapPin, Clock, ChevronRight } from 'lucide-react';

const CabinetInfo: React.FC = () => {
  return (
    <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Infos Cabinet</h3>
        <div className="bg-white rounded-2xl shadow-xl shadow-primary/5 border border-gray-50 overflow-hidden">
            <div className="p-5">
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-text-secondary">Horaires d'ouverture</p>
                        <p className="font-semibold text-text-primary">Lundi - Vendredi : 8h - 18h</p>
                    </div>
                </div>
            </div>
            <a href="#" className="flex items-center justify-between p-5 border-t border-gray-100 hover:bg-light transition-colors cursor-pointer">
                 <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-text-secondary">Adresse</p>
                        <p className="font-semibold text-text-primary">12 Rue de la Santé, Tunis</p>
                    </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
            </a>
        </div>
    </div>
  );
};

export default CabinetInfo;
