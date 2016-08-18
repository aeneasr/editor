import React, { Component, PropTypes } from 'react'
import cssModules from 'react-css-modules'
import debounce from 'lodash.debounce'
import { ResizableBox } from 'react-resizable'
import classNames from 'classnames'

import styles from './index.scoped.css'

const compute = ({ height }) => ({ height: height > 24 ? height : 24 })

const fire = debounce(({ state, onChange }) => onChange(state), 1000, { leading: false })

const Solid = ({ height }) => <div style={{ height }} />

Solid.propTypes = {
  height: PropTypes.number
}

class Spacer extends Component {
  constructor(props) {
    super(props)

    this.state = compute(props.state)
    this.onResize = this.onResize.bind(this)
  }

  onResize(event, { size }) {
    const { onChange } = this.props
    const state = compute(size)
    this.setState(state)
    fire({ onChange, state })
  }

  render() {
    const { readOnly } = this.props
    return (
      <div className="editable-spacer" styleName={classNames({ spacer: true, 'read-only': readOnly })}>
        {readOnly
          ? (
          <Solid height={this.state.height} />
        ) : (
          <ResizableBox onResize={this.onResize} height={this.state.height}>
            <div />
          </ResizableBox>
        )}
      </div>
    )
  }
}

Spacer.propTypes = {
  onChange: PropTypes.func.isRequired,
  state: PropTypes.shape({
    height: PropTypes.number
  }),
  readOnly: PropTypes.bool.isRequired
}

export default cssModules(Spacer, styles, { allowMultiple: true })
