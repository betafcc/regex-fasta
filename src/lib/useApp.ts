import { Reducer, useCallback, useReducer } from 'react'

import * as Fasta from './Fasta'
import { SafeMap } from './SafeMap'

export type State = {
  input: InputState
  pattern: {
    input: string
    regex: RegExp | null
  }
}

export type InputState =
  | {
      type: 'Incomplete'
      fastas: SafeMap<string, FastaState>
      rest: string
    }
  | {
      type: 'Complete'
      fastas: SafeMap<string, FastaState>
    }

export type FastaState =
  | { type: 'Loading' }
  | { type: 'Error'; message: string }
  | { type: 'Ok'; data: Fasta.FastaMatch }

export const initial: State = {
  input: { type: 'Incomplete', fastas: SafeMap.create([]), rest: '' },
  pattern: {
    input: '',
    regex: null,
  },
}

export type Event =
  | {
      type: 'PatternChanged'
      input: string
    }
  | {
      type: 'InputChanged'
      input: InputState
    }
  | {
      type: 'ProteinFetchFailed'
      accession: string
      message: string
    }
  | {
      type: 'ProteinFetched'
      fasta: Fasta.Fasta
    }

export const reduce: Reducer<State, Event> = (state, event) => {
  switch (event.type) {
    case 'PatternChanged': {
      const regex = event.input ? new RegExp(event.input, 'g') : null
      return {
        ...state,
        pattern: {
          input: event.input,
          regex,
        },
        input: {
          ...state.input,
          fastas: state.input.fastas.map(fs =>
            fs.type !== 'Ok'
              ? fs
              : {
                  type: 'Ok',
                  data: Fasta.match(fs.data.fasta, regex),
                },
          ),
        },
      }
    }
    case 'InputChanged':
      return {
        ...state,
        input: event.input,
      }
    case 'ProteinFetchFailed':
      return {
        ...state,
        input: {
          ...state.input,
          fastas: state.input.fastas.update(event.accession, {
            type: 'Error',
            message: event.message,
          }),
        },
      }
    case 'ProteinFetched':
      return {
        ...state,
        input: {
          ...state.input,
          fastas: state.input.fastas.update(event.fasta.accession, {
            type: 'Ok',
            data: Fasta.match(event.fasta, state.pattern.regex),
          }),
        },
      }
  }
}

export const useApp = (initialState: State = initial) => {
  const [state, dispatch] = useReducer(reduce, initialState)

  return [
    state,
    {
      changePattern: useCallback(
        (input: string) => dispatch({ type: 'PatternChanged', input }),
        [],
      ),
      changeInput: useCallback(
        (input: string) => {
          if (input.trim().length === 0) {
            dispatch({
              type: 'InputChanged',
              input: { type: 'Complete', fastas: SafeMap.create([]) },
            })
            return
          }

          // remove anything that is not uppercase letter or digit or '\n'
          input = input.toUpperCase().replace(/[^A-Z0-9\n]/g, '')
          const complete = input.endsWith('\n')
          input = input.trim()

          const lines = input
            .split('\n')
            .map(e => e.trim())
            .filter(e => e.length > 0)

          const toProcess = complete ? lines : lines.slice(0, -1)

          const notCached = new Set<string>()
          let fastas = SafeMap.create<string, FastaState>([])

          for (const accession of toProcess) {
            if (!state.input.fastas.has(accession)) notCached.add(accession)
            fastas = fastas.set(
              accession,
              state.input.fastas.get(accession, { type: 'Loading' }),
            )
          }

          dispatch({
            type: 'InputChanged',
            input: complete
              ? { type: 'Complete', fastas }
              : { type: 'Incomplete', fastas, rest: lines[lines.length - 1] },
          })

          for (const accession of notCached) {
            Fasta.get(accession)
              .then(fasta => dispatch({ type: 'ProteinFetched', fasta }))
              .catch(() =>
                dispatch({
                  type: 'ProteinFetchFailed',
                  accession,
                  message: 'failed to load',
                }),
              )
          }
        },
        [state.input.fastas],
      ),
    },
  ] as const
}
