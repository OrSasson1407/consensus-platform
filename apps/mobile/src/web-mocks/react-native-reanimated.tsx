import React, { useState, useEffect } from 'react';
import { View } from './react-native';

export const useSharedValue = (initialValue: any) => {
  return { value: initialValue };
};

export const useAnimatedStyle = (styleSelector: () => any) => {
  return {};
};

export const withSpring = (value: any, config?: any, callback?: any) => {
  if (callback) callback(true);
  return value;
};

export const withTiming = (value: any, config?: any, callback?: any) => {
  if (callback) callback(true);
  return value;
};

export const runOnJS = (fn: any) => fn;

export const interpolate = (value: any, inputRange: any, outputRange: any, extrapolate?: any) => {
  return outputRange ? outputRange[0] : 0;
};

export const Extrapolation = {
  CLAMP: 'clamp'
};

const Animated = {
  View: View,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation
};

export default Animated;
