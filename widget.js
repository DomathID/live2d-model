(function(global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        (global = typeof globalThis !== 'undefined' ? globalThis : global || self).SakanaWidget = factory();
    }
})(this, function() {
    'use strict';

    // Constants for ResizeObserver
    var ResizeObserverBoxOptions = {
        BORDER_BOX: 'border-box',
        CONTENT_BOX: 'content-box',
        DEVICE_PIXEL_CONTENT_BOX: 'device-pixel-content-box'
    };

    // Utility function to create a frozen object
    var createFrozenObject = function(obj) {
        return Object.freeze(obj);
    };

    // Utility function to calculate box sizes
    var calculateBoxSize = function(inlineSize, blockSize, isVertical = false) {
        return createFrozenObject({
            inlineSize: isVertical ? blockSize : inlineSize,
            blockSize: isVertical ? inlineSize : blockSize
        });
    };

    // A class representing the resize observation box sizes and content rectangle
    var ResizeObservationBoxSizes = function() {
        return createFrozenObject({
            devicePixelContentBoxSize: calculateBoxSize(),
            borderBoxSize: calculateBoxSize(),
            contentBoxSize: calculateBoxSize(),
            contentRect: new DOMRectReadOnly(0, 0, 0, 0)
        });
    };

    // A utility function to get the box sizes of an element
    var getBoxSizes = function(element, observedBox) {
        // ... (implementation detail, similar to the original code)
    };

    // Class representing ResizeObserverEntry
    var ResizeObserverEntry = function(target) {
        var sizes = getBoxSizes(target);
        this.target = target;
        this.contentRect = sizes.contentRect;
        this.borderBoxSize = createFrozenObject([sizes.borderBoxSize]);
        this.contentBoxSize = createFrozenObject([sizes.contentBoxSize]);
        this.devicePixelContentBoxSize = createFrozenObject([sizes.devicePixelContentBoxSize]);
    };

    // Main SakanaWidget class
    class SakanaWidget {
        constructor(options = {}) {
            // Initialize properties
            this._lastRunUnix = Date.now();
            this._frameUnix = 1000 / 60;
            this._running = true;
            this._magicForceTimeout = 0;
            this._magicForceEnabled = false;
            this._resizeObserver = null;

            // Initialize state and options
            this._state = {};
            this._options = Object.assign({}, SakanaWidget.defaultOptions, options);
            this._char = this._options.character;
            this._image = this.getCharacter(this._char).image;

            // Create DOM elements and set up event listeners
            this._updateDom();
            this._updateSize(this._options.size);
            this._updateLimit(this._options.size);

            if (this._options.autoFit) {
                this._resizeObserver = new ResizeObserver(entries => {
                    if (entries && entries[0]) {
                        this._onResize(entries[0].contentRect);
                    }
                });
                this._resizeObserver.observe(this._domWrapper);
            }
        }

        // Method to get character details
        static getCharacter(name) {
            return SakanaWidget.characters[name] || null;
        }

        // Method to register a new character
        static registerCharacter(name, data) {
            SakanaWidget.characters[name] = data;
        }

        // ... Other methods like setState, setCharacter, _draw, _run, etc.

        // Method to mount the widget to a DOM element
        mount(selector) {
            let element = typeof selector === 'string' ? document.querySelector(selector) : selector;
            if (!element) throw new Error('Invalid mounting element');

            const parent = element.parentNode;
            if (!parent) throw new Error('Invalid mounting element parent');

            if (this._options.draggable) {
                this._domImage.addEventListener('mousedown', this._onMouseDown.bind(this));
                this._domImage.addEventListener('touchstart', this._onTouchStart.bind(this));
            }

            this._domCtrlPerson.addEventListener('click', this.nextCharacter.bind(this));
            this._domCtrlMagic.addEventListener('click', this.triggerAutoMode.bind(this));
            this._domCtrlClose.addEventListener('click', this.unmount.bind(this));

            const clonedElement = element.cloneNode(false);
            clonedElement.appendChild(this._domWrapper);
            parent.replaceChild(clonedElement, element);

            requestAnimationFrame(this._run.bind(this));
            return this;
        }

        // Method to unmount the widget from the DOM
        unmount() {
            // Remove event listeners
            this._domImage.removeEventListener('mousedown', this._onMouseDown);
            this._domImage.removeEventListener('touchstart', this._onTouchStart);
            this._domCtrlPerson.removeEventListener('click', this.nextCharacter);
            this._domCtrlMagic.removeEventListener('click', this.triggerAutoMode);
            this._domCtrlClose.removeEventListener('click', this.unmount);

            // Disconnect resize observer
            if (this._resizeObserver) {
                this._resizeObserver.disconnect();
            }

            // Remove the widget from the DOM
            const parent = this._domWrapper.parentNode;
            if (!parent) throw new Error('Invalid mounting element');
            parent.removeChild(this._domWrapper);
            return this;
        }
    }

    // Default options for the widget
    SakanaWidget.defaultOptions = {
        size: 200,
        autoFit: false,
        character: 'chisato',
        controls: true,
        rod: true,
        draggable: true,
        stroke: { color: '#b4b4b4', width: 10 },
        threshold: 0.1,
        rotate: 0,
        title: false
    };

    // Storage for registered characters
    SakanaWidget.characters = {};

    return SakanaWidget;
});
