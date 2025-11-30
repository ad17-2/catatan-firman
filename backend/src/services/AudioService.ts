import { unlink } from "fs/promises";

export async function cleanup(paths: string[]): Promise<void> {
  await Promise.all(paths.map((p) => unlink(p).catch(() => {})));
}
