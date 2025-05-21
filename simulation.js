const fs = require("fs");
const crypto  = require("crypto");

function runSimulation() {
    const result = caractorSignal();
    const appendText = `"${new Date().toISOString()}": ${JSON.stringify(result)}, \n`;
    console.log(appendText);
    fs.appendFileSync("results.txt", appendText);  // 파일에 추가
}

function caractorSignal(maxCount = 180) {
    const result = {
        sSignals: [],
        aSignals: [],
        sWinCount: 0,
        sFalseCount: 0,
        aWinCOunt: 0,
        aFalseCount: 0,
        sCount: 0,
        aCount: 0,
    }

    const sRankFullSize = 7;
    const sRankRate = 0.6;
    const aRankRate = 9.4;
    const winRate = 50;

    for(let index = 1; index <= maxCount; index++) {
        const choice = getRandomNumber(1000) / 10;
        const winOrFale = getRandomNumber(100);
        
        console.log(`index: ${index} - 결과값: ${choice}, 승패값: ${winOrFale}`);

        if(choice <= sRankRate) {
            ++result.sCount;
            if(winOrFale <= winRate) {
                result.sSignals.push(index);
                ++result.sWinCount;
            }
            // 패배
            result.sSignals.push(index); 
            ++result.sFalseCount;
        }

        if(choice > sRankRate && choice <= aRankRate) {
            ++result.aCount;

            if(winOrFale <= winRate) {
                result.aSignals.push(index);
                ++result.aWinCOunt;
            }
            // 패배
            result.aSignals.push(index); 
            ++result.aFalseCount;
        } 
    }
    return result;
}

function getRandomNumber(max) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;  // 0 ~ max-1
  }
  

runSimulation();
