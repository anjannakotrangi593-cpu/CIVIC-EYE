import React from 'react';
import { Trash2, AlertTriangle, Lightbulb, Droplets, Waves, Zap, MoreHorizontal, Layers } from 'lucide-react';
import { ComplaintCategory } from '../../types';

interface Props {
  category: ComplaintCategory | string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<Props> = ({ category, className = 'w-5 h-5', size = 20 }) => {
  switch (category) {
    case 'garbage':
      return <Trash2 size={size} className={className} />;
    case 'road':
      return <AlertTriangle size={size} className={className} />;
    case 'streetlight':
      return <Lightbulb size={size} className={className} />;
    case 'water':
      return <Droplets size={size} className={className} />;
    case 'drainage':
      return <Waves size={size} className={className} />;
    case 'electricity':
      return <Zap size={size} className={className} />;
    case 'other':
      return <MoreHorizontal size={size} className={className} />;
    default:
      return <Layers size={size} className={className} />;
  }
};
