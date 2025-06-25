export interface Work {
  id: number
  title: string
  author: string
  career: string
  subject: string
  semester: string
  summary: string
  pdfFile?: string
  sourceCode?: string
  status: "pending" | "approved" | "rejected"
  date: string
  createdAt: Date
  updatedAt: Date
}

export interface WorkStats {
  total: number
  approved: number
  pending: number
  rejected: number
}
