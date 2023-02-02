import { deepEquals } from '@react-page/editor';
import type { FC, PropsWithChildren } from 'react';

import React, { useCallback, useEffect, useMemo } from 'react';
import { createEditor, Transforms } from 'slate';
import { ReactEditor, Slate, withReact } from 'slate-react';
import withInline from '../slateEnhancer/withInline';
import withPaste from '../slateEnhancer/withPaste';
import type { SlateProps } from '../types/component';
import DialogVisibleProvider from './DialogVisibleProvider';

const SlateProvider: FC<PropsWithChildren<SlateProps>> = (props) => {
  const { data, plugins, children, defaultPluginType } = props;
  const editor = useMemo(
    () =>
      withPaste(
        plugins,
        defaultPluginType
      )(withReact(withInline(plugins)(createEditor()))),
    []
  );
  // We abuse useMemo for a side effect
  // don't try this at home!
  // unfortunatly, slate broke the controlled input pattern. So we have to hack our way around it, see https://github.com/ianstormtaylor/slate/issues/4992
  // doing it in a `useEffect` works, but there are still timing issues where updates are lost and inconsistency arise
  useMemo(() => {
    editor.children = data?.slate;
    try {
      // focus
      ReactEditor.focus(editor);
    } catch (e) {
      // ignore, can happen
    }
    if (data.selection) {
      // update seleciton, if changed from outside (e.g. through undo)
      Transforms.select(editor, data.selection);
    } else {
      // deselect, otherwise slate might throw an eerror if cursor is now on a non existing dom node
      Transforms.deselect(editor);
    }
  }, [data?.slate, data?.selection]);

  const onChange = useCallback(() => {
    props.onChange(
      {
        slate: editor.children,
        selection: editor.selection,
      },
      {
        // mark as not undoable when state is same
        // that happens if only selection was changed
        notUndoable: deepEquals(editor.children, data?.slate),
      }
    );
  }, [data?.slate, props.onChange]);

  const initialValue = data?.slate;

  return (
    <DialogVisibleProvider>
      <Slate
        editor={editor}
        value={
          initialValue /*
      this is confusingly only for the initial value since slate 0.70something, see https://github.com/ianstormtaylor/slate/issues/4992
    */
        }
        onChange={onChange}
      >
        {children}
      </Slate>
    </DialogVisibleProvider>
  );
};

export default SlateProvider;
