import { toGeoJSON } from "../lib-geojson";
import { json } from "../log/json";
import { Err, Ok, type Result } from "../type/helpers";
import {
	type TPasswordStrength,
	calculate_password_strength,
} from "./password-strength";

export const main: any = toGeoJSON

export const validate_file = (file: unknown): Result<File, string> => {
	if (!(file instanceof File)) {
		console.error(
			"file is not valid because it is not an instance of File:",
			json(file),
		);
		return Err("file is not valid because it is not an instance of File");
	}
	return Ok(file);
};

export const validate_files = (files: unknown): Result<Array<File>, string> => {
	if (!Array.isArray(files))
		return Err("invalid files because files is not an array");
	if (files.length === 0) return Err("invalid files because files is empty");
	const files_result = files.map((item) => validate_file(item));
	if (files_result.some((file) => !file.ok))
		return Err("invalid files because of invalid file");
	return Ok(
		files_result
			.filter((file): file is { ok: true; value: File } => file.ok)
			.map((file) => file.value),
	);
};

export const validate_email = (input: unknown): Result<string, string> => {
	if (typeof input !== "string" || !input)
		return Err("Sørg for at e-posten din er gyldig");
	const regex_email = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
	if (!regex_email.test(input))
		return Err("Sørg for at e-posten din er gyldig");
	return Ok(input);
};

export function validate_email_redirect(args: {
	email: string;
	redirectHref?: string;
}): Result<{ email: string; redirectHref?: string }, string> {
	const email = validate_email(args.email);
	if (!email.ok)
		throw new Error("can not validate email because email is not valid");
	return Ok({ email: email.value, redirectHref: args.redirectHref });
}

export const validate_url = (url: unknown): Result<string, string> => {
	if (typeof url !== "string" || !url) return Err("url is not a string");
	const pattern = new RegExp(
		"^(https?:\\/\\/)?" + // protocol
		"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,23}|" + // domain name
		"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
		"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
		"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
		"(\\#[-a-z\\d_]*)?$",
		"i",
	); // fragment locator

	const is_valid = !!pattern.test(url);
	if (!is_valid) return Err("url is not a valid url");
	return Ok(url);
};

export const validate_url_pathname_full = (
	pathname: unknown,
): Result<string, string> => {
	if (typeof pathname !== "string" || !pathname)
		return Err("pathname is not a string");

	const pattern =
		/^(\/(?:[-a-z\d%_.~+]*)?)+(?:\?[;&a-z\d%_.~+=-]*)?(?:#[-a-z\d_]*)?$/i;
	const is_valid = !!pattern.test(pathname);
	if (!is_valid) return Err("pathname is not a valid url");
	return Ok(pathname);
};

export const validate_password = (
	input: unknown,
	min_strength?: TPasswordStrength,
): Result<string, string> => {
	if (typeof input !== "string" || !input)
		return Err("Passordet må ha en tekst");

	const strength = calculate_password_strength(input);

	if (strength === min_strength) {
		return Err(
			"Beklager, passordet er for svakt. Det må være lengre eller mer komplekst",
		);
	}

	return Ok(input);
};

export const validate_id = (id: unknown): Result<string, string> => {
	if (typeof id !== "string") return Err("id is not a string");
	if (id.length < 20) return Err("id is too short");
	if (id.length > 100) return Err("id is too long");
	return Ok(id);
};

export const throw_invalid_object = (input: unknown): void => {
	if (validate_object(input)) throw new Error("input is not an object");
};

export const validate_object = (input: unknown): boolean =>
	typeof input !== "object" || input === null;

export const validate_id_redirect = (input: TAuthIdRedirect): {
	id: string;
	redirectUrl: string;
} => {
	throw_invalid_object(input);
	const id = validate_id(input.id);
	if (id.ok) return { id: id.value, redirectUrl: input.redirectUrl || "" };
	throw new Error("can not validate auth id redirect because id is not valid");
};

export const validate_redirect_url = (
	pathname_full?: string,
): Result<string, string> => {
	if (!pathname_full) return Err("pathname_full is not a string");
	const url = validate_url(`https://example.com${pathname_full}`);
	if (!url.ok) return Err("pathname_full is not a valid url");
	return Ok(url.value);
};

export const validate_formdata = (
	formData: FormData,
): Result<FormData, string> => {
	if (!(formData instanceof FormData))
		return Err("formData is not an instance of FormData");
	return Ok(formData);
};

export interface TAuthIdRedirect {
	id: string;
	redirectUrl?: string;
}

export interface TAuthCredentials {
	email: string;
	password: string;
	redirectUrl?: string;
}
