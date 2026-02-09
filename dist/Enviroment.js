"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eniviroment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const env = process.env.NODE_ENV ?? "cloud";
dotenv_1.default.config({
    path: `.env.${env}`,
});
class Eniviroment {
    static init({ GACHA_LOG_V2_PATH, TIME_SLOT_PATH, ANALYZE_PATH, CLOD_GACHA_LOG_V2_PATH, LOCAL_GACHA_LOG_V2_PATH, }) {
        this.GACHA_LOG_V2_PATH = GACHA_LOG_V2_PATH;
        this.TIME_SLOT_PATH = TIME_SLOT_PATH;
        this.ANALYZE_PATH = ANALYZE_PATH;
        this.CLOD_GACHA_LOG_V2_PATH = CLOD_GACHA_LOG_V2_PATH;
        this.LOCAL_GACHA_LOG_V2_PATH = LOCAL_GACHA_LOG_V2_PATH;
    }
}
exports.Eniviroment = Eniviroment;
Eniviroment.init(process.env);
