// @flow
/* eslint-disable no-empty-function */
import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { undo, redo } from 'src/editor/actions/undo'
import { removeCell, focusCell, blurAllCells } from 'src/editor/actions/cell'
import { isEditMode } from 'src/editor/selector/display'
import { focus } from 'src/editor/selector/focus'
import { node, editable, editables, findNode } from 'src/editor/selector/editable'
import { createStructuredSelector } from 'reselect'
import pathOr from 'ramda/src/pathOr'
import type { Editable } from 'types/editable'
import Mousetrap from 'mousetrap'

type Props = {
  children: any,
  id: string,
  undo(id: string): void,
  redo(id: string): void,
  removeCell(id: string): void,
  focus: string,
  focusCell(id: string): void,
  blurAllCells(): void,
  updateCellContent(): any,
  updateCellLayout(): any,
  isEditMode: boolean,
  node(cell: string, editable: string): Object,
  editable: Editable
}

const hotKeyHandler = (n: Object, key: string) => pathOr(pathOr(() => Promise.resolve(), ['content', 'plugin', key], n), ['layout', 'plugin', key], n)

const nextLeaf = (order: [] = [], current: string) => {
  let last

  return order.find((c: {id: string, isLeaf: boolean}) => {
    if (last === current) {
      return c.isLeaf
    }
    last = c.id
    return false
  })
}

const previousLeaf = (order: [], current: string) => nextLeaf([...order].reverse(), current)

const falser = (err: Error) => {
  if (err) {
    console.log(err)
  }
}

// const hotKeyMap = {
//   undo: ['ctrl+z', 'command+z'],
//   redo: ['ctrl+shift+z', 'ctrl+y', 'command+shift+z', 'command+y'],
//   remove: ['del', 'backspace'],
//   focusNext: ['down', 'right'],
//   focusPrev: ['up', 'left'],
//   // insert: ['insert']
// }

Mousetrap.prototype.stopCallback = () => false

let wasInitialized = false

class Decorator extends Component {

  componentDidMount() {
    if (!wasInitialized) {
      Mousetrap.bind(['ctrl+z', 'command+z'], this.handlers.undo)
      Mousetrap.bind(['ctrl+shift+z', 'ctrl+y', 'command+shift+z', 'command+y'], this.handlers.redo)
      Mousetrap.bind(['del', 'backspace'], this.handlers.remove)
      Mousetrap.bind(['down', 'right'], this.handlers.focusNext)
      Mousetrap.bind(['up', 'left'], this.handlers.focusPrev)
      wasInitialized = true
    }
  }

  props: Props

  handlers = {
    undo: () => {
      const { id, undo } = this.props
      undo(id)
    },
    redo: () => {
      const { id, redo } = this.props
      redo(id)
    },

    // remove cells
    remove: (e: Event) => {
      const { id, focus, removeCell, isEditMode, node } = this.props
      if (!isEditMode) {
        return
      }

      const n = node(focus, id)
      hotKeyHandler(n, 'handleRemoveHotKey')(e, n)
        .then(() => removeCell(focus))
        .catch(falser)
    },

    // focus next cell
    focusNext: (e: Event) => {
      const { focus, focusCell, blurAllCells, isEditMode } = this.props
      if (!isEditMode) {
        return
      }

      const { node: n, editable } = this.props.findNode(focus)
      hotKeyHandler(n, 'handleFocusNextHotKey')(e, n)
        .then(() => {
          const found = nextLeaf(editable.cellOrder, focus)
          if (found) {
            blurAllCells()
            focusCell(found.id)
          }
        })
        .catch(falser)
    },

    // focus previous cell
    focusPrev: (e: Event) => {
      const { focus, focusCell, blurAllCells, isEditMode } = this.props
      if (!isEditMode) {
        return
      }

      const { node: n, editable } = this.props.findNode(focus)
      hotKeyHandler(n, 'handleFocusPreviousHotKey')(e, n)
        .then(() => {
          const found = previousLeaf(editable.cellOrder, focus)
          if (found) {
            blurAllCells()
            focusCell(found.id)
          }
        })
        .catch(falser)
    }
  }

  render() {
    const { children } = this.props
    return children
  }
}

Decorator.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired
}

const mapStateToProps = createStructuredSelector({
  isEditMode, focus,
  node: (state: any) => (id: string, editable: string) => node(state, { id, editable }),
  findNode: (state: any) => (id: string) => findNode(state, id),
  editable: (state: any, props: any) => (id?: string) => editable(state, id ? { id } : props),
  editables
})

const mapDispatchToProps = {
  undo,
  redo,
  removeCell,
  focusCell: (id: string) => focusCell(id)(),
  blurAllCells
}

export default connect(mapStateToProps, mapDispatchToProps)(Decorator)
