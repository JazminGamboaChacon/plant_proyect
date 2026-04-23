import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface AppPermissions {
  camera: PermissionStatus;
  mediaLibrary: PermissionStatus;
}

const normalizeStatus = (granted: boolean, status: string): PermissionStatus => {
  if (granted) return 'granted';
  if (status === 'undetermined') return 'undetermined';
  return 'denied';
};

const PermissionService = {

  async requestCameraPermission(): Promise<PermissionStatus> {
    const { granted, status } = await Camera.requestCameraPermissionsAsync();
    return normalizeStatus(granted, status);
  },


  async requestMediaLibraryPermission(): Promise<PermissionStatus> {
    const { granted, status } = await MediaLibrary.requestPermissionsAsync();
    return normalizeStatus(granted, status);
  },


  async checkAllPermissions(): Promise<AppPermissions> {
    const camera = await Camera.getCameraPermissionsAsync();
    let mediaLibraryStatus: PermissionStatus = 'denied';
    try {
      const mediaLibrary = await MediaLibrary.getPermissionsAsync();
      mediaLibraryStatus = normalizeStatus(mediaLibrary.granted, mediaLibrary.status);
    } catch {
      // Expo Go no soporta media library completa
    }
    return {
      camera: normalizeStatus(camera.granted, camera.status),
      mediaLibrary: mediaLibraryStatus,
    };
  },


  async requestAllPermissions(): Promise<AppPermissions> {
    const camera = await PermissionService.requestCameraPermission();
    let mediaLibrary: PermissionStatus = 'denied';
    try {
      mediaLibrary = await PermissionService.requestMediaLibraryPermission();
    } catch {
      // Expo Go no soporta media library completa — no bloquear la cámara
    }
    return { camera, mediaLibrary };
  },

  isGranted: (status: PermissionStatus): boolean => status === 'granted',
};

export default PermissionService;
