import React from 'react';

export const GestureHandlerRootView = ({ children, style, ...props }: any) => {
  const flattenedStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100%',
        ...flattenedStyle
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const GestureDetector = ({ children }: any) => {
  return <>{children}</>;
};

export const Gesture = {
  Pan: () => {
    const chain: any = {
      onUpdate: (callback?: any) => chain,
      onEnd: (callback?: any) => chain,
      onStart: (callback?: any) => chain,
    };
    return chain;
  }
};
