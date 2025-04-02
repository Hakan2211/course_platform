'use client';

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  Children,
  isValidElement,
  useEffect,
  useRef,
} from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

// Interface definitions (unchanged)
interface ImageItemProps {
  src: string;
  alt: string;
  title?: string;
  description?: React.ReactNode;
  badges?: string[];
  children?: never;
}

interface ImageGalleryProps {
  children: React.ReactNode;
  className?: string;
}

interface ImageGalleryContextType {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  items: ImageItemProps[];
  direction: number;
  setDirection: (direction: number) => void;
}

const ImageGalleryContext = createContext<ImageGalleryContextType | null>(null);

const useImageGallery = () => {
  const context = useContext(ImageGalleryContext);
  if (!context) {
    throw new Error(
      'useImageGallery must be used within an <ImageGallery> component'
    );
  }
  return context;
};

const ImageGalleryItem: React.FC<ImageItemProps> = () => null;
ImageGalleryItem.displayName = 'ImageGalleryItem';

// --- Minimap (unchanged) ---
const Minimap: React.FC = () => {
  const { items, activeIndex, setActiveIndex } = useImageGallery();
  const activeThumbnailRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeThumbnailRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const button = activeThumbnailRef.current;
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const scrollLeft =
        container.scrollLeft +
        buttonRect.left -
        containerRect.left -
        (containerRect.width - buttonRect.width) / 2;

      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeIndex]);

  return (
    <div
      ref={scrollContainerRef}
      className="w-full overflow-x-auto py-4 px-6 scrollbar-hide"
    >
      <div className="flex justify-center gap-4">
        {items.map((item, index) => (
          <motion.button
            key={item.src + index}
            ref={index === activeIndex ? activeThumbnailRef : null}
            onClick={() => setActiveIndex(index)}
            className={cn(
              'relative h-16 w-16 flex-shrink-0 rounded-2xl overflow-hidden',
              'border border-gray-800/50 transition-all duration-300 ease-out',
              index === activeIndex
                ? 'scale-110 opacity-100 shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-gray-700/70'
                : 'opacity-60 hover:opacity-90 hover:scale-105 hover:border-gray-600/60'
            )}
            whileHover={{ scale: index === activeIndex ? 1.1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`View image ${index + 1}: ${item.alt}`}
          >
            <Image
              src={item.src}
              alt={`Thumbnail for ${item.alt}`}
              fill
              className="object-cover"
              sizes="64px"
              loading="lazy"
            />
            {index !== activeIndex && (
              <div className="absolute inset-0 bg-black/30"></div>
            )}
            {index === activeIndex && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30 pointer-events-none"></div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
Minimap.displayName = 'Minimap';

// --- Refined ImageGallery ---
const ImageGallery = React.forwardRef<HTMLDivElement, ImageGalleryProps>(
  ({ children, className, ...props }, ref) => {
    const [activeIndex, setActiveIndexState] = useState(0);
    const [direction, setDirection] = useState(0);

    const items = useMemo(() => {
      const validItems: ImageItemProps[] = [];
      Children.forEach(children, (child) => {
        if (isValidElement(child) && child.props.src) {
          validItems.push(child.props as ImageItemProps);
        }
      });
      return validItems;
    }, [children]);

    useEffect(() => {
      if (activeIndex >= items.length && items.length > 0) {
        setActiveIndexState(0);
      } else if (items.length === 0 && activeIndex !== 0) {
        setActiveIndexState(0);
      }
    }, [items, activeIndex]);

    const setActiveIndex = (newIndex: number) => {
      if (newIndex === activeIndex) return;
      setDirection(newIndex > activeIndex ? 1 : -1);
      setActiveIndexState(newIndex);
    };

    if (items.length === 0) {
      return (
        <div
          ref={ref}
          className={cn(
            'text-muted-foreground p-6 text-center rounded-3xl bg-gradient-to-br from-gray-950/90 to-black/90 border border-gray-700/50 shadow-2xl',
            className
          )}
          {...props}
        >
          No images provided. Pass valid {'<ImageGalleryItem />'} children.
        </div>
      );
    }

    const currentItem = items[activeIndex];

    const variants = {
      enter: (direction: number) => ({
        x: direction > 0 ? 60 : -60,
        opacity: 0,
        scale: 0.96,
        rotateY: direction > 0 ? 15 : -15,
      }),
      center: {
        x: 0,
        opacity: 1,
        scale: 1,
        rotateY: 0,
      },
      exit: (direction: number) => ({
        x: direction < 0 ? 60 : -60,
        opacity: 0,
        scale: 0.96,
        rotateY: direction < 0 ? 15 : -15,
      }),
    };

    return (
      <ImageGalleryContext.Provider
        value={{ activeIndex, setActiveIndex, items, direction, setDirection }}
      >
        <div
          ref={ref}
          className={cn('w-full flex flex-col items-center gap-8', className)}
          {...props}
        >
          {/* Main Container */}
          <motion.div
            className={cn(
              'relative w-full max-w-5xl rounded-3xl overflow-hidden',
              'bg-gradient-to-br from-gray-950/90 via-gray-900/85 to-black/90',
              'shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-gray-700/50',
              'backdrop-blur-2xl'
            )}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Metallic Overlay */}
            <div
              className="absolute inset-0 rounded-3xl -z-10 pointer-events-none"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02) 50%, rgba(0, 0, 0, 0.15))',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            />

            {/* Image Display */}
            <div className="relative w-full aspect-[16/9] overflow-hidden">
              <div className="absolute inset-0 shadow-[inset_0_8px_16px_rgba(0,0,0,0.4)] pointer-events-none z-10"></div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20 pointer-events-none z-5"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 450, damping: 45 },
                    opacity: { duration: 0.35 },
                    scale: { duration: 0.5 },
                    rotateY: { duration: 0.4 },
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Image
                    src={currentItem.src}
                    alt={currentItem.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1280px"
                    priority={activeIndex === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Refined Content Area */}
            {(currentItem.title ||
              currentItem.description ||
              currentItem.badges?.length) && (
              <div className="px-12 py-10 text-center bg-gradient-to-b from-gray-900/70 to-black/60 backdrop-blur-md">
                {currentItem.title && (
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="text-4xl font-extrabold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent tracking-tight text-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                  >
                    {currentItem.title}
                  </motion.h3>
                )}
                {currentItem.description && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    className="text-lg text-gray-200 mt-4 max-w-md mx-auto leading-relaxed font-light relative"
                  >
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></span>
                    {currentItem.description}
                  </motion.div>
                )}
                {currentItem.badges?.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    className="flex flex-wrap gap-3 justify-center mt-6"
                  >
                    {currentItem.badges.map((badge, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={cn(
                          'text-sm font-medium py-1.5 px-4 rounded-full',
                          'bg-gradient-to-br from-gray-800/60 via-gray-700/70 to-gray-800/60',
                          'text-white border border-gray-600/50',
                          'shadow-[inset_0_1px_3px_rgba(255,255,255,0.15),0_2px_6px_rgba(0,0,0,0.3)]',
                          'hover:bg-gradient-to-br hover:from-gray-700/70 hover:via-gray-600/80 hover:to-gray-700/70',
                          'hover:scale-105 transition-all duration-200 ease-out'
                        )}
                      >
                        {badge}
                      </Badge>
                    ))}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>

          {/* Minimap */}
          {items.length > 1 && <Minimap />}
        </div>
      </ImageGalleryContext.Provider>
    );
  }
);
ImageGallery.displayName = 'ImageGallery';

export { ImageGallery, ImageGalleryItem };
export type { ImageGalleryProps, ImageItemProps };
