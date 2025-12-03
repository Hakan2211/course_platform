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

const BrainModel = dynamic(
  () =>
    import('@/components/mdx_components/3d_lessons/brain/BrainModelContainer'),
  { ssr: false }
);

const BrainExplorer = dynamic(
  () =>
    import('@/components/mdx_components/cognitive_athlete/BrainExplorer').then(
      (mod) => mod.BrainExplorer
    ),
  { ssr: false }
);

const RaceAnimation = dynamic(
  () =>
    import('@/components/mdx_components/cognitive_athlete/RaceAnimation').then(
      (mod) => mod.RaceAnimation
    ),
  { ssr: false }
);

const HierarchyBuilding = dynamic(
  () =>
    import(
      '@/components/mdx_components/cognitive_athlete/HierarchyBuilding'
    ).then((mod) => mod.default),
  { ssr: false }
);

const DecisionFlowchart = dynamic(
  () =>
    import(
      '@/components/mdx_components/cognitive_athlete/DecisionFlowchart'
    ).then((mod) => mod.default),
  { ssr: false }
);

const BrainIdentifier = dynamic(
  () =>
    import(
      '@/components/mdx_components/cognitive_athlete/BrainIdentifier'
    ).then((mod) => mod.default),
  { ssr: false }
);

const AnatomyOfBlowUp = dynamic(
  () =>
    import(
      '@/components/mdx_components/cognitive_athlete/AnatomyOfBlowUp'
    ).then((mod) => mod.AnatomyOfBlowUp),
  { ssr: false }
);

const TunnelVisionSimulation = dynamic(
  () =>
    import(
      '@/components/mdx_components/cognitive_athlete/TunnelVisionSimulation'
    ).then((mod) => mod.TunnelVisionSimulation),
  { ssr: false }
);

const SignalDecoder = dynamic(
  () =>
    import('@/components/mdx_components/cognitive_athlete/SignalDecoder').then(
      (mod) => mod.default
    ),
  { ssr: false }
);

const VagusHighway = dynamic(
  () =>
    import('@/components/mdx_components/cognitive_athlete/VagusHighway').then(
      (mod) => mod.default
    ),
  { ssr: false }
);

const BreathingPacer = dynamic(
  () =>
    import('@/components/mdx_components/cognitive_athlete/BreathingPacer').then(
      (mod) => mod.default
    ),
  { ssr: false }
);

const SomaticMarkersExplorer = dynamic(
  () =>
    import(
      '@/components/mdx_components/cognitive_athlete/SomaticMarkersExplorer'
    ).then((mod) => mod.default),
  { ssr: false }
);

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
import { SurvivalHierarchy } from '@/components/mdx_components/survivalHierarchy/SurvivalHierarchy';
import { SurvivalCommandments } from '@/components/mdx_components/survivalCommandments/SurvivalCommandments';
import { CustomLink } from '@/components/mdx_components/customLink/CustomLink';
import { Math } from '@/components/mdx_components/math/Math';
import DecisionTree from '@/components/mdx_components/decisionTree/DecisionTree';
import ShortInterestDataPanel from '@/components/mdx_components/shortInterestPanel/ShortInterestDataPanel';
import DilutionChecklist from '@/components/mdx_components/dilutionChecklist/DilutionChecklist';
import Checklist from '@/components/mdx_components/checklist/Checklist';
import { FortressCommandCenter } from '@/components/mdx_components/fortressCommandCenter/FortressCommandCenter';
import { PersonalRiskPlanDownload } from '@/components/mdx_components/downloads/PersonalRiskPlanDownload';
const PredictionErrorSimulator = dynamic(
  () =>
    import(
      '@/components/mdx_components/cognitive_athlete/PredictionErrorSimulator'
    ),
  { ssr: false }
);

const SynapticDownregulation = dynamic(
  () =>
    import(
      '@/components/mdx_components/cognitive_athlete/SynapticDownregulation'
    ),
  { ssr: false }
);

const CasinoModeMeter = dynamic(
  () =>
    import(
      '@/components/mdx_components/cognitive_athlete/CasinoModeMeter/CasinoModeMeter'
    ),
  { ssr: false }
);

const CycleOfDoom = dynamic(
  () =>
    import('@/components/mdx_components/cognitive_athlete/CycleOfDoom').then(
      (mod) => mod.CycleOfDoom
    ),
  { ssr: false }
);

const DecisionBattery = dynamic(
  () =>
    import(
      '@/components/mdx_components/cognitive_athlete/DecisionBattery/DecisionBattery'
    ).then((mod) => mod.DecisionBattery),
  { ssr: false }
);

const PrefrontalBattery = dynamic(
  () =>
    import(
      '@/components/mdx_components/cognitive_athlete/PrefrontalBattery/PrefrontalBatteryContainer'
    ).then((mod) => mod.PrefrontalBatteryContainer),
  { ssr: false }
);

const HormonalLens = dynamic(
  () => import('@/components/mdx_components/cognitive_athlete/HormonalLens'),
  { ssr: false }
);

const PositionSizingCurve = dynamic(
  () =>
    import('@/components/mdx_components/cognitive_athlete/PositionSizingCurve'),
  { ssr: false }
);

const ShadowFloatRiskSimulator = dynamic(
  () =>
    import(
      '@/components/mdx_components/shadowFloatRiskSimulator/ShadowFloatRiskSimulator'
    ),
  { ssr: false }
);
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
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trophy,
  Circle,
  Skull,
  X,
  BellRing,
  Medal,
  Flag,
  MessageCircleQuestion,
  Brain,
  AudioWaveform,
  Activity,
  Sprout,
  BrainCircuit,
  EggFried,
  Banana,
  Cherry,
  Croissant,
  Lollipop,
  Apple,
  Nut,
  Wheat,
  Drumstick,
  CookingPot,
  Candy,
  Coffee,
  Fish,
  Salad,
  Beef,
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

const VolumeAtPriceContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/magicMarketBox/VolumeAtPriceContainer'
    ),
  { ssr: false }
);

const CompressedCycle2DContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/2d_environment/magicMarketBox/CompressedCycle2DContainer'
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

const VerticalEcosystemContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/magicMarketBox/VerticalEcosystemContainer'
    ),
  { ssr: false }
);

const MarketEcosystemContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/magicMarketBox/MarketEcosystemContainer'
    ),
  { ssr: false }
);

const ShortingMechanismContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/magicMarketBox/ShortingMechanismContainer'
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

const CompanyGalaxyContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/magicMarketBox/CompanyGalaxyContainer'
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

const LiquidityHuntContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/magicMarketBox/LiquidityHuntContainer'
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

const VWAPLaboratory2DContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/2d_environment/p5Sketch/VWAPLaboratory2DContainer'
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

const FalseVsFailedBreakout2DContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/2d_environment/p5Sketch/FalseVsFailedBreakout2DContainer'
    ),
  { ssr: false }
);

const DepthChart2DContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/2d_environment/p5Sketch/DepthChart2DContainer'
    ),
  { ssr: false }
);

const TapeReading2DContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/2d_environment/p5Sketch/TapeReading2DContainer'
    ),
  { ssr: false }
);

const OwnershipDilution2DContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/2d_environment/p5Sketch/OwnershipDilution2DContainer'
    ),
  { ssr: false }
);

const ToxicityScorecard2DContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/2d_environment/p5Sketch/ToxicityScorecard2DContainer'
    ),
  { ssr: false }
);

const DilutionImpact2DContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/2d_environment/p5Sketch/DilutionImpact2DContainer'
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

const OrderBook3DContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/magicMarketBox/OrderBook3DContainer'
    ),
  { ssr: false }
);

const ExecutionStrategiesContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/magicMarketBox/ExecutionStrategiesContainer'
    ),
  { ssr: false }
);

const DilutionBuybackContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/magicMarketBox/DilutionBuybackContainer'
    ),
  { ssr: false }
);

const OfferingMechanicsContainer = dynamic(
  () =>
    import(
      '@/components/mdx_components/3d_lessons/magicMarketBox/OfferingMechanicsContainer'
    ),
  { ssr: false }
);

const TraderGraveyard = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/graveyard/TraderGraveyard'
    ),
  { ssr: false }
);

const RiskCalculator = dynamic(
  () => import('@/components/mdx_components/risk_management/RiskCalculator'),
  { ssr: false }
);

const CoinFlipGame = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/coin_flip_game/CoinFlipGame'
    ).then((mod) => mod.CoinFlipGame),
  { ssr: false }
);

const PositionSizingCalculator = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/position_sizing/PositionSizingCalculator'
    ).then((mod) => mod.PositionSizingCalculator),
  { ssr: false }
);

const PositionSizeImpactSphere = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/position_sizing/impact_sphere/PositionSizeImpactSphere'
    ),
  { ssr: false }
);

const ATRStopCalculator = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/stop_loss/ATRStopCalculator'
    ).then((mod) => mod.ATRStopCalculator),
  { ssr: false }
);

const TrailingStopVisualizer = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/stop_loss/TrailingStopVisualizer'
    ),
  { ssr: false }
);

const StopHuntingSimulator = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/stop_loss/StopHuntingSimulator/StopHuntingSimulator'
    ),
  { ssr: false }
);

const ProfitabilityLandscape = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/profitability_landscape/ProfitabilityLandscape'
    ),
  { ssr: false }
);

const ProfitabilitySimulator = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/profitability_landscape/ProfitabilitySimulator'
    ),
  { ssr: false }
);

const RUniverse = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/r_universe/RUniverse'
    ).then((mod) => mod.RUniverse),
  { ssr: false }
);

const RDistributionBuilder = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/r_distribution/RDistributionBuilder'
    ).then((mod) => mod.RDistributionBuilder),
  { ssr: false }
);

const MaeMfeScatterPlot = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/mae_mfe/MaeMfeScatterPlot'
    ),
  { ssr: false }
);

const DrawdownCanyon = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/drawdown/DrawdownCanyon'
    ).then((mod) => mod.DrawdownCanyon),
  { ssr: false }
);

const SisyphusScale = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/drawdown/SisyphusScale'
    ),
  { ssr: false }
);

const StreakGenerator = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/drawdown/StreakGenerator'
    ),
  { ssr: false }
);

const PortfolioHeatGame = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/portfolio_heat/PortfolioHeatGame'
    ),
  { ssr: false }
);

const RiskConstellation = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/portfolio_heat/RiskConstellation'
    ).then((mod) => mod.RiskConstellation),
  { ssr: false }
);

const VolatilityRegimeViz = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/volatility_regimes/VolatilityRegimeViz'
    ),
  { ssr: false }
);

const FatTailDistribution = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/volatility_regimes/FatTailDistribution'
    ),
  { ssr: false }
);

const TailRiskVisualizer = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/volatility_regimes/TailRiskVisualizer'
    ),
  { ssr: false }
);

const RevengeSimulator = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/psychological_warfare/RevengeSimulator'
    ),
  { ssr: false }
);

const MazeGame = dynamic(
  () =>
    import(
      '@/components/mdx_components/risk_management/psychological_warfare/maze_game/MazeGame'
    ).then((mod) => mod.MazeGame),
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
  BrainModel,
  BrainExplorer,
  RaceAnimation,
  HierarchyBuilding,
  DecisionFlowchart,
  BrainIdentifier,
  AnatomyOfBlowUp,
  TunnelVisionSimulation,
  SignalDecoder,
  VagusHighway,
  BreathingPacer,
  SomaticMarkersExplorer,
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
  VerticalEcosystemContainer,
  MarketEcosystemContainer,
  ShortingMechanismContainer,
  BattleInsideBoxContainer,
  CompanyGalaxyContainer,
  VolumeAnatomyContainer,
  VolumeAtPriceContainer,
  LiquidityHuntContainer,
  VolumeRotation3D,
  CompressedCycle2DContainer,
  VolumeAnatomy2DContainer,
  VPALens2DContainer,
  ProfileShapeExplorer2DContainer,
  VWAPLaboratory2DContainer,
  CryptoEquitiesRotationContainer,
  EconomicCycleRotationContainer,
  MarketStatesVisualizerContainer,
  FalseVsFailedBreakout2DContainer,
  DepthChart2DContainer,
  TapeReadingContainer: TapeReading2DContainer,
  OwnershipDilution2DContainer,
  ToxicityScorecard2DContainer,
  DilutionImpact2DContainer,
  TrendArchitectureContainer,
  SupportResistanceMemoryContainer,
  OrderBook3DContainer,
  ExecutionStrategiesContainer,
  DilutionBuybackContainer,
  OfferingMechanicsContainer,
  TraderGraveyard,
  RiskCalculator,
  CoinFlipGame,
  PositionSizingCalculator,
  PositionSizeImpactSphere,
  ATRStopCalculator,
  TrailingStopVisualizer,
  StopHuntingSimulator,
  ProfitabilityLandscape,
  ProfitabilitySimulator,
  RUniverse,
  RDistributionBuilder,
  MaeMfeScatterPlot,
  DrawdownCanyon,
  SisyphusScale,
  StreakGenerator,
  PortfolioHeatGame,
  RiskConstellation,
  VolatilityRegimeViz,
  FatTailDistribution,
  TailRiskVisualizer,
  RevengeSimulator,
  MazeGame,
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
  SurvivalHierarchy,
  SurvivalCommandments,
  CustomLink,
  Math,
  DecisionTree,
  ShortInterestDataPanel,
  PredictionErrorSimulator,
  SynapticDownregulation,
  CasinoModeMeter,
  CycleOfDoom,
  DecisionBattery,
  PrefrontalBattery,
  HormonalLens,
  PositionSizingCurve,
  ShadowFloatRiskSimulator,
  DilutionChecklist,
  Checklist,
  FortressCommandCenter,
  PersonalRiskPlanDownload,
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
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trophy,
  Circle,
  Skull,
  X,
  BellRing,
  Medal,
  Flag,
  MessageCircleQuestion,
  Brain,
  AudioWaveform,
  Activity,
  Sprout,
  BrainCircuit,
  EggFried,
  Banana,
  Cherry,
  Croissant,
  Lollipop,
  Apple,
  Nut,
  Wheat,
  Drumstick,
  CookingPot,
  Candy,
  Coffee,
  Fish,
  Salad,
  Beef,
};

export default COMPONENT_MAP;
