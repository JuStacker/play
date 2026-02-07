export class Log {
    static isDebug: boolean = true;
    // static isDebug: boolean = false;
    
    static log(...message: any): void {
        if(!this.isDebug) return;
        console.log(...message);
    }

    static table(obj: any): void {
        if(!this.isDebug) return;
        console.table(obj);
    
    }}
