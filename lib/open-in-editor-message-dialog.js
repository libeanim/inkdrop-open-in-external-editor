'use babel'

import * as React from 'react'
import { CompositeDisposable } from 'event-kit'
import * as fs from 'fs'
import * as tmp from 'tmp'
import { actions } from 'inkdrop'
import { spawn } from 'child_process'

export default class OpenInEditorMessageDialog extends React.Component {
  editor = null
  dialog = null
  deleteTmpFile = null

  componentDidMount() {
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(
      inkdrop.commands.add(document.body, {
        'open-in-external-editor:open': () => this.open()
      })
    )
  }

  componentWillUnmount() {
    this.subscriptions.dispose()
  }

  render() {
    const { MessageDialog } = inkdrop.components.classes
    return (
      <MessageDialog
        ref={d => (this.dialog = d)}
        title="Waiting for external editor"
        buttons={[{ label: 'Force quit', cancel: true }]}
        onDismiss={this.onDismiss}
      >
        <p>
          This note is opened in an external editor. Close the external editor
          to conitnue or click on &quot;Force quit&quot; to cancel.
        </p>
      </MessageDialog>
    )
  }

  openAndMonitorExternalEditor() {
    const { editingNote } = inkdrop.store.getState()
    const editorPath = inkdrop.config.get('open-in-external-editor.editorPath')
    const editorArgs = inkdrop.config.get('open-in-external-editor.editorArgs')
    // console.log('Open Editor', editorPath, editorArgs)

    // Create temporary file
    tmp.file((err, path, fd, cleanupCallback) => {
      if (err) {
        inkdrop.notifications.addError(
          `Could not create temporary file.\n${err}`
        )
        this.dialog.dismissDialog()
        return
      }

      this.deleteTmpFile = cleanupCallback

      fs.writeFileSync(path, editingNote.body)
      this.editor = spawn(editorPath, [editorArgs, path])

      // Monitor editor
      this.editor.on('close', () => {
        const newBody = fs.readFileSync(path).toString()

        // Only update editor if a change happened
        if (newBody !== editingNote.body) {
          inkdrop.store.dispatch(actions.editingNote.update({ body: newBody }))

          // Timeout to ensure the store action has been dispatched.
          setTimeout(
            // FIXME: Saving the note does not work.
            () => inkdrop.commands.dispatch(document.body, 'core:save-note'),
            500
          )
        }

        this.dialog.dismissDialog()
      })
    })
  }

  onDismiss = (caller, buttonIndex) => {
    if (buttonIndex === 0) {
      /* Force quit */
      this.forceQuit()
      return true
    } else if (buttonIndex === undefined) {
      /* editor closed */
      this.dispose()
      return true
    }
    return false
  }

  forceQuit() {
    if (this.editor) {
      this.editor.removeAllListeners()
      this.editor.kill()
    }
    this.dispose()
  }

  open() {
    const editorPath = inkdrop.config.get('open-in-external-editor.editorPath')
    if (!editorPath) {
      inkdrop.notifications.addError(
        `Path to external editor is not set. Please update the plugin settings.`
      )
      return
    }
    if (!this.dialog.isShown) {
      this.dialog.showDialog()
      this.openAndMonitorExternalEditor()
    }
  }

  dispose() {
    if (this.deleteTmpFile) {
      this.deleteTmpFile()
    }
    if (this.editor) {
      this.editor.removeAllListeners()
    }

    this.editor = null
    this.deleteTmpFile = null
  }
}
