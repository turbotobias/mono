import { nanoid } from "nanoid"

/**
 * Generate secure URL-friendly unique ID.
 *
 * By default, the ID will have 21 symbols to have a collision probability
 * similar to UUID v4.
 *
 * ```ts
 * import { gen_id_nano } from '~/utils/generate'
 * model.id = gen_id_nano() //=> "Uakgb_J5m9g-0JDMbcJqL"
 * ```
 *
 * ```ts
 * import { nanoid } from 'nanoid'
 * model.id = nanoid() //=> "Uakgb_J5m9g-0JDMbcJqL"
 * ```
 *
 * @param size Size of the ID. The default size is 21.
 * @returns A random string.
 */
export function gen_id_nano(size: number): string {
	return nanoid(size)
}
/**
 *
	```txt
	possible ids for length:
	1:  63
	2:  3,969
	3:  250,047
	4:  15,752,961
	5:  992,436,543
	6:  62.5 billion
	7:  3.9 trillion
	8:  248 trillion
	9:  15.6 quadrillion
	10: 984 quadrillion
	```
*/
export function gen_id_tiny(size?: number): string {
	return nanoid(size || 4)
}