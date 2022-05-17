import { shopify } from '..'

export interface Section {
    name: string
    settings?: Setting[]
    blocks?: Block[]
    max_blocks?: number
    presets?: Array<{
        name: string
        settings?: Record<string, shopify.Setting>
        blocks?: shopify.Block[]
    }>
    default?: Pick<shopify.Section, 'settings' | 'blocks'>
    templates?: string[]
}

export interface Block {
    type: string
    name: string
    limit?: number
    settings?: Setting[]
}

export function isInputSetting(value: Setting): value is InputSetting {
    return value.type != 'header' && value.type != 'paragraph'
}

export type Config = Array<{
    /** The name of the category of settings. */
    name: string
    /** An array of associated {@link Setting settings}. */
    settings: Setting[]
}>

export type Setting = SidebarSetting | InputSetting
interface SidebarSetting {
    type: 'header' | 'paragraph'
    content: string
    id?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}
// prettier-ignore
export type InputSetting = CheckboxSetting | NumberSetting | RadioSetting | RangeSetting | SelectSetting | TextSetting | TextareaSetting | ArticleSetting | BlogSetting | CollectionSetting | CollectionListSetting | ColorSetting | ColorBackgroundSetting | FontPickerSetting | HtmlSetting | ImagePickerSetting | LinkListSetting | LiquidSetting | PageSetting | ProductSetting | ProductListSetting | RichtextSetting | UrlSetting | VideoUrlSetting
interface InputSettingBase {
    type: string
    id: string
    label: string
    default?: unknown
    info?: string
}
interface CheckboxSetting extends InputSettingBase {
    type: 'checkbox'
    default?: boolean
}
interface NumberSetting extends InputSettingBase {
    type: 'number'
    default?: number
}
interface RadioSetting extends InputSettingBase {
    type: 'radio'
    options: Array<{
        value: string
        label: string
    }>
    default?: RadioSetting['options'][number]['label']
}
interface RangeSetting extends InputSettingBase {
    type: 'range'
    min: number
    max: number
    step: number
    unit?: string
    default?: number
}
interface SelectSetting extends InputSettingBase {
    type: 'select'
    options: Array<{
        value: string
        label: string
    }>
    default?: RadioSetting['options'][number]['label']
}
interface TextSetting extends InputSettingBase {
    type: 'text'
    placeholder?: string
    default?: string
}
interface TextareaSetting extends InputSettingBase {
    type: 'textarea'
    placeholder?: string
    default?: string
}
interface ArticleSetting extends InputSettingBase {
    type: 'article'
    default?: string
}
interface BlogSetting extends InputSettingBase {
    type: 'blog'
    default?: string
}
interface CollectionSetting extends InputSettingBase {
    type: 'collection'
    default?: string
}
interface CollectionListSetting extends InputSettingBase {
    type: 'collection_list'
    limit?: number
    default?: string
}
interface ColorSetting extends InputSettingBase {
    type: 'color'
    default?: string
}
interface ColorBackgroundSetting extends InputSettingBase {
    type: 'color_background'
    default?: string
}
interface FontPickerSetting extends InputSettingBase {
    type: 'font_picker'
    default?: string
}
interface HtmlSetting extends InputSettingBase {
    type: 'html'
    placeholder?: 'string'
    default?: string
}
interface ImagePickerSetting extends InputSettingBase {
    type: 'image_picker'
    default?: string
}
interface LinkListSetting extends InputSettingBase {
    type: 'link_list'
    default?: string
}
interface LiquidSetting extends InputSettingBase {
    type: 'liquid'
    default?: string
}
interface PageSetting extends InputSettingBase {
    type: 'page'
    default?: string
}
interface ProductSetting extends InputSettingBase {
    type: 'product'
    default?: string
}
interface ProductListSetting extends InputSettingBase {
    type: 'product_list'
    limit?: number
    default?: string
}
interface RichtextSetting extends InputSettingBase {
    type: 'richtext'
    default?: string
}
interface UrlSetting extends InputSettingBase {
    type: 'url'
    default?: string
}
interface VideoUrlSetting extends InputSettingBase {
    type: 'video_url'
    accept: Array<'youtube' | 'vimeo'>
    placeholder?: string
    default?: string
}
