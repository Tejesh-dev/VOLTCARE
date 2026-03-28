import { useAdmin } from '@/context/AdminContext';
import { Zap, Droplets, Wrench, Package } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="h-4 w-4 sm:h-5 sm:w-5" />,
  Droplets: <Droplets className="h-4 w-4 sm:h-5 sm:w-5" />,
  Wrench: <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />,
};

interface CategoryNavProps {
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  onSubcategorySelect: (subcategoryId: string | null) => void;
}

const CategoryNav = ({ selectedCategory, selectedSubcategory, onCategorySelect, onSubcategorySelect }: CategoryNavProps) => {
  const { categories } = useAdmin();
  const activeCategory = categories.find(c => c.id === selectedCategory);

  return (
    <div className="bg-card border-b border-border">
      <div className="container">
        <div className="flex gap-2 py-2 sm:py-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => { onCategorySelect(null); onSubcategorySelect(null); }}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              !selectedCategory
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary text-foreground hover:bg-muted'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { onCategorySelect(cat.id); onSubcategorySelect(null); }}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-foreground hover:bg-muted'
              }`}
            >
              {iconMap[cat.icon] || <Package className="h-4 w-4" />}
              {cat.name}
            </button>
          ))}
        </div>

        {activeCategory && (
          <div className="flex gap-2 pb-2 sm:pb-3 overflow-x-auto scrollbar-hide animate-fade-in">
            <button
              onClick={() => onSubcategorySelect(null)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors ${
                !selectedSubcategory ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All {activeCategory.name}
            </button>
            {activeCategory.subcategories.map(sub => (
              <button
                key={sub.id}
                onClick={() => onSubcategorySelect(sub.id)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedSubcategory === sub.id ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryNav;
