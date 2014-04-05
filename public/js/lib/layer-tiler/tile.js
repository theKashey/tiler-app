modules.define('layer-tiler-tile', [
    'inherit',
    'vow',
    'layer-tiler-image-source',
    'node-canvas',
    'node-util',
    'node-fs',
    'tile-config'
], function (provide, inherit, vow, ImageSource, Canvas, util, fs, config) {

    /**
     * @class
     * @name Tile
     * @augments ImageSource
     * @param {Number} width Tile width.
     * @param {Number} height Tile height.
     */
    var Tile = inherit(ImageSource, /** @lends Tile prototype. */ {
        /**
         * @constructor
         */
        __constructor: function (size) {
            this._source = new Canvas(size, size);
        },
        /**
         * Write canvas source to the image file.
         * @borrows ImageSource.save
         * @function
         * @name Tile.save
         * @param {String} url Path to the image.
         * @param {String} [type="png"] Type of the image "png" or "jpg".
         * @returns {vow.Promise} Promise A+.
         */
        save: function (path, x, y, zoom) {
            var tileType = config.get('type'),
                url = util.format(config.get('urlTemplate'), path, zoom, x, y, tileType.replace('image/', ''));

            return this.__base.call(this, url, tileType);
        },
        resize: function (size) {
            var canvas = new Canvas(size, size),
                ctx = canvas.getContext('2d');

            ctx.imageSmoothingEnabled = true;
            ctx.drawImage(this._source.getElement(), 0, 0, size, size);

            this._source = canvas;

            return this;
        },
        draw: function (source, sx, sy, sw, sh, tx, ty, tw, th) {
            this.getContext()
                .drawImage(source, sx, sy, sw, sh, tx, ty, tw, th);

            return this;
        },
        getFillStyle: function () {
            return this.getSource().getContext().fillStyle;
        },
        /**
         * @see http://www.w3schools.com/cssref/css_colors_legal.asp
         */
        setFillStyle: function (fillStyle) {
            var ctx = this.getSource().getContext(),
                tmp = ctx.globalCompositeOperation;

            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = fillStyle;
            ctx.fillRect(0, 0, this.getWidth(), this.getHeight());
            ctx.globalCompositeOperation = tmp;

            return this;
        },
        getOpacity: function () {
            return this.getSource().getContext().globalAlpha;
        },
        setOpacity: function (opacity) {
            this.getSource().getContext().globalAlpha = opacity;

            return this;
        },
        toDataURL: function (type) {
            return this.getSource().getElement().toDataURL(type);
        }
    });

    provide(Tile);
});
