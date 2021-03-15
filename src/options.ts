import type { Reviver } from './doc/applyReviver.js'
import type { Directives } from './doc/directives.js'
import type { Replacer } from './doc/Document.js'
import type { SchemaName } from './schema/Schema.js'
import type { LogLevelId } from './log.js'
import type { Pair } from './nodes/Pair.js'
import type { Scalar } from './nodes/Scalar.js'
import type { LineCounter } from './parse/line-counter.js'
import type { CollectionTag, ScalarTag, TagValue } from './schema/types.js'

export type ParseOptions = {
  /**
   * Whether integers should be parsed into BigInt rather than number values.
   *
   * Default: `false`
   *
   * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/BigInt
   */
  intAsBigInt?: boolean

  /**
   * If set, newlines will be tracked, to allow for `lineCounter.linePos(offset)`
   * to provide the `{ line, col }` positions within the input.
   */
  lineCounter?: LineCounter

  /**
   * Include line/col position & node type directly in parse errors.
   *
   * Default: `true`
   */
  prettyErrors?: boolean

  /**
   * Detect and report errors that are required by the YAML 1.2 spec,
   * but are caused by unambiguous content.
   *
   * Default: `true`
   */
  strict?: boolean
}

export type DocumentOptions = {
  /**
   * Default prefix for anchors.
   *
   * Default: `'a'`, resulting in anchors `a1`, `a2`, etc.
   */
  anchorPrefix?: string

  /**
   * Used internally by Composer. If set and includes an explicit version,
   * that overrides the `version` option.
   */
  directives?: Directives

  /**
   * Keep `undefined` object values when creating mappings and return a Scalar
   * node when calling `YAML.stringify(undefined)`, rather than `undefined`.
   *
   * Default: `false`
   */
  keepUndefined?: boolean

  /**
   * Control the logging level during parsing
   *
   * Default: `'warn'`
   */
  logLevel?: LogLevelId

  /**
   * The YAML version used by documents without a `%YAML` directive.
   *
   * Default: `"1.2"`
   */
  version?: '1.1' | '1.2'
}

export type SchemaOptions = {
  /**
   * Array of additional tags to include in the schema, or a function that may
   * modify the schema's base tag array.
   */
  customTags?: TagValue[] | ((tags: TagValue[]) => TagValue[]) | null

  /**
   * Enable support for `<<` merge keys.
   *
   * Default: `false` for YAML 1.2, `true` for earlier versions
   */
  merge?: boolean

  /**
   * When using the `'core'` schema, support parsing values with these
   * explicit YAML 1.1 tags:
   *
   * `!!binary`, `!!omap`, `!!pairs`, `!!set`, `!!timestamp`.
   *
   * Default `true`
   */
  resolveKnownTags?: boolean

  /**
   * The base schema to use.
   *
   * Default: `"core"` for YAML 1.2, `"yaml-1.1"` for earlier versions
   */
  schema?: SchemaName

  /**
   * When adding to or stringifying a map, sort the entries.
   * If `true`, sort by comparing key values with `<`.
   *
   * Default: `false`
   */
  sortMapEntries?: boolean | ((a: Pair, b: Pair) => number)
}

export type CreateNodeOptions = {
  /** Force the top-level collection node to use flow style. */
  flow?: boolean

  /**
   * Keep `undefined` object values when creating mappings, rather than
   * discarding them.
   *
   * Default: `false`
   */
  keepUndefined?: boolean | null

  onTagObj?: (tagObj: ScalarTag | CollectionTag) => void

  /**
   * Filter or modify values while creating a node.
   *
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_replacer_parameter
   */
  replacer?: Replacer

  /**
   * Specify the collection type, e.g. `"!!omap"`. Note that this requires the
   * corresponding tag to be available in this document's schema.
   */
  tag?: string
}

export type ToJSOptions = {
  /**
   * Use Map rather than Object to represent mappings.
   *
   * Default: `false`
   */
  mapAsMap?: boolean

  /**
   * Prevent exponential entity expansion attacks by limiting data aliasing count;
   * set to `-1` to disable checks; `0` disallows all alias nodes.
   *
   * Default: `100`
   */
  maxAliasCount?: number

  /**
   * If defined, called with the resolved `value` and reference `count` for
   * each anchor in the document.
   */
  onAnchor?: (value: unknown, count: number) => void

  /**
   * Optional function that may filter or modify the output JS value
   *
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#using_the_reviver_parameter
   */
  reviver?: Reviver
}

export type ToStringOptions = {
  /**
   * The default type of string literal used to stringify implicit key values.
   * Output may use other types if required to fully represent the value.
   *
   * If `null`, the value of `defaultStringType` is used.
   *
   * Default: `null`
   */
  defaultKeyType?: Scalar.Type | null

  /**
   * The default type of string literal used to stringify values in general.
   * Output may use other types if required to fully represent the value.
   *
   * Default: `'PLAIN'`
   */
  defaultStringType?: Scalar.Type

  /**
   * Include directives in the output.
   *
   * - If `true`, at least the document-start marker `---` is always included.
   *   This does not force the `%YAML` directive to be included. To do that,
   *   set `doc.directives.yaml.explicit = true`.
   * - If `false`, no directives or marker is ever included. If using the `%TAG`
   *   directive, you are expected to include it manually in the stream before
   *   its use.
   * - If `null`, directives and marker may be included if required.
   *
   * Default: `null`
   */
  directives?: boolean | null

  /**
   * Restrict double-quoted strings to use JSON-compatible syntax.
   *
   * Default: `false`
   */
  doubleQuotedAsJSON?: boolean

  /**
   * Minimum length for double-quoted strings to use multiple lines to
   * represent the value. Ignored if `doubleQuotedAsJSON` is set.
   *
   * Default: `40`
   */
  doubleQuotedMinMultiLineLength?: number

  /**
   * String representation for `false`.
   * With the core schema, use `'false'`, `'False'`, or `'FALSE'`.
   *
   * Default: `'false'`
   */
  falseStr?: string

  /**
   * The number of spaces to use when indenting code.
   *
   * Default: `2`
   */
  indent?: number

  /**
   * Whether block sequences should be indented.
   *
   * Default: `true`
   */
  indentSeq?: boolean

  /**
   * Maximum line width (set to `0` to disable folding).
   *
   * This is a soft limit, as only double-quoted semantics allow for inserting
   * a line break in the middle of a word, as well as being influenced by the
   * `minContentWidth` option.
   *
   * Default: `80`
   */
  lineWidth?: number

  /**
   * Minimum line width for highly-indented content (set to `0` to disable).
   *
   * Default: `20`
   */
  minContentWidth?: number

  /**
   * String representation for `null`.
   * With the core schema, use `'null'`, `'Null'`, `'NULL'`, `'~'`, or an empty
   * string `''`.
   *
   * Default: `'null'`
   */
  nullStr?: string

  /**
   * Require keys to be scalars and to use implicit rather than explicit notation.
   *
   * Default: `false`
   */
  simpleKeys?: boolean

  /**
   * Prefer 'single quote' rather than "double quote" where applicable.
   *
   * Default: `false`
   */
  singleQuote?: boolean

  /**
   * String representation for `true`.
   * With the core schema, use `'true'`, `'True'`, or `'TRUE'`.
   *
   * Default: `'true'`
   */
  trueStr?: string
}

export type Options = ParseOptions & DocumentOptions & SchemaOptions

/**
 * `yaml` defines document-specific options in three places: as an argument of
 * parse, create and stringify calls, in the values of `YAML.defaultOptions`,
 * and in the version-dependent `YAML.Document.defaults` object. Values set in
 * `YAML.defaultOptions` override version-dependent defaults, and argument
 * options override both.
 */
export const defaultOptions: Required<
  Omit<ParseOptions, 'lineCounter'> & Omit<DocumentOptions, 'directives'>
> = {
  anchorPrefix: 'a',
  intAsBigInt: false,
  keepUndefined: false,
  logLevel: 'warn',
  prettyErrors: true,
  strict: true,
  version: '1.2'
}