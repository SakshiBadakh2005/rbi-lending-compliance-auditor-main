import { useState, useRef } from 'react'
import { UploadCloud, FileText, X, CheckCircle2 } from 'lucide-react'

export default function FileUploadZone({ onFileChange }) {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const accept = (f) => {
    if (!f) return
    setFile(f)
    onFileChange && onFileChange(f)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type === 'application/pdf') accept(f)
  }

  const remove = (e) => {
    e.stopPropagation()
    setFile(null)
    onFileChange && onFileChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <label className="input-label">
        Loan Document <span className="text-fail-dot">*</span>
        <span className="ml-1 font-normal text-ink-faint">(PDF, Key Fact Statement or loan agreement)</span>
      </label>

      <div
        onClick={() => !file && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`
          relative mt-1 border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer
          ${file
            ? 'border-primary-300 bg-primary-50 cursor-default'
            : dragging
            ? 'border-primary-500 bg-primary-50 scale-[1.01]'
            : 'border-surface-border bg-white hover:border-primary-300 hover:bg-primary-50/40'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => accept(e.target.files[0])}
        />

        {file ? (
          /* File selected state */
          <div className="flex items-center gap-4 animate-fade-in">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText size={20} className="text-primary-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink-primary truncate">{file.name}</p>
              <p className="text-xs text-ink-muted mt-0.5">
                {(file.size / 1024).toFixed(1)} KB &nbsp;·&nbsp; PDF Document
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-pass-dot" />
              <button
                onClick={remove}
                className="p-1 rounded-md text-ink-muted hover:text-fail-dot hover:bg-fail-bg transition-colors"
                title="Remove file"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${dragging ? 'bg-primary-100 scale-110' : 'bg-surface-muted'}`}>
              <UploadCloud size={24} className={dragging ? 'text-primary-700' : 'text-ink-muted'} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-primary">
                Drop your PDF here, or{' '}
                <span className="text-primary-700 underline underline-offset-2 hover:text-primary-800">browse</span>
              </p>
              <p className="text-xs text-ink-faint mt-1">Only PDF files supported · Max 20 MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
