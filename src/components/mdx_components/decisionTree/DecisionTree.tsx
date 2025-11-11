import React from 'react';
import { cn } from '@/lib/utils';

export interface DecisionNode {
  question: string;
  yes?: DecisionNode | string;
  no?: DecisionNode | string;
}

interface DecisionTreeProps {
  root: DecisionNode;
  className?: string;
}

const DecisionTree: React.FC<DecisionTreeProps> = ({ root, className }) => {
  const renderNode = (
    node: DecisionNode | string,
    isYes: boolean,
    depth: number = 0
  ): React.ReactNode => {
    if (typeof node === 'string') {
      return (
        <div
          className={cn(
            'ml-8 mt-2 text-sm',
            isYes ? 'text-green-400' : 'text-gray-400'
          )}
        >
          → {node}
        </div>
      );
    }

    return (
      <div className={cn('my-4', depth > 0 && 'ml-8')}>
        <div className="text-base font-medium text-[var(--text-color-primary-800)] mb-2">
          {node.question}
        </div>
        <div className="ml-4">
          {node.yes && (
            <div className="mb-2">
              <div className="text-sm font-semibold text-green-400 mb-1">
                ├─ YES
              </div>
              {renderNode(node.yes, true, depth + 1)}
            </div>
          )}
          {node.no && (
            <div>
              <div className="text-sm font-semibold text-gray-400 mb-1">
                └─ NO
              </div>
              {renderNode(node.no, false, depth + 1)}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        'my-8 p-6 rounded-lg border border-[var(--text-color-primary-300)] bg-[var(--bg-color)]',
        className
      )}
    >
      {renderNode(root, false)}
    </div>
  );
};

export default DecisionTree;
