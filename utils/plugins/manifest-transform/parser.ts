export class ManifestParser {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static transformToManifestV2(manifestV3: ManifestV3): ManifestV2 {
    const manifestV2 = {
      ...manifestV3,
      manifest_version: 2,
    } as unknown as ManifestV2;

    if (manifestV3.background?.service_worker) {
      manifestV2.background = {
        scripts: [manifestV3.background.service_worker],
      };
    }
    if (manifestV3.action) {
      manifestV2.browser_action = { ...manifestV3.action };
      delete manifestV2.action;
    }
    return manifestV2;
  }
}
