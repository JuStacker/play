import dotenv from "dotenv";

const env = process.env.NODE_ENV ?? "cloud";

dotenv.config({
  path: `.env.${env}`,
});

export class Eniviroment {
  static GACHA_LOG_V2_PATH: string;
  static TIME_SLOT_PATH: string;
  static ANALYZE_PATH: string;
  static CLOD_GACHA_LOG_V2_PATH: string;
  static LOCAL_GACHA_LOG_V2_PATH: string;

  static init({
    GACHA_LOG_V2_PATH,
    TIME_SLOT_PATH,
    ANALYZE_PATH,
    CLOD_GACHA_LOG_V2_PATH,
    LOCAL_GACHA_LOG_V2_PATH,
  }) {
    this.GACHA_LOG_V2_PATH = GACHA_LOG_V2_PATH;
    this.TIME_SLOT_PATH = TIME_SLOT_PATH;
    this.ANALYZE_PATH = ANALYZE_PATH;
    this.CLOD_GACHA_LOG_V2_PATH = CLOD_GACHA_LOG_V2_PATH;
    this.LOCAL_GACHA_LOG_V2_PATH = LOCAL_GACHA_LOG_V2_PATH;
  }
}

Eniviroment.init(process.env as any);
