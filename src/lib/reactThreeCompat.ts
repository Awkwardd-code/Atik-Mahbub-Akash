import * as ReactModule from 'react';

type ReactInternals = typeof ReactModule & {
  default?: typeof ReactModule;
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?: unknown;
  __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?: unknown;
  __SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?: unknown;
  ReactCurrentOwner?: { current: null };
  ReactCurrentBatchConfig?: { transition: null };
  ReactCurrentActQueue?: { current: null };
};

declare global {

  var __R3F_REACT_INTERNALS_PATCHED__: boolean | undefined;
}

const SECRET_KEY = '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED';
type LegacyActQueue = {
  current: Array<unknown> | null;
  isBatchingLegacy: boolean | null;
  didScheduleLegacyUpdate: boolean;
};

const createActQueue = (): LegacyActQueue => ({
  current: null,
  isBatchingLegacy: null,
  didScheduleLegacyUpdate: false,
});

const ensureActQueueShape = (queue?: LegacyActQueue): LegacyActQueue => {
  if (!queue || typeof queue !== 'object') {
    return createActQueue();
  }

  if (typeof queue.current === 'undefined') {
    queue.current = null;
  }
  if (typeof queue.isBatchingLegacy === 'undefined') {
    queue.isBatchingLegacy = null;
  }
  if (typeof queue.didScheduleLegacyUpdate === 'undefined') {
    queue.didScheduleLegacyUpdate = false;
  }

  return queue;
};

const resolveReactTarget = (): ReactInternals => {
  const namespaceReact = ReactModule as ReactInternals;
  if (namespaceReact.default && typeof namespaceReact.default === 'object') {
    return namespaceReact.default as ReactInternals;
  }
  return namespaceReact;
};

const reactTarget = resolveReactTarget();

const secretInternals =
  (reactTarget.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ??
    reactTarget.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ??
    reactTarget.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED ??
    null) ?? undefined;

const ensureLegacyBatchConfig = (internals: Record<string, unknown> | undefined) => {
  if (!internals) return;

  const shared = internals as {
    ReactCurrentBatchConfig?: { transition?: unknown };
    ReactCurrentActQueue?: LegacyActQueue;
    ReactCurrentOwner?: { current: null };
    T?: LegacyActQueue;
  };

  // Ensure ReactCurrentOwner exists (critical for React 19)
  if (!shared.ReactCurrentOwner) {
    const ownerBridge = { current: null };
    try {
      Object.defineProperty(internals, 'ReactCurrentOwner', {
        configurable: true,
        enumerable: false,
        writable: true,
        value: ownerBridge,
      });
    } catch {
      shared.ReactCurrentOwner = ownerBridge;
    }
  }

  if (!shared.ReactCurrentBatchConfig) {
    const bridge = { transition: null as unknown };
    try {
      Object.defineProperty(internals, 'ReactCurrentBatchConfig', {
        configurable: true,
        enumerable: false,
        writable: true,
        value: bridge,
      });
    } catch {
      shared.ReactCurrentBatchConfig = bridge;
    }
  } else if (!('transition' in shared.ReactCurrentBatchConfig)) {
    shared.ReactCurrentBatchConfig.transition = null;
  }

  shared.T = ensureActQueueShape(shared.T);
  shared.ReactCurrentActQueue = ensureActQueueShape(shared.ReactCurrentActQueue ?? shared.T);
  if (shared.T !== shared.ReactCurrentActQueue) {
    shared.T = shared.ReactCurrentActQueue;
  }
};

ensureLegacyBatchConfig(secretInternals as Record<string, unknown> | undefined);

const tryAssignSecret = (candidate: Record<string, unknown> | undefined) => {
  if (!candidate || typeof candidate !== 'object' || !secretInternals) {
    return false;
  }

  if (SECRET_KEY in candidate) {
    return true;
  }

  if (!Object.isExtensible(candidate)) {
    return false;
  }

  Object.defineProperty(candidate, SECRET_KEY, {
    value: secretInternals,
    enumerable: false,
    configurable: true,
  });
  return true;
};

const globalScope = globalThis as typeof globalThis & {
  __R3F_REACT_INTERNALS_PATCHED__?: boolean;
  React?: Record<string, unknown>;
};

if (typeof globalThis !== 'undefined' && !globalScope.__R3F_REACT_INTERNALS_PATCHED__) {
  globalScope.__R3F_REACT_INTERNALS_PATCHED__ = true;

  const patchedMainReact = tryAssignSecret(reactTarget);

  const existingGlobalReact = globalScope.React;

  if (existingGlobalReact) {
    if (!tryAssignSecret(existingGlobalReact) && secretInternals) {
      const clone = { ...reactTarget, [SECRET_KEY]: secretInternals };
      globalScope.React = clone;
    }
  } else if (secretInternals) {
    if (patchedMainReact) {
      globalScope.React = reactTarget;
    } else {
      const clone = { ...reactTarget, [SECRET_KEY]: secretInternals };
      globalScope.React = clone;
    }
  }

  // Additional React 19 compatibility fix
  if (typeof window !== 'undefined') {
    const windowWithReact = window as typeof window & { React?: unknown };
    windowWithReact.React = globalScope.React || reactTarget;
  }
}

export {};
