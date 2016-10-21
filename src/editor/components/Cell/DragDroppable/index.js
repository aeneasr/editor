// @flow
import { identity } from 'ramda'
import React, { Component, PropTypes } from 'react'
import { shouldPureComponentUpdate } from 'src/editor/helper/shouldComponentUpdate'
import * as hoverActions from 'src/editor/actions/cell/drag'
import * as insertActions from 'src/editor/actions/cell/insert'
import { DragSource as dragSource, DropTarget as dropTarget } from 'react-dnd'
import { connect } from 'react-redux'
import cssModules from 'react-css-modules'
import { target, source, connect as monitorConnect, collect } from './helper/dnd'
import styles from './index.scoped.css'
import classNames from 'classnames'

class DragDroppable extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidMount() {
    const img = new Image();
    img.onload = () => this.props.connectDragPreview(img)
    img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAhCAYAAACbffiEAAAA6UlEQVRYhe2ZQQ6CMBBFX0njHg7ESXTp1p3uvIBewc3Em3AfdelSFwRDCAm01JRO+pa0lP8zzc9kMCKyAa7AFqhIixdwB44WuACHuHq8KWm1vwtgF1lMCPaWkevUNE3Qr9R17XTu1P5uvUdV+IpbG2qMGBH5xBYRAjUVUWPEjj10SS3XRFry3kha/VBTETVGcmqtDTVGFqdWn7k9ku96f88QNRVRYySn1tpQY8QptXz7qinmnpt7rZTIqbU21BgJ2mv1+XfCDVFTETVGjIg8SG8KP+RZ0I7lU+dmgRNgaKfyZVw9znT/R85fOHJJE77U6UcAAAAASUVORK5CYII='
  }

  render() {
    const {
      allowDrop = false,
      connectDragSource,
      connectDropTarget,
      isDragging,
      isLayoutMode, isInsertMode,
      className,
      node: {
        hover,
        inline,
      },
      children
    } = this.props

    const decorator = allowDrop && !inline ? connectDropTarget : identity
    let classes = classNames(
      'draggable',
      {
        'is-over-current': hover && allowDrop,
        [`is-over-${hover}`]: hover && allowDrop,
        'is-dragging': isDragging
      }
    )

    if (!(isLayoutMode || isInsertMode)) {
      classes = ''
    }

    if (isLayoutMode || isInsertMode) {
      return connectDragSource(decorator(
        <div styleName={classes} className={className}>
          {children}
        </div>
      ))
    }

    return (
      <div styleName={classes} className={className}>
        {children}
      </div>
    )
  }
}

DragDroppable.propTypes = {
  allowDrop: PropTypes.bool,
  isOver: PropTypes.bool.isRequired,
  isOverCurrent: PropTypes.bool.isRequired,
  isDragging: PropTypes.bool.isRequired,

  node: PropTypes.shape({
    hover: PropTypes.string
  }).isRequired,

  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,

  dragCell: PropTypes.func.isRequired,
  clearHover: PropTypes.func.isRequired
}

const mapDispatchToProps = { ...hoverActions, ...insertActions }

export default connect(null, mapDispatchToProps)(dropTarget(({ dropTypes }: { dropTypes: Array<string> }) => dropTypes, target, monitorConnect)(dragSource(({ dragType }: { dragType: string }) => dragType, source, collect)(cssModules(DragDroppable, styles, { allowMultiple: true }))))
