import * as pdfjsLib from 'pdfjs-dist'

// Configure worker path for pdfjs-dist with Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString()

/**
 * Extract plain text content from a PDF file using pdfjs-dist.
 * @param {File|Blob} file - PDF file to extract text from
 * @returns {Promise<string>} Extracted text string or empty string on failure
 */
export async function extractTextFromPDF(file) {
  if (!file) return ''

  try {
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise

    let fullText = ''
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ')
      fullText += pageText + '\n'
    }

    return fullText.trim()
  } catch (error) {
    console.error('[pdfExtractor] Error extracting text from PDF:', error)
    return ''
  }
}
