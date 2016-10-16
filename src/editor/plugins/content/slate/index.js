// @flow
// TODO lint: prefer-reflect doesn't work with slate state #158
/* eslint no-duplicate-imports: ["off"] */
/* eslint prefer-reflect: ["off"] */
import Subject from 'material-ui/svg-icons/action/subject'
import React from 'react'
import { ContentPlugin } from 'src/editor/service/plugin/classes'
import Component from './Component'
import type { Props } from './Component'

import * as hooks from './hooks'

export default class SlatePlugin extends ContentPlugin {
  Component = Component
  name = 'ory/content/slate'
  version = '0.0.1'
  icon = <Subject />
  text = 'Text'

  onFocus = (props: Props) => {
    if (props.state.editorState.isFocused) {
      return
    }
  }

  onBlur = (props: Props) => {
    if (!props.state.editorState.isFocused) {
      return
    }

    props.onChange({
      editorState: props.state.editorState
        .transform()
        .blur()
        .apply()
    })
  }

  onRemoveHotKey = hooks.onRemoveHotKey
  onFocusPreviousHotKey = hooks.onFocusPreviousHotKey
  onFocusNextHotKey = hooks.onFocusNextHotKey

  createInitialState = hooks.createInitialState
  serialize = hooks.serialize
  unserialize = hooks.unserialize
  merge = hooks.merge
  split = hooks.split
}
