import { computed, signal, Signal } from "@preact/signals-core";
const proxyToSignals = new WeakMap();
const objToProxy = new WeakMap();
const arrayToArrayOfSignals = new WeakMap();
const ignore = new WeakSet();
const objToIterable = new WeakMap();
const rg = /^\$/;
const descriptor = Object.getOwnPropertyDescriptor;
let peeking = false;
export const deepSignal = (obj) => {
    if (!shouldProxy(obj))
        throw new Error("This object can't be observed.");
    if (!objToProxy.has(obj))
        objToProxy.set(obj, createProxy(obj, objectHandlers));
    return objToProxy.get(obj);
};
export const peek = (obj, key) => {
    peeking = true;
    const value = obj[key];
    try {
        peeking = false;
    }
    catch (e) { }
    return value;
};
const isShallow = Symbol("shallow");
export function shallow(obj) {
    ignore.add(obj);
    return obj;
}
const createProxy = (target, handlers) => {
    const proxy = new Proxy(target, handlers);
    ignore.add(proxy);
    return proxy;
};
const throwOnMutation = () => {
    throw new Error("Don't mutate the signals directly.");
};
const get = (isArrayOfSignals) => (target, fullKey, receiver) => {
    if (peeking)
        return Reflect.get(target, fullKey, receiver);
    let returnSignal = isArrayOfSignals || fullKey[0] === "$";
    if (!isArrayOfSignals && returnSignal && Array.isArray(target)) {
        if (fullKey === "$") {
            if (!arrayToArrayOfSignals.has(target))
                arrayToArrayOfSignals.set(target, createProxy(target, arrayHandlers));
            return arrayToArrayOfSignals.get(target);
        }
        returnSignal = fullKey === "$length";
    }
    if (!proxyToSignals.has(receiver))
        proxyToSignals.set(receiver, new Map());
    const signals = proxyToSignals.get(receiver);
    const key = returnSignal ? fullKey.replace(rg, "") : fullKey;
    if (!signals.has(key) &&
        typeof descriptor(target, key)?.get === "function") {
        signals.set(key, computed(() => Reflect.get(target, key, receiver)));
    }
    else {
        let value = Reflect.get(target, key, receiver);
        if (returnSignal && typeof value === "function")
            return;
        if (typeof key === "symbol" && wellKnownSymbols.has(key))
            return value;
        if (!signals.has(key)) {
            if (shouldProxy(value)) {
                if (!objToProxy.has(value))
                    objToProxy.set(value, createProxy(value, objectHandlers));
                value = objToProxy.get(value);
            }
            signals.set(key, signal(value));
        }
    }
    return returnSignal ? signals.get(key) : signals.get(key).value;
};
const objectHandlers = {
    get: get(false),
    set(target, fullKey, val, receiver) {
        if (typeof descriptor(target, fullKey)?.set === "function")
            return Reflect.set(target, fullKey, val, receiver);
        if (!proxyToSignals.has(receiver))
            proxyToSignals.set(receiver, new Map());
        const signals = proxyToSignals.get(receiver);
        if (fullKey[0] === "$") {
            if (!(val instanceof Signal))
                throwOnMutation();
            const key = fullKey.replace(rg, "");
            signals.set(key, val);
            return Reflect.set(target, key, val.peek(), receiver);
        }
        else {
            let internal = val;
            if (shouldProxy(val)) {
                if (!objToProxy.has(val))
                    objToProxy.set(val, createProxy(val, objectHandlers));
                internal = objToProxy.get(val);
            }
            const isNew = !(fullKey in target);
            const result = Reflect.set(target, fullKey, val, receiver);
            if (!signals.has(fullKey))
                signals.set(fullKey, signal(internal));
            else
                signals.get(fullKey).value = internal;
            if (isNew && objToIterable.has(target))
                objToIterable.get(target).value++;
            if (Array.isArray(target) && signals.has("length"))
                signals.get("length").value = target.length;
            return result;
        }
    },
    deleteProperty(target, key) {
        if (key[0] === "$")
            throwOnMutation();
        const signals = proxyToSignals.get(objToProxy.get(target));
        const result = Reflect.deleteProperty(target, key);
        if (signals && signals.has(key))
            signals.get(key).value = undefined;
        objToIterable.has(target) && objToIterable.get(target).value++;
        return result;
    },
    ownKeys(target) {
        if (!objToIterable.has(target))
            objToIterable.set(target, signal(0));
        objToIterable._ = objToIterable.get(target).value;
        return Reflect.ownKeys(target);
    },
};
const arrayHandlers = {
    get: get(true),
    set: throwOnMutation,
    deleteProperty: throwOnMutation,
};
const wellKnownSymbols = new Set(Object.getOwnPropertyNames(Symbol)
    .map(key => Symbol[key])
    .filter(value => typeof value === "symbol"));
const supported = new Set([Object, Array]);
const shouldProxy = (val) => {
    if (typeof val !== "object" || val === null)
        return false;
    return supported.has(val.constructor) && !ignore.has(val);
};
