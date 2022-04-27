export * as schema from './schema'

export interface Template {
    name?: string
    layout?: string | false
    wrapper?: string
    sections: Record<string, Section>
    order: Record<string, string>
}

export interface Section {
    type: string
    disabled?: boolean
    settings?: Record<string, Setting>
    blocks?: Record<string, Block>
    block_order?: string[]
}

export interface Block {
    type: string
    settings?: Record<string, Setting>
}

export type Setting = boolean | number | string
