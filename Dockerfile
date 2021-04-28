# The Dockerfile tells Docker how to construct the image.
# mybinder.org doesn't accept 'latest' as tag. Docker Hub has been configured to
# automatically build this image with tag 'binder' whenever a new commit is
# pushed.
FROM mellesies/thomas-core:binder

LABEL maintainer="Melle Sieswerda <m.sieswerda@iknl.nl>"

# Copied from thomas-base.Dockerfile
ARG NB_USER=jupyter
ARG NB_UID=1000

# ENV variables are inherited from parent dockerfile
# ENV USER ${NB_USER}
# ENV NB_UID ${NB_UID}
# ENV HOME /home/${USER}
# ENV THOMAS_DIR /home/${USER}/thomas

# Copy package contents
COPY js ${THOMAS_DIR}/thomas-jupyter-widget/js
COPY thomas ${THOMAS_DIR}/thomas-jupyter-widget/thomas
COPY .nvmrc ${THOMAS_DIR}/thomas-jupyter-widget
COPY install.json ${THOMAS_DIR}/thomas-jupyter-widget
COPY MANIFEST.in ${THOMAS_DIR}/thomas-jupyter-widget
COPY pyproject.toml ${THOMAS_DIR}/thomas-jupyter-widget
COPY README.md ${THOMAS_DIR}/thomas-jupyter-widget
COPY RELEASE.md ${THOMAS_DIR}/thomas-jupyter-widget
COPY setup.cfg ${THOMAS_DIR}/thomas-jupyter-widget
COPY setup.py ${THOMAS_DIR}/thomas-jupyter-widget
COPY thomas-jupyter-widget.json ${THOMAS_DIR}/thomas-jupyter-widget

# Make sure files are owned by jupyter & install the package
WORKDIR ${THOMAS_DIR}/
USER root
RUN chown -R ${USER} ${THOMAS_DIR}
RUN chown -R ${USER} ${HOME}

USER ${USER}

# NOTE: If an editable install is required, we'll need to use a virtual
# environment.
# RUN pip install virtualenv
# RUN virtualenv ${HOME}/.venv
# RUN ${HOME}/.venv/bin/pip install -e ./thomas-jupyter-widget
# RUN ${HOME}/.venv/bin/pip install git+https://github.com/jupyterlab/jupyterlab
# RUN ${HOME}/.venv/bin/jupyter labextension develop --overwrite thomas-jupyter-widget

# Install the package as a regular install
RUN pip install ./thomas-jupyter-widget

# Set the workdir to the core package (which contains the notebooks)
# and switch users
WORKDIR ${THOMAS_DIR}/thomas-core

# Setting CMD jupyter is not necessary, since it's already set in
# thomas-core. Unless we're using an editable install, that is.
# CMD ${HOME}/.venv/bin/jupyter lab --ip 0.0.0.0 --LabApp.token=''

