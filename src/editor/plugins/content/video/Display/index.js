// @flow
import React from 'react'
import cssModules from 'react-css-modules'
import PlayArrow from 'material-ui/svg-icons/av/play-arrow'
import styles from '../index.scoped.css'
import { iconStyle } from '../common.js'
import ReactPlayer from 'react-player'
import type { PropTypes } from '../index.js'

const Display = ({ state: { src }, readOnly }: PropTypes) => src ? (
  <div style={{ position: 'relative', height: 0, paddingBottom: '65.25%' }}>
    {readOnly ? null : <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }} />}
    <ReactPlayer url={src} height="100%" width="100%" style={{ position: 'absolute', width: '100% !important', height: '100% !important' }} />
  </div>
) : (
  <div styleName="placeholder">
    <PlayArrow style={iconStyle} />
  </div>
)

export default cssModules(Display, styles, { allowMultiple: true })
