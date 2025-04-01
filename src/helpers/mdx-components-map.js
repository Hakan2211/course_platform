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

import VideoTest from '@/components/mdx_components/videoPlayer/videoTest';
import { VideoPlayerUI } from '@/components/mdx_components/videoPlayer/videoPlayerUI';

const TestScene = dynamic(
  () => import('@/components/mdx_components/3d_lessons/example/TestScene'),
  { ssr: false }
);

const VideoPlayer = dynamic(
  () => import('@/components/mdx_components/videoPlayer/videoPlayer'),
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
};

export default COMPONENT_MAP;
