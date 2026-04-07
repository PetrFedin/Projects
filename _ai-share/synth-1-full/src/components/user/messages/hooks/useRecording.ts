import React from 'react';

export function useRecording() {
  const [recording, setRecording] = React.useState(false);

  const startRecording = () => {
    setRecording(true);
    // Simulation
    setTimeout(() => setRecording(false), 2000);
  };

  const stopRecording = () => {
    setRecording(false);
  };

  return {
    recording,
    startRecording,
    stopRecording
  };
}
