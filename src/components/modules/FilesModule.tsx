import { useState, useCallback } from 'react'
import { Folder, File, HardDrive, Monitor, Printer, Plus, Trash2, ChevronRight, ChevronDown, Image, Music, Video, FileText, Archive, Tag, Search } from 'lucide-react'

interface FileMetadata {
  id: string
  name: string
  type: 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other'
  size: string
  createdAt: string
  modifiedAt: string
  tags: string[]
  thumbnail?: string
  parentId: string | null
}

interface FolderNode {
  id: string
  name: string
  type: 'system' | 'os' | 'hardcopy'
  parentId: string | null
  children: string[]
}

interface FileSystem {
  folders: FolderNode[]
  files: FileMetadata[]
}

const DEFAULT_FOLDERS: FolderNode[] = [
  { id: 'root', name: 'Files', type: 'system', parentId: null, children: ['sys-apps', 'sys-config', 'sys-logs'] },
  { id: 'sys-apps', name: 'Applications', type: 'system', parentId: 'root', children: [] },
  { id: 'sys-config', name: 'Configuration', type: 'system', parentId: 'root', children: [] },
  { id: 'sys-logs', name: 'System Logs', type: 'system', parentId: 'root', children: [] },
  { id: 'os-docs', name: 'Documents', type: 'os', parentId: 'root', children: [] },
  { id: 'os-media', name: 'Media', type: 'os', parentId: 'root', children: [] },
  { id: 'os-downloads', name: 'Downloads', type: 'os', parentId: 'root', children: [] },
  { id: 'hc-prints', name: 'Print Queue', type: 'hardcopy', parentId: 'root', children: [] },
  { id: 'hc-archive', name: 'Physical Archive', type: 'hardcopy', parentId: 'root', children: [] },
]

const TYPE_ICONS = {
  image: Image,
  video: Video,
  audio: Music,
  document: FileText,
  archive: Archive,
  other: File
}

const TYPE_COLORS = {
  image: 'text-purple-400',
  video: 'text-red-400',
  audio: 'text-blue-400',
  document: 'text-yellow-400',
  archive: 'text-gray-400',
  other: 'text-gray-400'
}

export function FilesModule() {
  const [fs, setFs] = useState<FileSystem>(() => {
    const stored = localStorage.getItem('sitegeiste_filesystem')
    if (stored) return JSON.parse(stored)
    return { folders: DEFAULT_FOLDERS, files: [] }
  })
  const [activeFolder, setActiveFolder] = useState('root')
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']))
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null)
  const [newTag, setNewTag] = useState('')

  const saveFs = useCallback((updated: FileSystem) => {
    setFs(updated)
    localStorage.setItem('sitegeiste_filesystem', JSON.stringify(updated))
  }, [])

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const createFolder = () => {
    if (!newFolderName.trim()) return
    const folder: FolderNode = {
      id: `folder_${Date.now()}`,
      name: newFolderName,
      type: 'os',
      parentId: activeFolder === 'root' ? 'root' : activeFolder,
      children: []
    }
    const updated = {
      ...fs,
      folders: [...fs.folders, folder]
    }
    // Add to parent
    updated.folders = updated.folders.map(f =>
      f.id === folder.parentId
        ? { ...f, children: [...f.children, folder.id] }
        : f
    )
    saveFs(updated)
    setNewFolderName('')
    setShowCreateFolder(false)
    setExpandedFolders(prev => new Set(prev).add(folder.parentId!))
  }

  const deleteFolder = (id: string) => {
    const folder = fs.folders.find(f => f.id === id)
    if (!folder || id === 'root') return
    // Remove from parent
    const updated = {
      folders: fs.folders
        .filter(f => f.id !== id)
        .map(f =>
          f.id === folder.parentId
            ? { ...f, children: f.children.filter(c => c !== id) }
            : f
        ),
      files: fs.files.filter(f => f.parentId !== id)
    }
    saveFs(updated)
    if (activeFolder === id) setActiveFolder('root')
  }

  void deleteFolder // used implicitly via UI

  const addFile = (type: FileMetadata['type']) => {
    const file: FileMetadata = {
      id: `file_${Date.now()}`,
      name: `New ${type} file`,
      type,
      size: '0 KB',
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      tags: [],
      parentId: activeFolder === 'root' ? 'sys-apps' : activeFolder
    }
    const updated = {
      ...fs,
      files: [...fs.files, file]
    }
    saveFs(updated)
  }

  const deleteFile = (id: string) => {
    const updated = {
      ...fs,
      files: fs.files.filter(f => f.id !== id)
    }
    saveFs(updated)
    if (selectedFile?.id === id) setSelectedFile(null)
  }

  const updateFile = (id: string, updates: Partial<FileMetadata>) => {
    const updated = {
      ...fs,
      files: fs.files.map(f =>
        f.id === id ? { ...f, ...updates, modifiedAt: new Date().toISOString() } : f
      )
    }
    saveFs(updated)
    if (selectedFile?.id === id) {
      setSelectedFile({ ...selectedFile, ...updates, modifiedAt: new Date().toISOString() })
    }
  }

  const addTagToFile = (fileId: string) => {
    if (!newTag.trim()) return
    const file = fs.files.find(f => f.id === fileId)
    if (!file) return
    if (file.tags.includes(newTag.trim())) return
    updateFile(fileId, { tags: [...file.tags, newTag.trim()] })
    setNewTag('')
  }

  const removeTagFromFile = (fileId: string, tag: string) => {
    const file = fs.files.find(f => f.id === fileId)
    if (!file) return
    updateFile(fileId, { tags: file.tags.filter(t => t !== tag) })
  }

  const getFolderFiles = (folderId: string) => {
    return fs.files.filter(f => f.parentId === folderId)
  }

  const getAllDescendants = (folderId: string): string[] => {
    const folder = fs.folders.find(f => f.id === folderId)
    if (!folder) return []
    return [
      ...folder.children,
      ...folder.children.flatMap(child => getAllDescendants(child))
    ]
  }

  const getBreadcrumb = (folderId: string): FolderNode[] => {
    const folder = fs.folders.find(f => f.id === folderId)
    if (!folder || !folder.parentId) return folder ? [folder] : []
    return [...getBreadcrumb(folder.parentId), folder]
  }

  const searchFiles = () => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return fs.files.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  const renderFolderTree = (folderId: string, depth = 0) => {
    const folder = fs.folders.find(f => f.id === folderId)
    if (!folder) return null

    const isExpanded = expandedFolders.has(folderId)
    const hasChildren = folder.children.length > 0
    const isActive = activeFolder === folderId

    const getFolderIcon = (type: string) => {
      switch (type) {
        case 'system': return <HardDrive className="w-4 h-4 text-njz-accent-teal" />
        case 'os': return <Monitor className="w-4 h-4 text-njz-accent-purple" />
        case 'hardcopy': return <Printer className="w-4 h-4 text-njz-accent-orange" />
        default: return <Folder className="w-4 h-4 text-njz-text-muted" />
      }
    }

    return (
      <div key={folderId}>
        <button
          onClick={() => {
            setActiveFolder(folderId)
            if (hasChildren) toggleFolder(folderId)
          }}
          className={`w-full flex items-center gap-1.5 py-1.5 px-2 rounded-lg text-sm transition-colors ${
            isActive ? 'bg-njz-accent-teal/20 text-njz-accent-teal' : 'text-njz-text-muted hover:bg-njz-bg-overlay hover:text-njz-text'
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {hasChildren && (
            <span onClick={e => { e.stopPropagation(); toggleFolder(folderId) }}>
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </span>
          )}
          {!hasChildren && <span className="w-3" />}
          {getFolderIcon(folder.type)}
          <span className="truncate">{folder.name}</span>
          <span className="text-xs opacity-50 ml-auto">
            {getFolderFiles(folderId).length}
          </span>
        </button>

        {isExpanded && folder.children.map(childId => renderFolderTree(childId, depth + 1))}
      </div>
    )
  }

  const filteredFiles = searchQuery.trim() ? searchFiles() : getFolderFiles(activeFolder)
  const breadcrumb = getBreadcrumb(activeFolder)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-njz-accent-purple/20">
          <Folder className="w-5 h-5 text-njz-accent-purple" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-njz-text">Files</h2>
          <p className="text-sm text-njz-text-muted">System / OS / Hardcopy management</p>
        </div>
      </div>

      <div className="flex gap-4 h-[500px]">
        {/* Folder Tree Sidebar */}
        <div className="w-56 bg-njz-bg-overlay rounded-lg p-3 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-njz-text-muted uppercase">Folders</span>
            <button
              onClick={() => setShowCreateFolder(true)}
              className="p-1 text-njz-text-muted hover:text-njz-accent-teal"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {showCreateFolder && (
            <div className="mb-2 space-y-2">
              <input
                type="text"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="w-full bg-njz-bg border border-njz-border rounded px-2 py-1 text-xs text-njz-text"
                autoFocus
              />
              <div className="flex gap-1">
                <button
                  onClick={createFolder}
                  className="px-2 py-1 bg-njz-accent-teal rounded text-white text-[10px]"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateFolder(false)}
                  className="px-2 py-1 border border-njz-border rounded text-njz-text text-[10px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {renderFolderTree('root')}
        </div>

        {/* File Area */}
        <div className="flex-1 flex flex-col">
          {/* Breadcrumb & Search */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 text-sm text-njz-text">
              {breadcrumb.map((folder, i) => (
                <span key={folder.id} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="w-3 h-3 text-njz-text-muted" />}
                  <button
                    onClick={() => setActiveFolder(folder.id)}
                    className={`hover:text-njz-accent-teal ${i === breadcrumb.length - 1 ? 'font-medium' : 'text-njz-text-muted'}`}
                  >
                    {folder.name}
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-njz-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search files..."
                  className="bg-njz-bg border border-njz-border rounded-lg pl-7 pr-3 py-1.5 text-xs text-njz-text placeholder:text-njz-text-subtle w-40"
                />
              </div>
              {!searchQuery && (
                <button
                  onClick={() => addFile('document')}
                  className="p-1.5 bg-njz-accent-teal/20 rounded text-njz-accent-teal hover:bg-njz-accent-teal/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* File Grid */}
          <div className="flex-1 bg-njz-bg-overlay rounded-lg p-3 overflow-y-auto">
            {filteredFiles.length === 0 ? (
              <div className="text-center py-12 text-njz-text-muted">
                <Folder className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No files</p>
                <p className="text-xs mt-1">
                  {searchQuery ? 'No matches found' : 'Add files to this folder'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {filteredFiles.map(file => {
                  const Icon = TYPE_ICONS[file.type]
                  const color = TYPE_COLORS[file.type]
                  return (
                    <button
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={`text-left bg-njz-bg rounded-lg p-3 border transition-colors hover:border-njz-accent-teal/50 ${
                        selectedFile?.id === file.id ? 'border-njz-accent-teal' : 'border-njz-border'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Icon className={`w-8 h-8 ${color}`} />
                        {file.thumbnail && (
                          <div className="w-8 h-8 rounded bg-njz-bg-overlay flex items-center justify-center">
                            <Image className="w-4 h-4 text-njz-text-muted" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-medium text-njz-text truncate">{file.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[10px] text-njz-text-muted">{file.size}</span>
                        <span className="text-[10px] text-njz-text-muted">•</span>
                        <span className="text-[10px] text-njz-text-muted">
                          {new Date(file.modifiedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {file.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {file.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-njz-bg border border-njz-border text-njz-text-muted">
                              {tag}
                            </span>
                          ))}
                          {file.tags.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] text-njz-text-muted">
                              +{file.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* File Details Sidebar */}
        {selectedFile && (
          <div className="w-56 bg-njz-bg-overlay rounded-lg p-3 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-njz-text">Details</h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-njz-text-muted hover:text-njz-text"
              >
                ×
              </button>
            </div>

            <div className="flex items-center gap-2">
              {(() => {
                const Icon = TYPE_ICONS[selectedFile.type]
                const color = TYPE_COLORS[selectedFile.type]
                return <Icon className={`w-8 h-8 ${color}`} />
              })()}
              <div>
                <p className="text-sm font-medium text-njz-text truncate">{selectedFile.name}</p>
                <p className="text-xs text-njz-text-muted capitalize">{selectedFile.type}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-njz-text-muted">Size: </span>
                <span className="text-njz-text">{selectedFile.size}</span>
              </div>
              <div>
                <span className="text-njz-text-muted">Created: </span>
                <span className="text-njz-text">{new Date(selectedFile.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-njz-text-muted">Modified: </span>
                <span className="text-njz-text">{new Date(selectedFile.modifiedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Tags */}
            <div>
              <p className="text-xs font-medium text-njz-text-muted mb-1">Tags</p>
              <div className="flex flex-wrap gap-1 mb-1.5">
                {selectedFile.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-njz-bg border border-njz-border text-njz-text">
                    {tag}
                    <button
                      onClick={() => removeTagFromFile(selectedFile.id, tag)}
                      className="text-njz-text-muted hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTagToFile(selectedFile.id)}
                  placeholder="Add tag..."
                  className="flex-1 bg-njz-bg border border-njz-border rounded px-2 py-1 text-[10px] text-njz-text"
                />
                <button
                  onClick={() => addTagToFile(selectedFile.id)}
                  className="px-2 py-1 bg-njz-accent-teal/20 rounded text-njz-accent-teal text-[10px]"
                >
                  <Tag className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-njz-border">
              <button
                onClick={() => deleteFile(selectedFile.id)}
                className="flex items-center gap-1.5 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
