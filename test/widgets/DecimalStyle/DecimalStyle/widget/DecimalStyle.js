define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
    "dojo/text!DecimalStyle/widget/template/DecimalStyle.html"
], function(declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, widgetTemplate) {
    "use strict";
    return declare("DecimalStyle.widget.DecimalStyle", [_WidgetBase, _TemplatedMixin], {
        templateString: widgetTemplate,
        field: null,
        widgetBase: null,
        beforeClassname: "",
        beforePrepend: "",
        afterClassname: "",
        // Internal variables.
        _handles: null,
        _contextObj: null,
        constructor: function() {
            this._handles = [];
        },
        postCreate: function() {
            logger.debug(this.id + ".postCreate");
        },
        update: function(obj, callback) {
            logger.debug(this.id + ".update");
            this._contextObj = obj;
            var _attrHandle = this.subscribe({
                guid: this._contextObj.getGuid(), // the guid
                attr: this.field, // the attributeName
                callback: lang.hitch(this, function(guid, attr, attrValue) {
                    this._updateRendering(); // do something
                })
            });
            this._handles.push(_attrHandle);
            var _objHandle = this.subscribe({
                guid: this._contextObj.getGuid(),
                callback: lang.hitch(this, function(guid) {
                    this._updateRendering();
                })
            });
            this._handles.push(_objHandle);
            this._updateRendering(callback);
        },
        resize: function(box) {
            logger.debug(this.id + ".resize");
        },
        uninitialize: function() {
            logger.debug(this.id + ".uninitialize");
            this.unsubscribeAll();
        },
        _updateRendering: function(callback) {
            logger.debug(this.id + "._updateRendering");
            var displayString = "" + (this._contextObj.get(this.field) * 1)
                .toFixed(this.decimalPlaces);
            var defaultAfter = "";
            for (var i = 0; i < this.decimalPlaces; i++) {
                defaultAfter += "0";
            }
            // add the prepend node in here somewhere
            this.prependNode.innerHTML = this.beforePrepend;
            dojoClass.add(this.prependNode, this.prependClassname);
            var split = displayString.split('.');
            this.beforeNode.innerHTML = split[0];
            dojoClass.add(this.beforeNode, this.beforeClassname)
            this.afterNode.innerHTML = split[1] ? (split[1].length == this.decimalPlaces ? split[1] : split[1] + "0") : defaultAfter;
            dojoClass.add(this.afterNode, this.afterClassname)
            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }
            this._executeCallback(callback);
        },
        _executeCallback: function(cb) {
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});
require(["DecimalStyle/widget/DecimalStyle"]);
