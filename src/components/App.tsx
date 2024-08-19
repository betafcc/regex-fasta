import { Field, Textarea } from '@headlessui/react'
import { ComponentProps, FC, Fragment } from 'react'
import { cn } from '../lib/util'
import { useApp } from '../lib/useApp'
import { Highlight } from './Highlight'

const proteins = [
  'Q9Y7B1',
  'A0A1B2J9U2',
  'C1PHG1',
  'A0A1B2JAX1',
  'A0A1B2J5Q5',
].map(e => e)

export function App() {
  const [state, commands] = useApp()

  const value = (() => {
    const keys = state.input.fastas.keys()
    switch (state.input.type) {
      case 'Complete': {
        return keys.join('\n') + (keys.length ? '\n' : '')
      }
      case 'Incomplete':
        return keys.concat([state.input.rest]).join('\n')
    }
  })()

  return (
    <div className="flex flex-row h-screen">
      <SidePannel>
        <Field>
          <input
            type="text"
            className="w-full text-white bg-gray-700 p-2 mb-2 rounded-lg"
            placeholder="Pattern"
            value={state.pattern.input}
            onChange={e => commands.changePattern(e.target.value)}
          />
        </Field>
        <Field className="flex flex-col flex-1">
          <div className="overflow-y-auto h-full">
            <div className="w-full flex flex-1 min-h-full font-mono">
              <pre
                // className="w-1/2 min-h-full max-h-full bg-gray-600 overflow-x-scroll p-2 text-right"
                className={cn(
                  'block w-1/4 resize-none rounded-l-lg border-none bg-white/30 py-1.5 px-3 text-sm/6 text-white',
                  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                  'text-right',
                )}
                children={state.input.fastas.values().map(fs => {
                  switch (fs.type) {
                    case 'Ok':
                      return (
                        <span
                          className={
                            fs.data.matches.length
                              ? 'text-green-500'
                              : 'text-red-500'
                          }
                          children={`${fs.data.matches.length}\n`}
                        />
                      )
                    case 'Error':
                      return fs.message + '\n'
                    case 'Loading':
                      return 'loading\n'
                  }
                })}
              />
              <Textarea
                // className="w-1/2 min-h-full bg-gray-700 whitespace-nowrap resize-none p-2"
                className={cn(
                  'block w-3/4 resize-none rounded-r-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                )}
                value={value}
                placeholder="Accessions"
                onChange={e => commands.changeInput(e.target.value)}
              />
            </div>
          </div>
        </Field>
      </SidePannel>
      <MainPannel>
        <pre className="font-mono text-xs leading-tight tracking-normal">
          {state.input.fastas.entries().map(([k, fs]) => {
            const content = (() => {
              switch (fs.type) {
                case 'Loading':
                  return (
                    <span
                      className="text-gray-300"
                      children={`>${k}\nloading...\n\n`}
                    />
                  )
                case 'Ok':
                  return (
                    <>
                      <span
                        className={
                          fs.data.matches.length
                            ? 'text-green-500'
                            : 'text-red-500'
                        }
                        children={fs.data.fasta.title + '\n'}
                      />
                      <Highlight
                        wrap={60}
                        ranges={fs.data.matches}
                        children={fs.data.fasta.sequence}
                        render={fragment => (
                          <span className="bg-yellow-700">{fragment}</span>
                        )}
                      />
                      {'\n\n'}
                    </>
                  )
                case 'Error':
                  return (
                    <span className="" children={`>${k}\nloading...\n\n`} />
                  )
              }
            })()

            return <Fragment key={k}>{content}</Fragment>
          })}
        </pre>
      </MainPannel>
    </div>
  )
}

export const FastaTitle: FC<{ children: string }> = ({ children }) => {
  return <span className="text-blue-500">{children}</span>
}

export const SidePannel: FC<ComponentProps<'div'>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col w-96 h-screen bg-gray-800 p-4 shrink-0',
        className,
      )}
      {...props}
    />
  )
}

export const MainPannel: FC<ComponentProps<'div'>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col flex-1 h-screen bg-gray-900 p-4 overflow-auto',
        className,
      )}
      {...props}
    />
  )
}
