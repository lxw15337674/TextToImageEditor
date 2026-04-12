import { AwsClient } from 'aws4fetch'
import { buildR2PartObjectKey } from './r2-upload'

const DEFAULT_PRESIGNED_URL_TTL_SECONDS = 900
const MIN_PRESIGNED_URL_TTL_SECONDS = 60
const MAX_PRESIGNED_URL_TTL_SECONDS = 3600

export interface R2PresignBindings {
  R2_DIRECT_UPLOAD_ENABLED?: string
  R2_S3_ACCOUNT_ID?: string
  R2_S3_ACCESS_KEY_ID?: string
  R2_S3_SECRET_ACCESS_KEY?: string
  R2_S3_BUCKET_NAME?: string
  R2_PRESIGNED_URL_TTL_SECONDS?: string
}

function isEnabledFlag(rawValue: string | undefined): boolean {
  if (!rawValue) {
    return false
  }

  const normalizedValue = rawValue.trim().toLowerCase()
  return normalizedValue === 'true'
    || normalizedValue === '1'
    || normalizedValue === 'yes'
    || normalizedValue === 'on'
}

function parseTtlSeconds(rawValue: string | undefined): number {
  if (!rawValue) {
    return DEFAULT_PRESIGNED_URL_TTL_SECONDS
  }

  const parsedValue = Number(rawValue)
  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return DEFAULT_PRESIGNED_URL_TTL_SECONDS
  }

  const rounded = Math.floor(parsedValue)
  if (rounded < MIN_PRESIGNED_URL_TTL_SECONDS) {
    return MIN_PRESIGNED_URL_TTL_SECONDS
  }
  if (rounded > MAX_PRESIGNED_URL_TTL_SECONDS) {
    return MAX_PRESIGNED_URL_TTL_SECONDS
  }
  return rounded
}

export function isDirectR2UploadEnabled(env: R2PresignBindings): boolean {
  return isEnabledFlag(env.R2_DIRECT_UPLOAD_ENABLED)
    && typeof env.R2_S3_ACCOUNT_ID === 'string'
    && env.R2_S3_ACCOUNT_ID.length > 0
    && typeof env.R2_S3_ACCESS_KEY_ID === 'string'
    && env.R2_S3_ACCESS_KEY_ID.length > 0
    && typeof env.R2_S3_SECRET_ACCESS_KEY === 'string'
    && env.R2_S3_SECRET_ACCESS_KEY.length > 0
    && typeof env.R2_S3_BUCKET_NAME === 'string'
    && env.R2_S3_BUCKET_NAME.length > 0
}

export async function createPresignedR2PartUploadUrl(
  env: R2PresignBindings,
  payload: {
    objectId: string
    partIndex: number
    contentType: string
  }
): Promise<{
  url: string
  expiresAt: string
}> {
  if (!isDirectR2UploadEnabled(env)) {
    throw new Error('Direct R2 upload is not enabled')
  }

  const expiresIn = parseTtlSeconds(env.R2_PRESIGNED_URL_TTL_SECONDS)
  const expiresAt = new Date(Date.now() + (expiresIn * 1000)).toISOString()
  const client = new AwsClient({
    accessKeyId: env.R2_S3_ACCESS_KEY_ID!,
    secretAccessKey: env.R2_S3_SECRET_ACCESS_KEY!,
    service: 's3',
    region: 'auto'
  })

  const objectKey = buildR2PartObjectKey(payload.objectId, payload.partIndex)
  const requestUrl = new URL(
    `https://${env.R2_S3_ACCOUNT_ID!}.r2.cloudflarestorage.com/${env.R2_S3_BUCKET_NAME!}/${objectKey}`
  )
  requestUrl.searchParams.set('X-Amz-Expires', String(expiresIn))
  const signedRequest = await client.sign(
    new Request(requestUrl.toString(), {
      method: 'PUT',
      headers: {
        'content-type': payload.contentType
      }
    }),
    {
      aws: {
        signQuery: true
      }
    }
  )

  return {
    url: signedRequest.url,
    expiresAt
  }
}
