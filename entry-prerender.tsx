import React from 'react';
import { renderToString } from 'react-dom/server';
import Home from './app/page';
import { publicRoutes, type InitialRoute } from './app/site-routes';
export { publicRoutes };
export { findStories } from './app/editorial-data';
export { storyReferences, analysisReferences, sourceMetadata, referenceMetadata, gddReferences } from './app/source-references';
export { structuredData, researchIndex, readingMetadata, citationUrls } from './app/research-metadata';
export function render(initial: InitialRoute) {
  return renderToString(<React.StrictMode><Home initial={initial} /></React.StrictMode>);
}
