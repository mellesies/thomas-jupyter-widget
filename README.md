thomas-jupyter-widget
=====================

Widget to display and interact with Bayesian Networks from [thomas-core](https://github.com/mellesies/thomas-core) in JupyterLab.

This version only supports JupyterLab >= 3.

Table of contents
-----------------
1. [Regular Installation](#regular-installation)
2. [Usage](#usage)
3. [Development installation](#development-installation)


![img](https://raw.githubusercontent.com/mellesies/thomas-jupyter-widget/master/img/screenshot.png)


Regular Installation
--------------------
The package can be installed through `pip`:
```bash
pip install thomas-jupyter-widget
```


Usage
-----
In JupyterLab, try the following:
```python
import thomas.core
from thomas.core import examples
from thomas.jupyter import BayesianNetworkWidget

# Load the Student network
Gs = examples.get_student_network()

# Display the widget
view = BayesianNetworkWidget(Gs, height=300)
display(view)

# Set evidence on the BN. This should update the probabilities throughout the
# network. Note that double-clicking on a state in the widget has the same
# effect.
Gs.set_evidence_hard('I', 'i1')
```


Development Installation
------------------------
First ensure that `nodejs` (>=12) and `yarn` are installed. In debian, you can use the following if you have `sudo` privileges:
```bash
curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -

# Running apt-get update is not necessary, since it's alread called in the
# above setup script.
sudo apt-get install -y nodejs

# Install yarn properly. The version of yarn that's available by default is
# just weird.
sudo apt-get remove cmdtest
sudo npm install --global yarn
```

Second, depending on your situation, you may want to create a virtual environment. For example, this might be useful if the command `jupyter labextension develop --overwrite .` fails because it cannot write to the system-wide extensions folder (e.g. `/usr/local`). Under debian/ubuntu, a virtual environment can be created as follows:
```bash
# Install the virtualenv package to make life easier
pip install virtualenv

# Create a virtual environment in the subdirectory '.venv'
virtualenv .venv

# Activate the virtual environment.
source .venv/bin/activate
```

After the preliminaries, install the package as follows:

```bash
# Clone the repository and move into the directory
git clone https://github.com/mellesies/thomas-jupyter-widget.git
cd thomas-jupyter-widget

# Checkout branch jupyter3
git checkout jupyter3

# Install the package in editable mode.
pip install -e .

# We need the latest version of JupyterLab, otherwise this will fail
pip install git+https://github.com/jupyterlab/jupyterlab

# link your development version of the extension with JupyterLab
jupyter labextension develop --overwrite .

# watch the source directory, automatically rebuilding when needed
yarn --cwd ./js run watch
```

Then, start JupyterLab like you normally would in a separate terminal (and don't forget to activate the virtual environment if you're using one ;-).

