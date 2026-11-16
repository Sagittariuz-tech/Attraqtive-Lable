export async function updateDemoStorage<T>(key: string, rehydrate: () => Promise<void> | void, work: () => T): Promise<T> {
  const run = async () => {
    await rehydrate();
    return work();
  };
  return navigator.locks ? navigator.locks.request(key, run) : run();
}
