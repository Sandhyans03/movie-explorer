import React from 'react';
import { ApiError } from '../api/tmdb';
import { describeError } from '../utils/errors';
import { StateView } from './StateView';

interface Props {
  error: unknown;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: Props) {
  const isNetwork = error instanceof ApiError && error.isNetwork;

  return (
    <StateView
      icon={isNetwork ? 'cloud-offline-outline' : 'alert-circle-outline'}
      title={isNetwork ? 'No connection' : 'Something went wrong'}
      message={describeError(error)}
      actionLabel="Try again"
      onAction={onRetry}
    />
  );
}
