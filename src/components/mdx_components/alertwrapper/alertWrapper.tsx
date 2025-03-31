'use client'; // Required for Framer Motion hooks and event handlers

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

import CircleCheckBigIcon from '@/components/icons/successIcon';
import InfoIcon from '@/components/icons/infoIcon';
import TriangleAlertIcon from '@/components/icons/warningIcon';
import ShieldAlertIcon from '@/components/icons/dangerIcon';

// --- Base Styles with Apple-Inspired Refinement ---
const alertVariants = cva(
  'relative w-full overflow-hidden rounded-3xl border border-opacity-20 p-6 shadow-xl backdrop-blur-2xl bg-opacity-80',
  {
    variants: {
      variant: {
        info: 'bg-gradient-to-br from-blue-500/10 via-blue-300/5 to-blue-200/20 border-blue-400/20 text-blue-900 dark:from-blue-600/15 dark:via-blue-900/10 dark:to-blue-100/20 dark:text-blue-200',
        success:
          'bg-gradient-to-br from-green-500/10 via-green-300/5 to-green-200/20 border-green-400/20 text-green-900 dark:from-green-600/15 dark:via-green-900/10 dark:to-green-100/20 dark:text-green-200',
        warning:
          'bg-gradient-to-br from-yellow-500/15 via-yellow-300/5 to-yellow-200/20 border-yellow-400/25 text-yellow-900 dark:from-yellow-600/20 dark:via-yellow-900/10 dark:to-yellow-100/20 dark:text-yellow-200',
        danger:
          'bg-gradient-to-br from-red-500/10 via-red-300/5 to-red-200/20 border-red-400/20 text-red-900 dark:from-red-600/15 dark:via-red-900/10 dark:to-red-100/20 dark:text-red-200',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

// --- Icon Container with Glossy, Metallic Finish ---
const iconContainerVariants = cva(
  'absolute z-10 flex h-10 w-10 items-center justify-center rounded-full border border-opacity-40 shadow-lg backdrop-blur-md', // Slightly refined base styles
  {
    variants: {
      variant: {
        info: 'bg-gradient-to-br from-blue-400/90 via-blue-600/80 to-blue-800/70 text-white border-blue-500/50',
        success:
          'bg-gradient-to-br from-green-400/90 via-green-600/80 to-green-800/70 text-white border-green-500/50',
        warning:
          'bg-gradient-to-br from-yellow-400/90 via-yellow-600/80 to-yellow-800/70 text-white border-yellow-500/50',
        danger:
          'bg-gradient-to-br from-red-400/90 via-red-600/80 to-red-800/70 text-white border-red-500/50',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

// --- Icon Mapping ---
const alertIcons = {
  info: InfoIcon,
  success: CircleCheckBigIcon,
  warning: TriangleAlertIcon,
  danger: ShieldAlertIcon,
};

// --- Component Props ---
interface AlertProps
  extends Omit<
      React.HTMLAttributes<HTMLDivElement>,
      'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'
    >,
    VariantProps<typeof alertVariants> {
  variant: 'info' | 'success' | 'warning' | 'danger';
}

// --- Enhanced Framer Motion Animations ---
const alertMotionVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 18,
      mass: 0.6,
      opacity: { duration: 0.5, ease: 'circOut' },
      y: { duration: 0.6, ease: [0.25, 0.8, 0.3, 1] },
      scale: { duration: 0.6, ease: [0.25, 0.8, 0.3, 1] },
    },
  },
};

const iconMotionVariants = {
  hidden: { scale: 0, opacity: 0, rotate: -30 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
      mass: 0.4,
      delay: 0.15,
    },
  },
};

// --- The Refined Alert Component ---
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, children, ...props }, ref) => {
    const IconComponent = alertIcons[variant];
    const Icon = React.useMemo(() => IconComponent, [IconComponent]);

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={alertMotionVariants}
        className={cn(alertVariants({ variant }), 'relative my-8', className)}
        role="alert"
        {...props}
      >
        {/* Icon Positioned on the Left with Glossy/Metallic Finish */}
        <motion.div
          variants={iconMotionVariants}
          className={cn(
            iconContainerVariants({ variant }),
            'left-4 -translate-y-1/2' // Centered vertically on the left
          )}
          aria-hidden="true"
          style={{
            boxShadow:
              'inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15)', // Glossy highlight + shadow
            backgroundBlendMode: 'overlay', // Enhances the metallic sheen
          }}
        >
          <Icon className="h-6 w-6" />
        </motion.div>

        {/* Content Area with Adjusted Padding */}
        <div className="ml-14 pt-2 pr-4">{children}</div>

        {/* Subtle Glow Effect in the Background */}
        <motion.div
          className="absolute inset-0 -z-10 rounded-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            background: `radial-gradient(circle at 20% 20%, ${
              variant === 'info'
                ? 'rgba(59, 130, 246, 0.3)'
                : variant === 'success'
                ? 'rgba(34, 197, 94, 0.3)'
                : variant === 'warning'
                ? 'rgba(234, 179, 8, 0.3)'
                : 'rgba(239, 68, 68, 0.3)'
            }, transparent 70%)`,
          }}
        />
      </motion.div>
    );
  }
);
Alert.displayName = 'Alert';

// --- Enhanced AlertTitle ---
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      'mb-1 font-medium text-[1.1em] leading-tight tracking-wide text-opacity-95',
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

// --- Enhanced AlertDescription ---
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-[0.9em] leading-relaxed opacity-85 tracking-wide text-[var(--text-color-primary-800)]',
      className
    )}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
