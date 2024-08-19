export type Fasta = {
  accession: string
  title: string
  sequence: string
}

export type FastaMatch = {
  fasta: Fasta
  matches: Array<[number, number]>
}

export const get = (accession: string) =>
  fetch(`https://rest.uniprot.org/uniprotkb/${accession}.fasta`)
    .then(res => res.text())
    .then(parse)

export const parse = (fasta: string): Fasta => {
  const [title, ...rest] = fasta.trim().split('\n')

  return {
    accession: title.split('|')[1],
    title,
    sequence: rest.join(''),
  }
}

export const match = (fasta: Fasta, pattern: RegExp | null = null) => {
  if (!pattern)
    return {
      fasta,
      matches: [],
    }

  const matches: Array<[number, number]> = []

  let match: RegExpExecArray | null
  while ((match = pattern.exec(fasta.sequence)) !== null) {
    matches.push([match.index, match.index + match[0].length])
  }

  return {
    fasta,
    matches,
  }
}
