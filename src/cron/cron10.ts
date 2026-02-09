import cron from "node-cron";
import { Eniviroment } from "../Enviroment";
import * as fs from "fs";
import { simlateForGacha } from "../simulate/simlateForGacha";

console.log("cron app started");

// ?분마다 실행
cron.schedule("*/1 * * * *", () => {
  const now = new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
  console.log("----스케줄 실행",  now);
  
  main(Eniviroment.GACHA_LOG_V2_PATH);
});

// 프로세스 유지
process.stdin.resume();
fs.writeFileSync("pid.txt", process.pid.toString());
console.log("cron started, pid:", process.pid);


function main(logPath: string, date = new Date()):void {
    simlateForGacha(logPath, date);
}
