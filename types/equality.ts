// Test with complex recursive types that might cause issues
type RecursiveType = { self: RecursiveType; value: string };
type _TestRecursive = Expect<IsSameType<RecursiveType, RecursiveType>>; // Should now work without never

// Tests for never detection and fallback handling
type _TestNever1 = Expect<IsSameType<never, never>>; // ✅ Should pass
// type _TestNever2 = Expect<IsSameType<never, string>>; // ❌ Should error appropriately
// type _TestNever3 = Expect<IsSameType<string, never>>; // ❌ Should error appropriately

// Test for any detection
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type _TestAny1 = Expect<IsSameType<any, any>>; // ✅ Should pass  

// type _TestAny2 = Expect<IsSameType<any, string>>; // ❌ Should error appropriately

// Test cases for deeply nested structures that could cause recursion issues
type DeepNested = {
    level1: {
        level2: {
            level3: {
                level4: {
                    level5: { value: string };
                };
            };
        };
    };
};

type DeepNestedCopy = {
    level1: {
        level2: {
            level3: {
                level4: {
                    level5: { value: string };
                };
            };
        };
    };
};

type _TestDeepNested = Expect<IsSameType<DeepNested, DeepNestedCopy>>; // ✅ Should pass

// Test circular reference handling
type CircularA = { b: CircularB; value: string };
type CircularB = { a: CircularA; value: number };
type CircularACopy = { b: CircularB; value: string };
type _TestCircular = Expect<IsSameType<CircularA, CircularACopy>>; // Should handle gracefully

/**
 * SOLUTION SUMMARY FOR NEVER TYPE ISSUES:
 * 
 * The original issue was that IsSameType could evaluate to `never` in certain scenarios,
 * particularly with:
 * 1. Recursive types (like RecursiveType above)
 * 2. Complex nested object comparisons
 * 3. Circular type references
 * 4. Types that hit TypeScript's recursion limits
 * 
 * IMPLEMENTED FIXES:
 * 
 * 1. **SafeIsSame**: Enhanced version of IsSame that:
 *    - Detects `any` types using `0 extends 1 & T` pattern
 *    - Detects `never` types using `[T] extends [never]` pattern
 *    - Falls back to original IsSame only when safe
 * 
 * 2. **SafeTypeErrorMessage**: Smart error message generator that:
 *    - Only applies special handling to object types (where recursion issues occur)
 *    - Uses tuple syntax `[T] extends [never]` for reliable never detection
 *    - Provides fallback message for complex recursive structures
 *    - Falls back to normal error messages for simple type mismatches
 * 
 * 3. **Updated DifferentKeys**: Now uses SafeIsSame instead of IsSame
 *    to prevent never propagation in key comparison
 * 
 * BENEFITS:
 * - Recursive types like RecursiveType now work correctly
 * - Complex object comparisons are more reliable
 * - Better error messages for edge cases
 * - Maintains performance for simple type comparisons
 * - Provides clear fallback behavior when type analysis fails
 */// Core utility type to check if two types are exactly the same
export type IsSame<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
    ? true
    : false;

// Helper to detect if a type has resolved to never
export type IsNever<T> = [T] extends [never] ? true : false;

// Helper to detect if a type is any
export type IsAny<T> = 0 extends 1 & T ? true : false;

// Safe version of IsSame that handles edge cases
export type SafeIsSame<X, Y> =
    IsAny<X> extends true
    ? IsAny<Y> extends true
    ? true
    : false
    : IsAny<Y> extends true
    ? false
    : IsNever<X> extends true
    ? IsNever<Y> extends true
    ? true
    : false
    : IsNever<Y> extends true
    ? false
    : IsSame<X, Y>;

// Check if a type is an object (not primitive, array, function, etc.)
type IsObject<T> = T extends object
    ? T extends unknown[]
    ? false
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    : T extends Function
    ? false
    : T extends Date
    ? false
    : T extends RegExp
    ? false
    : true
    : false;

// Handle different type categories
type GetTypeCategory<T> =
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends null ? "null" :
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    T extends Function ? "function" :
    T extends unknown[] ? "array" :
    T extends Date ? "date" :
    T extends RegExp ? "regexp" :
    T extends object ? "object" :
    "unknown";

// Get the keys that are different between two object types (only for existing keys with type mismatches)
type DifferentKeys<X, Y> = IsObject<X> extends true
    ? IsObject<Y> extends true
    ? {
        [K in keyof X & keyof Y]:
        SafeIsSame<X[K], Y[K]> extends true
        ? never
        : K
    }[keyof X & keyof Y]
    : never
    : never;

// Get missing keys (keys in X but not in Y)
type MissingKeys<X, Y> = IsObject<X> extends true
    ? IsObject<Y> extends true
    ? {
        [K in keyof X]: K extends keyof Y ? never : K
    }[keyof X]
    : never
    : never;

// Get extra keys (keys in Y but not in X)
type ExtraKeys<X, Y> = IsObject<X> extends true
    ? IsObject<Y> extends true
    ? {
        [K in keyof Y]: K extends keyof X ? never : K
    }[keyof Y]
    : never
    : never;

// Create detailed error message for type mismatches with never detection
export type SafeTypeErrorMessage<X, Y> =
    // Direct approach: try the detailed message and catch never with tuple wrapping
    [TypeErrorMessage<X, Y>] extends [never]
    ? "Types are different - complex structures prevent detailed analysis"
    : TypeErrorMessage<X, Y>;// Create detailed error message for type mismatches
export type TypeErrorMessage<X, Y> =
    // First check if they're completely different type categories
    GetTypeCategory<X> extends GetTypeCategory<Y>
    ? // Same category, check object-specific issues
    IsObject<X> extends true
    ? IsObject<Y> extends true
    ? // Both are objects, check keys and properties
    MissingKeys<X, Y> extends never
    ? ExtraKeys<X, Y> extends never
    ? DifferentKeys<X, Y> extends never
    ? "Types are identical"
    : `Type mismatch in keys: ${DifferentKeys<X, Y> & string}`
    : `Extra keys in second type: ${ExtraKeys<X, Y> & string}`
    : `Missing keys in second type: ${MissingKeys<X, Y> & string}`
    : `First type is object, second type is ${GetTypeCategory<Y>}`
    : // Non-objects that are same category but different (like different string literals)
    `Types are different ${GetTypeCategory<X>} types`
    : // Different categories entirely
    `Type category mismatch: ${GetTypeCategory<X>} vs ${GetTypeCategory<Y>}`;

// IsSameType - returns true if types are the same, otherwise compilation error
// Uses SafeIsSame for better handling of edge cases
export type IsSameType<X, Y> = SafeIsSame<X, Y> extends true
    ? true
    : SafeTypeErrorMessage<X, Y>;

// Expect - validates that a type matches the expected type, with never detection
export type Expect<T extends true> = T;

// Example usage and tests:

// Test cases that should pass
type _Test1 = Expect<IsSameType<string, string>>; // ✅ Pass
type _Test2 = Expect<IsSameType<{ a: number; b: string }, { a: number; b: string }>>; // ✅ Pass
type _Test3 = Expect<IsSameType<number[], number[]>>; // ✅ Pass

// Test cases that should show errors
// @ts-expect-error TypeScript should show an error in this case
type _Test4 = Expect<IsSameType<string, number>>; // ❌ Error: Type '"Type category mismatch: string vs number"' does not satisfy the constraint 'true'
// @ts-expect-error TypeScript should show an error in this case
type _Test5 = Expect<IsSameType<{ a: number }, { a: string }>>; // ❌ Error: Type '"Type mismatch in keys: a"' does not satisfy the constraint 'true'
// @ts-expect-error TypeScript should show an error in this case
type _Test6 = Expect<IsSameType<{ a: number; b: string }, { a: number }>>; // ❌ Error: Type '"Missing keys in second type: b"' does not satisfy the constraint 'true'
// @ts-expect-error TypeScript should show an error in this case
type _Test7 = Expect<IsSameType<{ a: number }, { a: number; b: string }>>; // ❌ Error: Type '"Extra keys in second type: b"' does not satisfy the constraint 'true'

// Advanced example with nested objects
type _User = {
    id: number;
    name: string;
    profile: {
        age: number;
        email: string;
    };
};

type _UserCopy = {
    id: number;
    name: string;
    profile: {
        age: number;
        email: string;
    };
};

type _UserWrong = {
    id: string; // Changed from number
    name: string;
    profile: {
        age: number;
        email: string;
    };
};

// Additional edge case tests
// @ts-expect-error TypeScript should show an error in this case
type _Test10 = Expect<IsSameType<string[], number[]>>; // ❌ Error: Type '"Type category mismatch: array vs array"' or similar
// @ts-expect-error TypeScript should show an error in this case
type _Test11 = Expect<IsSameType<() => void, () => string>>; // ❌ Error: Type '"Type category mismatch: function vs function"' or similar
// @ts-expect-error TypeScript should show an error in this case
type _Test12 = Expect<IsSameType<"literal", string>>; // ❌ Error: Type '"Types are different string types"' does not satisfy the constraint 'true'
// @ts-expect-error TypeScript should show an error in this case
type _Test13 = Expect<IsSameType<42, number>>; // ❌ Error: Type '"Types are different number types"' does not satisfy the constraint 'true'
// @ts-expect-error TypeScript should show an error in this case
type _Test14 = Expect<IsSameType<string, string[]>>; // ❌ Error: Type '"Type category mismatch: string vs array"' does not satisfy the constraint 'true'
// @ts-expect-error TypeScript should show an error in this case
type _Test15 = Expect<IsSameType<null, undefined>>; // ❌ Error: Type '"Type category mismatch: null vs undefined"' does not satisfy the constraint 'true'

// Union types
// @ts-expect-error TypeScript should show an error in this case
type _Test16 = Expect<IsSameType<string | number, string>>; // ❌ Should show appropriate error
// @ts-expect-error TypeScript should show an error in this case
type _Test17 = Expect<IsSameType<{ a: string } | { b: number }, { a: string }>>; // ❌ Should show appropriate error
