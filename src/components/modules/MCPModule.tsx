import { useState } from 'react'
import { Server, Plug, Zap, CheckCircle, XCircle, AlertTriangle, Settings, RefreshCw, Terminal, Activity, Database, Code, Copy, Check, ChevronDown, ChevronRight } from 'lucide-react'

interface McpEndpoint {
  id: string
  name: string
  url: string
  status: 'connected' | 'disconnected' | 'error' | 'unknown'
  lastPing: string | null
  latency: number | null
  type: 'ratos' | 'external' | 'local'
}

interface McpLog {
  id: string
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'success'
  message: string
  endpoint?: string
}

const DEFAULT_ENDPOINTS: McpEndpoint[] = [
  { id: 'ratos_core', name: 'RAT-OS Core API', url: 'https://api.ratos.njz.work/v1', status: 'unknown', lastPing: null, latency: null, type: 'ratos' },
  { id: 'ratos_auth', name: 'RAT-OS Auth Service', url: 'https://auth.ratos.njz.work/v1', status: 'unknown', lastPing: null, latency: null, type: 'ratos' },
  { id: 'ratos_data', name: 'RAT-OS Data Pipeline', url: 'https://data.ratos.njz.work/v1', status: 'unknown', lastPing: null, latency: null, type: 'ratos' },
  { id: 'external_kimi', name: 'Kimi API', url: 'https://api.moonshot.cn/v1', status: 'unknown', lastPing: null, latency: null, type: 'external' },
  { id: 'local_mcp', name: 'Local MCP Bridge', url: 'http://localhost:3001/mcp', status: 'unknown', lastPing: null, latency: null, type: 'local' }
]

export function MCPModule() {
  const [endpoints, setEndpoints] = useState<McpEndpoint[]>(() => {
    const stored = localStorage.getItem('sitegeiste_mcp_endpoints')
    return stored ? JSON.parse(stored) : DEFAULT_ENDPOINTS
  })
  const [logs, setLogs] = useState<McpLog[]>(() => {
    const stored = localStorage.getItem('sitegeiste_mcp_logs')
    return stored ? JSON.parse(stored) : []
  })
  const [activeTab, setActiveTab] = useState<'status' | 'config' | 'logs'>('status')
  const [checking, setChecking] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [config, setConfig] = useState({
    autoConnect: true,
    retryAttempts: 3,
    timeout: 5000,
    logLevel: 'info' as 'debug' | 'info' | 'warn' | 'error'
  })

  const saveEndpoints = (updated: McpEndpoint[]) => {
    setEndpoints(updated)
    localStorage.setItem('sitegeiste_mcp_endpoints', JSON.stringify(updated))
  }

  const addLog = (log: McpLog) => {
    const updated = [log, ...logs].slice(0, 100)
    setLogs(updated)
    localStorage.setItem('sitegeiste_mcp_logs', JSON.stringify(updated))
  }

  const checkEndpoint = async (endpoint: McpEndpoint): Promise<McpEndpoint> => {
    const start = performance.now()
    try {
      // Simulate ping - in real implementation would fetch endpoint.url + '/health'
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 200))
      const latency = Math.round(performance.now() - start)
      
      // Simulate random status for demo
      const statuses: Array<'connected' | 'disconnected' | 'error'> = ['connected', 'connected', 'connected', 'disconnected', 'error']
      const status = endpoint.type === 'local' ? 'disconnected' : statuses[Math.floor(Math.random() * statuses.length)]
      
      return {
        ...endpoint,
        status,
        lastPing: new Date().toISOString(),
        latency
      }
    } catch {
      const errorResult: McpEndpoint = {
        ...endpoint,
        status: 'error',
        lastPing: new Date().toISOString(),
        latency: null
      }
      return errorResult
    }
  }

  const runHealthCheck = async () => {
    setChecking(true)
    addLog({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Starting health check of all MCP endpoints...'
    })

    const updated = await Promise.all(endpoints.map(async ep => {
      const result = await checkEndpoint(ep)
      addLog({
        id: `log_${Date.now()}_${ep.id}`,
        timestamp: new Date().toISOString(),
        level: result.status === 'connected' ? 'success' : result.status === 'error' ? 'error' : 'warn',
        message: `${ep.name}: ${result.status}${result.latency ? ` (${result.latency}ms)` : ''}`,
        endpoint: ep.id
      })
      return result
    }))

    saveEndpoints(updated)
    addLog({
      id: `log_${Date.now()}_done`,
      timestamp: new Date().toISOString(),
      level: 'info',
      message: `Health check complete. ${updated.filter(e => e.status === 'connected').length}/${updated.length} endpoints connected.`
    })
    setChecking(false)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'disconnected': return <XCircle className="w-5 h-5 text-gray-400" />
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-400" />
      default: return <Activity className="w-5 h-5 text-njz-text-muted" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <span className="px-2 py-0.5 rounded text-xs bg-green-900/30 text-green-400 border border-green-800">Connected</span>
      case 'disconnected':
        return <span className="px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-400 border border-gray-700">Offline</span>
      case 'error':
        return <span className="px-2 py-0.5 rounded text-xs bg-red-900/30 text-red-400 border border-red-800">Error</span>
      default:
        return <span className="px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-400 border border-gray-700">Unknown</span>
    }
  }

  const getLogColor = (level: string) => {
    switch (level) {
      case 'success': return 'text-green-400'
      case 'error': return 'text-red-400'
      case 'warn': return 'text-yellow-400'
      case 'debug': return 'text-purple-400'
      default: return 'text-njz-text-muted'
    }
  }

  const connectedCount = endpoints.filter(e => e.status === 'connected').length
  const totalCount = endpoints.length

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-njz-accent-teal/20">
          <Server className="w-5 h-5 text-njz-accent-teal" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-njz-text">MCP Backend</h2>
          <p className="text-sm text-njz-text-muted">RAT-OS API connection & status</p>
        </div>
        <button
          onClick={runHealthCheck}
          disabled={checking}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-njz-accent-teal rounded-lg text-white text-xs font-medium disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
          {checking ? 'Checking...' : 'Health Check'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-njz-bg-overlay rounded-lg p-3 border border-njz-border">
          <div className="flex items-center gap-2 mb-1">
            <Plug className="w-4 h-4 text-green-400" />
            <span className="text-xs text-njz-text-muted">Connected</span>
          </div>
          <p className="text-xl font-bold text-green-400">{connectedCount}</p>
        </div>
        <div className="bg-njz-bg-overlay rounded-lg p-3 border border-njz-border">
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-4 h-4 text-njz-accent-purple" />
            <span className="text-xs text-njz-text-muted">Total</span>
          </div>
          <p className="text-xl font-bold text-njz-text">{totalCount}</p>
        </div>
        <div className="bg-njz-bg-overlay rounded-lg p-3 border border-njz-border">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-njz-text-muted">Avg Latency</span>
          </div>
          <p className="text-xl font-bold text-njz-text">
            {endpoints.filter(e => e.latency).length > 0
              ? `${Math.round(endpoints.filter(e => e.latency).reduce((sum, e) => sum + (e.latency || 0), 0) / endpoints.filter(e => e.latency).length)}ms`
              : '—'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-njz-bg-overlay rounded-lg p-1 w-fit">
        {(['status', 'config', 'logs'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === tab
                ? 'bg-njz-accent-teal/20 text-njz-accent-teal'
                : 'text-njz-text-muted hover:text-njz-text'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Status Tab */}
      {activeTab === 'status' && (
        <div className="space-y-2 flex-1 overflow-y-auto">
          {endpoints.map(endpoint => (
            <div key={endpoint.id} className="bg-njz-bg-overlay rounded-lg p-4 border border-njz-border">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getStatusIcon(endpoint.status)}
                  <div>
                    <h3 className="text-sm font-medium text-njz-text">{endpoint.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-[10px] bg-njz-bg px-1.5 py-0.5 rounded text-njz-text-muted">
                        {endpoint.url}
                      </code>
                      <button
                        onClick={() => copyToClipboard(endpoint.url, endpoint.id)}
                        className="text-njz-text-muted hover:text-njz-text"
                      >
                        {copied === endpoint.id ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-njz-text-muted">
                      <span className="capitalize">{endpoint.type}</span>
                      {endpoint.latency && (
                        <>
                          <span>•</span>
                          <span>{endpoint.latency}ms</span>
                        </>
                      )}
                      {endpoint.lastPing && (
                        <>
                          <span>•</span>
                          <span>Last ping: {new Date(endpoint.lastPing).toLocaleTimeString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getStatusBadge(endpoint.status)}
                  <button
                    onClick={() => {
                      const updated: McpEndpoint[] = endpoints.map(e =>
                        e.id === endpoint.id ? { ...e, status: 'unknown' as const, lastPing: null, latency: null } : e
                      )
                      saveEndpoints(updated)
                    }}
                    className="text-[10px] text-njz-text-muted hover:text-njz-accent-teal"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Config Tab */}
      {activeTab === 'config' && (
        <div className="space-y-4 flex-1 overflow-y-auto">
          <div className="bg-njz-bg-overlay rounded-lg p-4 border border-njz-border space-y-4">
            <h3 className="text-sm font-semibold text-njz-text flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Connection Settings
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-njz-text">Auto-connect on startup</p>
                  <p className="text-xs text-njz-text-muted">Automatically ping all endpoints when app loads</p>
                </div>
                <button
                  onClick={() => setConfig({ ...config, autoConnect: !config.autoConnect })}
                  className={`w-10 h-5 rounded-full transition-colors ${
                    config.autoConnect ? 'bg-njz-accent-teal' : 'bg-gray-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    config.autoConnect ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-njz-text">Retry attempts</p>
                  <p className="text-xs text-njz-text-muted">Number of retry attempts for failed connections</p>
                </div>
                <input
                  type="number"
                  value={config.retryAttempts}
                  onChange={e => setConfig({ ...config, retryAttempts: parseInt(e.target.value) || 0 })}
                  className="w-16 bg-njz-bg border border-njz-border rounded px-2 py-1 text-sm text-njz-text text-center"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-njz-text">Timeout (ms)</p>
                  <p className="text-xs text-njz-text-muted">Connection timeout in milliseconds</p>
                </div>
                <input
                  type="number"
                  value={config.timeout}
                  onChange={e => setConfig({ ...config, timeout: parseInt(e.target.value) || 1000 })}
                  className="w-20 bg-njz-bg border border-njz-border rounded px-2 py-1 text-sm text-njz-text text-center"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-njz-text">Log level</p>
                  <p className="text-xs text-njz-text-muted">Minimum log level to display</p>
                </div>
                <select
                  value={config.logLevel}
                  onChange={e => setConfig({ ...config, logLevel: e.target.value as any })}
                  className="bg-njz-bg border border-njz-border rounded px-3 py-1.5 text-sm text-njz-text"
                >
                  <option value="debug">Debug</option>
                  <option value="info">Info</option>
                  <option value="warn">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>
          </div>

          {/* Advanced */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1 text-xs text-njz-text-muted hover:text-njz-text"
            >
              {showAdvanced ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              Advanced Configuration
            </button>

            {showAdvanced && (
              <div className="mt-2 bg-njz-bg-overlay rounded-lg p-4 border border-njz-border space-y-3">
                <div className="flex items-center gap-2 text-sm text-njz-text">
                  <Code className="w-4 h-4" />
                  <span>mcpClient.ts</span>
                </div>
                <div className="bg-njz-bg rounded-lg p-3 border border-njz-border">
                  <code className="text-xs text-njz-text-muted whitespace-pre-wrap">
{`// RAT-OS MCP Client Configuration
export const MCP_CONFIG = {
  endpoints: ${JSON.stringify(endpoints.map(e => ({ id: e.id, url: e.url, type: e.type })), null, 2)},
  options: {
    autoConnect: ${config.autoConnect},
    retryAttempts: ${config.retryAttempts},
    timeout: ${config.timeout},
    logLevel: '${config.logLevel}'
  }
}`}
                  </code>
                </div>
                <button
                  onClick={() => copyToClipboard(JSON.stringify({ endpoints, config }, null, 2), 'config')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-njz-accent-teal/20 rounded-lg text-njz-accent-teal text-xs"
                >
                  {copied === 'config' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Config JSON
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="flex-1 flex flex-col bg-njz-bg-overlay rounded-lg border border-njz-border overflow-hidden">
          <div className="p-3 border-b border-njz-border flex items-center justify-between">
            <span className="text-xs font-medium text-njz-text-muted uppercase">Connection Logs</span>
            <button
              onClick={() => {
                setLogs([])
                localStorage.setItem('sitegeiste_mcp_logs', '[]')
              }}
              className="text-xs text-njz-text-muted hover:text-red-400"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1 font-mono">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-njz-text-muted">
                <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No logs yet</p>
                <p className="text-[10px]">Run a health check to generate logs</p>
              </div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="flex items-start gap-2 text-xs">
                  <span className="text-njz-text-muted whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`uppercase font-bold ${getLogColor(log.level)}`}>
                    {log.level}
                  </span>
                  <span className="text-njz-text">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}