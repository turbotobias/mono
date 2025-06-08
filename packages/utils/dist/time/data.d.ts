import { type Timezone, type TimezoneName } from 'countries-and-timezones';
export interface TTimeZoneOptions {
    offset: string;
    name: string;
    value: string;
    offsetMinutes: number;
}
export declare const timeZoneOptions: Array<TTimeZoneOptions>;
export declare const timezones: () => Record<TimezoneName, Timezone>;
export declare const getUserTimezone: () => string;
//# sourceMappingURL=data.d.ts.map