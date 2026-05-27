import { useState, useEffect } from 'react'
import { Moon, Sun, Bell, Key, Shield, Palette, Globe, Save } from 'lucide-react'

interface AppSettings {
  theme: 'dark' | 'light' | 'system'
  accentColor: string
  notifications: boolean
  soundEnabled: boolean
  autoSave: boolean
  language: string
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  accentColor: 'teal',
  notifications: true,
  soundEnabled: true,
  autoSave: true,
  language: 'en',
}

const ACCENT_COLORS = [
  { id: 'teal', label: 'Teal', class: 'bg-njz-accent-teal' },
  { id: 'purple', label: 'Purple', class: 'bg-njz-accent-purple' },
  { id: 'blue', label: 'Blue', class: 'bg-njz-accent-blue' },
  { id: 'orange', label: 'Orange', class: 'bg-njz-accent-orange' },
  { id: 'green', label: 'Green', class: 'bg-njz-accent-green' },
  { id: 'red', label: 'Red', class: 'bg-njz-accent-red' },
]

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem('sitegeiste-settings')
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS
}

function saveSettings(settings: AppSettings) {
  localStorage.setItem('sitegeiste-settings', JSON.stringify(settings))
}

export function SettingsModule() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    saveSettings(settings)
    setSaved(true)
    const t = setTimeout(() => setSaved(false), 1500)
    return () => clearTimeout(t)
  }, [settings])

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="h-full overflow-y-auto space-y-6">
      {/* Appearance */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-njz-text flex items-center gap-2">
          <Palette className="w-5 h-5 text-njz-accent-purple" />
          Appearance
        </h3>

        {/* Theme */}
        <div className="glass-panel p-4 rounded-lg space-y-3">
          <label className="text-sm font-medium text-njz-text">Theme</label>
          <div className="flex gap-2">
            {(['dark', 'light', 'system'] as const).map(t => (
              <button
                key={t}
                onClick={() => update('theme', t)}
                className={`flex-1 p-2 rounded-lg border text-sm capitalize transition-colors ${
                  settings.theme === t
                    ? 'border-njz-accent-teal bg-njz-accent-teal/10 text-njz-accent-teal'
                    : 'border-njz-border text-njz-text-muted hover:text-njz-text'
                }`}
              >
                {t === 'dark' && <Moon className="w-4 h-4 mx-auto mb-1" />}
                {t === 'light' && <Sun className="w-4 h-4 mx-auto mb-1" />}
                {t === 'system' && <Globe className="w-4 h-4 mx-auto mb-1" />}
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div className="glass-panel p-4 rounded-lg space-y-3">
          <label className="text-sm font-medium text-njz-text">Accent Color</label>
          <div className="flex gap-3">
            {ACCENT_COLORS.map(c => (
              <button
                key={c.id}
                onClick={() => update('accentColor', c.id)}
                className={`w-10 h-10 rounded-full ${c.class} transition-transform ${
                  settings.accentColor === c.id ? 'ring-2 ring-njz-text scale-110' : 'hover:scale-105'
                }`}
                title={c.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-njz-text flex items-center gap-2">
          <Bell className="w-5 h-5 text-njz-accent-blue" />
          Notifications
        </h3>

        <div className="glass-panel p-4 rounded-lg space-y-4">
          <ToggleSetting
            label="Enable Notifications"
            description="Receive alerts for focus sessions, deadlines, and updates"
            enabled={settings.notifications}
            onChange={v => update('notifications', v)}
          />
          <ToggleSetting
            label="Sound Effects"
            description="Play sounds for timer completion and actions"
            enabled={settings.soundEnabled}
            onChange={v => update('soundEnabled', v)}
          />
        </div>
      </section>

      {/* Data */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-njz-text flex items-center gap-2">
          <Shield className="w-5 h-5 text-njz-accent-red" />
          Data & Privacy
        </h3>

        <div className="glass-panel p-4 rounded-lg space-y-4">
          <ToggleSetting
            label="Auto-save"
            description="Automatically save your work every 30 seconds"
            enabled={settings.autoSave}
            onChange={v => update('autoSave', v)}
          />

          <div className="pt-2 border-t border-njz-border">
            <button
              onClick={() => {
                if (confirm('Clear all local data? This cannot be undone.')) {
                  localStorage.clear()
                  setSettings(DEFAULT_SETTINGS)
                }
              }}
              className="text-sm text-njz-accent-red hover:underline"
            >
              Clear All Local Data
            </button>
          </div>
        </div>
      </section>

      {/* API Keys */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-njz-text flex items-center gap-2">
          <Key className="w-5 h-5 text-njz-accent-orange" />
          API Keys
        </h3>

        <div className="glass-panel p-4 rounded-lg space-y-3">
          <p className="text-sm text-njz-text-muted">
            API keys are stored locally in your browser. They are never sent to our servers.
          </p>
          <div className="space-y-2">
            <ApiKeyInput label="OpenAI" storageKey="api-key-openai" />
            <ApiKeyInput label="Anthropic" storageKey="api-key-anthropic" />
            <ApiKeyInput label="NJZ API" storageKey="api-key-njz" />
          </div>
        </div>
      </section>

      {/* Save indicator */}
      {saved && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-njz-accent-green/20 text-njz-accent-green text-sm">
          <Save className="w-4 h-4" />
          Settings saved
        </div>
      )}
    </div>
  )
}

function ToggleSetting({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string
  description: string
  enabled: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-njz-text">{label}</p>
        <p className="text-xs text-njz-text-muted">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          enabled ? 'bg-njz-accent-teal' : 'bg-njz-border'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-njz-bg transition-transform ${
            enabled ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  )
}

function ApiKeyInput({ label, storageKey }: { label: string; storageKey: string }) {
  const [value, setValue] = useState(() => {
    try { return localStorage.getItem(storageKey) || '' } catch { return '' }
  })
  const [show, setShow] = useState(false)

  const handleChange = (v: string) => {
    setValue(v)
    if (v) localStorage.setItem(storageKey, v)
    else localStorage.removeItem(storageKey)
  }

  return (
    <div className="space-y-1">
      <label className="text-sm text-njz-text-muted">{label}</label>
      <div className="flex gap-2">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => handleChange(e.target.value)}
          placeholder="sk-..."
          className="flex-1 bg-njz-bg-overlay border border-njz-border rounded px-3 py-2 text-sm text-njz-text placeholder-njz-text-subtle focus:outline-none focus:border-njz-accent-teal"
        />
        <button
          onClick={() => setShow(!show)}
          className="px-3 py-2 rounded border border-njz-border text-xs text-njz-text-muted hover:text-njz-text"
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  )
}
