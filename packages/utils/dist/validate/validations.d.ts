import { type Result } from "../type/helpers";
import { type TPasswordStrength } from "./password-strength";
export declare const main: any;
export declare const validate_file: (file: unknown) => Result<File, string>;
export declare const validate_files: (files: unknown) => Result<Array<File>, string>;
export declare const validate_email: (input: unknown) => Result<string, string>;
export declare function validate_email_redirect(args: {
    email: string;
    redirectHref?: string;
}): Result<{
    email: string;
    redirectHref?: string;
}, string>;
export declare const validate_url: (url: unknown) => Result<string, string>;
export declare const validate_url_pathname_full: (pathname: unknown) => Result<string, string>;
export declare const validate_password: (input: unknown, min_strength?: TPasswordStrength) => Result<string, string>;
export declare const validate_id: (id: unknown) => Result<string, string>;
export declare const throw_invalid_object: (input: unknown) => void;
export declare const validate_object: (input: unknown) => boolean;
export declare const validate_id_redirect: (input: TAuthIdRedirect) => {
    id: string;
    redirectUrl: string;
};
export declare const validate_redirect_url: (pathname_full?: string) => Result<string, string>;
export declare const validate_formdata: (formData: FormData) => Result<FormData, string>;
export interface TAuthIdRedirect {
    id: string;
    redirectUrl?: string;
}
export interface TAuthCredentials {
    email: string;
    password: string;
    redirectUrl?: string;
}
//# sourceMappingURL=validations.d.ts.map