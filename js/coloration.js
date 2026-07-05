(function (global) {
    "use strict";

    class DeviceColorizer {
        constructor({ canvas, fallbackImage, placeholder }) {
            this.canvas = canvas;
            this.context = canvas.getContext("2d");
            this.fallbackImage = fallbackImage;
            this.placeholder = placeholder;
            this.assetCache = new Map();
            this.renderToken = 0;
        }

        async render({ model = {}, version = {}, color = "" } = {}) {
            const renderToken = ++this.renderToken;
            const config = this.getConfig(model, version);

            if (!config.imageBase) {
                this.showFallback(config.image);
                return;
            }

            const tintColor = config.palette[color] || "";

            if (!tintColor || config.maskPaths.length === 0) {
                this.showFallback(config.imageBase);
                return;
            }

            try {
                const [baseImage, ...maskImages] = await Promise.all([
                    this.loadAsset(config.imageBase),
                    ...config.maskPaths.map(path => this.loadAsset(path))
                ]);

                if (renderToken !== this.renderToken) return;

                this.canvas.width = baseImage.naturalWidth;
                this.canvas.height = baseImage.naturalHeight;

                this.context.clearRect(
                    0,
                    0,
                    this.canvas.width,
                    this.canvas.height
                );

                this.context.drawImage(
                    baseImage,
                    0,
                    0,
                    this.canvas.width,
                    this.canvas.height
                );

                maskImages.forEach(maskImage => {
                    this.drawTintedRegion(
                        baseImage,
                        maskImage,
                        tintColor
                    );
                });

                this.fallbackImage.style.display = "none";
                this.canvas.style.display = "block";
                this.placeholder.style.display = "none";

            } catch (error) {
                console.error(
                    "Recoloration impossible : affichage de l’image de secours.",
                    error
                );

                if (renderToken === this.renderToken) {
                    this.showFallback(
                        config.image || config.imageBase
                    );
                }
            }
        }

        getConfig(model, version) {
            const image =
                version.image ||
                model.image ||
                "";

            const imageBase =
                version.imageBase ||
                model.imageBase ||
                image;

            const additionalMasks =
                Array.isArray(version.masks)
                    ? version.masks
                    : (
                        Array.isArray(model.masks)
                            ? model.masks
                            : []
                    );

            const namedMasks = [
                version.maskBody || model.maskBody || "",
                version.maskScreen || model.maskScreen || ""
            ];

            return {
                image,
                imageBase,
                palette: version.palette || model.palette || {},
                maskPaths: [
                    ...additionalMasks,
                    ...namedMasks
                ].filter(Boolean)
            };
        }

        loadAsset(path) {
            if (!this.assetCache.has(path)) {
                const assetPromise = new Promise((resolve, reject) => {
                    const image = new Image();

                    image.onload = () => resolve(image);

                    image.onerror = () => reject(
                        new Error(`Image introuvable : ${path}`)
                    );

                    image.src = path;
                }).catch(error => {
                    this.assetCache.delete(path);
                    throw error;
                });

                this.assetCache.set(path, assetPromise);
            }

            return this.assetCache.get(path);
        }

        drawTintedRegion(baseImage, maskImage, tintColor) {
            const layer = document.createElement("canvas");

            layer.width = this.canvas.width;
            layer.height = this.canvas.height;

            const layerContext = layer.getContext("2d");

            layerContext.drawImage(
                baseImage,
                0,
                0,
                layer.width,
                layer.height
            );

            layerContext.globalCompositeOperation = "multiply";
            layerContext.fillStyle = tintColor;
            layerContext.fillRect(
                0,
                0,
                layer.width,
                layer.height
            );

            layerContext.globalCompositeOperation = "destination-in";

            layerContext.drawImage(
                maskImage,
                0,
                0,
                layer.width,
                layer.height
            );

            layerContext.globalCompositeOperation = "source-over";

            this.context.drawImage(layer, 0, 0);
        }

        showFallback(imagePath) {
            this.canvas.style.display = "none";

            if (imagePath) {
                this.fallbackImage.src = imagePath;
                this.fallbackImage.style.display = "block";
                this.placeholder.style.display = "none";
            } else {
                this.fallbackImage.src = "";
                this.fallbackImage.style.display = "none";
                this.placeholder.style.display = "block";
            }
        }
    }

    global.DeviceColorizer = DeviceColorizer;

})(window);
