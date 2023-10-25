import { writeFileSync } from "fs";
import { resolve } from "path";
import { Plugin } from "vite";

import { ensureDirectoryExists } from "../../helpers/fs";
import { ManifestParser } from "./parser";

interface PluginOptions {
  isDev: boolean;
  distDir: string;
  publicDir: string;
  manifestV3File: ManifestV3;
}

export function convertManifestToString(
  manifest: ManifestV3 | ManifestV2
): string {
  return JSON.stringify(manifest, null, 2);
}

export const manifestFileName = "manifest.json";
export const manifestV3FileName = "manifest.v3.json";
export const manifestV2FileName = "manifest.v2.json";

export function manifestTransform(options: PluginOptions): Plugin {
  const { isDev, distDir, manifestV3File, publicDir } = options;

  function createManifestPath(dir: string, fileName: string) {
    return resolve(dir, fileName);
  }

  function writeManifest(filePath: string, manifest: ManifestV3 | ManifestV2) {
    writeFileSync(filePath, convertManifestToString(manifest), "utf-8");
  }

  return {
    name: "manifest-transform-plugin",
    apply: "build",
    buildStart() {
      if (isDev) {
        ensureDirectoryExists(distDir);
        writeManifest(
          createManifestPath(distDir, manifestV3FileName),
          manifestV3File
        );
        writeManifest(
          createManifestPath(distDir, manifestV2FileName),
          ManifestParser.transformToManifestV2(manifestV3File)
        );
      }
    },
    buildEnd() {
      if (isDev) {
        return;
      }
      ensureDirectoryExists(publicDir);
      writeManifest(
        createManifestPath(publicDir, manifestV3FileName),
        manifestV3File
      );
      writeManifest(
        createManifestPath(publicDir, manifestV2FileName),
        ManifestParser.transformToManifestV2(manifestV3File)
      );
    },
  };
}

export default manifestTransform;
