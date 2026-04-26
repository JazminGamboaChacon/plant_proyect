import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface PermissionDetail {
  status: PermissionStatus;
  canAskAgain: boolean;
}

export interface AppPermissions {
  camera: PermissionDetail;
  mediaLibrary: PermissionDetail;
}

const normalizeDetail = (
  granted: boolean,
  status: string,
  canAskAgain: boolean
): PermissionDetail => ({
  status: granted ? 'granted' : status === 'undetermined' ? 'undetermined' : 'denied',
  canAskAgain,
});

const PermissionService = {

  async requestCameraPermission(): Promise<PermissionDetail> {
    const result = await Camera.requestCameraPermissionsAsync();
    return normalizeDetail(result.granted, result.status, result.canAskAgain);
  },

  async requestMediaLibraryPermission(): Promise<PermissionDetail> {
    const result = await MediaLibrary.requestPermissionsAsync();
    return normalizeDetail(result.granted, result.status, result.canAskAgain);
  },

  async checkAllPermissions(): Promise<AppPermissions> {
    const camera = await Camera.getCameraPermissionsAsync();
    let mediaLibraryDetail: PermissionDetail = { status: 'denied', canAskAgain: false };
    try {
      const mediaLibrary = await MediaLibrary.getPermissionsAsync();
      mediaLibraryDetail = normalizeDetail(
        mediaLibrary.granted,
        mediaLibrary.status,
        mediaLibrary.canAskAgain
      );
    } catch {
      // Expo Go no soporta media library completa
    }
    return {
      camera: normalizeDetail(camera.granted, camera.status, camera.canAskAgain),
      mediaLibrary: mediaLibraryDetail,
    };
  },

  async requestAllPermissions(): Promise<AppPermissions> {
    const camera = await PermissionService.requestCameraPermission();
    let mediaLibrary: PermissionDetail = { status: 'denied', canAskAgain: false };
    try {
      mediaLibrary = await PermissionService.requestMediaLibraryPermission();
    } catch {
      // Expo Go no soporta media library completa — no bloquear la cámara
    }
    return { camera, mediaLibrary };
  },

  isGranted: (detail: PermissionDetail): boolean => detail.status === 'granted',
  canAskAgain: (detail: PermissionDetail): boolean => detail.canAskAgain,
};

export default PermissionService;
