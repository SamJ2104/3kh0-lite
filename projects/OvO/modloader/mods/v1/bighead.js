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
            this.scale = 2;
            this.enabled = false;

            runtime.tickMe(this);
            globalThis.ovoBigLayer = this;

            window.addEventListener('keydown', (event) => {
                if (event.key === 'Control') {
                    this.enabled = !this.enabled;
                }
            });
        },

        tick() {
            if (isInLevel()) {
                const layer = getLayer();
                if (layer) {
                    layer.instances.forEach(instance => {
                        if (this.enabled) {
                            instance.width = instance.originalWidth * this.scale;
                            instance.height = instance.originalHeight * this.scale;
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
