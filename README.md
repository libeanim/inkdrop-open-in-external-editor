# Inkdrop Open in External Editor

An [Inkdrop](https://www.inkdrop.info/) plugin to open a note in an external editor.

## Install

```
ipm install open-in-external-editor
```

## Usage

1. Open the plugin settings and add the path to the editor you want to use (e.g. [Visual Studio Code](https://code.visualstudio.com/)):  
    ![inkdrop plugin settings](https://github.com/libeanim/inkdrop-open-in-external-editor/raw/master/docs/images/plugin-settings.png)  
    *(Notice the additional argument `--wait` which is required for VisualStudio in order to work. Other editors might not need additional arguments, you can leave it empty in this case.)*
2. To open the current note in an external editor, click on the new button in the editor toolbar:  
   ![inkdrop editor toolbar](https://github.com/libeanim/inkdrop-open-in-external-editor/raw/master/docs/images/editor-toolbar.png)  
   *(See red arrow)*
3. Now modify the note in the external editor. Inkdrop will wait until you have finished editing:  
   ![plugin wait dialog](https://github.com/libeanim/inkdrop-open-in-external-editor/raw/master/docs/images/wait-dialog.png)  
4. Once you are done, save the file and close the external editor. Inkdrop should notice that the editor is closed and automatically update the note with your changes.