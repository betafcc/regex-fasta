import { FC, Fragment, ReactNode } from 'react'

const wrapText = (text: string, width: number) => {
  const lines = []
  for (let i = 0; i < text.length; i += width) {
    lines.push(text.slice(i, i + width))
  }
  return lines.join('\n')
}

export const Highlight: FC<{
  wrap: number
  ranges: Array<[number, number]>
  render: (fragment: string) => JSX.Element
  children: string
}> = ({ wrap = 0, ranges, render, children }) => {
  const text = !wrap ? children : wrapText(children, wrap)
  ranges = !wrap
    ? [...ranges]
    : ranges.map(([start, end]) => {
        return [
          start + Math.floor(start / wrap),
          end + Math.floor(end / wrap),
        ] as [number, number]
      })

  ranges.sort((a, b) => a[0] - b[0])

  if (!ranges.length) return text
  else {
    const fragments: ReactNode[] = []
    let lastIndex = 0

    for (const [start, end] of ranges) {
      fragments.push(
        <Fragment key={`${lastIndex}-${start}`}>
          {text.slice(lastIndex, start)}
        </Fragment>,
      )
      fragments.push(
        <Fragment key={`${start}-${end}`}>
          {render(text.slice(start, end))}
        </Fragment>,
      )

      lastIndex = end
    }

    fragments.push(
      <Fragment key={`-${lastIndex}`}>{text.slice(lastIndex)}</Fragment>,
    )

    return <>{fragments}</>
  }
}
