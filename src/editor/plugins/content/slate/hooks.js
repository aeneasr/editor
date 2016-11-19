// @flow
// FIXME #125: missing types for slate internals
/* eslint-disable react/display-name */
/* eslint-disable new-cap */
import { List } from 'immutable'
import head from 'ramda/src/head'
import map from 'ramda/src/map'
import path from 'ramda/src/path'
import reduce from 'ramda/src/reduce'
import tail from 'ramda/src/tail'
import React from 'react'
import type { Props } from './Component'

import { H1, H2, H3 } from './plugins/headings'
import { P } from './plugins/paragraph'

// FIXME #126
// flow-disable-next-line named exports
import { Document, Html, Raw, State, Plain } from 'slate'

const rules = [{
  deserialize: (el: any) => el.tagName === 'p' ? {
    kind: 'block',
    type: P,
    nodes: [{ kind: 'text', ranges: [{ text: el.children[0].data }] }]
  } : null
}, {
  deserialize: (el: any) => el.tagName === 'h1' ? {
    kind: 'block',
    type: H1,
    nodes: [{ kind: 'text', ranges: [{ text: el.children[0].data }] }]
  } : null
}, {
  deserialize: (el: any) => el.tagName === 'h2' ? {
    kind: 'block',
    type: H2,
    nodes: [{ kind: 'text', ranges: [{ text: el.children[0].data }] }]
  } : null
}, {
  deserialize: (el: any) => el.tagName === 'h3' ? {
    kind: 'block',
    type: H3,
    nodes: [{ kind: 'text', ranges: [{ text: el.children[0].data }] }]
  } : null
}, {
  serialize: (el: any, children: any) => el.type === H1
    ? <h1>{children}</h1>
    : null
}, {
  serialize: (el: any, children: any) => el.type === P
    ? <p>{children}</p>
    : null
}]

export const html = new Html({ rules })

const options = { terse: true }

export const createInitialState = () => ({
  editorState: Raw.deserialize({
    nodes: [{
      kind: 'block',
      type: P,
      nodes: [{
        kind: 'text',
        ranges: [{ text: '' }]
      }]
    }]
  }, options)
})

export const unserialize = ({ importFromHtml, serialized }: { importFromHtml: string, serialized: Object }): { editorState: Object } => {
  if (serialized) {
    return { editorState: Raw.deserialize(serialized, options) }
  } else if (importFromHtml) {
    return { editorState: html.deserialize(importFromHtml, options) }
  }

  return createInitialState()
}

export const serialize = ({ editorState }: any) => ({
  serialized: Raw.serialize(editorState, options)
})

export const merge = (states: Object[]): Object => {
  const nodes = map(path(['editorState', 'document', 'nodes']), states)
  const mergedNodes = reduce((a: List<any>, b: List<any>) => a.concat(b), head(nodes), tail(nodes))
  const mergedDocument = Document.create({ nodes: mergedNodes })
  const mergedEditorState = State.create({ document: mergedDocument })

  return { editorState: mergedEditorState }
}

export const split = (state: Object): Object[] => {
  const nodes = path(['editorState', 'document', 'nodes'], state)

  return nodes.map(
    (node: any) => {
      const splittedDocument = Document.create({ nodes: List([node]) })
      const splittedEditorState = State.create({ document: splittedDocument })

      return { editorState: splittedEditorState }
    }
  ).toArray()
}

const position = (): {
  top: ?number,
  right: ?number,
  left: ?number,
  bottom: ?number
} => {
  if (window && window.getSelection) {
    const selection = window.getSelection()
    if (!selection.rangeCount) {
      return {
        top: null,
        right: null,
        left: null,
        bottom: null,
      }
    }

    return selection.getRangeAt(0).getBoundingClientRect()
  }

  if (window.document.selection) {
    return window.document.selection
      .createRange()
      .getBoundingClientRect()
  }

  return {
    top: null,
    right: null,
    left: null,
    bottom: null,
  }
}

// if editor state is empty, remove cell when backspace or delete was pressed.
export const handleRemoveHotKey = (_: KeyboardEvent, { content: { state: { editorState } } }: Props) => new Promise((resolve: Function, reject: Function) => Plain.serialize(editorState).length < 1 ? resolve() : reject())

// fixme disabled this completely because of #135
// export const handleFocusPreviousHotKey = () => Promise.reject()

const windowSelectionWaitTime = 1

export const handleFocusPreviousHotKey = (e: KeyboardEvent, { content: { state: { editorState } } }: Props) => {
  const current = position()
  // const isArrowUp = e.keyCode === 38

  return new Promise((resolve: Function, reject: Function) => {
    if (editorState.isExpanded) {
      return reject()
    }

    setTimeout(() => {
      const next = position()

      // if (isArrowUp && next.top === current.top) {
      //   return resolve()
      // } else
      if (next.top === current.top && next.right === current.right) {
        return resolve()
      }
      reject()
    }, windowSelectionWaitTime)
  })
}

// fixme disabled this completely because of #135
// export const handleFocusNextHotKey = () => Promise.reject()
export const handleFocusNextHotKey = (e: KeyboardEvent, { content: { state: { editorState } } }: Props) => {
  const current = position()
  // const isArrowDown = e.keyCode === 40

  return new Promise((resolve: Function, reject: Function) => {
    if (editorState.isExpanded) {
      return reject()
    }

    setTimeout(() => {
      const next = position()

      // if (isArrowDown && next.top === current.top) {
      //   return resolve()
      // } else
      if (next.top === current.top && next.right === current.right) {
        return resolve()
      }
      reject()
    }, windowSelectionWaitTime)
  })
}
