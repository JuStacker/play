import { Eniviroment } from "../Enviroment";
import { SlotDto } from "../timeSlot/dto/SlotDto";
import { TimeSlotDto } from "../timeSlot/dto/TimeSlotDto";
import { inverseRelativeScore } from "../util/inverseRelativeScore";
import { Log } from "../util/log";
import { relativeScore } from "../util/relativeScore";
import { AnalyzeTimeSlotDto } from "./dto/AnalyzeTimeSlot";
import { TotalAnalyze } from "./dto/TotalAnalyze";
import * as fs from 'fs'

const A_CH_TITLE = "A캐릭터 추천 시간대";
const AB_CH_TITLE = "AB캐릭터 추천 시간대";
const AB_CH_A_WP_TITLE = "AB캐릭터 + A무기 추천 시간대";
const AB_CH_AB_WP_TITLE = "AB캐릭터 + AB무기 추천 시간대";

export function analyzeByTimeSlot(timeSlotDto: TimeSlotDto): void {
  const aAnalyzeList = analyzeByRangeSlot(timeSlotDto.aCharacter);

  const abAnalyzeList = analyzeByRangeSlot(timeSlotDto.abCharacter);

  const abChaWpAnlyzeList = analyzeByRangeSlot(timeSlotDto.abCharacterAWeapon);

  const abChabWpAnlyzeList = analyzeByRangeSlot(
    timeSlotDto.abCharacterAbWeapon,
  );

  showLog(A_CH_TITLE, 10, aAnalyzeList);
  showLog(AB_CH_TITLE, 10, abAnalyzeList);
  showLog(AB_CH_A_WP_TITLE, 10, abChaWpAnlyzeList);
  showLog(AB_CH_AB_WP_TITLE, 10, abChabWpAnlyzeList);


  const outputLines = [
    formatTable(A_CH_TITLE, aAnalyzeList),
    formatTable(AB_CH_TITLE, abAnalyzeList),
    formatTable(AB_CH_A_WP_TITLE, abChaWpAnlyzeList),
    formatTable(AB_CH_AB_WP_TITLE, abChabWpAnlyzeList),
  ];
  fs.writeFileSync(
      Eniviroment.ANALYZE_PATH,
      outputLines.join('\n'),
      'utf-8'
  );
}

function showLog(
  title: string,
  maxSlot: number,
  analyzeTimeSlots: AnalyzeTimeSlotDto[],
) {
  Log.log("\n" + title);
  Log.table(
    analyzeTimeSlots
      .slice(0, maxSlot)
      .map((slotDto) => slotDto.analyzeTimeFormat),
  );
}

function analyzeByRangeSlot(
  rangeDtoMap: Map<string, SlotDto>,
): AnalyzeTimeSlotDto[] {
  const totalAnalyze = new TotalAnalyze();

  for (const slotDto of rangeDtoMap.values()) {
    totalAnalyze.updateBySlotDto(slotDto);
  }

  const analyzeTimeSlots: AnalyzeTimeSlotDto[] = [];
  for (const [timeRange, slotDto] of rangeDtoMap.entries()) {
    analyzeTimeSlots.push(
      AnalyzeTimeSlotDto.of(
        timeRange,
        calcScore(slotDto, totalAnalyze),
        slotDto,
      ),
    );
  }
  analyzeTimeSlots.sort((a, b) => b.score - a.score);

  return analyzeTimeSlots;
}

function calcScore(slotDto: SlotDto, totalAnalyze: TotalAnalyze): number {
  const pityScore = inverseRelativeScore(
    slotDto.avgPity,
    totalAnalyze.minAvgPity,
    totalAnalyze.maxAvgPity,
    50,
  );
  const winScore = relativeScore(
    slotDto.winRate,
    totalAnalyze.minWinRate,
    totalAnalyze.maxWinRate,
    40,
  );
  const simCountScore = relativeScore(
    slotDto.simCount,
    totalAnalyze.minSimCount,
    totalAnalyze.maxSimCount,
    10,
  );
  return pityScore + winScore + simCountScore;
}

function formatTable(title: string, slotDtos: AnalyzeTimeSlotDto[], maxSlot= 10): string {
  const header = `\n=== ${title} ===\n`;
  const body = slotDtos
    .slice(0, maxSlot)
    .map(v => v.analyzeTimeFormat)
    .map((r) =>
      [
        r.시간대,
        `점수:${r.점수}`,
        `평균 뽑기:${r["픽업 평균 뽑기"]}`,
        `승률:${r["반천장 승률"]}`,
        `시뮬 횟수:${r["시뮬레이션 횟수"]}`,
      ].join(" | "),
    )
    .join("\n");

  return header + body + "\n";
}
