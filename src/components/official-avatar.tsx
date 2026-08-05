import React from 'react';
import { TrackedOfficial } from '../lib/civic-database';

export function OfficialAvatar({ official, size = 'md', className = '' }: { official: Pick<TrackedOfficial, 'initials' | 'color' | 'name'> & { photoUrl?: string }; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  if (official.photoUrl) {
    return (
      <img src={official.photoUrl} alt={official.name} className={`official-avatar official-avatar-${size} ${className}`} style={{ objectFit: 'cover' }} />
    );
  }
  return (
    <span className={`official-avatar official-avatar-${size} ${className}`} style={{ '--avatar-color': official.color } as React.CSSProperties} aria-label={`${official.name} example portrait`}>
      <span>{official.initials}</span>
    </span>
  );
}
