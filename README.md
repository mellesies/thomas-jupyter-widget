thomas-jupyter-widget
===============================

A Custom Jupyter Widget Library

![img](img/screenshot.png)


Installation
------------

For a development installation (requires npm),

    $ git clone https://github.com/mellesies/thomas-jupyter-widget.git
    $ cd thomas-jupyter-widget
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix thomas-jupyter-widget
    $ jupyter nbextension enable --py --sys-prefix thomas-jupyter-widget
    $ jupyter labextension install js

When actively developing your extension, build Jupyter Lab with the command:

    $ jupyter lab --watch

This take a minute or so to get started, but then allows you to hot-reload your javascript extension.
To see a change, save your javascript, watch the terminal for an update.

Note on first `jupyter lab --watch`, you may need to touch a file to get Jupyter Lab to open.

