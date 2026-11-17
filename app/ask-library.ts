// Server-side only: the citable passages for Ask the Library.
import { buildPassages } from './ask-core.js';
import { records, evidenceClasses, tactics } from './tactics-data.js';

export const passages = buildPassages(records, evidenceClasses);
export const cards = tactics.cards;
