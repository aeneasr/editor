import React from 'react'
import ReactDOM from 'react-dom'
import Editor, { EditableComponent, ControlsComponent } from 'src/editor'
import VideoPlugin from './plugins/video'
import ContainerPlugin from './plugins/container'
import { PluginService, defaultLayoutPlugins, defaultContentPlugins } from 'src/editor/service'
import content from './content.js'

require('react-tap-event-plugin')()

const editor = new Editor({
  plugins: new PluginService(defaultContentPlugins, [
    ...defaultLayoutPlugins,
    VideoPlugin,
    ContainerPlugin
  ])
})

const elements = document.querySelectorAll('.editable')
for (const element of elements) {
  ReactDOM.render((
    <EditableComponent
      editor={editor}
      state={content[element.dataset.editable]}
      // onChange={(state) => console.log(state)}
    />
  ), element)
}

ReactDOM.render(<ControlsComponent editor={editor} />, document.getElementById('controls'))
