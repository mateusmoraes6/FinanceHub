import React from 'react';
import type { Category } from '../types/finance';

interface CategoryBadgeProps {
  category: Category;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const textColor = isLightColor(category.color) ? 'text-bg-primary' : 'text-white-primary';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${textColor} transition-transform hover:scale-105 duration-300 badge`}
      style={{ 
        backgroundColor: hexToRgba(category.color, 0.8),
        border: `1px solid ${category.color}`
      }}
    >
      {category.name}
    </span>
  );
};

// Helper function to determine if a color is light or dark
function isLightColor(color: string): boolean {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
}

// Helper function to convert hex to rgba
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default CategoryBadge;