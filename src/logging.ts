import * as os from 'os';
import * as vscode from 'vscode';


export let outputChannel: vscode.OutputChannel | undefined; // NOSONAR
export let sshChannel: vscode.OutputChannel | undefined; // NOSONAR
let outputChannelLogger: Logger | undefined; 

function isIntegral(str: string): boolean {
    const regex = /^-?\d+$/;
    return regex.test(str);
}

export function getNumericLoggingLevel(loggingLevel: string | undefined): number {
    if (!loggingLevel) {
        return 1;
    }
    if (isIntegral(loggingLevel)) {
        return parseInt(loggingLevel, 10);
    }
    const lowerCaseLoggingLevel: string = loggingLevel.toLowerCase();
    switch (lowerCaseLoggingLevel) {
        case "error":
            return 1;
        case "warning":
            return 3;
        case "information":
            return 5;
        case "debug":
            return 6;
        case "none":
            return 0;
        default:
            return -1;
    }
}

// This is used for testing purposes
let Subscriber: (message: string) => void;
export function subscribeToAllLoggers(subscriber: (message: string) => void): void {
    Subscriber = subscriber;
}

export class Logger {
    private readonly writer: (message: string) => void;

    constructor(writer: (message: string) => void) {
        this.writer = writer;
    }

    public append(message: string): void {
        this.writer(message);
        if (Subscriber) {
            Subscriber(message);
        }
    }

    public appendLine(message: string): void {
        this.writer(message + os.EOL);
        if (Subscriber) {
            Subscriber(message + os.EOL);
        }
    }

    // We should not await on this function.
    public showInformationMessage(message: string, items?: string[]): Thenable<string | undefined> {
        this.appendLine(message);

        if (!items) {
            return vscode.window.showInformationMessage(message);
        }
        return vscode.window.showInformationMessage(message, ...items);
    }

    // We should not await on this function.
    public showWarningMessage(message: string, items?: string[]): Thenable<string | undefined> {
        this.appendLine(message);

        if (!items) {
            return vscode.window.showWarningMessage(message);
        }
        return vscode.window.showWarningMessage(message, ...items);
    }

    // We should not await on this function.
    public showErrorMessage(message: string, items?: string[]): Thenable<string | undefined> {
        this.appendLine(message);

        if (!items) {
            return vscode.window.showErrorMessage(message);
        }
        return vscode.window.showErrorMessage(message, ...items);
    }
}

export function getOutputChannel(): vscode.OutputChannel {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel("Remote Compilation");
        // Do not use CppSettings to avoid circular require()
        const settings: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("remote-compilation", null);
        const loggingLevel: string | undefined = settings.get<string>("loggingLevel");
        if (getNumericLoggingLevel(loggingLevel) > 1) {
            outputChannel.appendLine(`loggingLevel: ${loggingLevel}`);
        }
    }
    return outputChannel;
}

export function getSshChannel(): vscode.OutputChannel {
    if (!sshChannel) {
        sshChannel = vscode.window.createOutputChannel("Remote Compilation: SSH");
    }
    return sshChannel;
}

export function showOutputChannel(): void {
    getOutputChannel().show();
}


export function getOutputChannelLogger(): Logger {
    if (!outputChannelLogger) {
        outputChannelLogger = new Logger(message => getOutputChannel().append(message));
    }
    return outputChannelLogger;
}

export function log(output: string): void {
    if (!outputChannel) {
        outputChannel = getOutputChannel();
    }
    outputChannel.appendLine(`${output}`);
}

