import { registerDefaultFontFaces } from "@fluentui/react";

export function formatBytesForPresentation(bytes: number | undefined): string | undefined {
    if (bytes === undefined) return undefined;

    if (bytes < 1024) {
        return bytes + " bytes";
    } else if (bytes < 1048576) {
        return (bytes / 1024).toFixed(2) + " KB";
    } else if (bytes < 1073741824) {
        return (bytes / 1048576).toFixed(2) + " MB";
    } else {
        return (bytes / 1073741824).toFixed(2) + " GB";
    }
}

export function ifBooleanThenYesNoOtherwiseValue(value: any): any {
    if (value === true || value === false) {
        return value ? "Yes" : "No";
    } else {
        return value;
    }
}

export function convertTimespanToString(value: string | undefined): string {
    console.log("convertTimespanToString: ", value);
    if (value === undefined) return "";
    var tokens = value.split(/[A-Z]+/);

    function formatPart(part: string) {
        let num = parseFloat(part);
        if (num == NaN) num = 0;
        return num.toLocaleString('en');
    }

    const getPart = (part: string, name: string, isEnd?: boolean): string => {
        if (part === undefined || part === "" || part === "0") return "";
        if (isEnd === undefined) isEnd = false;
        return `${!isEnd ? ", " : ""} ${formatPart(part)} ${name}${part == "1" ? "" : "s"}`;
    }


    let days = tokens[1];
    let hours = tokens[2];
    let minutes = tokens[3];
    let seconds = tokens[4];
    let daysAsNumber = parseInt(days);
    let years = daysAsNumber / 365;
    if (years > 1) {
        years = Math.floor(years);
        days = (daysAsNumber - (years * 365)).toString();
    } else {
        years = 0;
    }
    let result = `${getPart(years.toString(), "year", true)}${getPart(days, "day", years < 1)}${getPart(hours, "hour")}${getPart(minutes, "minute")}${getPart(seconds, "second")}`;
    return result;
}

export interface LoadingData<T> {
    data?: T;
    hasLoaded: boolean;
    isLoading: boolean;
    didError: boolean;
    errorMessage?: string;
}