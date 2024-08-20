import * as fs from "fs";
import { s3Client } from "../lib/s3";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  PutObjectCommandOutput,
  DeleteObjectCommandOutput,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

/**
 * Upload a file directly using File path (from disk only)
 *
 * @async
 * @param {string} filepath
 * @param {string} filename
 * @param {string} key
 * @param {string} bucket
 * @param {ObjectCannedACL} [acl="public-read"]
 * @returns {Promise<PutObjectCommandOutput>}
 */
const putFile = async (
  filepath: string,
  filename: string,
  key: string,
  bucket: string,
  acl: ObjectCannedACL = "public-read"
): Promise<PutObjectCommandOutput> => {
  if (!fs.existsSync(filepath)) throw "File not found";

  const fileStream = fs.createReadStream(filepath);

  fileStream.on("error", function (err) {
    throw err;
  });

  const putCmd = new PutObjectCommand({
    Bucket: bucket,
    ACL: acl,
    Body: fileStream,
    Key: key,
    ContentDisposition: `attachment; filename=${filename}`,
  });

  const response = await s3Client.send(putCmd);
  return response;
};

/**
 * Upload a file's buffer, instead of file path
 *
 * @async
 * @param {Buffer} buffer
 * @param {string} filename
 * @param {string} key
 * @param {string} bucket
 * @param {ObjectCannedACL} [acl="public-read"]
 * @returns {Promise<PutObjectCommandOutput>}
 */
const putBuffer = async (
  buffer: Buffer,
  filename: string,
  key: string,
  bucket: string,
  acl: ObjectCannedACL = "public-read"
): Promise<PutObjectCommandOutput> => {
  const putCmd = new PutObjectCommand({
    Bucket: bucket,
    ACL: acl,
    Body: Readable.from(buffer),
    Key: key,
    ContentDisposition: `attachment; filename=${filename}`,
    ContentLength: buffer.length,
  });
  const response = await s3Client.send(putCmd);
  return response;
};

/**
 * Delete a file, using key
 *
 * @async
 * @param {string} key
 * @param {string} bucket
 * @returns {Promise<DeleteObjectCommandOutput>}
 */
const deleteFile = async (key: string, bucket: string): Promise<DeleteObjectCommandOutput> => {
  const deleteCmd = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const response = await s3Client.send(deleteCmd);
  return response;
};

export { putFile, putBuffer, deleteFile };
