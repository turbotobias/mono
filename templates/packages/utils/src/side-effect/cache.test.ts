import { afterEach, beforeEach, describe, expect, setSystemTime, test } from 'bun:test';
import { TimedCache } from '../cache.ts';

describe('TimedCache', () => {
    beforeEach(() => {
        setSystemTime(new Date("2020-01-01T00:00:00.000Z"));
    });

    afterEach(() => {
        setSystemTime();
    });

    test('stores and retrieves values', () => {
        const cache = new TimedCache<string>(1000);

        cache.set('key1', 'value1');
        expect(cache.get('key1')).toBe('value1');

        cache.destroy();

        expect(cache.get('key1')).toBeUndefined();
    });

    test('returns undefined for non-existent keys', () => {
        const cache = new TimedCache<string>(1000);

        expect(cache.get('nonexistent')).toBeUndefined();

        cache.destroy();
    });

    test('expires values after TTL', () => {
        const cache = new TimedCache<string>(1000);

        cache.set('key1', 'value1');
        expect(cache.get('key1')).toBe('value1');

        // Advance time past TTL
        setSystemTime(new Date("2020-01-01T00:00:01.001Z"));
        expect(cache.get('key1')).toBeUndefined();

        cache.destroy();
    });

    test('values do not expire before TTL', () => {
        const cache = new TimedCache<string>(1000);

        cache.set('key1', 'value1');

        // Advance time but not past TTL
        setSystemTime(new Date("2020-01-01T00:00:00.999Z"));
        expect(cache.get('key1')).toBe('value1');

        cache.destroy();
    });

    test('overwrites existing keys', () => {
        const cache = new TimedCache<string>(1000);

        cache.set('key1', 'value1');
        cache.set('key1', 'value2');

        expect(cache.get('key1')).toBe('value2');

        cache.destroy();
    });

    test('handles multiple keys independently', () => {
        const cache = new TimedCache<string>(1000);

        cache.set('key1', 'value1');
        setSystemTime(new Date("2020-01-01T00:00:00.500Z"));
        cache.set('key2', 'value2');

        // After 800ms total, key1 should still exist but be close to expiring
        setSystemTime(new Date("2020-01-01T00:00:00.800Z"));
        expect(cache.get('key1')).toBe('value1');
        expect(cache.get('key2')).toBe('value2');

        // After 1100ms total, key1 should expire but key2 should remain
        setSystemTime(new Date("2020-01-01T00:00:01.100Z"));
        expect(cache.get('key1')).toBeUndefined();
        expect(cache.get('key2')).toBe('value2');

        cache.destroy();
    });

    test('periodic cleanup removes expired entries', () => {
        const cache = new TimedCache<string>(1000);

        cache.set('key1', 'value1');
        cache.set('key2', 'value2');

        // Advance time to expire entries
        setSystemTime(new Date("2020-01-01T00:00:01.001Z"));

        // Trigger cleanup interval (runs every TTL * 2)
        setSystemTime(new Date("2020-01-01T00:00:02.002Z"));

        // Both entries should be cleaned up
        expect(cache.get('key1')).toBeUndefined();
        expect(cache.get('key2')).toBeUndefined();

        cache.destroy();
    });

    test('destroy clears cache and stops cleanup interval', () => {
        const cache = new TimedCache<string>(1000);

        cache.set('key1', 'value1');
        expect(cache.get('key1')).toBe('value1');

        cache.destroy();

        // After destroy, cache should be empty
        expect(cache.get('key1')).toBeUndefined();

        // Cleanup interval should be stopped (no errors when advancing time)
        setSystemTime(new Date("2020-01-01T00:00:10.010Z"));
    });

    test('works with different value types', () => {
        const cache = new TimedCache<{ id: number; name: string }>(1000);

        const obj = { id: 1, name: 'test' };
        cache.set('object', obj);

        expect(cache.get('object')).toBe(obj);
        expect(cache.get('object')).toEqual({ id: 1, name: 'test' });

        cache.destroy();
    });

    test('handles null and undefined values', () => {
        const cache = new TimedCache<string | null | undefined>(1000);

        cache.set('null', null);
        cache.set('undefined', undefined);

        expect(cache.get('null')).toBeNull();
        expect(cache.get('undefined')).toBeUndefined();

        cache.destroy();
    });

    test('different TTL values work correctly', () => {
        const shortCache = new TimedCache<string>(100);
        const longCache = new TimedCache<string>(2000);

        shortCache.set('short', 'value');
        longCache.set('long', 'value');

        // After 150ms, short cache should expire but long cache should remain
        setSystemTime(new Date("2020-01-01T00:00:00.150Z"));
        expect(shortCache.get('short')).toBeUndefined();
        expect(longCache.get('long')).toBe('value');

        shortCache.destroy();
        longCache.destroy();
    });
});