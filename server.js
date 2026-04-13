import express from 'express'
import multer from 'multer'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join, extname, basename } from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

const UPLOAD_DIR = join(__dirname, 'Uploaded Documents')

// Ensure upload directory exists
if (!existsSync(UPLOAD_DIR)) {
  await mkdir(UPLOAD_DIR, { recursive: true })
}

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel',                                           // .xls
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword',                                                  // .doc
])

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.xlsx', '.xls', '.docx', '.doc'])

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const ts   = new Date().toISOString().replace(/[:.]/g, '-')
    const ext  = extname(file.originalname)
    const base = basename(file.originalname, ext)
    cb(null, `${base}_${ts}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
  fileFilter: (req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase()
    if (ALLOWED_MIME_TYPES.has(file.mimetype) || ALLOWED_EXTENSIONS.has(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only PDF, Excel (.xlsx/.xls), and Word (.docx/.doc) files are allowed.'))
    }
  },
})

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/upload', (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      const msg = err.code === 'LIMIT_FILE_SIZE'
        ? 'File exceeds the 25 MB size limit.'
        : err.message
      return res.status(400).json({ success: false, error: msg })
    }
    if (err) {
      return res.status(400).json({ success: false, error: err.message })
    }
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file received.' })
    }

    const comment = (req.body.comment || '').slice(0, 250)
    const savedName = req.file.filename

    // Write companion .txt with the comment
    const txtName    = savedName.replace(/\.[^.]+$/, '') + '.txt'
    const txtPath    = join(UPLOAD_DIR, txtName)
    const txtContent = [
      `File: ${req.file.originalname}`,
      `Uploaded: ${new Date().toLocaleString('en-US')}`,
      `Size: ${(req.file.size / 1024).toFixed(1)} KB`,
      '',
      'Comment:',
      comment || '(no comment provided)',
    ].join('\n')

    try {
      await writeFile(txtPath, txtContent, 'utf-8')
    } catch (writeErr) {
      return res.status(500).json({ success: false, error: 'Failed to save comment file.' })
    }

    res.json({
      success:  true,
      filename: savedName,
      txtFile:  txtName,
      size:     req.file.size,
    })
  })
})

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }))

const PORT = 3001
app.listen(PORT, () => console.log(`Upload server running on http://localhost:${PORT}`))
