'use babel'

import * as React from 'react'

export default function OpenInEditorToolbarButton() {
  return (
    <a
      onClick={() =>
        inkdrop.commands.dispatch(document.body, 'open-in-external-editor:open')
      }
      title="Open in external editor"
      className="editor-toolbar-button fa fa-external-link"
    />
  )
}
