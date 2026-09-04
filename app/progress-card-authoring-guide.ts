export const progressCardAuthoringGuide = {
  version: 1,
  purpose:
    'Repository contract for agents that create or update cards on the Progress page.',
  sourceOfTruth: 'app/data/progress-tracker.json',
  runtimeDelivery: {
    browserEndpoint: '/api/progress',
    refreshBehavior:
      'The browser requests the current board once when the Progress page loads. There is no polling.',
    publication:
      'Commit and push a valid progress-tracker.json update to main. After the runtime reader has been deployed once, card-only changes do not require a Vercel build or deployment.',
    fallback:
      'If the live source cannot be read or validated, the page keeps the last deployed JSON snapshot.',
    infrastructure:
      'The Vercel project must define GITHUB_PROGRESS_TOKEN before its one manual infrastructure deployment. Use a fine-grained GitHub token restricted to oguzhanozfe/steam-discovery with Contents: Read only.',
    freshness:
      'Each page load requests the current GitHub JSON without browser or Vercel CDN caching. There is no background polling.',
    maximumFileSize:
      'Keep progress-tracker.json below 4 MB, the safe ceiling for this Vercel Function response.',
  },
  schemaValidator: 'app/progress-data.ts',
  editScope: {
    ordinaryCardChanges: ['app/data/progress-tracker.json'],
    preserve: [
      'Unrelated cards and fields',
      'Existing card order unless the user explicitly requests a reorder',
      'Published task and milestone IDs',
    ],
    doNotChangeWithoutExplicitUiRequest: [
      'app/progress-tracker.tsx',
      'app/globals.css',
      'Routing',
      'Archive behavior',
    ],
  },
  boardMetadata: {
    updatedAt: 'ISO date: YYYY-MM-DD',
    updatedLabel:
      'Same date: DD MMM YY with an uppercase three-letter English month',
  },
  taskContract: {
    id: 'Unique lowercase kebab-case. Never rename or reuse after publishing; browser archive state is keyed by this ID.',
    title: 'Short, specific work title.',
    summary: 'One concise sentence describing current scope or outcome.',
    owner: ['Emir', 'Oğuzhan'],
    priority: ['P0', 'P1', 'P2'],
    state: ['ongoing', 'paused', 'done'],
    progress: 'Number from 0 through 100.',
    lastUpdate: {
      date: 'ISO date: YYYY-MM-DD',
      note: 'Concise factual note describing the latest meaningful change.',
    },
    milestones: 'One or more milestones following milestoneRules.',
  },
  stateRules: {
    ongoing: 'Progress is below 100. Omit pauseReason and contentHandoff.',
    paused:
      'Progress is below 100. Include a non-empty free-text pauseReason and omit contentHandoff.',
    done: {
      rule: 'Progress is exactly 100, pauseReason is absent, and contentHandoff is complete.',
      contentHandoff: {
        label: 'Human-readable package name.',
        repoPath:
          'Exact repository-relative path to an existing artifact or entrypoint.',
        entrypoint: 'File the receiving authoring agent reads first.',
        note: 'Short instruction explaining how to use the handoff.',
      },
    },
    archived:
      'Not a task state. Never add it to JSON. Archive is a per-browser display preference.',
  },
  milestoneRules: [
    'Use a stable ID that is unique within the card.',
    'Provide a short label and a concrete description.',
    'Positions are strictly increasing, greater than 0, and no greater than 100.',
    'State is exactly done, current, or next.',
    'Past milestones are done, the active checkpoint may be current, and future milestones are next.',
    'At 0%, milestones are normally all next. On a done card, every milestone is done.',
    'Keep task progress consistent with milestone positions and states.',
  ],
  workflow: [
    'Read this guide, the current progress JSON, and the schema validator.',
    'Find a card by stable ID or append a new unordered card.',
    'Apply the requested owner, priority, state, progress, dates, and milestones.',
    'Add or remove pauseReason and contentHandoff according to the state rules.',
    'Update board metadata and the card lastUpdate.',
    'Before marking done, verify that contentHandoff.repoPath exists.',
    'Preserve unrelated cards and run every validation command.',
  ],
  validationCommands: [
    'pnpm exec oxfmt --check app/data/progress-tracker.json',
    'pnpm exec oxlint app/progress-data.ts app/progress-tracker.tsx',
    'pnpm exec tsc --noEmit --pretty false',
    'pnpm build:vercel',
  ],
  visibility: [
    'Everything in the progress JSON and this browser-delivered guide is public information.',
    'Done-card contentHandoff values are rendered in the expanded card.',
    'Never add credentials, tokens, private filesystem paths, or secret instructions.',
  ],
} as const;
