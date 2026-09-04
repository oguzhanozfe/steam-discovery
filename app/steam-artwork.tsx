'use client';
import { useState } from 'react';
import { steamImageManifest as manifest, steamImageUrl } from './steam-image-url';
export { steamImageUrl } from './steam-image-url';
export function SteamArtwork({ appId, title, className, priority = false }: { appId: string; title: string; className?: string; priority?: boolean }) {
  const [failed, setFailed] = useState(0);
  const fallback = manifest[appId]?.fallback;
  if (failed > (fallback ? 1 : 0)) return <span className={`artwork-unavailable ${className ?? ''}`} role="img" aria-label={`${title}: artwork unavailable`}><strong>{title}</strong><small>Artwork temporarily unavailable</small></span>;
  return <img className={className} width={manifest[appId]?.width ?? 460} height={manifest[appId]?.height ?? 215} loading={priority ? 'eager' : 'lazy'} decoding="async" src={failed && fallback ? fallback : steamImageUrl(appId)} alt={`${title} — official Steam store capsule`} onError={() => setFailed(previous => previous + 1)} />;
}
