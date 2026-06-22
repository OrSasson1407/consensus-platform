import React from 'react';

export const Image = ({ source, style, contentFit, ...props }: any) => {
  const flattenedStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;
  const uri = typeof source === 'object' ? source?.uri : source;
  const objectFit = contentFit === 'cover' ? 'cover' : 'contain';
  
  return (
    <img
      src={uri}
      style={{
        width: '100%',
        height: '100%',
        objectFit,
        ...flattenedStyle
      }}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};
