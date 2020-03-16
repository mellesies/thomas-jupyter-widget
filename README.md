thomas-jupyter-widget
===============================

A Custom Jupyter Widget Library

![img](https://raw.githubusercontent.com/mellesies/thomas-jupyter-widget/master/img/screenshot.png)


## Installation

### Regular install

    $ pip install thomas-jupyter-widget
    $ jupyterlab labextension install thomas-jupyter-widget

### Development install
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


## Usage

* Enable extensions in Jupyter Lab (see [jupyterlab.readthedocs.io](https://jupyterlab.readthedocs.io/en/1.x/user/extensions.html))
* Run the following in a Jupyter Lab notebook:

```python
    import thomas.core
    from thomas.core import get_pkg_data
    from thomas.core import BayesianNetwork, examples
    from thomas.jupyter import BayesianNetworkWidget
    
    Gs = examples.get_student_network()
    view = BayesianNetworkWidget(Gs)
    display(view)
```

Evidence can be set by calling the method `set_evidence_hard()` on the Bayesian Network. Alternatively, you can double click on a state in the Graph.
