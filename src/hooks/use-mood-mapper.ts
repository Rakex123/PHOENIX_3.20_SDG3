"use client";

import { useContext } from 'react';
import { MoodMapperContext } from '@/contexts/mood-mapper-provider';

export const useMoodMapper = () => {
  const context = useContext(MoodMapperContext);
  if (context === undefined) {
    throw new Error('useMoodMapper must be used within a MoodMapperProvider');
  }
  return context;
};
