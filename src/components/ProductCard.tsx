import { useEffect, useMemo, useState } from 'react';
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

  const hasVariants = Boolean(product.variants?.length);

  const availableSizes = useMemo(() => {
    if (product.availableSizes?.length) return product.availableSizes;

    return [
      ...new Set(
        product.variants
          ?.map((variant) => variant.size)
          .filter((size): size is string => Boolean(size)) ?? []
      ),
    ];
  }, [product.availableSizes, product.variants]);

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    availableSizes[0]
  );

  const colorsForSize = useMemo(() => {
    if (!hasVariants || !selectedSize) return [];

    return [
      ...new Set(
        product.variants
          ?.filter((variant) => variant.size === selectedSize)
          .map((variant) => variant.color)
          .filter((color): color is string => Boolean(color)) ?? []
      ),
    ];
  }, [hasVariants, product.variants, selectedSize]);

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.availableColors?.[0]
  );

  const [showVariants, setShowVariants] = useState(false);

  useEffect(() => {
    if (!hasVariants) return;

    if (!selectedSize && availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    }
  }, [hasVariants, selectedSize, availableSizes]);

  useEffect(() => {
    if (!hasVariants) return;

    if (colorsForSize.length > 0 && (!selectedColor || !colorsForSize.includes(selectedColor))) {
      setSelectedColor(colorsForSize[0]);
    }
  }, [hasVariants, colorsForSize, selectedColor]);

  const activeVariant = useMemo<ProductVariant | undefined>(() => {
    if (!hasVariants || !selectedSize || !selectedColor) return undefined;

    return product.variants?.find(
      (variant) => variant.size === selectedSize && variant.color === selectedColor
    );
  }, [hasVariants, product.variants, selectedSize, selectedColor]);

  const price = hasVariants ? activeVariant?.price ?? product.price : product.price;
  const stock = hasVariants ? activeVariant?.stock ?? 0 : product.stock;

  const cartItem = items.find((item) => {
    if (hasVariants) {
      return (
        item.product.id === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
      );
    }

    return item.product.id === product.id && !item.selectedSize && !item.selectedColor;
  });

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);

    const availableColors =
      product.variants
        ?.filter((variant) => variant.size === size)
        .map((variant) => variant.color)
        .filter((color): color is string => Boolean(color)) ?? [];

    setSelectedColor((currentColor) =>
      currentColor && availableColors.includes(currentColor)
        ? currentColor
        : availableColors[0]
    );
  };

  const image = product.image || '📦';

  const isImageUrl =
    typeof image === 'string' &&
    (image.startsWith('data:') || image.startsWith('http') || image.startsWith('/'));

  const canAddToCart = stock > 0 && (!hasVariants || Boolean(activeVariant));

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-200 group animate-scale-in">
      <div className="relative bg-secondary p-3 sm:p-4 flex items-center justify-center h-28 sm:h-36 overflow-hidden">
        {isImageUrl ? (
          <img
            src={image}
            alt={product.name}
            className="max-h-full max-w-full h-auto w-auto object-contain"
          />
        ) : (
          <span className="text-3xl sm:text-4xl">{image}</span>
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
          <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-0.5">
            {product.brand}
          </p>
        )}

        <h3 className="font-medium text-xs sm:text-sm text-foreground leading-tight mb-0.5 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
          {product.name}
          {activeVariant?.label && (
            <span className="text-muted-foreground font-normal">
              {' '}— {activeVariant.label}
            </span>
          )}
        </h3>

        <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">
          {product.unit}
        </p>

        {hasVariants && (
          <button
            type="button"
            onClick={() => setShowVariants((prev) => !prev)}
            className="w-full flex items-center justify-between text-[10px] sm:text-xs font-medium text-primary bg-primary/10 rounded-md px-2 py-1 sm:py-1.5 mb-2 hover:bg-primary/15 transition-colors"
          >
            <span>
              {selectedSize || 'Select size'} · {selectedColor || 'Select color'}
            </span>

            <ChevronDown
              className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform ${
                showVariants ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}

        {hasVariants && showVariants && (
          <div className="space-y-2 mb-2 p-1.5 sm:p-2 bg-secondary/50 rounded-lg">
            <div>
              <p className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Size
              </p>

              <div className="flex flex-wrap gap-1">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
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
              <p className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Color
              </p>

              <div className="flex flex-wrap gap-1.5">
                {colorsForSize.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${
                      COLOR_MAP[color] || 'bg-muted'
                    } transition-all ${
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
          <span className="text-sm sm:text-base font-bold text-foreground">
            ₹{price}
          </span>

          {stock === 0 ? (
            <span className="text-[10px] sm:text-xs text-destructive font-medium">
              Unavailable
            </span>
          ) : cartItem ? (
            <div className="flex items-center gap-0.5 sm:gap-1 bg-primary rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  updateQuantity(
                    product.id,
                    cartItem.quantity - 1,
                    selectedSize,
                    selectedColor
                  )
                }
                className="p-1 sm:p-1.5 text-primary-foreground hover:bg-primary/80 transition-colors"
              >
                <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>

              <span className="text-xs sm:text-sm font-bold text-primary-foreground min-w-[1.25rem] sm:min-w-[1.5rem] text-center">
                {cartItem.quantity}
              </span>

              <button
                type="button"
                disabled={cartItem.quantity >= stock}
                onClick={() =>
                  updateQuantity(
                    product.id,
                    cartItem.quantity + 1,
                    selectedSize,
                    selectedColor
                  )
                }
                className="p-1 sm:p-1.5 text-primary-foreground hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              disabled={!canAddToCart}
              onClick={() => addToCart(product, selectedSize, selectedColor)}
              className="h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs font-bold border-primary text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
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
