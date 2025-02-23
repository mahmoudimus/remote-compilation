import { platform } from 'os';

export const OperatingSystem = platform();

export const isWindows = OperatingSystem === 'win32';
export const isMacOS = OperatingSystem === 'darwin';
export const isLinux = OperatingSystem === 'linux';