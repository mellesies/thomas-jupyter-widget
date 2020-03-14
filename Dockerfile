# The Dockerfile tells Docker how to construct the image.
FROM mellesies/thomas-core:latest

LABEL maintainer="Melle Sieswerda <m.sieswerda@iknl.nl>"

# Copy package
COPY . /usr/local/python/thomas-jupyter-widget/

WORKDIR /usr/local/python/

RUN pip install ./thomas-jupyter-widget
RUN jupyter labextension install thomas-jupyter-widget/js
RUN cp thomas-jupyter-widget/notebooks/* thomas-core/notebooks

# JupyterLab runs on port 8888
EXPOSE 8888

# CMD /bin/bash
WORKDIR /usr/local/python/thomas-core/notebooks
CMD jupyter lab --ip 0.0.0.0 --allow-root --LabApp.token=''
