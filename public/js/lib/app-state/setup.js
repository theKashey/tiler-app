modules.define('app-state-setup', [
    'inherit',
    'ymaps',
    'app-state-base',
    'ymaps-layout-layer-setup'
], function (provide, inherit, ymaps, AppStateBase, LayerSetupLayout) {

    var SetupState = inherit(AppStateBase, {
        __constructor: function () {
            this._name = 'setup';
            this._title = 'Настройка параметров слоя';

            this.__base.apply(this, arguments);
        },
        init: function () {
            this.__base.call(this);

            var app = this._app;

            app.addSourceLayer();
            app.sidebar
                .render('layerSetup', ymaps.util.extend({}, {
                    acceptedMimes: this._getAcceptedMimes()
                }, app.options.getAll()));
        },
        destroy: function () {
            var app = this._app;

            app.sidebar
                .clear();
            app.removeSourceLayer();

            this.__base.call(this);
        },
        _setupListeners: function () {
            this.__base.call(this);

            this._app.sidebar.events
                .add('submit', this._onSetupSubmit, this)
                .add('change', this._onSetupChange, this)
                .add('cancel', this._onSetupCancel, this);
        },
        _clearListeners: function () {
            this._app.sidebar.events
                .remove('submit', this._onSetupSubmit, this)
                .remove('change', this._onSetupChange, this)
                .remove('cancel', this._onSetupCancel, this);

            this.__base.call(this);
        },
        _onSetupSubmit: function (e) {
            this._changeState('process');
        },
        _onSetupChange: function (e) {
            this._app.options
                .set(e.get('name'), e.get('value'));
        },
        _onSetupCancel: function (e) {
            this._changeState('load');
        },
        _getAcceptedMimes: function () {
            var mimes = ['png', 'jpeg', 'gif', 'tiff'/*, 'bmp'*/],
                canvas = document.createElement('canvas');

            return mimes.filter(function (mime) {
                return canvas.toDataURL('image/' + mime).search(mime) >= 0;
            });
        }
    });

    provide(SetupState);
});
