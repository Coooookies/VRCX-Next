import { ConsoleStyle } from './constants'

export class MixedStyle {
  constructor(
    public style: ConsoleStyle[] | ConsoleStyle,
    public content: string
  ) {}

  public get t(): string {
    return `${Array.isArray(this.style) ? this.style.join('') : this.style}${this.content}${ConsoleStyle.RESET}`
  }

  public get raw(): string {
    return this.content
  }
}

export function mixed(style: ConsoleStyle[] | ConsoleStyle, content: string): MixedStyle {
  return new MixedStyle(style, content)
}
