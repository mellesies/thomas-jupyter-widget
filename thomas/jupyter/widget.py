import ipywidgets as widgets
from traitlets import Unicode, Any, observe

from thomas.core import BayesianNetwork

# See js/lib/widget.js for the frontend counterpart to this file.

@widgets.register
class BayesianNetworkWidget(widgets.DOMWidget):
    """An example widget."""

    # Name of the widget view class in front-end
    _view_name = Unicode('View').tag(sync=True)

    # Name of the widget model class in front-end
    _model_name = Unicode('Model').tag(sync=True)

    # Name of the front-end module containing widget view
    _view_module = Unicode('thomas-jupyter-widget').tag(sync=True)

    # Name of the front-end module containing widget model
    _model_module = Unicode('thomas-jupyter-widget').tag(sync=True)

    # Version of the front-end module containing widget view
    _view_module_version = Unicode('^0.1.0').tag(sync=True)
    # Version of the front-end module containing widget model
    _model_module_version = Unicode('^0.1.0').tag(sync=True)

    # Widget specific property.
    # Widget properties are defined as traitlets. Any property tagged with `sync=True`
    # is automatically synced to the frontend *any* time it changes in Python.
    # It is synced back to Python from the frontend *any* time the model is touched.
    value = Any().tag(sync=True)
    marginals = Any().tag(sync=True)
    query = Any().tag(sync=True)

    def __init__(self, bn, **kwargs):
        """Create a new instance.

        Args:
            bn (BayesianNetwork): BN to display.
        """
        super().__init__(**kwargs)
        self.bn = bn

    @property
    def bn(self):
        """Get the BN on display."""
        return BayesianNetwork.from_dict(self.value)

    @bn.setter
    def bn(self, bn):
        """Set the BN on display."""
        probs = bn.compute_marginals()
        self.marginals = {key: value.zipped() for key, value in probs.items()}
        self.query = {}

        # Setting value updates the rendering of the BN, so has to be done last.
        self.value = bn.as_dict()
