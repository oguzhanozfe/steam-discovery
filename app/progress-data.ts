import progressData from './data/progress-tracker.json';

export type ProgressOwner = 'Emir' | 'Oğuzhan';
export type ProgressPriority = 'P0' | 'P1' | 'P2';
export type ProgressState = 'ongoing' | 'paused' | 'done';
export type MilestoneState = 'done' | 'current' | 'next';

export type ProgressMilestone = {
  id: string;
  label: string;
  position: number;
  state: MilestoneState;
  description: string;
};

export type ProgressLastUpdate = {
  date: string;
  note: string;
};

export type ContentHandoff = {
  label: string;
  repoPath: string;
  entrypoint: string;
  note: string;
};

type ProgressTaskBase = {
  id: string;
  title: string;
  owner: ProgressOwner;
  priority: ProgressPriority;
  progress: number;
  summary: string;
  lastUpdate: ProgressLastUpdate;
  milestones: ProgressMilestone[];
};

export type ProgressTask =
  | (ProgressTaskBase & {
      state: 'ongoing';
      pauseReason?: never;
      contentHandoff?: never;
    })
  | (ProgressTaskBase & {
      state: 'paused';
      pauseReason: string;
      contentHandoff?: never;
    })
  | (ProgressTaskBase & {
      state: 'done';
      progress: 100;
      pauseReason?: never;
      contentHandoff: ContentHandoff;
    });

export type ProgressBoard = {
  updatedAt: string;
  updatedLabel: string;
  tasks: ProgressTask[];
};

const owners = new Set<ProgressOwner>(['Emir', 'Oğuzhan']);
const priorities = new Set<ProgressPriority>(['P0', 'P1', 'P2']);
const states = new Set<ProgressState>(['ongoing', 'paused', 'done']);
const milestoneStates = new Set<MilestoneState>(['done', 'current', 'next']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function assertProgressBoard(value: unknown): asserts value is ProgressBoard {
  if (
    !isRecord(value) ||
    !isNonEmptyString(value.updatedAt) ||
    !isNonEmptyString(value.updatedLabel) ||
    !Array.isArray(value.tasks)
  ) {
    throw new Error('Progress board metadata is invalid.');
  }

  for (const [index, task] of value.tasks.entries()) {
    const taskName = `Progress task ${index + 1}`;

    if (
      !isRecord(task) ||
      !isNonEmptyString(task.id) ||
      !isNonEmptyString(task.title) ||
      !isNonEmptyString(task.summary) ||
      !owners.has(task.owner as ProgressOwner) ||
      !priorities.has(task.priority as ProgressPriority) ||
      !states.has(task.state as ProgressState) ||
      typeof task.progress !== 'number' ||
      task.progress < 0 ||
      task.progress > 100 ||
      !Array.isArray(task.milestones) ||
      task.milestones.length === 0
    ) {
      throw new Error(`${taskName} has invalid core fields.`);
    }

    if (
      !isRecord(task.lastUpdate) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(String(task.lastUpdate.date)) ||
      !isNonEmptyString(task.lastUpdate.note)
    ) {
      throw new Error(`${taskName} needs a dated last-update note.`);
    }

    const isDone = task.state === 'done';
    if (isDone !== (task.progress === 100)) {
      throw new Error(
        `${taskName} must be Done if and only if progress is 100.`,
      );
    }

    if (task.state === 'paused') {
      if (!isNonEmptyString(task.pauseReason)) {
        throw new Error(`${taskName} needs a pause reason.`);
      }
    } else if (task.pauseReason !== undefined) {
      throw new Error(`${taskName} can only have a pause reason when Paused.`);
    }

    if (isDone) {
      if (
        !isRecord(task.contentHandoff) ||
        !isNonEmptyString(task.contentHandoff.label) ||
        !isNonEmptyString(task.contentHandoff.repoPath) ||
        !isNonEmptyString(task.contentHandoff.entrypoint) ||
        !isNonEmptyString(task.contentHandoff.note)
      ) {
        throw new Error(`${taskName} needs a complete content handoff.`);
      }
    } else if (task.contentHandoff !== undefined) {
      throw new Error(`${taskName} can only have a handoff when Done.`);
    }

    let previousPosition = 0;
    for (const milestone of task.milestones) {
      if (
        !isRecord(milestone) ||
        !isNonEmptyString(milestone.id) ||
        !isNonEmptyString(milestone.label) ||
        !isNonEmptyString(milestone.description) ||
        !milestoneStates.has(milestone.state as MilestoneState) ||
        typeof milestone.position !== 'number' ||
        milestone.position <= previousPosition ||
        milestone.position > 100
      ) {
        throw new Error(`${taskName} has invalid or unsorted milestones.`);
      }
      previousPosition = milestone.position;
    }
  }
}

const rawProgressData: unknown = progressData;
assertProgressBoard(rawProgressData);

export const progressBoard = rawProgressData;
