import type { JSONSchema7 } from 'json-schema'

export function createSettingSchema(setting: Setting): JSONSchema7 | undefined {
    if (setting.type == 'header' || setting.type == 'paragraph') return
    else if (setting.type == 'checkbox') return { type: 'boolean' }
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
    // else if (
    //     settings.type == 'text' ||
    //     settings.type == 'textarea' ||
    //     settings.type == 'article' ||
    //     settings.type == 'blog' ||
    //     settings.type == 'collection' ||
    //     settings.type == 'collection_list' ||
    //     settings.type == 'color' ||
    //     settings.type == 'color_background' ||
    //     settings.type == 'font_picker' ||
    //     settings.type == 'html' ||
    //     settings.type == 'image_picker' ||
    //     settings.type == 'link_list' ||
    //     settings.type == 'liquid' ||
    //     settings.type == 'page' ||
    //     settings.type == 'product' ||
    //     settings.type == 'product_list' ||
    //     settings.type == 'richtext' ||
    //     settings.type == 'url' ||
    //     settings.type == 'video_url'
    // )
}

export type Setting = SidebarSettings | InputSetting

export interface SidebarSettings {
    type: 'header' | 'paragraph'
    content: string
    id?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

// prettier-ignore
export type InputSetting =  | CheckboxSettings | NumberSettings | RadioSettings | RangeSettings | SelectSettings | TextSettings | TextareaSettings | ArticleSettings | BlogSettings | CollectionSettings | CollectionListSettings | ColorSettings | ColorBackgroundSettings | FontPickerSettings | HtmlSettings | ImagePickerSettings | LinkListSettings | LiquidSettings | PageSettings | ProductSettings | ProductListSettings | RichtextSettings | UrlSettings | VideoUrlSettings

// prettier-ignore
type InputType = 'checkbox' | 'number' | 'radio' | 'range' | 'select' | 'text' | 'textarea' | 'article' | 'blog' | 'collection' | 'collection_list' | 'color' | 'color_background' | 'font_picker' | 'html' | 'image_picker' | 'link_list' | 'liquid' | 'page' | 'product' | 'product_list' | 'richtext' | 'url' | 'video_url'

interface StandardInputSettings {
    type: InputType
    id: string
    label: string
    default?: unknown
    info?: string
}

interface CheckboxSettings extends StandardInputSettings {
    type: 'checkbox'
    default?: boolean
}
interface NumberSettings extends StandardInputSettings {
    type: 'number'
    default?: number
}
interface RadioSettings extends StandardInputSettings {
    type: 'radio'
    options: Array<{
        value: string
        label: string
    }>
    default?: RadioSettings['options'][number]['label']
}
interface RangeSettings extends StandardInputSettings {
    type: 'range'
    min: number
    max: number
    step: number
    unit?: string
    default?: number
}
interface SelectSettings extends StandardInputSettings {
    type: 'select'
    options: Array<{
        value: string
        label: string
    }>
    default?: RadioSettings['options'][number]['label']
}
interface TextSettings extends StandardInputSettings {
    type: 'text'
    placeholder?: string
    default?: string
}
interface TextareaSettings extends StandardInputSettings {
    type: 'textarea'
    placeholder?: string
    default?: string
}

interface ArticleSettings extends StandardInputSettings {
    type: 'article'
    default?: string
}
interface BlogSettings extends StandardInputSettings {
    type: 'blog'
    default?: string
}
interface CollectionSettings extends StandardInputSettings {
    type: 'collection'
    default?: string
}
interface CollectionListSettings extends StandardInputSettings {
    type: 'collection_list'
    limit?: number
    default?: string
}
interface ColorSettings extends StandardInputSettings {
    type: 'color'
    default?: string
}
interface ColorBackgroundSettings extends StandardInputSettings {
    type: 'color_background'
    default?: string
}
interface FontPickerSettings extends StandardInputSettings {
    type: 'font_picker'
    default?: string
}
interface HtmlSettings extends StandardInputSettings {
    type: 'html'
    placeholder?: 'string'
    default?: string
}
interface ImagePickerSettings extends StandardInputSettings {
    type: 'image_picker'
    default?: string
}
interface LinkListSettings extends StandardInputSettings {
    type: 'link_list'
    default?: string
}
interface LiquidSettings extends StandardInputSettings {
    type: 'liquid'
    default?: string
}
interface PageSettings extends StandardInputSettings {
    type: 'page'
    default?: string
}
interface ProductSettings extends StandardInputSettings {
    type: 'product'
    default?: string
}
interface ProductListSettings extends StandardInputSettings {
    type: 'product_list'
    limit?: number
    default?: string
}
interface RichtextSettings extends StandardInputSettings {
    type: 'richtext'
    default?: string
}
interface UrlSettings extends StandardInputSettings {
    type: 'url'
    default?: string
}
interface VideoUrlSettings extends StandardInputSettings {
    type: 'video_url'
    accept: Array<'youtube' | 'vimeo'>
    placeholder?: string
    default?: string
}
