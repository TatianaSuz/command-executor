import inquirer from 'inquirer';
import {PromtTypes} from "./promt.types";

export class PromtService {
    public async input<T>(message: string, type: PromtTypes) {
        const { result } = await inquirer.prompt<{ result: T}>([
            {
                type,
                name: 'result',
                message,
            }
        ]);

        return result;
    }
}