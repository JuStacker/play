import * as fs from 'fs';
import * as path from 'path';

// 파일 경로 설정 (현재 파일 기준으로 같은 디렉토리의 example.txt)
const filePath = path.join('results.txt');

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('파일 읽기 중 오류 발생:', err);
      return;
    }

    const datas = data.replaceAll('\r', '').split('\n').reduce((prev, current) => {
      const lastDem = current.lastIndexOf(',');

      const jsonString = `{${current.slice(0, lastDem)}}`;
      const object = JSON.parse(jsonString);
      prev.push(object);
      return prev;
      // const [key ,value] = Object.entries(object)[0];    
      // prev[key] = value;
      return prev;
    } , []);

  const sortedb = datas.sort((a, b) => {
    const aKey = Object.keys(a)[0];
    const bKey = Object.keys(b)[0];

    const sCountA = a[aKey].sCount;
    const sCountB = b[bKey].sCount;

    return  sCountA - sCountB; // 오름차순
  });

  sortedb.forEach(data => {
    const [k, v] = Object.entries(data)[0]
    console.log(`${new Date(k).toLocaleDateString()} ${new Date(k).getHours()}:${new Date(k).getMinutes()} : sCount: ${v.sCount}, winCount: ${v.sWinCount}`);
  });

});

/**
 * @param {SignalStat[]} signalStats 
 * @param {number} stepByHour 
 * @param {number} stepByMinutes 
 */
function showLogbyTime(signalStats, stepByHour, stepByMinutes) {
  for(signalStat of SignalStats) {

  }
}

class SignalStat {
  /**
   * @param {string} date
   * @param {Object} data
   * @param {number} data.sCount
   * @param {number} data.sWinCount
   * @param {number} data.sFalseCount
   * @param {number} data.aCount
   * @param {number} data.aWinCOunt
   * @param {number} data.aFalseCount
   * @param {number[]} data.sSignals
   * @param {number[]} data.aSignals
   */
  constructor(date, data) {
    this.date = new Date(date)
    this.sCount = data.sCount;
    this.sWinCount = data.sWinCount;
    this.sFalseCount = data.sFalseCount;
    this.aCount = data.aCount;
    this.aWinCOunt = data.aWinCOunt;
    this.aFalseCount = data.aFalseCount;
    this.sSignals = data.sSignals;
    this.aSignals = data.aSignals;
  }

  // 예시: 승률 계산 메서드 추가
  get sWinRate() {
    return this.sCount > 0 ? this.sWinCount / this.sCount : 0;
  }

  get aWinRate() {
    return this.aCount > 0 ? this.aWinCOunt / this.aCount : 0;
  }
}
