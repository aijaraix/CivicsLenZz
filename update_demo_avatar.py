import re

with open("src/components/demo-avatar.tsx", "r") as f:
    text = f.read()

new_avatar_code = """import React from 'react';
import { DemoOfficial } from '../lib/demo-data';

export function DemoAvatar({ official, size = 'md', className = '' }: { official: Pick<DemoOfficial, 'initials' | 'color' | 'name'> & { photoUrl?: string }; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  if (official.photoUrl) {
    return (
      <img src={official.photoUrl} alt={official.name} className={`demo-avatar demo-avatar-${size} ${className}`} style={{ objectFit: 'cover' }} />
    );
  }
  return (
    <span className={`demo-avatar demo-avatar-${size} ${className}`} style={{ '--avatar-color': official.color } as React.CSSProperties} aria-label={`${official.name} example portrait`}>
      <span>{official.initials}</span>
    </span>
  );
}
"""

with open("src/components/demo-avatar.tsx", "w") as f:
    f.write(new_avatar_code)
