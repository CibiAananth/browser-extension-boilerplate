import type { Plugin } from "vite";
import { copy, move, ensureDir, remove } from "fs-extra";
import { resolve } from "path";
import {
  manifestFileName,
  manifestV2FileName,
  manifestV3FileName,
} from "../manifest-transform";

export function duplicateBuild(distPath: string): Plugin {
  const tempPath = resolve(__dirname, "../../../tmp.local");

  return {
    name: "duplicate-build",
    async closeBundle() {
      const chromeDistPath = resolve(tempPath, "chrome");
      const firefoxDistPath = resolve(tempPath, "firefox");

      // cleanup temp directory
      await remove(tempPath);

      // Create the /dist/chrome and /dist/firefox directories if not exists
      await ensureDir(chromeDistPath);
      await ensureDir(firefoxDistPath);

      // Duplicate the common build folder /dist to /dist/chrome and /dist/firefox directories
      await copy(distPath, chromeDistPath);
      await copy(distPath, firefoxDistPath);

      // Remove manifest v2 from chrome directory
      await remove(resolve(chromeDistPath, manifestV2FileName));

      // Remove manifest v3 from firefox directory
      await remove(resolve(firefoxDistPath, manifestV3FileName));

      // Move the respective manifest files to their directories
      await move(
        resolve(chromeDistPath, manifestV3FileName),
        resolve(chromeDistPath, manifestFileName)
      );
      await move(
        resolve(firefoxDistPath, manifestV2FileName),
        resolve(firefoxDistPath, manifestFileName)
      );

      // Empty the /dist directory
      await remove(distPath);

      // Move the /temp directory content to /dist
      await move(tempPath, distPath);
    },
  };
}
