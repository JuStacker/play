import { GachaLog } from "../log/dto/GachaLog";
import * as fs from 'fs';

export function readGachaV2Log(filePath: string): {  [date: string]: GachaLog } {
    const result: {  [date: string]: GachaLog } = {};
    const logString: string = fs.readFileSync(filePath, 'utf-8');
    
    logString.replaceAll('\r', '').split('\n').forEach((log) => {
      if(log.length == 0) {
        return;
      }
      
      const jsonString = `{${log.substring(log.lastIndexOf(','))}}`;
      const [[dateString, gachaLog]] = Object.entries(JSON.parse(jsonString)) as any;
      result[dateString] = gachaLog;
    });
    return result;
  }