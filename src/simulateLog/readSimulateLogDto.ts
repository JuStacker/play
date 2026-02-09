import fs from 'fs';
import { Eniviroment } from '../Enviroment';
import { SimulateLogDto as SimulateLogDto } from './dto/SimulateLog';
import { SimulateResult } from '../dto/SimulateResult';

export function readSimulateLog(path: string = Eniviroment.GACHA_LOG_V2_PATH): SimulateLogDto[] {
    const results = [];
    const logString: string = fs.readFileSync(path, 'utf-8');
    
    logString.replaceAll('\r', '').split('\n').forEach((log) => {
      if(log.length == 0) {
        return;
      }
      
      const jsonString = `{${log.substring(0, log.lastIndexOf(','))}}`;
      const [[dateString, simulateResultJson]] = Object.entries(JSON.parse(jsonString)) as any;
      results.push(new SimulateLogDto(new Date(dateString), SimulateResult.of(simulateResultJson)));
    });
    return results;
} 
