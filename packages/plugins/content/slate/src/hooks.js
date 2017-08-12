// @flow
// FIXME #125: missing types for slate internals
/* eslint-disable new-cap, arrow-body-style, react/display-name */
import { List } from 'immutable'
import head from 'ramda/src/head'
import map from 'ramda/src/map'
import path from 'ramda/src/path'
import reduce from 'ramda/src/reduce'
import tail from 'ramda/src/tail'
import React from 'react'
import type { Props } from './Component'

import { defaultPlugins } from './index'

// FIXME #126
import { Document, Html, Raw, State, Plain } from 'slate'

const rules = [
  {
    deserialize: (el: any) =>
      el.tagName === 'p'
        ? {
            kind: 'block',
            type: P,
            nodes: [{ kind: 'text', ranges: [{ text: el.children[0].data }] }]
          }
        : null
  },
  {
    deserialize: (el: any) =>
      el.tagName === 'h1'
        ? {
            kind: 'block',
            type: H1,
            nodes: [{ kind: 'text', ranges: [{ text: el.children[0].data }] }]
          }
        : null
  },
  {
    deserialize: (el: any) =>
      el.tagName === 'h2'
        ? {
            kind: 'block',
            type: H2,
            nodes: [{ kind: 'text', ranges: [{ text: el.children[0].data }] }]
          }
        : null
  },
  {
    deserialize: (el: any) =>
      el.tagName === 'h3'
        ? {
            kind: 'block',
            type: H3,
            nodes: [{ kind: 'text', ranges: [{ text: el.children[0].data }] }]
          }
        : null
  },
  {
    serialize: (el: any, children: any) =>
      el.type === H1 ? <h1>{children}</h1> : null
  },
  {
    serialize: (el: any, children: any) =>
      el.type === P ? <p>{children}</p> : null
  }
]

export const html = new Html({ rules: defaultPlugins })

const options = { terse: true }

export const createInitialState = () => ({
  editorState: Raw.deserialize(
    {
      nodes: [
        {
          kind: 'block',
          type: P,
          nodes: [
            {
              kind: 'text',
              text: ''
            }
          ]
        }
      ]
    },
    options
  )
})

export const unserialize = ({
  importFromHtml,
  serialized,
  editorState
}: {
  importFromHtml: string,
  serialized: Object,
  editorState: Object
}): { editorState: Object } => {
  if (serialized) {
    return { editorState: Raw.deserialize(serialized, options) }
  } else if (importFromHtml) {
    return { editorState: html.deserialize(importFromHtml, options) }
  } else if (editorState) {
    return { editorState }
  }

  return createInitialState()
}

export const serialize = ({ editorState }: any) => ({
  serialized: Raw.serialize(editorState, options)
})

export const merge = (states: Object[]): Object => {
  const nodes = map(path(['editorState', 'document', 'nodes']), states)
  const mergedNodes = reduce(
    (a: List<any>, b: List<any>) => a.concat(b),
    head(nodes),
    tail(nodes)
  )
  const mergedDocument = Document.create({ nodes: mergedNodes })
  const mergedEditorState = State.create({ document: mergedDocument })

  return { editorState: mergedEditorState }
}

export const split = (state: Object): Object[] => {
  const nodes = path(['editorState', 'document', 'nodes'], state)

  return nodes
    .map((node: any) => {
      const splittedDocument = Document.create({ nodes: List([node]) })
      const splittedEditorState = State.create({ document: splittedDocument })

      return { editorState: splittedEditorState }
    })
    .toArray()
}

// const position = (): {
//   top: ?number,
//   right: ?number,
//   left: ?number,
//   bottom: ?number
// } => {
//   if (window && window.getSelection) {
//     const selection = window.getSelection()
//     if (!selection.rangeCount) {
//       return {
//         top: null,
//         right: null,
//         left: null,
//         bottom: null,
//       }
//     }
//
//     return selection.getRangeAt(0).getBoundingClientRect()
//   }
//
//   if (window.document.selection) {
//     return window.document.selection
//       .createRange()
//       .getBoundingClientRect()
//   }
//
//   return {
//     top: null,
//     right: null,
//     left: null,
//     bottom: null,
//   }
// }

// if editor state is empty, remove cell when backspace or delete was pressed.
export const handleRemoveHotKey = (
  _: KeyboardEvent,
  { content: { state: { editorState } } }: Props
) =>
  new Promise(
    (resolve: Function, reject: Function) =>
      Plain.serialize(editorState).length < 1 ? resolve() : reject()
  )

const windowSelectionWaitTime = 1

export const handleFocusPreviousHotKey = (
  e: KeyboardEvent,
  { content: { state: { editorState } } }: Props
) => {
  // const isArrowUp = e.keyCode === 38

  return new Promise((resolve: Function, reject: Function) => {
    if (editorState.isExpanded) {
      return reject()
    }

    setTimeout(() => {
      // if (isArrowUp && next.top === current.top) {
      //   return resolve()
      // } else
      if (
        editorState.selection.isAtStartOf(editorState.document.nodes.first())
      ) {
        return resolve()
      }
      reject()
    }, windowSelectionWaitTime)
  })
}

export const handleFocusNextHotKey = (
  e: KeyboardEvent,
  { content: { state: { editorState } } }: Props
) => {
  // const isArrowDown = e.keyCode === 40

  return new Promise((resolve: Function, reject: Function) => {
    if (editorState.isExpanded) {
      return reject()
    }

    setTimeout(() => {
      // if (isArrowDown && next.top === current.top) {
      //   return resolve()
      // } else
      if (editorState.selection.isAtEndOf(editorState.document.nodes.last())) {
        return resolve()
      }
      reject()
    }, windowSelectionWaitTime)
  })
}
