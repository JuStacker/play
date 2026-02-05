export class Log {
    static isDebug: boolean = true;
    
    static log(...message: any): void {
        if(!this.isDebug) return;
        console.log(...message);
    }
}