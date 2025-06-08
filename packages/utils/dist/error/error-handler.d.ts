/**
 * Utility function to execute an operation and handle errors with log notifications
 */
export declare function handle<T>(options: {
    fn: () => Promise<T> | T;
    on_error?: {
        message: string;
        details?: boolean;
    };
    on_success?: {
        message: string;
        show: boolean;
    };
}): Promise<T | undefined>;
/**
 * Synchronous version of handle
 */
export declare function handle_sync<T>(options: {
    fn: () => T;
    on_error?: {
        message: string;
        details?: boolean;
    };
    on_success?: {
        message: string;
        show: boolean;
    };
}): T | undefined;
//# sourceMappingURL=error-handler.d.ts.map