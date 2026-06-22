import React from 'react';

export default function SkeletonContent({ isLoading, layout, children }: any) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', overflowX: 'auto', padding: '8px 0' }}>
      {layout?.map((item: any, i: number) => (
        <div
          key={item.key || i}
          className="animate-pulse"
          style={{
            flexShrink: 0,
            width: item.width || 120,
            height: item.height || 180,
            borderRadius: item.borderRadius || 8,
            backgroundColor: 'rgba(31, 31, 53, 0.6)',
            marginRight: item.marginRight || 0,
            marginTop: item.marginTop || 0,
            marginBottom: item.marginBottom || 0,
            marginLeft: item.marginLeft || 0,
          }}
        />
      ))}
    </div>
  );
}
