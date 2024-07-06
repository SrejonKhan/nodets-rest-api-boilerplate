import { google } from "googleapis";
import config from "../config/base.config";

const oauth2Client = new google.auth.OAuth2(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET, "postmessage");

export { oauth2Client };
