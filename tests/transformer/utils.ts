import { shopify } from '../../src'

export function baseSettingFor<T extends shopify.Setting['type']>(type: T) {
    return {
        type,
        id: type + '-setting',
        label: type + '-setting',
    }
}

export function basicBlock(type: string): shopify.BlockSchema {
    return { type, name: type + ' block' }
}

export const blockShopifySchema = basicBlock('example')
export const settingShopifySchema: shopify.Setting = baseSettingFor('number')

export const section = {
    type: 'example-section',
    fileName: 'example-section.liquid',
    shopifySchema: { name: 'Section Example' },
}
