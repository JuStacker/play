export class Log {
    static isDebug: boolean = false;
    
    static log(...message: any): void {
        if(!this.isDebug) return;
        console.log(...message);
    }
}