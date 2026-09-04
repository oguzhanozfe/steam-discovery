import React from 'react';
import { renderToString } from 'react-dom/server';
import Home from './app/page';
import { publicRoutes, type InitialRoute } from './app/site-routes';
export { publicRoutes };
export function render(initial: InitialRoute) {
  return renderToString(<React.StrictMode><Home initial={initial} /></React.StrictMode>);
}
