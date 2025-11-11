'use client';

import React from 'react';
import EnvironmentWrapper from '@/components/mdx_components/2d_environment/environmentWrapper';
import FalseVsFailedBreakout2D from './FalseVsFailedBreakout2D';

const FalseVsFailedBreakout2DContainer: React.FC = () => {
  return (
    <div className="relative w-full my-8">
      <EnvironmentWrapper height="480px">
        <FalseVsFailedBreakout2D />
      </EnvironmentWrapper>
    </div>
  );
};

export default FalseVsFailedBreakout2DContainer;
