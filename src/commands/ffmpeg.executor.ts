import { CommandExecutor } from "../core/executor/command.executor";
import { ICommandExecFfmpeg, IFfmpegInput } from "./ffmpeg.types";
import { IStreamLogger } from "../core/handlers/stream-logger.interface";
import { FileService } from "../core/files/file.service";
import { PromtService } from "../core/promt/promt.service";
import { FfmpegBuilder } from "./ffmpeg.builder";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import {StreamHandler} from "../core/handlers/stream.handler";

export class FfmpegExecutor extends CommandExecutor<IFfmpegInput>{
    private fileService: FileService = new FileService();
    private promtService: PromtService = new PromtService();

    constructor(logger: IStreamLogger) {
        super(logger);
    }

    protected build({ width, height, path, name }: IFfmpegInput): ICommandExecFfmpeg {
        const output = this.fileService.getFilePath(path, name, 'mp4');
        const args = (new FfmpegBuilder)
            .input(path)
            .setVideoSize(width, height)
            .output(output);

        return { command: 'ffmpeg', args, output };
    }

    protected processStream(stream: ChildProcessWithoutNullStreams, logger: IStreamLogger): void {
        const handler = new StreamHandler(logger);
        handler.processOutput(stream);
    }

    protected async promt(): Promise<IFfmpegInput> {
        const width = await this.promtService.input<number>('Width', 'number');
        const height = await this.promtService.input<number>('Height', 'number');
        const path = await this.promtService.input<string>('Path to file', 'input');
        const name = await this.promtService.input<string>('Name of file', 'input');
        return { width, height, path, name };
    }

    protected spawn({ output, command, args }: ICommandExecFfmpeg): ChildProcessWithoutNullStreams {
        this.fileService.deleteFileIfExist(output);
        return spawn(command, args);
    }

}
