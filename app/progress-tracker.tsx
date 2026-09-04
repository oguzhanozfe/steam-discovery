'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  Archive,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CircleDashed,
  FileText,
  Flag,
  Pause,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  progressBoard,
  parseProgressBoard,
  type ProgressMilestone,
  type ProgressState,
  type ProgressTask,
} from './progress-data';

const stateLabels = {
  ongoing: 'Ongoing',
  paused: 'Paused',
  done: 'Done',
} as const;

const milestoneLabels = {
  done: 'Reached',
  current: 'Current',
  next: 'Next',
} as const;

type ProgressFilter = 'all' | ProgressState | 'archived';

const filterLabels: Record<ProgressFilter, string> = {
  all: 'All',
  ongoing: 'Ongoing',
  paused: 'Paused',
  done: 'Done',
  archived: 'Archived',
};

const archiveStorageKey = 'steam-discovery.progress.archive.v1';
const progressDataEndpoint = '/api/progress';
const progressDataTimeoutMs = 8_000;
const progressDataMaxCharacters = 4_000_000;

type ArchivePreferences = {
  archivedTaskIds: string[];
  activeFilter: ProgressFilter;
};

const defaultArchivePreferences: ArchivePreferences = {
  archivedTaskIds: [],
  activeFilter: 'all',
};
const archivePreferenceListeners = new Set<() => void>();
let archivePreferenceSnapshot = defaultArchivePreferences;
let archivePreferenceSnapshotRaw: string | null | undefined;
let archivePreferenceMemoryOnly = false;

function isProgressFilter(value: unknown): value is ProgressFilter {
  return (
    typeof value === 'string' &&
    Object.prototype.hasOwnProperty.call(filterLabels, value)
  );
}

function parseArchivePreferences(storedValue: string | null) {
  try {
    if (!storedValue) return defaultArchivePreferences;

    const parsedValue: unknown = JSON.parse(storedValue);
    if (
      typeof parsedValue !== 'object' ||
      parsedValue === null ||
      !('archivedTaskIds' in parsedValue) ||
      !Array.isArray(parsedValue.archivedTaskIds)
    ) {
      return defaultArchivePreferences;
    }

    const archivedTaskIds = [
      ...new Set(
        parsedValue.archivedTaskIds.filter(
          (taskId): taskId is string =>
            typeof taskId === 'string' &&
            taskId.length > 0 &&
            taskId.length <= 128,
        ),
      ),
    ].slice(0, 1_000);
    const activeFilter =
      'activeFilter' in parsedValue &&
      isProgressFilter(parsedValue.activeFilter)
        ? parsedValue.activeFilter
        : 'all';

    return { archivedTaskIds, activeFilter };
  } catch {
    return defaultArchivePreferences;
  }
}

function getArchivePreferenceSnapshot() {
  if (archivePreferenceMemoryOnly) return archivePreferenceSnapshot;

  try {
    const storedValue = window.localStorage.getItem(archiveStorageKey);
    if (storedValue !== archivePreferenceSnapshotRaw) {
      archivePreferenceSnapshot = parseArchivePreferences(storedValue);
      archivePreferenceSnapshotRaw = storedValue;
    }
  } catch {
    // Fall back to the current in-memory snapshot.
  }

  return archivePreferenceSnapshot;
}

function getServerArchivePreferenceSnapshot() {
  return defaultArchivePreferences;
}

function subscribeToArchivePreferences(listener: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === archiveStorageKey) {
      archivePreferenceMemoryOnly = false;
      archivePreferenceSnapshotRaw = undefined;
      listener();
    }
  }

  archivePreferenceListeners.add(listener);
  window.addEventListener('storage', handleStorage);

  return () => {
    archivePreferenceListeners.delete(listener);
    window.removeEventListener('storage', handleStorage);
  };
}

function updateArchivePreferences(
  updater: (current: ArchivePreferences) => ArchivePreferences,
) {
  const nextPreferences = updater(getArchivePreferenceSnapshot());
  const serializedPreferences = JSON.stringify(nextPreferences);

  archivePreferenceSnapshot = nextPreferences;
  archivePreferenceSnapshotRaw = serializedPreferences;
  try {
    window.localStorage.setItem(archiveStorageKey, serializedPreferences);
    archivePreferenceMemoryOnly = false;
  } catch {
    archivePreferenceMemoryOnly = true;
    // Keep the in-memory archive usable when browser storage is unavailable.
  }
  archivePreferenceListeners.forEach((listener) => listener());
}

function MilestoneMark({ milestone }: { milestone: ProgressMilestone }) {
  return (
    <span
      className={`progress-milestone-mark is-${milestone.state}`}
      style={{ left: `${milestone.position}%` }}
      aria-hidden="true"
    />
  );
}

function formatUpdateDate(date: string) {
  const [year, month, day] = date.split('-');
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];

  return `${day} ${months[Number(month) - 1] ?? month} ${year.slice(-2)}`;
}

function ProgressCard({
  task,
  isArchived,
  onArchiveChange,
}: {
  task: ProgressTask;
  isArchived: boolean;
  onArchiveChange: (task: ProgressTask, archived: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const StateIcon =
    task.state === 'done'
      ? CheckCircle2
      : task.state === 'paused'
        ? Pause
        : CircleDashed;
  const milestonesId = `${task.id}-milestones`;
  const currentMilestone =
    [...task.milestones]
      .reverse()
      .find((milestone) => milestone.position <= task.progress) ??
    task.milestones[0];
  const checkpointLabel =
    task.progress === 0
      ? 'Next checkpoint'
      : task.progress === 100
        ? 'Final checkpoint'
        : 'Current checkpoint';

  return (
    <article
      className={`progress-card is-${task.state} priority-${task.priority.toLowerCase()}${isOpen ? ' is-open' : ''}`}
    >
      <div className="progress-card-overview">
        <button
          type="button"
          className="progress-card-toggle"
          aria-expanded={isOpen}
          aria-controls={milestonesId}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="sr-only">
            {isOpen ? 'Hide' : 'Show'} progress details for {task.title}
          </span>
          <ChevronDown aria-hidden="true" />
        </button>

        <header className="progress-card-header">
          <div className="progress-card-meta-rail">
            <span
              className={`progress-priority is-${task.priority.toLowerCase()}`}
            >
              {task.priority}
            </span>
            <span className={`progress-status is-${task.state}`}>
              <StateIcon aria-hidden="true" />
              {stateLabels[task.state]}
            </span>
            <span
              className="progress-owner"
              aria-label={`Owner: ${task.owner}`}
            >
              {task.owner}
            </span>
          </div>
          <div className="progress-card-title">
            <h2>{task.title}</h2>
            <p>{task.summary}</p>
          </div>
        </header>

        {task.state === 'paused' && (
          <aside className="progress-pause-reason">
            <Pause aria-hidden="true" />
            <div>
              <strong>Pause reason</strong>
              <p>{task.pauseReason}</p>
            </div>
          </aside>
        )}

        <div className="progress-track-block">
          <div className="progress-track-meta">
            <span>Milestone progress</span>
            <strong>{task.progress}%</strong>
          </div>
          <span className="sr-only">
            {task.title}: {task.progress}% complete.
          </span>
          <div className="progress-slider-wrap">
            <Slider
              className="progress-slider"
              value={[task.progress]}
              min={0}
              max={100}
              disabled
              aria-hidden="true"
            />
            <div className="progress-milestone-marks">
              {task.milestones.map((milestone) => (
                <MilestoneMark key={milestone.id} milestone={milestone} />
              ))}
            </div>
          </div>
          <p className="progress-current">
            <Flag aria-hidden="true" />
            <span>
              {checkpointLabel}: <strong>{currentMilestone.label}</strong>
            </span>
          </p>
          <div className="progress-last-update">
            <Clock3 aria-hidden="true" />
            <div>
              <span>
                Last update ·{' '}
                <time dateTime={task.lastUpdate.date}>
                  {formatUpdateDate(task.lastUpdate.date)}
                </time>
              </span>
              <p>{task.lastUpdate.note}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        id={milestonesId}
        className="progress-milestone-panel"
        hidden={!isOpen}
      >
        {task.state === 'done' && (
          <section
            className="progress-content-handoff"
            aria-label="Content authoring handoff"
          >
            <div className="progress-handoff-heading">
              <FileText aria-hidden="true" />
              <div>
                <span>Content authoring handoff</span>
                <strong>{task.contentHandoff.label}</strong>
              </div>
            </div>
            <dl>
              <div>
                <dt>Repository path</dt>
                <dd>
                  <code>{task.contentHandoff.repoPath}</code>
                </dd>
              </div>
              <div>
                <dt>Entrypoint</dt>
                <dd>
                  <code>{task.contentHandoff.entrypoint}</code>
                </dd>
              </div>
            </dl>
            <p>{task.contentHandoff.note}</p>
          </section>
        )}
        <ol>
          {task.milestones.map((milestone) => (
            <li className={`is-${milestone.state}`} key={milestone.id}>
              <span className="progress-milestone-icon" aria-hidden="true">
                {milestone.state === 'done' ? <Check /> : milestone.position}
              </span>
              <div>
                <div className="progress-milestone-heading">
                  <strong>{milestone.label}</strong>
                  <span>{milestoneLabels[milestone.state]}</span>
                </div>
                <p>{milestone.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="progress-card-actions">
          <button
            type="button"
            aria-label={`${isArchived ? 'Restore' : 'Archive'} ${task.title}`}
            onClick={() => onArchiveChange(task, !isArchived)}
          >
            <Archive aria-hidden="true" />
            {isArchived ? 'Restore' : 'Archive'}
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProgressTracker() {
  const [board, setBoard] = useState(progressBoard);
  const [remoteLoadFailed, setRemoteLoadFailed] = useState(false);
  const { activeFilter, archivedTaskIds } = useSyncExternalStore(
    subscribeToArchivePreferences,
    getArchivePreferenceSnapshot,
    getServerArchivePreferenceSnapshot,
  );
  const [archiveMessage, setArchiveMessage] = useState('');
  const activeFilterButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const isLocalPreview =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
    const forceRemoteData = new URLSearchParams(window.location.search).has(
      'live-progress',
    );
    if (isLocalPreview && !forceRemoteData) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(
      () => controller.abort(),
      progressDataTimeoutMs,
    );
    let disposed = false;

    async function loadProgressBoard() {
      try {
        const response = await fetch(progressDataEndpoint, {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Progress data request failed: ${response.status}`);
        }

        const payload = await response.text();
        if (payload.length > progressDataMaxCharacters) {
          throw new Error('Progress data response is too large.');
        }

        const nextBoard = parseProgressBoard(JSON.parse(payload));
        if (!disposed) {
          setBoard(nextBoard);
          setRemoteLoadFailed(false);
        }
      } catch {
        if (!disposed) setRemoteLoadFailed(true);
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void loadProgressBoard();

    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const archivedTaskIdSet = new Set(archivedTaskIds);
  const activeTasks = board.tasks.filter(
    (task) => !archivedTaskIdSet.has(task.id),
  );
  const archivedTasks = board.tasks.filter((task) =>
    archivedTaskIdSet.has(task.id),
  );
  const ongoingCount = activeTasks.filter(
    (task) => task.state === 'ongoing',
  ).length;
  const pausedCount = activeTasks.filter(
    (task) => task.state === 'paused',
  ).length;
  const doneCount = activeTasks.filter((task) => task.state === 'done').length;
  const filterCounts: Record<ProgressFilter, number> = {
    all: activeTasks.length,
    ongoing: ongoingCount,
    paused: pausedCount,
    done: doneCount,
    archived: archivedTasks.length,
  };
  const visibleTasks =
    activeFilter === 'archived'
      ? archivedTasks
      : activeFilter === 'all'
        ? activeTasks
        : activeTasks.filter((task) => task.state === activeFilter);

  function handleArchiveChange(task: ProgressTask, archived: boolean) {
    updateArchivePreferences((currentPreferences) => ({
      ...currentPreferences,
      archivedTaskIds: archived
        ? [...new Set([...currentPreferences.archivedTaskIds, task.id])]
        : currentPreferences.archivedTaskIds.filter(
            (taskId) => taskId !== task.id,
          ),
    }));
    setArchiveMessage(`${archived ? 'Archived' : 'Restored'} ${task.title}.`);
    window.requestAnimationFrame(() => activeFilterButtonRef.current?.focus());
  }

  return (
    <section className="workbench content-view progress-view">
      <h1 className="sr-only">Progress</h1>

      {remoteLoadFailed && (
        <output className="progress-source-warning">
          Live data is unavailable. Showing the deployed snapshot.
        </output>
      )}

      <div className="progress-filter-bar">
        <fieldset className="progress-filter-options">
          <legend className="sr-only">Filter work cards by state</legend>
          {(Object.keys(filterLabels) as ProgressFilter[]).map((filter) => (
            <button
              type="button"
              className="progress-filter-option"
              key={filter}
              ref={activeFilter === filter ? activeFilterButtonRef : null}
              aria-pressed={activeFilter === filter}
              onClick={() => {
                setArchiveMessage('');
                updateArchivePreferences((currentPreferences) => ({
                  ...currentPreferences,
                  activeFilter: filter,
                }));
              }}
            >
              <span>{filterLabels[filter]}</span>
              <strong>{filterCounts[filter]}</strong>
            </button>
          ))}
        </fieldset>
        <span className="sr-only" aria-live="polite">
          {archiveMessage} Showing {visibleTasks.length} work{' '}
          {visibleTasks.length === 1 ? 'card' : 'cards'}.
        </span>
      </div>

      <div className="progress-card-list">
        {visibleTasks.length > 0 ? (
          visibleTasks.map((task) => (
            <ProgressCard
              key={task.id}
              task={task}
              isArchived={archivedTaskIdSet.has(task.id)}
              onArchiveChange={handleArchiveChange}
            />
          ))
        ) : (
          <p className="progress-filter-empty">
            {activeFilter === 'archived'
              ? 'No archived work cards.'
              : 'No work cards match this filter.'}
          </p>
        )}
      </div>
    </section>
  );
}
