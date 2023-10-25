import { existsSync, mkdirSync } from "fs";
import { resolve } from "path";

export function ensureDirectoryExists(directoryPath: string) {
  if (!existsSync(directoryPath)) {
    mkdirSync(directoryPath, { recursive: true });
  }

  return resolve(directoryPath);
}
