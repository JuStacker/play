import cron from "node-cron";
import { Log } from "../util/log";
import { main } from "../main";

Log.log("cron app started");

// 10분마다 실행
cron.schedule("*/10 * * * *", () => {
  const now = new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
  
  main();
});

// 프로세스 유지
process.stdin.resume();
