import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

export const getBase64FromUri = async (uri: string): Promise<string> => {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return base64;
};

/**
 * Converts an Expo Asset to a base64 string.
 * Fixes issues on Android where asset URIs are not file URIs.
 */
export async function getBase64FromAsset(asset: Asset): Promise<string> {
  let uri = asset.localUri || asset.uri;

  if (!uri.startsWith('file://')) {
    // Download asset to a local file to fix Android issues where asset URIs are not file URIs
    const target = FileSystem.cacheDirectory + asset.name;
    await FileSystem.copyAsync({ from: uri, to: target });
    uri = target;
  }

  const base64 = await getBase64FromUri(uri);
  return base64;
}

export function generateReportName(projectName: string, type: string, range?: string) {
  return `${projectName.replace(/[^a-z0-9]/gi, '_')}_Date_${range?.replace(/[^a-z0-9]/gi, '_') || ''}.${type}`;
}
