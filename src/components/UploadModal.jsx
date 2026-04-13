import { useState, useRef, useCallback, useEffect } from 'react'

const ACCEPTED_TYPES = {
  'application/pdf': true,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': true,
  'application/vnd.ms-excel': true,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
  'application/msword': true,
}
const ACCEPTED_EXTENSIONS = new Set(['.pdf', '.xlsx', '.xls', '.docx', '.doc'])
const MAX_SIZE_BYTES = 25 * 1024 * 1024 // 25 MB
const MAX_COMMENT = 250

function extOf(filename) {
  const m = filename.match(/(\.[^.]+)$/)
  return m ? m[1].toLowerCase() : ''
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileIcon(filename) {
  const ext = extOf(filename)
  if (ext === '.pdf') return '📄'
  if (['.xlsx', '.xls'].includes(ext)) return '📊'
  if (['.docx', '.doc'].includes(ext)) return '📝'
  return '📎'
}

function validateFile(file) {
  if (!file) return 'No file selected.'
  const ext = extOf(file.name)
  if (!ACCEPTED_EXTENSIONS.has(ext) && !ACCEPTED_TYPES[file.type]) {
    return 'Invalid file type. Please upload a PDF, Excel (.xlsx / .xls), or Word (.docx / .doc) document.'
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `File is too large (${formatBytes(file.size)}). Maximum size is 25 MB.`
  }
  return null
}

export default function UploadModal({ onClose }) {
  const [file,       setFile]       = useState(null)
  const [comment,    setComment]    = useState('')
  const [dragOver,   setDragOver]   = useState(false)
  const [fileError,  setFileError]  = useState('')
  const [status,     setStatus]     = useState('idle') // idle | uploading | success | error
  const [serverErr,  setServerErr]  = useState('')
  const [result,     setResult]     = useState(null)
  const inputRef = useRef(null)

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const selectFile = useCallback((f) => {
    const err = validateFile(f)
    setFileError(err || '')
    setFile(err ? null : f)
    setStatus('idle')
    setServerErr('')
  }, [])

  function onInputChange(e) {
    const f = e.target.files?.[0]
    if (f) selectFile(f)
    e.target.value = ''
  }

  function onDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) selectFile(f)
  }

  function onDragOver(e) { e.preventDefault(); setDragOver(true) }
  function onDragLeave() { setDragOver(false) }

  async function handleSubmit() {
    if (!file || fileError) return
    setStatus('uploading')
    setServerErr('')
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('comment', comment)
      const res  = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed.')
      setResult(data)
      setStatus('success')
    } catch (err) {
      setServerErr(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const isSubmittable = file && !fileError && status !== 'uploading'

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-xl">📤</span>
            <h2 className="text-lg font-bold text-[#1e3a5f] dark:text-blue-300">Upload Document</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto">

          {status === 'success' ? (
            /* ── Success state ── */
            <div className="flex flex-col items-center text-center py-4 gap-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-3xl">✓</div>
              <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">Upload Successful!</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <p>
                  <span className="font-medium">Document:</span>{' '}
                  <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{result.filename}</span>
                </p>
                <p>
                  <span className="font-medium">Comment file:</span>{' '}
                  <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{result.txtFile}</span>
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                  Both files saved to <span className="font-mono">Uploaded Documents\</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#16305a] transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* ── Drop zone ── */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Document <span className="text-gray-400 dark:text-gray-500 font-normal">(PDF, Excel, Word · max 25 MB)</span>
                </label>

                {file ? (
                  /* File selected preview */
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
                    <span className="text-2xl shrink-0">{fileIcon(file.name)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{file.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{formatBytes(file.size)}</p>
                    </div>
                    <button
                      onClick={() => { setFile(null); setFileError(''); setStatus('idle') }}
                      className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove file"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  /* Drop zone */
                  <div
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onClick={() => inputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors duration-150 ${
                      dragOver
                        ? 'border-[#1e3a5f] bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-[#1e3a5f] dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <svg className={`w-10 h-10 ${dragOver ? 'text-[#1e3a5f] dark:text-blue-300' : 'text-gray-300 dark:text-gray-600'} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {dragOver ? 'Drop to upload' : 'Drag & drop a file here'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">or <span className="text-[#1e3a5f] dark:text-blue-300 font-medium">browse files</span></p>
                  </div>
                )}

                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.xlsx,.xls,.docx,.doc"
                  className="hidden"
                  onChange={onInputChange}
                />

                {fileError && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-start gap-1.5">
                    <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {fileError}
                  </p>
                )}
              </div>

              {/* ── Comment field ── */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Comment <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
                  rows={3}
                  placeholder="Add a short note about this document…"
                  className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 resize-none"
                />
                <div className="flex justify-end mt-1">
                  <span className={`text-xs ${comment.length >= MAX_COMMENT ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
                    {comment.length} / {MAX_COMMENT}
                  </span>
                </div>
              </div>

              {/* ── Server error ── */}
              {status === 'error' && serverErr && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {serverErr}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer buttons (hidden on success) */}
        {status !== 'success' && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isSubmittable}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#16305a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'uploading' ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Uploading…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
