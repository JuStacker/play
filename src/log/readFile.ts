import { SignalStat } from "./signalStat";
import * as fs from 'fs';


export function readFile(filePath: string): SignalStat[] {
  const result: SignalStat[] = [];
  const logString: string = fs.readFileSync(filePath, 'utf-8');
  
  logString.replaceAll('\r', '').split('\n').forEach((log) => {
    if(log.length == 0) {
      return;
    }

    const lastDem = log.lastIndexOf(',');

    const jsonString = `{${log.slice(0, lastDem)}}`;
    const[[dateString, signalData]] = Object.entries(JSON.parse(jsonString)) as any;

    result.push(new SignalStat(new Date(dateString), signalData));
  });


  return result;
}