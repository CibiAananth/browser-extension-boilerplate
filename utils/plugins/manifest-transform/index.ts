import type { Plugin } from "vite";
import { ensureDir, outputFile } from "fs-extra";
import { resolve } from "path";

import { ManifestParser } from "./parser";

interface PluginOptions {
  isDev: boolean;
  distDir: string;
  publicDir: string;
  manifestV3File: ManifestV3;
}

export const manifestFileName = "manifest.json";
export const manifestV3FileName = "manifest.v3.json";
export const manifestV2FileName = "manifest.v2.json";

export function transformManifest(options: PluginOptions): Plugin {
  function convertManifestToString(manifest: ManifestV3 | ManifestV2): string {
    return JSON.stringify(manifest, null, 2);
  }

  const { isDev, distDir, manifestV3File, publicDir } = options;

  function createManifestPath(dir: string, fileName: string) {
    return resolve(dir, fileName);
  }

  async function writeManifest(
    filePath: string,
    manifest: ManifestV3 | ManifestV2
  ) {
    await outputFile(filePath, convertManifestToString(manifest), "utf-8");
  }

  return {
    name: "manifest-transform-plugin",
    apply: "build",
    async buildStart() {
      if (isDev) {
        await ensureDir(distDir);
        await writeManifest(
          createManifestPath(distDir, manifestV3FileName),
          manifestV3File
        );
        await writeManifest(
          createManifestPath(distDir, manifestV2FileName),
          ManifestParser.transformToManifestV2(manifestV3File)
        );
      }
    },
    async buildEnd() {
      if (isDev) {
        return;
      }
      await ensureDir(publicDir);
      await writeManifest(
        createManifestPath(publicDir, manifestV3FileName),
        manifestV3File
      );
      await writeManifest(
        createManifestPath(publicDir, manifestV2FileName),
        ManifestParser.transformToManifestV2(manifestV3File)
      );
    },
  };
}
