export type UniProtResponse = {
  accession: string
  id: string
  proteinExistence: string
  info: {
    type: string
    created: string
    modified: string
    version: number
  }
  organism: {
    taxonomy: number
    names: Array<{
      type: string
      value: string
    }>
    lineage: string[]
  }
  protein: {
    recommendedName: {
      fullName: {
        value: string
        evidences: Array<{
          code: string
          source: {
            name: string
            id: string
            url: string
          }
        }>
      }
      ecNumber: Array<{
        value: string
        evidences: Array<{
          code: string
          source: {
            name: string
            id: string
            url: string
          }
        }>
      }>
    }
  }
  gene: Array<{
    name: {
      value: string
      evidences: Array<{
        code: string
        source: {
          name: string
          id: string
          url: string
        }
      }>
    }
  }>
  comments: Array<{
    type: string
    text?: Array<{
      value: string
      evidences: Array<{
        code: string
        source: {
          name: string
          id: string
          url: string
        }
      }>
    }>
    reaction?: {
      name: string
      dbReferences: Array<{
        type: string
        id: string
      }>
      ecNumber: string
      evidences: Array<{
        code: string
        source: {
          name: string
          id: string
          url: string
        }
      }>
    }
    cofactors?: Array<{
      name: string
      dbReference: {
        type: string
        id: string
      }
      evidences: Array<{
        code: string
        source: {
          name: string
          id: string
          url: string
        }
      }>
    }>
  }>
  features: Array<{
    type: string
    category: string
    description: string
    begin: string
    end: string
    molecule: string
    ligand?: {
      name: string
      dbReference: {
        name: string
        id: string
      }
      label?: string
      ligandPart?: {
        name: string
        dbReference: {
          name: string
          id: string
        }
        note: string
      }
    }
    evidences: Array<{
      code: string
      source: {
        name: string
        id: string
        url: string
      }
    }>
  }>
  dbReferences: Array<{
    type: string
    id: string
    properties?: {
      [key: string]: string
    }
  }>
  keywords: Array<{
    value: string
    evidences: Array<{
      code: string
      source: {
        name: string
        id: string
        url: string
      }
    }>
  }>
  references: Array<{
    citation: {
      type: string
      publicationDate: string
      title: string
      authors: string[]
      publication: {
        journalName: string
      }
      location: {
        volume: string
        firstPage: string
        lastPage: string
      }
      dbReferences: Array<{
        type: string
        id: string
      }>
    }
    source: {
      strain: Array<{
        value: string
        evidences: Array<{
          code: string
          source: {
            name: string
            id: string
            url: string
          }
        }>
      }>
    }
    scope: string[]
    evidences: Array<{
      code: string
      source: {
        name: string
        id: string
        url: string
      }
    }>
  }>
  sequence: {
    version: number
    length: number
    mass: number
    modified: string
    sequence: string
  }
}

export const jsonEnpoint = 'https://www.ebi.ac.uk/proteins/api/proteins'

export const fetchJson = (id: string): Promise<UniProtResponse> =>
  fetch(`${jsonEnpoint}/${id}`).then(res => res.json())

export const fastaEndpoint = 'https://rest.uniprot.org/uniprotkb'

export const fetchFasta = (id: string): Promise<string> =>
  fetch(`${fastaEndpoint}/${id}.fasta`).then(res => res.text())
