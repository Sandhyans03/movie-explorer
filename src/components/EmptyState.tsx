import React from 'react';
import { StateView, type StateViewProps } from './StateView';

export function EmptyState(props: StateViewProps) {
  return <StateView {...props} />;
}
