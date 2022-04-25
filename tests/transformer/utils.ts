import { shopify } from '../../src'

export function baseSettingFor<T extends shopify.schema.Setting['type']>(
    type: T
) {
    return {
        type,
        id: type + '-setting',
        label: type + '-setting',
    }
}

export function basicBlock(type: string): shopify.schema.Block {
    return { type, name: type + ' block' }
}

export const blockShopifySchema = basicBlock('example')
export const settingShopifySchema: shopify.schema.Setting =
    baseSettingFor('number')

export const section = {
    type: 'example-section',
    fileName: 'example-section.liquid',
    shopifySchema: { name: 'Section Example' },
}
