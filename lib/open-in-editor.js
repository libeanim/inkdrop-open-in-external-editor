'use babel'

import OpenInEditorMessageDialog from './open-in-editor-message-dialog'
import OpenInEditorToolbarButton from './open-in-editor-toolbar-button'

module.exports = {
  activate() {
    inkdrop.components.registerClass(OpenInEditorMessageDialog)
    inkdrop.layouts.addComponentToLayout('modal', 'OpenInEditorMessageDialog')

    inkdrop.components.registerClass(OpenInEditorToolbarButton)
    inkdrop.layouts.addComponentToLayout(
      'editor-toolbar',
      'OpenInEditorToolbarButton'
    )
  },

  deactivate() {
    inkdrop.layouts.removeComponentFromLayout(
      'modal',
      'OpenInEditorMessageDialog'
    )
    inkdrop.components.deleteClass(OpenInEditorMessageDialog)
  },

  config: {
    editorPath: {
      title: 'Editor path',
      type: 'string',
      description: 'The path to the editor you want to use',
      default: ''
    },
    editorArgs: {
      title: 'Editor arguments',
      type: 'string',
      description:
        'Any additional arguments for your editor to function properly',
      default: ''
    }
  }
}
