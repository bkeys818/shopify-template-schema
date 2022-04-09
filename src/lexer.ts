import type { shopify } from '.'

const schemaRegExp = /{%(-?) schema \1%}([\s\S]+?){%\1 endschema \1%}/g

export default function lexer(
    value: string
): shopify.SectionSchema | undefined {
    const str = Array.from(value.matchAll(schemaRegExp)).pop()?.at(2)
    if (str) return JSON.parse(str)
}
