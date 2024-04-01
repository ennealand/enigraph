// import { computed, signal, Signal } from "@preact/signals-core";
// import { useMemo } from 'preact/hooks';

// const proxyToSignals = new WeakMap();
// const objToProxy = new WeakMap();
// const arrayToArrayOfSignals = new WeakMap();
// const ignore = new WeakSet();
// const objToIterable = new WeakMap();
// const rg = /^\$/;
// const descriptor = Object.getOwnPropertyDescriptor;
// let peeking = false;

// export const deepSignal = <T extends object>(obj: T): DeepSignal<T> => {
// 	if (!shouldProxy(obj)) throw new Error("This object can't be observed.");
// 	if (!objToProxy.has(obj))
// 		objToProxy.set(obj, createProxy(obj, objectHandlers) as DeepSignal<T>);
// 	return objToProxy.get(obj);
// };

// export const peek = <
// 	T extends DeepSignalObject<object>,
// 	K extends keyof RevertDeepSignalObject<T>
// >(
// 	obj: T,
// 	key: K
// ): RevertDeepSignal<RevertDeepSignalObject<T>[K]> => {
// 	peeking = true;
// 	const value = obj[key];
// 	try {
// 		peeking = false;
// 	} catch (e) {}
// 	return value as RevertDeepSignal<RevertDeepSignalObject<T>[K]>;
// };

// const isShallow = Symbol("shallow");
// export function shallow<T extends object>(obj: T): Shallow<T> {
// 	ignore.add(obj);
// 	return obj as Shallow<T>;
// }

// const createProxy = (target: object, handlers: ProxyHandler<object>) => {
// 	const proxy = new Proxy(target, handlers);
// 	ignore.add(proxy);
// 	return proxy;
// };

// const throwOnMutation = () => {
// 	throw new Error("Don't mutate the signals directly.");
// };

// const get =
// 	(type: "object" | "array" | "set") =>
// 	(target: object, fullKey: string, receiver: object): unknown => {
// 		if (peeking) return Reflect.get(target, fullKey, receiver);
// 		let returnSignal = type === "array" || fullKey[0] === "$";
// 		if (type !== "array" && fullKey[0] === "$" && Array.isArray(target)) {
// 			if (fullKey === "$") {
// 				if (!arrayToArrayOfSignals.has(target))
// 					arrayToArrayOfSignals.set(target, createProxy(target, arrayHandlers));
// 				return arrayToArrayOfSignals.get(target);
// 			}
// 			returnSignal = fullKey === "$length";
// 		} else if (type !== "set" && fullKey[0] === "$" && target instanceof Set) {
// 			if (fullKey === "$") {
// 				if (!arrayToArrayOfSignals.has(target))
// 					arrayToArrayOfSignals.set(target, createProxy(target, setHandlers));
// 				return arrayToArrayOfSignals.get(target);
// 			}
// 			returnSignal = fullKey === "$size";
// 		}
// 		if (!proxyToSignals.has(receiver)) proxyToSignals.set(receiver, new Map());
// 		const signals = proxyToSignals.get(receiver);
// 		const key = returnSignal ? fullKey.replace(rg, "") : fullKey;

// 		// ===== Process Set here ===== //
// 		if (target instanceof Set) {
// 			let existing = signals.get(key)

// 			if (!existing) {
// 				// Start tracking
// 				if (typeof descriptor(Set.prototype, key)?.value === "function") {
// 					if (key === 'add' || key === 'delete' || key === 'clear') {
// 						existing = computed(() => {
// 							return (...args: any[]) => {
// 								const result = Reflect.get(target as any, key, receiver).apply(target, args)
// 								// Update `size` if tracked
// 								const $size = signals.get('size')
// 								if ($size) $size.value = target.size
// 								const $has = signals.get('has')
// 								if ($has) {
// 									$has.value = Reflect.get(target, 'has', receiver).bind(target)
// 									console.log('$has.value has been updated')
// 								}
// 								return result
// 							}
// 						})
// 					} else {
// 						existing = signal(Reflect.get(target, key, receiver).bind(target))
// 					}
// 				} else {
// 					let value = Reflect.get(target, key, target)
// 					if (shouldProxy(value)) {
// 						if (!objToProxy.has(value))
// 							objToProxy.set(value, createProxy(value, objectHandlers));
// 						value = objToProxy.get(value);
// 					}
// 					existing = signal(value)
// 				}
// 				signals.set(key, existing);
// 			}

// 			return returnSignal ? existing : existing.value;
// 		}

// 		if (
// 			!signals.has(key) &&
// 			(typeof descriptor(target, key)?.get === "function")
// 		) {
// 			console.log('good', target instanceof Set, key)
// 			signals.set(
// 				key,
// 				computed(() => Reflect.get(target, key, receiver).bind(target))
// 			);
// 		} else {
// 			let value = Reflect.get(target, key, receiver);
// 			if (returnSignal && typeof value === "function") {
// 				return;
// 			}
// 			if (typeof key === "symbol" && wellKnownSymbols.has(key)) return value;
// 			if (!signals.has(key)) {
// 				if (shouldProxy(value)) {
// 					if (!objToProxy.has(value))
// 						objToProxy.set(value, createProxy(value, objectHandlers));
// 					value = objToProxy.get(value);
// 				}
// 				signals.set(key, signal(value));
// 			}
// 		}
// 		return returnSignal ? signals.get(key) : signals.get(key).value;
// 	};

// const objectHandlers = {
// 	get: get('object'),
// 	set(target: object, fullKey: string, val: any, receiver: object): boolean {
// 		if (typeof descriptor(target, fullKey)?.set === "function")
// 			return Reflect.set(target, fullKey, val, receiver);
// 		if (!proxyToSignals.has(receiver)) proxyToSignals.set(receiver, new Map());
// 		const signals = proxyToSignals.get(receiver);
// 		if (fullKey[0] === "$") {
// 			if (!(val instanceof Signal)) throwOnMutation();
// 			const key = fullKey.replace(rg, "");
// 			signals.set(key, val);
// 			return Reflect.set(target, key, val.peek(), receiver);
// 		} else {
// 			let internal = val;
// 			if (shouldProxy(val)) {
// 				if (!objToProxy.has(val))
// 					objToProxy.set(val, createProxy(val, objectHandlers));
// 				internal = objToProxy.get(val);
// 			}
// 			const isNew = !(fullKey in target);
// 			const result = Reflect.set(target, fullKey, val, receiver);
// 			if (!signals.has(fullKey)) signals.set(fullKey, signal(internal));
// 			else signals.get(fullKey).value = internal;
// 			if (isNew && objToIterable.has(target)) objToIterable.get(target).value++;
// 			if (Array.isArray(target) && signals.has("length"))
// 				signals.get("length").value = target.length;
// 			return result;
// 		}
// 	},
// 	deleteProperty(target: object, key: string): boolean {
// 		if (key[0] === "$") throwOnMutation();
// 		const signals = proxyToSignals.get(objToProxy.get(target));
// 		const result = Reflect.deleteProperty(target, key);
// 		if (signals && signals.has(key)) signals.get(key).value = undefined;
// 		objToIterable.has(target) && objToIterable.get(target).value++;
// 		return result;
// 	},
// 	ownKeys(target: object): (string | symbol)[] {
// 		if (!objToIterable.has(target)) objToIterable.set(target, signal(0));
// 		(objToIterable as any)._ = objToIterable.get(target).value;
// 		return Reflect.ownKeys(target);
// 	},
// };

// const arrayHandlers = {
// 	get: get('array'),
// 	set: throwOnMutation,
// 	deleteProperty: throwOnMutation,
// };

// const setHandlers = {
// 	get: get('set'),
// 	set: throwOnMutation,
// 	deleteProperty: throwOnMutation,
// };

// const wellKnownSymbols = new Set(
// 	Object.getOwnPropertyNames(Symbol)
// 		.map(key => Symbol[key as WellKnownSymbols])
// 		.filter(value => typeof value === "symbol")
// );
// const supported = new Set([Object, Array, Set]);
// const shouldProxy = (val: any): boolean => {
// 	if (typeof val !== "object" || val === null) return false;
// 	return supported.has(val.constructor) && !ignore.has(val);
// };

// /** TYPES **/

// export type DeepSignal<T> = T extends Function
// 	? T
// 	: T extends { [isShallow]: true }
// 	? T
// 	: T extends Set<unknown>
// 	? DeepSignalSet<T>
// 	: T extends Array<unknown>
// 	? DeepSignalArray<T>
// 	: T extends object
// 	? DeepSignalObject<T>
// 	: T;

// type DeepSignalObject<T extends object> = {
// 	[P in keyof T & string as `$${P}`]?: T[P] extends Function
// 		? never
// 		: Signal<T[P]>;
// } & {
// 	[P in keyof T]: DeepSignal<T[P]>;
// };

// /** @ts-expect-error **/
// interface DeepArray<T> extends Array<T> {
// 	map: <U>(
// 		callbackfn: (
// 			value: DeepSignal<T>,
// 			index: number,
// 			array: DeepSignalArray<T[]>
// 		) => U,
// 		thisArg?: any
// 	) => U[];
// 	forEach: (
// 		callbackfn: (
// 			value: DeepSignal<T>,
// 			index: number,
// 			array: DeepSignalArray<T[]>
// 		) => void,
// 		thisArg?: any
// 	) => void;
// 	concat(...items: ConcatArray<T>[]): DeepSignalArray<T[]>;
// 	concat(...items: (T | ConcatArray<T>)[]): DeepSignalArray<T[]>;
// 	reverse(): DeepSignalArray<T[]>;
// 	shift(): DeepSignal<T> | undefined;
// 	slice(start?: number, end?: number): DeepSignalArray<T[]>;
// 	splice(start: number, deleteCount?: number): DeepSignalArray<T[]>;
// 	splice(
// 		start: number,
// 		deleteCount: number,
// 		...items: T[]
// 	): DeepSignalArray<T[]>;
// 	filter<S extends T>(
// 		predicate: (
// 			value: DeepSignal<T>,
// 			index: number,
// 			array: DeepSignalArray<T[]>
// 		) => value is DeepSignal<S>,
// 		thisArg?: any
// 	): DeepSignalArray<S[]>;
// 	filter(
// 		predicate: (
// 			value: DeepSignal<T>,
// 			index: number,
// 			array: DeepSignalArray<T[]>
// 		) => unknown,
// 		thisArg?: any
// 	): DeepSignalArray<T[]>;
// 	reduce(
// 		callbackfn: (
// 			previousValue: DeepSignal<T>,
// 			currentValue: DeepSignal<T>,
// 			currentIndex: number,
// 			array: DeepSignalArray<T[]>
// 		) => T
// 	): DeepSignal<T>;
// 	reduce(
// 		callbackfn: (
// 			previousValue: DeepSignal<T>,
// 			currentValue: DeepSignal<T>,
// 			currentIndex: number,
// 			array: DeepSignalArray<T[]>
// 		) => DeepSignal<T>,
// 		initialValue: T
// 	): DeepSignal<T>;
// 	reduce<U>(
// 		callbackfn: (
// 			previousValue: U,
// 			currentValue: DeepSignal<T>,
// 			currentIndex: number,
// 			array: DeepSignalArray<T[]>
// 		) => U,
// 		initialValue: U
// 	): U;
// 	reduceRight(
// 		callbackfn: (
// 			previousValue: DeepSignal<T>,
// 			currentValue: DeepSignal<T>,
// 			currentIndex: number,
// 			array: DeepSignalArray<T[]>
// 		) => T
// 	): DeepSignal<T>;
// 	reduceRight(
// 		callbackfn: (
// 			previousValue: DeepSignal<T>,
// 			currentValue: DeepSignal<T>,
// 			currentIndex: number,
// 			array: DeepSignalArray<T[]>
// 		) => DeepSignal<T>,
// 		initialValue: T
// 	): DeepSignal<T>;
// 	reduceRight<U>(
// 		callbackfn: (
// 			previousValue: U,
// 			currentValue: DeepSignal<T>,
// 			currentIndex: number,
// 			array: DeepSignalArray<T[]>
// 		) => U,
// 		initialValue: U
// 	): U;
// }
// type ArrayType<T> = T extends Array<infer I> ? I : T;
// type DeepSignalArray<T> = DeepArray<ArrayType<T>> & {
// 	[key: number]: DeepSignal<ArrayType<T>>;
// 	$?: { [key: number]: Signal<ArrayType<T>> };
// 	$length?: Signal<number>;
// };

// type DeepSignalSet<T> = T & {
// 	$size?: Signal<number>;
// };

// export type Shallow<T extends object> = T & { [isShallow]: true };

// export const useDeepSignal = <T extends object>(obj: T): DeepSignal<T> => {
// 	return useMemo(() => deepSignal(obj), []);
// };

// type FilterSignals<K> = K extends `$${infer P}` ? never : K;
// type RevertDeepSignalObject<T> = Pick<T, FilterSignals<keyof T>>;
// type RevertDeepSignalArray<T> = Omit<T, "$" | "$length">;

// export type RevertDeepSignal<T> = T extends Array<unknown>
// 	? RevertDeepSignalArray<T>
// 	: T extends object
// 	? RevertDeepSignalObject<T>
// 	: T;

// type WellKnownSymbols =
// 	| "asyncIterator"
// 	| "hasInstance"
// 	| "isConcatSpreadable"
// 	| "iterator"
// 	| "match"
// 	| "matchAll"
// 	| "replace"
// 	| "search"
// 	| "species"
// 	| "split"
// 	| "toPrimitive"
// 	| "toStringTag"
// 	| "unscopables";