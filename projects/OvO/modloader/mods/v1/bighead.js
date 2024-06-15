(function () {
    const old = globalThis.sdk_runtime;
    c2_callFunction("execCode", ["globalThis.sdk_runtime = this.runtime"]);
    const runtime = globalThis.sdk_runtime;
    globalThis.sdk_runtime = old;

    const getLayer = () => {
        return runtime.running_layout.layers.find(x => x.name === "Layer 0");
    }

    const isInLevel = () => {
        return runtime.running_layout.sheetname === "Levels";
    }

    const bigLayerMod = {
        init() {
            this.bigScale = 2;
            this.smallScale = 0.5;
            this.enabled = false;
            this.shrinkEnabled = false;

            runtime.tickMe(this);
            globalThis.ovoBigLayer = this;

            window.addEventListener('keydown', (event) => {
                if (event.key === 'Control') {
                    this.enabled = !this.enabled;
                    this.shrinkEnabled = false; // Disable shrinking if Control is pressed
                }
                if (event.key === 'Shift') {
                    this.shrinkEnabled = !this.shrinkEnabled;
                    this.enabled = false; // Disable enlarging if Shift is pressed
                }
            });
        },

        tick() {
            if (isInLevel()) {
                const layer = getLayer();
                if (layer) {
                    layer.instances.forEach(instance => {
                        if (this.enabled) {
                            instance.width = instance.originalWidth * this.bigScale;
                            instance.height = instance.originalHeight * this.bigScale;
                        } else if (this.shrinkEnabled) {
                            instance.width = instance.originalWidth * this.smallScale;
                            instance.height = instance.originalHeight * this.smallScale;
                        } else {
                            instance.width = instance.originalWidth;
                            instance.height = instance.originalHeight;
                        }
                    });
                }
            }
        }
    };

    // Store original dimensions to reset correctly
    const layer = getLayer();
    if (layer) {
        layer.instances.forEach(instance => {
            instance.originalWidth = instance.width;
            instance.originalHeight = instance.height;
        });
    }

    bigLayerMod.init();
})();
