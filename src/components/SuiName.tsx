import React from 'react';
import { useSuiName, formatAddress } from '@/hooks/useSuiName';

interface SuiNameProps {
  address: string;
  className?: string;
  showIcon?: boolean;
}

export const SuiName: React.FC<SuiNameProps> = ({ address, className = '', showIcon = false }) => {
  const { data: name, isLoading } = useSuiName(address);

  if (isLoading) {
    return <span className={`${className} animate-pulse opacity-50`}>{formatAddress(address)}</span>;
  }

  return (
    <span className={className}>
      {name || formatAddress(address)}
    </span>
  );
};
