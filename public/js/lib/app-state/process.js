modules.define('app-state-process', [
    'inherit',
    'jquery',
    'app-state-base',
    'ymaps-layout-preloader'
], function (provide, inherit, jQuery, AppStateBase, PreloaderLayout) {

    var ProcessState = inherit(AppStateBase, {
        __contructor: function () {
            this.__base.apply(this, arguments);

            this._name = 'process';
        },
        init: function () {
            var app = this._app;

            this._setupListeners();

            this._app.popup
                .render('preloader', {
                    progress: 0,
                    message: 'starting'
                });

            app.tiler
                .render()
                .done(
                    this._onComplete,
                    this._onError,
                    this._onProgress,
                    this
                );
        },
        destroy: function () {
            this._app.popup
                .clear();
            this._clearListeners();
        },
        _setupListeners: function () {
            this._app.sidebar.events
                .add('cancel', this._onProcessCancel, this);
        },
        _clearListeners: function () {
            this._app.sidebar.events
                .remove('cancel', this._onProcessCancel, this);
        },
        _onComplete: function (res) {
            this._changeState('publish');
        },
        _onProgress: function (v) {
            this._app.popup
                .setData(v);
        },
        _onError: function (err) {
            var message = err.status?
                err.status + ' ' + err.statusText : err.message;

            this._app.popup
                .clear()
                .render('alert', {
                    content: message
                });

            this._changeState('setup');
        },
        _onCancel: function (e) {
            this._changeState('setup');
        }
    });

    provide(ProcessState);
});