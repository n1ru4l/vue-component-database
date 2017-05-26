
export const SETTING_IS_SIDEBAR_ACTIVE = `SETTING_IS_SIDEBAR_ACTIVE`
export const SETTING_IS_AUTO_UPDATE_ENABLED = `SETTING_IS_AUTO_UPDATE_ENABLED`
export const SETTING_IS_EDITOR_VISIBLE = `SETTING_IS_EDITOR_VISIBLE`
export const SETTING_IS_AUTO_SAVE_ENABLED = `SETTING_IS_AUTO_SAVE_ENABLED`

export default {
  getBoolean: (settingKey, defaultValue) => {
    const value = localStorage.getItem(settingKey)
    if (value == null) return defaultValue
    return value === `1`
  },
  setBoolean: (settingKey, value) => localStorage.setItem(settingKey, value ? `1` : `0`),
}
