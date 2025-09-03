import sharp from 'sharp'
import type { Sharp } from 'sharp'

export async function resizeToMinEdge(path: string, size: number): Promise<Sharp> {
  const image = sharp(path)
  const metadata = await image.metadata()

  if (!metadata.width || !metadata.height) {
    throw new Error('Invalid image metadata')
  }

  const resizeOptions: { width?: number; height?: number } = {}
  if (metadata.width < metadata.height) {
    resizeOptions.width = size
  } else {
    resizeOptions.height = size
  }

  return image.resize(resizeOptions)
}
