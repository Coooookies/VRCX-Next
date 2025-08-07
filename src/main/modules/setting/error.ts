export class SettingModuleError extends Error {
  constructor(
    public message: string,
    public error: unknown
  ) {
    super(message)
  }
}
