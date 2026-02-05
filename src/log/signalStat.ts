import { SignalStatsData } from "./SignalStatsData";

export class SignalStat {
  date: Date;
  sCount: number;
  sWinCount: number;
  sFalseCount: number;
  aCount: number;
  aWinCOunt: number;
  aFalseCount: number;
  sSignals: number[];
  aSignals: number[];

  constructor(date:Date, data: SignalStatsData) {
    this.date = date;
    this.sCount = data.sCount;
    this.sWinCount = data.sWinCount;
    this.sFalseCount = data.sFalseCount;
    this.aCount = data.aCount;
    this.aWinCOunt = data.aWinCOunt;
    this.aFalseCount = data.aFalseCount;
    this.sSignals = data.sSignals;
    this.aSignals = data.aSignals;
  }

  get sWinRate(): number {
    return this.sCount > 0 ? this.sWinCount / this.sCount : 0;
  }

  get aWinRate(): number {
    return this.aCount > 0 ? this.aWinCOunt / this.aCount : 0;
  }
}