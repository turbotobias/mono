import { getAllTimezones, } from 'countries-and-timezones';
export const timeZoneOptions = [
    {
        offset: '(UTC-12:00)',
        name: 'International Date Line West',
        value: 'Etc/GMT+12',
        offsetMinutes: -12 * 60,
    },
    {
        offset: '(UTC-11:00)',
        name: 'Coordinated Universal Time-11',
        value: 'Etc/GMT+11',
        offsetMinutes: -11 * 60,
    },
    {
        offset: '(UTC-10:00)',
        name: 'Hawaii',
        value: 'Pacific/Honolulu',
        offsetMinutes: -10 * 60,
    },
    {
        offset: '(UTC-09:00)',
        name: 'Alaska',
        value: 'America/Anchorage',
        offsetMinutes: -9 * 60,
    },
    {
        offset: '(UTC-08:00)',
        name: 'Pacific Time (US and Canada)',
        value: 'America/Los_Angeles',
        offsetMinutes: -8 * 60,
    },
    {
        offset: '(UTC-07:00)',
        name: 'Mountain Time (US and Canada)',
        value: 'America/Denver',
        offsetMinutes: -7 * 60,
    },
    {
        offset: '(UTC-06:00)',
        name: 'Central Time (US and Canada)',
        value: 'America/Chicago',
        offsetMinutes: -6 * 60,
    },
    {
        offset: '(UTC-05:00)',
        name: 'Eastern Time (US and Canada)',
        value: 'America/New_York',
        offsetMinutes: -5 * 60,
    },
    {
        offset: '(UTC-04:00)',
        name: 'Atlantic Time (Canada)',
        value: 'America/Halifax',
        offsetMinutes: -4 * 60,
    },
    {
        offset: '(UTC-03:30)',
        name: 'Newfoundland',
        value: 'America/St_Johns',
        offsetMinutes: -3 * 60 - 30,
    },
    {
        offset: '(UTC-03:00)',
        name: 'Brasilia',
        value: 'America/Sao_Paulo',
        offsetMinutes: -3 * 60,
    },
    {
        offset: '(UTC-02:00)',
        name: 'Coordinated Universal Time-2',
        value: 'Etc/GMT+2',
        offsetMinutes: -2 * 60,
    },
    {
        offset: '(UTC-01:00)',
        name: 'Azores',
        value: 'Atlantic/Azores',
        offsetMinutes: -1 * 60,
    },
    {
        offset: '(UTC+00:00)',
        name: 'London, Dublin, Edinburgh',
        value: 'Europe/London',
        offsetMinutes: 0,
    },
    {
        offset: '(UTC+01:00)',
        name: 'Berlin, Paris, Rome, Madrid',
        value: 'Europe/Paris',
        offsetMinutes: 60,
    },
    {
        offset: '(UTC+02:00)',
        name: 'Athens, Istanbul, Helsinki',
        value: 'Europe/Istanbul',
        offsetMinutes: 2 * 60,
    },
    {
        offset: '(UTC+03:00)',
        name: 'Moscow, St. Petersburg',
        value: 'Europe/Moscow',
        offsetMinutes: 3 * 60,
    },
    {
        offset: '(UTC+03:30)',
        name: 'Tehran',
        value: 'Asia/Tehran',
        offsetMinutes: 3 * 60 + 30,
    },
    {
        offset: '(UTC+04:00)',
        name: 'Dubai, Abu Dhabi',
        value: 'Asia/Dubai',
        offsetMinutes: 4 * 60,
    },
    {
        offset: '(UTC+04:30)',
        name: 'Kabul',
        value: 'Asia/Kabul',
        offsetMinutes: 4 * 60 + 30,
    },
    {
        offset: '(UTC+05:00)',
        name: 'Karachi, Islamabad',
        value: 'Asia/Karachi',
        offsetMinutes: 5 * 60,
    },
    {
        offset: '(UTC+05:30)',
        name: 'New Delhi, Mumbai',
        value: 'Asia/Kolkata',
        offsetMinutes: 5 * 60 + 30,
    },
    {
        offset: '(UTC+05:45)',
        name: 'Kathmandu',
        value: 'Asia/Kathmandu',
        offsetMinutes: 5 * 60 + 45,
    },
    {
        offset: '(UTC+06:00)',
        name: 'Dhaka',
        value: 'Asia/Dhaka',
        offsetMinutes: 6 * 60,
    },
    {
        offset: '(UTC+06:30)',
        name: 'Yangon',
        value: 'Asia/Yangon',
        offsetMinutes: 6 * 60 + 30,
    },
    {
        offset: '(UTC+07:00)',
        name: 'Bangkok, Jakarta',
        value: 'Asia/Bangkok',
        offsetMinutes: 7 * 60,
    },
    {
        offset: '(UTC+08:00)',
        name: 'Beijing, Singapore, Hong Kong',
        value: 'Asia/Shanghai',
        offsetMinutes: 8 * 60,
    },
    {
        offset: '(UTC+09:00)',
        name: 'Tokyo, Seoul',
        value: 'Asia/Tokyo',
        offsetMinutes: 9 * 60,
    },
    {
        offset: '(UTC+09:30)',
        name: 'Adelaide',
        value: 'Australia/Adelaide',
        offsetMinutes: 9 * 60 + 30,
    },
    {
        offset: '(UTC+10:00)',
        name: 'Sydney, Melbourne',
        value: 'Australia/Sydney',
        offsetMinutes: 10 * 60,
    },
    {
        offset: '(UTC+11:00)',
        name: 'Solomon Islands',
        value: 'Pacific/Guadalcanal',
        offsetMinutes: 11 * 60,
    },
    {
        offset: '(UTC+12:00)',
        name: 'Auckland, Wellington',
        value: 'Pacific/Auckland',
        offsetMinutes: 12 * 60,
    },
    {
        offset: '(UTC+13:00)',
        name: "Nuku'alofa",
        value: 'Pacific/Tongatapu',
        offsetMinutes: 13 * 60,
    },
];
let _timezones;
export const timezones = () => {
    if (!_timezones) {
        _timezones = getAllTimezones();
    }
    return _timezones;
};
export const getUserTimezone = () => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const matchingOption = timeZoneOptions.find((option) => option.value === userTimezone);
    if (matchingOption) {
        return matchingOption.value;
    }
    const userOffset = -new Date().getTimezoneOffset();
    const closestOption = timeZoneOptions.reduce((prev, curr) => Math.abs(curr.offsetMinutes - userOffset) <
        Math.abs((prev?.offsetMinutes || 0) - userOffset)
        ? curr
        : prev, timeZoneOptions[0]);
    return closestOption?.value ?? 'UTC';
};
//# sourceMappingURL=data.js.map