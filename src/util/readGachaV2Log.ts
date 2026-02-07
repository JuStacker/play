import { GachaLog } from "../log/dto/GachaLog";
import * as fs from 'fs';

export function readGachaV2Log(filePath: string): GachaV2Log[] {
    const result: GachaV2Log[] = [];
    const logString: string = fs.readFileSync(filePath, 'utf-8');
    
    logString.replaceAll('\r', '').split('\n').forEach((log) => {
      if(log.length == 0) {
        return;
      }
      
      const jsonString = `{${log.substring(0, log.lastIndexOf(','))}}`;
      const [[dateString, gachaLog]] = Object.entries(JSON.parse(jsonString)) as any;
      result.push({
        date: new Date(dateString),
        gachaLog: gachaLog
      });
    });
    return result;
  } 

  export interface GachaV2Log {
    date: Date,
    gachaLog: GachaLog 
  }