import { useState, useMemo } from 'react';
import { Product, ProductVariant } from '@/data/types';
import { useCart } from '@/context/CartContext';
import { Plus, Minus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLOR_MAP: Record<string, string> = {
  Red: 'bg-red-500',
  Blue: 'bg-blue-500',
  Green: 'bg-green-500',
  Black: 'bg-gray-900',
  Yellow: 'bg-yellow-400',
  White: 'bg-white border border-border',
};

const ProductCard = ({ product }: { product: Product }) => {
  const { items, addToCart, updateQuantity } = useCart();
  const hasVariants = product.variants && product.variants.length > 0;

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.availableSizes?.[1] || product.availableSizes?.[0]
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.availableColors?.[0]
  );
  const [showVariants, setShowVariants] = useState(false);

  const activeVariant = useMemo<ProductVariant | undefined>(() => {
    if (!hasVariants) return undefined;
    return product.variants!.find(v => v.size === selectedSize && v.color === selectedColor);
  }, [hasVariants, product.variants, selectedSize, selectedColor]);

  const colorsForSize = useMemo(() => {
    if (!hasVariants) return [];
    return [...new Set(product.variants!.filter(v => v.size === selectedSize).map(v => v.color!))];
  }, [hasVariants, product.variants, selectedSize]);

  const price = activeVariant?.price ?? product.price;
  const stock = activeVariant?.stock ?? product.stock;

  const cartItem = items.find(item => {
    if (hasVariants) {
      return item.product.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor;
    }
    return item.product.id === product.id && !item.selectedSize;
  });

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    const availableColors = product.variants!.filter(v => v.size === size).map(v => v.color!);
    if (selectedColor && !availableColors.includes(selectedColor)) {
      setSelectedColor(availableColors[0]);
    }
  };

  const isImageUrl = product.image.startsWith('data:') || product.image.startsWith('http') || product.image.startsWith('/');

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-200 group animate-scale-in">
      <div className="relative bg-secondary p-3 sm:p-4 flex items-center justify-center h-28 sm:h-36 overflow-hidden">
        {isImageUrl ? (
          <img src={product.image} alt={product.name} className="max-h-full max-w-full h-auto w-auto object-contain" />
        ) : (
          <span className="text-3xl sm:text-4xl">{product.image}</span>
        )}
        {stock < 10 && stock > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-accent text-accent-foreground text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded-md">
            Low Stock
          </span>
        )}
        {stock === 0 && (
          <span className="absolute top-1.5 right-1.5 bg-destructive text-destructive-foreground text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded-md">
            Out of Stock
          </span>
        )}
      </div>

      <div className="p-2.5 sm:p-3">
        {product.brand && (
          <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-0.5">{product.brand}</p>
        )}
        <h3 className="font-medium text-xs sm:text-sm text-foreground leading-tight mb-0.5 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
          {product.name}
          {activeVariant && (
            <span className="text-muted-foreground font-normal"> — {activeVariant.label}</span>
          )}
        </h3>
        <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">{product.unit}</p>

        {hasVariants && (
          <button
            onClick={() => setShowVariants(!showVariants)}
            className="w-full flex items-center justify-between text-[10px] sm:text-xs font-medium text-primary bg-primary/10 rounded-md px-2 py-1 sm:py-1.5 mb-2 hover:bg-primary/15 transition-colors"
          >
            <span>{selectedSize} · {selectedColor}</span>
            <ChevronDown className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform ${showVariants ? 'rotate-180' : ''}`} />
          </button>
        )}

        {hasVariants && showVariants && (
          <div className="space-y-2 mb-2 p-1.5 sm:p-2 bg-secondary/50 rounded-lg">
            <div>
              <p className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Size</p>
              <div className="flex flex-wrap gap-1">
                {product.availableSizes!.map(size => (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md font-medium transition-colors ${
                      selectedSize === size
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border text-foreground hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Color</p>
              <div className="flex flex-wrap gap-1.5">
                {colorsForSize.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${COLOR_MAP[color] || 'bg-muted'} transition-all ${
                      selectedColor === color
                        ? 'ring-2 ring-primary ring-offset-1 ring-offset-card scale-110'
                        : 'hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-end justify-between">
          <span className="text-sm sm:text-base font-bold text-foreground">₹{price}</span>

          {stock === 0 ? (
            <span className="text-[10px] sm:text-xs text-destructive font-medium">Unavailable</span>
          ) : cartItem ? (
            <div className="flex items-center gap-0.5 sm:gap-1 bg-primary rounded-lg overflow-hidden">
              <button
                onClick={() => updateQuantity(product.id, cartItem.quantity - 1, selectedSize, selectedColor)}
                className="p-1 sm:p-1.5 text-primary-foreground hover:bg-primary/80 transition-colors"
              >
                <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
              <span className="text-xs sm:text-sm font-bold text-primary-foreground min-w-[1.25rem] sm:min-w-[1.5rem] text-center">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateQuantity(product.id, cartItem.quantity + 1, selectedSize, selectedColor)}
                className="p-1 sm:p-1.5 text-primary-foreground hover:bg-primary/80 transition-colors"
              >
                <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => addToCart(product, selectedSize, selectedColor)}
              className="h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs font-bold border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              ADD
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
