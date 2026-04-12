export function detectMimeTypeFromBytes(bytes: Uint8Array): string | null {
  if (bytes.length >= 8
    && bytes[0] === 0x89
    && bytes[1] === 0x50
    && bytes[2] === 0x4e
    && bytes[3] === 0x47
    && bytes[4] === 0x0d
    && bytes[5] === 0x0a
    && bytes[6] === 0x1a
    && bytes[7] === 0x0a) {
    return 'image/png'
  }

  if (bytes.length >= 3
    && bytes[0] === 0xff
    && bytes[1] === 0xd8
    && bytes[2] === 0xff) {
    return 'image/jpeg'
  }

  if (bytes.length >= 6
    && bytes[0] === 0x47
    && bytes[1] === 0x49
    && bytes[2] === 0x46
    && bytes[3] === 0x38
    && (bytes[4] === 0x37 || bytes[4] === 0x39)
    && bytes[5] === 0x61) {
    return 'image/gif'
  }

  if (bytes.length >= 12
    && bytes[0] === 0x52
    && bytes[1] === 0x49
    && bytes[2] === 0x46
    && bytes[3] === 0x46
    && bytes[8] === 0x57
    && bytes[9] === 0x45
    && bytes[10] === 0x42
    && bytes[11] === 0x50) {
    return 'image/webp'
  }

  if (bytes.length >= 2
    && bytes[0] === 0x42
    && bytes[1] === 0x4d) {
    return 'image/bmp'
  }

  if (bytes.length >= 5
    && bytes[0] === 0x25
    && bytes[1] === 0x50
    && bytes[2] === 0x44
    && bytes[3] === 0x46
    && bytes[4] === 0x2d) {
    return 'application/pdf'
  }

  if (bytes.length >= 12
    && bytes[4] === 0x66
    && bytes[5] === 0x74
    && bytes[6] === 0x79
    && bytes[7] === 0x70) {
    return 'video/mp4'
  }

  if (bytes.length >= 4
    && bytes[0] === 0x4f
    && bytes[1] === 0x67
    && bytes[2] === 0x67
    && bytes[3] === 0x53) {
    return 'audio/ogg'
  }

  if (bytes.length >= 12
    && bytes[0] === 0x52
    && bytes[1] === 0x49
    && bytes[2] === 0x46
    && bytes[3] === 0x46
    && bytes[8] === 0x57
    && bytes[9] === 0x41
    && bytes[10] === 0x56
    && bytes[11] === 0x45) {
    return 'audio/wav'
  }

  if (bytes.length >= 3
    && bytes[0] === 0x49
    && bytes[1] === 0x44
    && bytes[2] === 0x33) {
    return 'audio/mpeg'
  }

  if (bytes.length >= 2
    && bytes[0] === 0xff
    && ((bytes[1] ?? 0) & 0xe0) === 0xe0) {
    return 'audio/mpeg'
  }

  return null
}
