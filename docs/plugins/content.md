# Content plugins

The ORY Editor ships a few handy content plugins per default:

1. A plugin for [text editing](#text-editing), based on [Slate](http://slatejs.org).
2. A plugin for embedding [images](#image).
3. A plugin for embedding [videos](#video) from Vimeo and YouTube.
4. A [spacer](#spacer) plugin.

## Text editing

The text editing allows you to create and modify rich-text and is optimized for use with the ORY Editor. We strongly
encourage using our text editing solution.

<p>
  <figure align="center">
    <img alt="Text editing plugin" src="/images/text-editing-plugin.gif"><br>
    <figcaption>The text editing plugin based on <a href="http://slatejs.org">Slate</a></figcaption>
  </figure>
</p>

### Customize text editing

By default we provide the following plugins:

- AlignmentPlugin: allows to align left, right center and justify,
- BlockquotePlugin: place a blockquote
- CodePlugin: place code
- EmphasizePlugin: place em tags
- HeadingsPlugin: place headings h1 - h6
- LinkPlugin: place links
- ListsPlugin: place ordered and unordered lists
- ParagraphPlugin: place paragraphs

If you only want to include some plugins, you can specify them:

```
import slate, { slatePlugins } from '@react-page/plugins-slate';


const slatePlugin = slate([
  new slatePlugins.HeadingsPlugin(),
  new slatePlugins.ParagraphPlugin(),
]);

const plugins: Plugins = {
  content: [
    slatePlugin,
    // ...
  ],
  // ...

};

const editor = new Editor({
  plugins: plugins,
  // pass the content states
  editables: [
    ...content,
    // creates an empty state, basically like the line above
    createEmptyState(),
  ],
});
```

Some plugins allow further configuration. E.g. most plugins implement `getComponent` where you can override the component rendering:

```

// any custom component
const RedH1 = ({ style, ...props }: Props) => (
  <h1 style={{ ...style, color: 'red' }} {...props} />
);

const slatePlugin = slate([
  new slatePlugins.HeadingsPlugin({
    allowedLevels: [1],
    getComponent: ({ type }: { type: string; data: any }) => RedH1,
  })

```

## Image

The image plugin allows you to add images to your content by entering their URL. The image plugin does not support
uploads.

<p>
  <figure align="center">
    <img alt="Image plugin" src="/images/image-plugin.gif"><br>
    <figcaption>The image plugin</figcaption>
  </figure>
</p>

The image plugin is not configurable.

## Video

The video plugin allows you to add videos to your content by entering their URL. The video plugin does not support
uploads.

<p>
  <figure align="center">
    <img alt="Video plugin" src="/images/video-plugin.gif"><br>
    <figcaption>The video plugin</figcaption>
  </figure>
</p>

The video plugin is not configurable.

## Spacer

The spacer is a plugin which you can use to create an empty fixed height cell.

<p>
  <figure align="center">
    <img alt="Spacer plugin" src="/images/spacer-plugin.gif"><br>
    <figcaption>The spacer plugin</figcaption>
  </figure>
</p>

The spacer plugin is not configurable.

## Create your own plugins

A content plugin in its minimal form is described with this object:

```
{
  Component: YourComponent,
  name: 'some/unique/name',
  version: '0.0.1',
  IconComponent: <YourIcon />,
  text: "Name of the plugin",
  description: "description of the plugin
}
```

`Component` receives the Component that renders the content of your plugin and its controls (if any). It will receive the following props:

- `state` (object): the properties of the plugin. this is usually defined by the Controls of the plugin
- `readOnly` (boolean): true means the editor just shows the content. If false, the editor is in edit mode and you should allow users to configure your Component. Usually you will render the plugins controls if readOnly is false
- `focused` (boolean): whether the plugin is select in edit mode. You should reveal the controls if this property is true
- `onChange`: (function): Call this function with a new `state` to update the `state` of the plugin. This is usally the responsiblity of the controls

Most built-in plugins use a bottom toolbar with a form as Controls. See for example the image plugin which allows to define the image url and other properties.

### Create your own plugin with default material-ui controls

Because it can be tedious to implement controls for a plugin, we started to develop a plugin that make this much easier: `@react-page/create-plugin-materialui`

See [the readme of this library for more information](/packages/plugins/createPluginMaterialUi/README.md)
