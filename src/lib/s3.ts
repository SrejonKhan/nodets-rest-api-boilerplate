import { S3Client } from "@aws-sdk/client-s3";
import config from "../config/base.config";

const s3Client = new S3Client({
  forcePathStyle: false,
  endpoint: config.AWS_S3_ENDPOINT,
  region: config.AWS_S3_REGION,
  credentials: {
    accessKeyId: config.AWS_S3_ACCESS_KEY,
    secretAccessKey: config.AWS_S3_SECRET_ACCESS_KEY,
  },
});

export { s3Client };
