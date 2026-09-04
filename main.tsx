import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import Home from './app/page';
import { resolveRoute, type InitialRoute } from './app/site-routes';
import './app/globals.css';

const root = document.getElementById('root')!;
const routeNode = document.getElementById('research-route');
const initial: InitialRoute = routeNode ? JSON.parse(routeNode.textContent ?? '{}') : resolveRoute(window.location.pathname)?.initial ?? {};
const app = <React.StrictMode><Home initial={initial} /></React.StrictMode>;
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
