import Papa from 'papaparse'
import { saveAs } from 'file-saver'

export async function importCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors && results.errors.length) {
          reject(results.errors)
        } else {
          resolve(results.data as any[])
        }
      }
    })
  })
}

export function exportCSV(rows: any[], columns: { key: string; label: string }[]) {
  const csvRows = rows.map(r => {
    const obj: any = {}
    columns.forEach(c => obj[c.label] = r[c.key])
    return obj
  })
  const csv = Papa.unparse(csvRows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, 'export.csv')
}
