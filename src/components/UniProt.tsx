import { FC, useEffect, useState } from 'react'

import { Protein } from '../lib/Protein'
import { Highlight } from './Highlight'

export const UniProt: FC<{
  accession: string
  pattern?: RegExp | string
}> = props => {
  const [protein, setProtein] = useState<Protein | null>(null)

  useEffect(() => {
    Protein.fetch(props.accession).then(setProtein)
  }, [props.accession])

  if (!protein) return `>${props.accession}`
  if (!props.pattern) return protein.data.fasta
  const pattern =
    typeof props.pattern === 'string'
      ? new RegExp(props.pattern, 'g')
      : props.pattern

  const match = protein.match(pattern)

  return (
    <>
      {protein.data.title + '\n'}
      <Highlight
        wrap={60}
        ranges={match.matches}
        render={(fragment: string) => (
          <span className="bg-green-300">{fragment}</span>
        )}
        children={protein.data.sequence}
      />
    </>
  )
}
