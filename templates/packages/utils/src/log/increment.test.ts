import { describe, expect, spyOn, test } from 'bun:test';
import { log } from './increment';

describe('log.inc (singleton logger)', () => {
    test('logs messages with persistent counter', () => {
        const console_spy = spyOn(console, 'log');

        // Clear any existing calls
        console_spy.mockClear();

        log.inc('first message');
        log.inc('second message');
        log.inc('third message');

        const calls = console_spy.mock.calls;

        // Each call should have incremental counter but different messages
        expect(calls.length).toBe(3);
        expect(calls[0][0]).toMatch(/^#\d+: first message$/);
        expect(calls[1][0]).toMatch(/^#\d+: second message$/);
        expect(calls[2][0]).toMatch(/^#\d+: third message$/);

        // Extract counter values to verify they increment
        const counters = calls.map(call => parseInt(call[0].match(/#(\d+):/)?.[1] || '0'));
        expect(counters[1]).toBe(counters[0] + 1);
        expect(counters[2]).toBe(counters[1] + 1);

        console_spy.mockRestore();
    });

    test('supports different log types', () => {
        const error_spy = spyOn(console, 'error');
        const warn_spy = spyOn(console, 'warn');

        log.inc('error message', 'error');
        log.inc('warning message', 'warn');

        expect(error_spy).toHaveBeenCalledWith(expect.stringMatching(/^#\d+: error message$/));
        expect(warn_spy).toHaveBeenCalledWith(expect.stringMatching(/^#\d+: warning message$/));

        error_spy.mockRestore();
        warn_spy.mockRestore();
    });
});

describe('log.inc_new (instance logger)', () => {
    test('creates independent instances starting from 0', () => {
        const console_spy = spyOn(console, 'log');
        console_spy.mockClear();

        const log_a = log.inc_new();
        const log_b = log.inc_new();

        log_a('message A1');
        log_b('message B1');
        log_a('message A2');
        log_b('message B2');

        const calls = console_spy.mock.calls;
        expect(calls[0][0]).toBe('#0: message A1');
        expect(calls[1][0]).toBe('#0: message B1');
        expect(calls[2][0]).toBe('#1: message A2');
        expect(calls[3][0]).toBe('#1: message B2');

        console_spy.mockRestore();
    });

    test('supports prefix parameter', () => {
        const console_spy = spyOn(console, 'log');
        console_spy.mockClear();

        const prefixed_log = log.inc_new('[PREFIX]');

        prefixed_log('test message');
        prefixed_log('another message');

        const calls = console_spy.mock.calls;
        expect(calls[0][0]).toBe('#0: [PREFIX] test message');
        expect(calls[1][0]).toBe('#1: [PREFIX] another message');

        console_spy.mockRestore();
    });

    test('supports different log types', () => {
        const error_spy = spyOn(console, 'error');
        const instance_log = log.inc_new();

        instance_log('error message', 'error');

        expect(error_spy).toHaveBeenCalledWith('#0: error message');

        error_spy.mockRestore();
    });
});

describe('integration tests', () => {
    test('regular log, log.inc, and log.inc_new work independently', () => {
        const console_spy = spyOn(console, 'log');
        console_spy.mockClear();

        // Regular log (per-message counter)
        log('test message');
        log('test message'); // should increment for same message

        // Singleton inc (global counter)
        log.inc('singleton message');

        // Instance logger
        const instance_log = log.inc_new();
        instance_log('instance message');

        const calls = console_spy.mock.calls;

        // Regular log should use per-message counters
        expect(calls[0][0]).toBe('#0: test message');
        expect(calls[1][0]).toBe('#1: test message');

        // Singleton should use global counter
        expect(calls[2][0]).toMatch(/^#\d+: singleton message$/);

        // Instance should start from 0
        expect(calls[3][0]).toBe('#0: instance message');

        console_spy.mockRestore();
    });
});