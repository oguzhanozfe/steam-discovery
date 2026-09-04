import imageManifest from './data/game-images.json';

export type ImageRecord = { url: string; fallback?: string; width?: number; height?: number };
export const steamImageManifest = imageManifest as Record<string, ImageRecord>;
export function steamImageUrl(appId: string) {
  return steamImageManifest[appId]?.url ?? `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
}
