import type { Timezone } from "countries-and-timezones";
import type { TimezoneName } from "countries-and-timezones";
export interface TDateTimeZone {
    date: string;
    time: string;
    timezone?: Timezone | undefined;
}
export declare const get_seconds_from_minutes_and_seconds: (minutes: number, seconds: number) => number;
export declare const get_hours_only_from_seconds: (seconds: number) => number;
export declare const get_minutes_only_from_seconds: (seconds: number) => number;
export declare const get_seconds_only_from_seconds: (seconds: number) => number;
export declare const get_date: (from: {
    date: string;
    time: string;
    timezone_name?: TimezoneName;
    timezone_offset?: Timezone["utcOffset"];
    timezone_offset_string?: Timezone["utcOffsetStr"];
}) => Date | undefined;
export declare const get_date_format: (from: {
    date: string;
    time: string;
    timezone?: Timezone | undefined;
}) => string | undefined;
export declare const get_date_date_now: () => string;
export declare const get_date_time_now: () => string;
export declare const validate_date_date: (date: string) => boolean;
export declare const validate_date_time: (time: string) => boolean;
export declare const get_date_string_locale: (date: string) => string;
//# sourceMappingURL=time.d.ts.map