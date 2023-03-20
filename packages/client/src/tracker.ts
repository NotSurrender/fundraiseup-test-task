const TRACKER_URL = "http://localhost:8888/tracker";

interface TTracker {
  track(event: string, ...tags: string[]): void;
}

interface Track {
  event: string;
  tags: string[];
  url: string;
  title: string;
  ts: number;
}

interface ITrackerParams {
  pendingTime?: number;
  attempts?: number;
}

class Tracker implements TTracker {
  private buffer: Track[] = [];
  private timer: number | null = null;
  private linkClicked: boolean = false;
  private isPending: boolean = false;
  private pendingTime: number;
  private attempts: number;

  constructor({ pendingTime = 1000, attempts = 3 }: ITrackerParams = {}) {
    this.pendingTime = pendingTime;
    this.attempts = attempts;

    window.addEventListener("unload", this.handleUnload.bind(this));

    window.document.addEventListener(
      "click",
      this.handleDocumentClick.bind(this),
      true
    );
  }

  public async track(event: string, ...tags: string[]): Promise<void> {
    this.addTrackToBuffer(event, tags); // добавляем событие в буфер
    this.clearTimer(); // откладываем вызов предыдущего таймера (нужно для обнуления)

    // запускаем таймер на 1 секунду
    this.timer = window.setTimeout(() => {
      // если через секунду у нас есть что отправить и запрос не в pending состоянии, то отправляем
      if (this.buffer.length && !this.isPending) {
        this.sendWithAttempts();
      }
    }, this.pendingTime);

    // если в буфере события больше максимального, то отправляем запрос
    if (this.buffer.length >= this.attempts && !this.isPending) {
      this.sendWithAttempts();
    }
  }

  private async sendWithAttempts(): Promise<void> {
    try {
      const controller = new AbortController();

      // создаем отдельный таймер для обработки кейса когда запрос завис в pending состоянии, чтобы прервать его
      const timeout = window.setTimeout(() => {
        this.clearTimer(timeout);
        if (this.isPending) {
          controller.abort();
        }
      }, this.pendingTime);

      this.isPending = true;
      const response = await this.send(controller.signal);

      if (!response.ok) {
        throw new Error("Response is not ok");
      }

      this.isPending = false;
      this.buffer = [];
    } catch (err) {
      this.isPending = true;
      await delay(this.pendingTime);
      this.sendWithAttempts();
    }
  }

  private send(signal?: AbortSignal): Promise<Response> {
    return fetch(TRACKER_URL, {
      method: "POST",
      signal,
      body: JSON.stringify(this.buffer),
    });
  }

  private addTrackToBuffer(event: string, tags: string[]): void {
    this.buffer.push({
      event,
      tags,
      url: document.URL,
      title: document.title,
      ts: Date.now(),
    });
  }

  private clearTimer(timer: number | null = this.timer): void {
    if (timer) {
      window.clearTimeout(timer);
    }
  }

  private handleUnload(): void {
    if (!this.linkClicked) {
      this.addTrackToBuffer("closebrowser", []);
      navigator.sendBeacon(TRACKER_URL, JSON.stringify(this.buffer));
    } else if (this.buffer.length) {
      navigator.sendBeacon(TRACKER_URL, JSON.stringify(this.buffer));
    }
  }

  private handleDocumentClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).tagName === "A") {
      this.linkClicked = true;
    } else {
      this.linkClicked = false;
    }
  }
}

const tracker = new Tracker({ attempts: 3, pendingTime: 1000 });

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
