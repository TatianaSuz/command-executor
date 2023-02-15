import { FfmpegExecutor } from "./commands/ffmpeg.executor";
import { ConsoleLogger } from "./out/console-logger";

export class App {
    async run() {
        await new FfmpegExecutor(ConsoleLogger.getInstance()).execute();
    }
}


const app = new App();
app.run();