import * as vscode from "vscode";

export class Utils {
    private static readonly appNames = {
        "Arduino IDE": "arduino",
        "Azure Data Studio": "azdata",
        "Cursor": "cursor",
        "Onivim": "onivim",
        "Onivim 2": "onivim",
        "SQL Operations Studio": "sqlops",
        "Visual Studio Code": "vscode",
        "Windsurf": "windsurf",
    };

    public static quote(str: string): string {
        if (str.includes(" ")) {return `"${str.replace('"', '\\"')}"`;}
        return str;
    }

    public static formatDate(date: Date): string {
        let months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        let ampm = "AM";
        let hour = date.getHours();
        if (hour > 11) {
            ampm = "PM";
            hour = hour - 12;
        }
        if (hour == 0) {
            hour = 12;
        }
        let minute = date.getMinutes();
        return `${
            months[date.getMonth()]
        } ${date.getDate()}, ${date.getFullYear()} ${hour}:${
            minute < 10 ? `0${minute}` : minute
        } ${ampm}`;
    }

    public static wrapArg(arg: string): string {
        if (arg.indexOf(" ") > -1) {return '"' + arg.replace(/"/g, '\\"') + '"';}
        return arg;
    }

    public static isRemoteUri(uri: vscode.Uri): boolean {
        if (!uri) {return false;}
        return uri.scheme === "vscode-remote";
    }

    public static isPullRequest(uri: vscode.Uri): boolean {
        if (!uri) {return false;}
        return uri.scheme === "pr";
    }
    public static getEditorName(): string {
        const appName = vscode.env.appName as keyof typeof this.appNames;
        if (this.appNames[appName]) {
            return this.appNames[appName];
        } else if (vscode.env.appName.toLowerCase().includes("visual")) {
            return "vscode";
        } else {
            return vscode.env.appName.replace(/\s/g, "").toLowerCase();
        }
    }
}
