import {cp, mkdir, readdir} from 'node:fs/promises';

// Keep only generated images across clean builds; HTML is always rebuilt.
export async function copyImageCache(source, destination) {
  try {
    await readdir(source);
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }
  await mkdir(destination, {recursive: true});
  await cp(source, destination, {recursive: true, preserveTimestamps: true});
}

export const restoreImageCache = () => copyImageCache('.cache/image-output', 'dist/img');
export const saveImageCache = () => copyImageCache('dist/img', '.cache/image-output');
