import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusPanel from './StatusPanel';
import { FaceTrackingProvider } from '../../context/FaceTrackingContext';
import { AvatarProvider } from '../../context/AvatarContext';

test('renders status indicators correctly', () => {
  render(
    <FaceTrackingProvider>
      <AvatarProvider>
        <StatusPanel />
      </AvatarProvider>
    </FaceTrackingProvider>
  );

  expect(screen.getByText(/tracking/i)).toBeInTheDocument();
  expect(screen.getByText(/model/i)).toBeInTheDocument();
});