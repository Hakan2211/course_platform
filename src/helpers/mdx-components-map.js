import BlogHeading from '@/components/mdx_components/blogHeading/blogHeading';
import QuoteComponent from '@/components/mdx_components/quoteComponent/quoteComponent';
import { VoiceoverPlayer } from '@/components/mdx_components/voiceover/voiceoverPlayer';
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/mdx_components/alertwrapper/alertWrapper';
import { CanvasWrapper } from '@/components/mdx_components/canvas3d/canvasWrapper';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import {
  ImageGallery,
  ImageGalleryItem,
} from '@/components/mdx_components/imageGallery/imageGallery';

import VideoTest from '@/components/mdx_components/videoPlayer/videoTest';
import { VideoPlayerUI } from '@/components/mdx_components/videoPlayer/videoPlayerUI';
import EnvironmentWrapper from '@/components/mdx_components/2d_environment/environmentWrapper';
import FramerMotionTest from '@/components/mdx_components/2d_environment/framerMotionTest';
import P5Example from '@/components/mdx_components/2d_environment/p5Sketch/p5Example';
import { InteractiveDemo } from '@/components/mdx_components/2d_environment/p5Sketch/interactiveSplit';
import { CompressionExpansion } from '@/components/mdx_components/2d_environment/p5Sketch/compressionExpansion';
import TradingPyramid from '@/components/mdx_components/2d_environment/TradingPyramid';
import TradingCycleLoop from '@/components/mdx_components/2d_environment/TradingCycleLoop';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import {
  GridList,
  GridListItem,
} from '@/components/mdx_components/gridList/GridList';
import {
  InfoGrid,
  InfoGridItem,
} from '@/components/mdx_components/gridList/InfoGrid';
import { Highlight } from '@/components/mdx_components/highlight/Highlight';
import { CustomLink } from '@/components/mdx_components/customLink/CustomLink';
import { Math } from '@/components/mdx_components/math/Math';
import {
  TrendingUp,
  LandPlot,
  Repeat,
  FunctionSquare,
  Package,
  CircleDollarSign,
  Car,
  Home,
  Briefcase,
  Droplets,
  Building,
  Building2,
  BarChart,
  Bot,
  Scale,
  Target,
  Users,
  Waves,
  Globe,
  GraduationCap,
} from 'lucide-react';

const TestScene = dynamic(
  () => import('@/components/mdx_components/3d_lessons/example/TestScene'),
  { ssr: false }
);

const VideoPlayer = dynamic(
  () => import('@/components/mdx_components/videoPlayer/videoPlayer'),
  { ssr: false }
);

const AssetSpheres = dynamic(
  () => import('@/components/mdx_components/3d_lessons/module1/assetSpheres'),
  { ssr: false }
);

const MarketSizes = dynamic(
  () =>
    import('@/components/mdx_components/3d_lessons/marketSizes/marketSizes'),
  { ssr: false }
);

const MarketDynamics = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/marketDynamics/marketDynamics'
    ),
  { ssr: false }
);

const EquitiesNested = dynamic(
  () =>
    import('@/components/mdx_components/3d_lessons/marketSizes/EquitiesNested'),
  { ssr: false }
);

const ShareCakeSlicer = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/shareCakeSlicer/ShareCakeSlicer'
    ),
  { ssr: false }
);

const VolumeRotation3D = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/magicMarketBox/VolumeRotationContainer'
    ),
  { ssr: false }
);

const InteractiveFloat = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/interactiveFloat/InteractiveFloat'
    ),
  { ssr: false }
);

const IntroductionContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/magicMarketBox/IntroductionContainer'
    ),
  { ssr: false }
);

const ParticleModelContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/magicMarketBox/ParticleModelContainer'
    ),
  { ssr: false }
);

const EnergyAndMotionContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/magicMarketBox/EnergyAndMotionContainer'
    ),
  { ssr: false }
);

const EquilibriumAndPressureContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/magicMarketBox/EquilibriumAndPressureContainer'
    ),
  { ssr: false }
);

const BattleInsideBoxContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/magicMarketBox/BattleInsideBoxContainer'
    ),
  { ssr: false }
);

const VolumeAnatomyContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/magicMarketBox/VolumeAnatomyContainer'
    ),
  { ssr: false }
);

const VolumeAnatomy2DContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/2d_environment/p5Sketch/VolumeAnatomy2DContainer'
    ),
  { ssr: false }
);

const VPALens2DContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/2d_environment/p5Sketch/VPALens2DContainer'
    ),
  { ssr: false }
);

const ProfileShapeExplorer2DContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/2d_environment/p5Sketch/ProfileShapeExplorer2DContainer'
    ),
  { ssr: false }
);

const CryptoEquitiesRotationContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/2d_environment/CryptoEquitiesRotationContainer'
    ),
  { ssr: false }
);

const EconomicCycleRotationContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/2d_environment/EconomicCycleRotationContainer'
    ),
  { ssr: false }
);

const MarketStatesVisualizerContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/2d_environment/MarketStatesVisualizerContainer'
    ),
  { ssr: false }
);

const TrendArchitectureContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/magicMarketBox/TrendArchitectureContainer'
    ),
  { ssr: false }
);

const SupportResistanceMemoryContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/magicMarketBox/SupportResistanceMemoryContainer'
    ),
  { ssr: false }
);

const COMPONENT_MAP = {
  h1: (props) => <BlogHeading level={1} {...props} />,
  h2: (props) => <BlogHeading level={2} {...props} />,
  h3: (props) => <BlogHeading level={3} {...props} />,
  QuoteComponent,
  VoiceoverPlayer,
  Alert,
  AlertTitle,
  AlertDescription,
  CanvasWrapper,
  TestScene,
  Suspense,
  VideoPlayer,
  VideoPlayerUI,
  VideoTest,
  ImageGallery,
  ImageGalleryItem,
  EnvironmentWrapper,
  FramerMotionTest,
  P5Example,
  InteractiveDemo,
  CompressionExpansion,
  TradingPyramid,
  TradingCycleLoop,
  AssetSpheres,
  MarketSizes,
  MarketDynamics,
  EquitiesNested,
  ShareCakeSlicer,
  InteractiveFloat,
  IntroductionContainer,
  ParticleModelContainer,
  EnergyAndMotionContainer,
  EquilibriumAndPressureContainer,
  BattleInsideBoxContainer,
  VolumeAnatomyContainer,
  VolumeRotation3D,
  VolumeAnatomy2DContainer,
  VPALens2DContainer,
  ProfileShapeExplorer2DContainer,
  CryptoEquitiesRotationContainer,
  EconomicCycleRotationContainer,
  MarketStatesVisualizerContainer,
  TrendArchitectureContainer,
  SupportResistanceMemoryContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  GridList,
  GridListItem,
  InfoGrid,
  InfoGridItem,
  Highlight,
  CustomLink,
  Math,
  TrendingUp,
  LandPlot,
  Repeat,
  FunctionSquare,
  Package,
  CircleDollarSign,
  Car,
  Home,
  Briefcase,
  Droplets,
  Building,
  Building2,
  BarChart,
  Bot,
  Scale,
  Target,
  Users,
  Waves,
  Globe,
  GraduationCap,
};

export default COMPONENT_MAP;
