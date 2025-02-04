import React from 'react';
import CreateAnimation from '../animations/CreateAnimation';
import OpenAnimation from '../animations/OpenAnimation';
import DeleteAnimation from '../animations/DeleteAnimation';

type AnimationType = 'create' | 'open' | 'delete';

interface CapsuleAnimationProps {
  type: AnimationType;
  onAnimationComplete: () => void;
}

const CapsuleAnimation = ({
  type,
  onAnimationComplete,
}: CapsuleAnimationProps) => {
  switch (type) {
    case 'create':
      return <CreateAnimation onAnimationComplete={onAnimationComplete} />;
    case 'open':
      return <OpenAnimation onAnimationComplete={onAnimationComplete} />;
    case 'delete':
      return <DeleteAnimation onAnimationComplete={onAnimationComplete} />;
    default:
      return null;
  }
};

export default CapsuleAnimation;
