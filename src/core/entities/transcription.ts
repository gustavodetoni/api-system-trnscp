export type Transcription = {
  id: string
  title: string | null
  name: string
  keywords: string[] | null
  resume: string | null
  duration: number | null
  squadId: string
  category: string | null
  status: |
    'ERROR' |
    'UPLOADING' |
    'TRANSCRIBING' |
    'CATEGORIZING' |
    'COMPLETED' |
    null
  pinned: boolean
}
