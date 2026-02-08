import cron from "node-cron";
import { Log } from "../util/log";
import { main } from "../main";
import { Eniviroment } from "../Enviroment";

Log.log("cron app started");

// 10분마다 실행
cron.schedule("*/10 * * * *", () => {
  const now = new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
  
  main(Eniviroment.LOCAL_GACHA_LOG_V2_PATH);
});

// 프로세스 유지
process.stdin.resume();
