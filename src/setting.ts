import type { JSONSchema7 } from 'json-schema'

export function createSettingSchema(setting: InputSetting): JSONSchema7 {
    if (setting.type == 'checkbox') return { type: 'boolean' }
    else if (setting.type == 'number') return { type: 'number' }
    else if (setting.type == 'radio' || setting.type == 'select')
        return { type: 'string', enum: setting.options.map(obj => obj.value) }
    else if (setting.type == 'range')
        return {
            type: 'number',
            minimum: setting.min,
            maximum: setting.max,
            multipleOf: setting.step,
        }
    else return { type: 'string' }
}

export function isInputSetting(setting: Setting): setting is InputSetting {
    return setting.type != 'header' && setting.type != 'paragraph'
}

export type Setting = SidebarSetting | InputSetting

// prettier-ignore
export type InputSetting =  | CheckboxSetting | NumberSetting | RadioSetting | RangeSetting | SelectSetting | TextSetting | TextareaSetting | ArticleSetting | BlogSetting | CollectionSetting | CollectionListSetting | ColorSetting | ColorBackgroundSetting | FontPickerSetting | HtmlSetting | ImagePickerSetting | LinkListSetting | LiquidSetting | PageSetting | ProductSetting | ProductListSetting | RichtextSetting | UrlSetting | VideoUrlSetting

interface StandardInputSetting {
    type: string
    id: string
    label: string
    default?: unknown
    info?: string
}

interface CheckboxSetting extends StandardInputSetting {
    type: 'checkbox'
    default?: boolean
}
interface NumberSetting extends StandardInputSetting {
    type: 'number'
    default?: number
}
interface RadioSetting extends StandardInputSetting {
    type: 'radio'
    options: Array<{
        value: string
        label: string
    }>
    default?: RadioSetting['options'][number]['label']
}
interface RangeSetting extends StandardInputSetting {
    type: 'range'
    min: number
    max: number
    step: number
    unit?: string
    default?: number
}
interface SelectSetting extends StandardInputSetting {
    type: 'select'
    options: Array<{
        value: string
        label: string
    }>
    default?: RadioSetting['options'][number]['label']
}
interface TextSetting extends StandardInputSetting {
    type: 'text'
    placeholder?: string
    default?: string
}
interface TextareaSetting extends StandardInputSetting {
    type: 'textarea'
    placeholder?: string
    default?: string
}

interface ArticleSetting extends StandardInputSetting {
    type: 'article'
    default?: string
}
interface BlogSetting extends StandardInputSetting {
    type: 'blog'
    default?: string
}
interface CollectionSetting extends StandardInputSetting {
    type: 'collection'
    default?: string
}
interface CollectionListSetting extends StandardInputSetting {
    type: 'collection_list'
    limit?: number
    default?: string
}
interface ColorSetting extends StandardInputSetting {
    type: 'color'
    default?: string
}
interface ColorBackgroundSetting extends StandardInputSetting {
    type: 'color_background'
    default?: string
}
interface FontPickerSetting extends StandardInputSetting {
    type: 'font_picker'
    default?: string
}
interface HtmlSetting extends StandardInputSetting {
    type: 'html'
    placeholder?: 'string'
    default?: string
}
interface ImagePickerSetting extends StandardInputSetting {
    type: 'image_picker'
    default?: string
}
interface LinkListSetting extends StandardInputSetting {
    type: 'link_list'
    default?: string
}
interface LiquidSetting extends StandardInputSetting {
    type: 'liquid'
    default?: string
}
interface PageSetting extends StandardInputSetting {
    type: 'page'
    default?: string
}
interface ProductSetting extends StandardInputSetting {
    type: 'product'
    default?: string
}
interface ProductListSetting extends StandardInputSetting {
    type: 'product_list'
    limit?: number
    default?: string
}
interface RichtextSetting extends StandardInputSetting {
    type: 'richtext'
    default?: string
}
interface UrlSetting extends StandardInputSetting {
    type: 'url'
    default?: string
}
interface VideoUrlSetting extends StandardInputSetting {
    type: 'video_url'
    accept: Array<'youtube' | 'vimeo'>
    placeholder?: string
    default?: string
}

export interface SidebarSetting {
    type: 'header' | 'paragraph'
    content: string
    id?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}
