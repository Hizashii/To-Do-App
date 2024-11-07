export class ClockService {
    private static instance: ClockService;
    private time: string = new Date().toLocaleTimeString();
    private intervalId: number | null = null;
  
    private constructor() {
      this.startClock();
    }
  
    static getInstance(): ClockService {
      if (!ClockService.instance) {
        ClockService.instance = new ClockService();
      }
      return ClockService.instance;
    }
  
    private startClock(): void {
      this.intervalId = window.setInterval(() => {
        this.time = new Date().toLocaleTimeString();
      }, 1000);
    }
  
    getTime(): string {
      return this.time;
    }
  
    stopClock(): void {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
  }
  