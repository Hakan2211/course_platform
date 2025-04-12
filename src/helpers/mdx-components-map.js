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

const TestScene = dynamic(
  () => import('@/components/mdx_components/3d_lessons/example/TestScene'),
  { ssr: false }
);

const TradingFloorViz = dynamic(
  () =>
    import('@/components/mdx_components/3d_lessons/module1/tradingFloorViz'),
  { ssr: false }
);

const TradingFloorViz2 = dynamic(
  () =>
    import('@/components/mdx_components/3d_lessons/module1/tradingFloorViz2'),
  { ssr: false }
);

const VideoPlayer = dynamic(
  () => import('@/components/mdx_components/videoPlayer/videoPlayer'),
  { ssr: false }
);

const AssetTowers = dynamic(
  () => import('@/components/mdx_components/3d_lessons/module1/assetTowers'),
  { ssr: false }
);
const AssetSpheres = dynamic(
  () => import('@/components/mdx_components/3d_lessons/module1/assetSpheres'),
  { ssr: false }
);

const CurrencyFlowMap = dynamic(
  () =>
    import('@/components/mdx_components/3d_lessons/module1/currencyFlowMap'),
  { ssr: false }
);

const TimeComparisonViz = dynamic(
  () => import('@/components/mdx_components/3d_lessons/module1/timeComparison'),
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
  TradingFloorViz,
  TradingFloorViz2,
  AssetTowers,
  AssetSpheres,
  CurrencyFlowMap,
  TimeComparisonViz,
};

export default COMPONENT_MAP;
