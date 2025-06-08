/**
/**
 * A logger that logs messages with a counter for each unique message
 *
 * ```tsx
 * log("entry.server.tsx handleRequest()")
 * // => "#0: entry.server.tsx handleRequest()"
 * log.error("entry.server.tsx handleRequest()")
 * // => "#2: entry.server.tsx handleRequest()"
 * log.trace("entry.server.tsx handleRequest()")
 * // => "#4: entry.server.tsx handleRequest()"
 * ```
 */
/** log message type */
type TConsoleMethod = Pick<typeof console, "log" | "info" | "error" | "warn" | "trace">;
type TConsoleMethodType = keyof TConsoleMethod;
/** logger interface with counter for each unique message */
interface ILogger extends TConsoleMethod {
    (message: string, type?: TConsoleMethodType): void;
    /** singleton logger with cache persistence across all consumers */
    inc: (message: string, type?: TConsoleMethodType) => void;
    /** creates new logger instance starting from 0 */
    inc_new: (prefix?: string) => (message: string, type?: TConsoleMethodType) => void;
}
export declare const log: ILogger;
export declare const log_bit_size: (size: number) => string;
export {};
//# sourceMappingURL=increment.d.ts.map