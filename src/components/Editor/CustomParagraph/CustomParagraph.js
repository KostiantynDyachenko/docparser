import SelectionIconString from "../icons/SelectionIconString";
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { createSentences } from '../utils';
import { getPhraseColor } from "../../utils/getPhraseColor";
/**
 * Build styles
 */
//require('./index.css').toString();
//import "./index.css";

/**
 * Base CustomParagraph Block for the Editor.js.
 * Represents simple CustomParagraph
 */

/**
 * @typedef {object} CustomParagraphConfig
 * @property {string} placeholder - placeholder for the empty CustomParagraph
 * @property {boolean} preserveBlank - Whether or not to keep blank CustomParagraphs when saving editor data
 */

/**
 * @typedef {Object} CustomParagraphData
 * @description Tool's input and output data format
 * @property {String} text — CustomParagraph's content. Can include HTML tags: <a><b><i>
 */
class CustomParagraph {
    /**
     * Default placeholder for CustomParagraph Tool
     *
     * @return {string}
     * @constructor
     */
    static get DEFAULT_PLACEHOLDER() {
        return '';
    }

    /**
     * Render plugin`s main Element and fill it with saved data
     *
     * @param {object} params - constructor params
     * @param {CustomParagraphData} params.data - previously saved data
     * @param {CustomParagraphConfig} params.config - user config for Tool
     * @param {object} params.api - editor.js api
     * @param {boolean} readOnly - read only mode flag
     */
    constructor({data, config, api, readOnly, ...rest}) {
        this.api = api;
        this.readOnly = readOnly;
        this.settings = [];
        this.wrapper = undefined;
        this.config = config;
        this.phrases = [];
        this.sectionid = data.sectionid;
        this.paragraphid = data.paragraphid;
        this.inner = false;
        this.markedel = null;
        this.tag = 'span';
        this.class = 'cdx-lookup';

        this._CSS = {
            block: this.api.styles.block,
            wrapper: 'ce-CustomParagraph'
        };

        if (!this.readOnly) {
            this.onKeyUp = this.onKeyUp.bind(this);
        }

        /**
         * Placeholder for CustomParagraph if it is first Block
         * @type {string}
         */
        this._placeholder = config.placeholder ? config.placeholder : CustomParagraph.DEFAULT_PLACEHOLDER;
        this._data = {};
        this._element = this.drawView();
        this._preserveBlank = config.preserveBlank !== undefined ? config.preserveBlank : false;

        this.data = data;
    }

    renderSettings() {
        const wrapper = document.createElement('div');
        this.wrapper = wrapper;
        return wrapper;
    }

    wrap(range, _span) {
        const { sentence_id, paragraph_id } = _span;
        this.unwrap();
        const text = range.extractContents();
        const span = document.createElement(this.tag);
        span.classList.add(this.class);
        span.append(text);

        range.insertNode(span);

        // let selection = window.getSelection().toString();
        // let index = this.api.blocks.getCurrentBlockIndex();

        let [x, y] = this.getOffsetXY(span);
        let wrapper = document.getElementsByClassName("editor-wrapper");
        let width = wrapper[0].offsetWidth;
        // sectionid is really sentenceid
        this.config.displayoriginal({sectionid: sentence_id, paragraphid: paragraph_id},
            () => {
                _span.unmark();
                this.unwrap();
            },
            {
                x: wrapper[0].offsetLeft + wrapper[0].parentElement.offsetLeft - 8,
                y: y + 76,
                width: width
            });
    }

    unwrap() {
        let selected = document.getElementsByClassName(this.class);
        let el = selected[0] || this.markedel;
        if (el) {
            // remove selection
            let newspan = document.createElement('span');
            newspan.innerHTML = el.innerHTML;
            el.parentNode.replaceChild(newspan, el);
        }
    }

    markel(sentence_id) {
        this.config?.markel(sentence_id);
    }

    unmarkel() {
        this.config?.unmarkel();
    }

    _getTuneProps(tune) {
        switch (tune) {
            case "displayoriginal":
                return {
                    sectionid: this.sectionid,
                    paragraphid: this.paragraphid,
                    displayoriginal: this.data['displayoriginal']
                }
        }
    }

    /**
     * @private
     * Click on the Settings Button
     * @param {string} tune — tune name from this.settings
     */
    _toggleTune(tune, button) {
        this.data[tune] = !this.data[tune];
        button.classList.toggle('cdx-settings-button--active');
        this._acceptTuneView();
    }

    /**
     * Add specified class corresponds with activated tunes
     * @private
     */
    _acceptTuneView() {
        this.settings.forEach( tune => {
            this.wrapper.classList.toggle(tune.name, !!this.data[tune.name]);
        });
    }

    /**
     * Check if text content is empty and set empty string to inner html.
     * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
     *
     * @param {KeyboardEvent} e - key up event
     */
    onKeyUp(e) {
        if (e.code !== 'Backspace' && e.code !== 'Delete') {
            return;
        }

        const {textContent} = this._element;

        if (textContent === '') {
            this._element.innerHTML = '';
        }
    }

    /**
     * Create Tool's view
     * @return {HTMLElement}
     * @private
     */
    drawView() {
        let div = document.createElement('DIV');

        div.classList.add(this._CSS.wrapper, this._CSS.block);
        div.contentEditable = false;
        div.dataset.placeholder = this.api.i18n.t(this._placeholder);

        if (!this.readOnly) {
            div.contentEditable = true;
            div.addEventListener('keyup', this.onKeyUp);
        }

        return div;
    }

    /**
     * Create Tool's wrapper view
     * @return {HTMLElement}
     * @private
     */
    drawWrapper() {
        let div = document.createElement('DIV');
        div.classList.add(this._CSS.wrapper, this._CSS.block);
        div.contentEditable = false;
        div.dataset.placeholder = this.api.i18n.t(this._placeholder);

        if (!this.readOnly) {
            div.contentEditable = true;
            div.addEventListener('keyup', this.onKeyUp);
        }

        return div;
    }

    /**
     * Return Tool's view
     *
     * @returns {HTMLDivElement}
     */
    render() {
        let wrapper = document.createElement('DIV');

        wrapper.classList.add("editor-wrapper");
        wrapper.append(this._element);

        this._elementWrapper = wrapper;
        return wrapper;
    }

    /**
     * Method that specified how to merge two Text blocks.
     * Called by Editor.js by backspace at the beginning of the Block
     * @param {CustomParagraphData} data
     * @public
     */
    merge(data) {
        let newData = {
            text : this.data.text + data.text
        };

        this.data = newData;
    }

    /**
     * Validate CustomParagraph block data:
     * - check for emptiness
     *
     * @param {CustomParagraphData} savedData — data received after saving
     * @returns {boolean} false if saved data is not correct, otherwise true
     * @public
     */
    validate(savedData) {
        if (savedData.text.trim() === '' && !this._preserveBlank) {
            return false;
        }

        return true;
    }

    /**
     * Extract Tool's data from the view
     * @param {HTMLDivElement} toolsContent - CustomParagraph tools rendered view
     * @returns {CustomParagraphData} - saved data
     * @public
     */
    save(toolsContent) {
        return {
            text: toolsContent.innerHTML
        };
    }

    /**
     * On paste callback fired from Editor.
     *
     * @param {PasteEvent} event - event with pasted data
     */
    onPaste(event) {
        const data = {
            text: event.detail.data.innerHTML
        };

        this.data = data;
    }

    /**
     * Enable Conversion Toolbar. CustomParagraph can be converted to/from other tools
     */
    static get conversionConfig() {
        return {
            //export: 'text', // to convert CustomParagraph to other block, use 'text' property of saved data
            //import: 'text' // to covert other block's exported string to CustomParagraph, fill 'text' property of tool data
        };
    }

    /**
     * Sanitizer rules
     */
    static get sanitize() {
        return {
            text: {
                br: true,
            },
            displayoriginal: false,
            sectionid: false,
            level: false,
            selecttext: false,
            summary_sentence_list: false,
            summary_phrase_list: false,
        };
    }

    /**
     * Returns true to notify the core that read-only mode is supported
     *
     * @return {boolean}
     */
    static get isReadOnlySupported() {
        return true;
    }

    createGlossarySpan(phrase) {
        let color = getPhraseColor(phrase.phrase_type_str);
        let span = document.createElement('span');
        phrase.span = span;
        span.phrase = phrase;
        span.innerHTML = phrase.text;
        if (span.style) span.style = {}
        if (color) span.style.color = color;
        span.style.zIndex = 2;

        span.mark = () => {
            if (this.markedel) this.markedel?.unmark();
            this.inner = true;
            this.markedel = span;
            if (color) span.style.background = lighten(color, 0.7);
            if (phrase.phrase_type_str === "dictionary") {
                let newspan = document.createElement('span');
                newspan.style.position = "absolute";
                newspan.classList.add("ce-custom-toolbar");
                this.api.listeners.on(newspan, 'click', () => {
                    let [x, y] = this.getOffsetXY(span);
                    this.config?.displaydefinition(span.phrase, { x: x, y: y + 220 });
                }, false);
                span.action = newspan;
                newspan.innerHTML = `<svg height="24" width="24" viewBox="-3 0 480 480" fill="#000" color="#000" xmlns="http://www.w3.org/2000/svg">
                                        <path d="m474.386719 103.496094c-.042969-.699219-.179688-1.394532-.410157-2.054688-.085937-.257812-.152343-.503906-.261718-.753906-.390625-.871094-.933594-1.664062-1.601563-2.34375l-96-96c-.679687-.671875-1.476562-1.214844-2.351562-1.601562-.238281-.109376-.480469-.175782-.726563-.261719-.679687-.234375-1.382812-.375-2.097656-.417969-.136719.0273438-.28125-.0625-.449219-.0625h-240c-22.078125.0273438-39.972656 17.917969-40 40v58.878906c-54.996093 24.253906-90.488281 78.691406-90.488281 138.800782 0 60.109374 35.492188 114.546874 90.488281 138.800781v63.519531c.027344 22.082031 17.921875 39.972656 40 40h304c22.082031-.027344 39.976563-17.917969 40-40v-336c0-.175781-.085937-.328125-.101562-.503906zm-27.210938-7.496094h-60.6875c-4.417969 0-8-3.582031-8-8v-60.6875zm-431.007812 141.679688c-.046875-36.085938 14.265625-70.703126 39.78125-96.21875 25.515625-25.515626 60.136719-39.828126 96.21875-39.78125 4.546875 0 9.058593.222656 13.511719.65625 61.859374 6.113281 111.644531 53.496093 120.808593 114.976562 1.0625 6.738281 1.621094 13.546875 1.671875 20.367188.058594 25.621093-7.183594 50.726562-20.871094 72.382812-10.855468 17.304688-25.484374 31.929688-42.792968 42.777344-41.910156 26.320312-94.808594 27.796875-138.121094 3.851562-43.3125-23.941406-70.199219-69.523437-70.207031-119.011718zm228.914062 120.175781c1.09375-.847657 2.175781-1.6875 3.246094-2.558594 3.949219-3.179687 7.730469-6.558594 11.335937-10.121094 3.5625-3.605469 6.941407-7.382812 10.121094-11.328125.871094-1.070312 1.710938-2.160156 2.558594-3.253906.96875-1.265625 2.019531-2.464844 2.945312-3.753906l68.199219 68.28125c4.515625 4.472656 7.058594 10.566406 7.058594 16.921875 0 6.359375-2.542969 12.449219-7.058594 16.925781-9.445312 9.128906-24.425781 9.128906-33.871093 0l-68.289063-68.167969c1.289063-.9375 2.496094-1.976562 3.753906-2.945312zm189.40625 106.144531h-304c-13.253906 0-24-10.746094-24-24v-57.273438c.496094.160157 1.015625.265626 1.519531.417969 1.28125.390625 2.578126.703125 3.875 1.0625 2.992188.800781 6.007813 1.601563 9.054688 2.199219 1.496094.3125 2.992188.601562 4.503906.867188 3.046875.535156 6.121094.957031 9.207032 1.3125 1.378906.15625 2.738281.351562 4.121093.46875 4.433594.378906 8.894531.625 13.398438.625 26.445312.019531 52.429687-6.902344 75.355469-20.078126l70.734374 70.664063c9.925782 10.863281 25.019532 15.402344 39.289063 11.808594 14.273437-3.589844 25.421875-14.726563 29.023437-28.996094 3.605469-14.269531-.917968-29.367187-11.777343-39.300781l-70.703125-70.746094c13.175781-22.925781 20.101562-48.910156 20.078125-75.351562 0-5.066407-.242188-10.09375-.734375-15.078126-3.414063-34.953124-18.886719-67.625-43.761719-92.410156-28.449219-28.601562-67.160156-44.628906-107.503906-44.511718-4.503907 0-8.964844.25-13.398438.625-1.382812.121093-2.753906.3125-4.128906.472656-3.078125.34375-6.136719.78125-9.183594 1.3125-1.519531.265625-3.035156.554687-4.542969.871094-3.007812.625-5.992187 1.359374-8.953124 2.175781-1.328126.359375-2.65625.679687-4 1.078125-.496094.152344-1 .257812-1.496094.417968v-52.632812c0-13.253906 10.746094-24 24-24h232.023437v72c0 13.253906 10.746094 24 24 24h72v328c0 13.253906-10.742187 24-24 24zm0 0"/>
                                        <path d="m330.488281 56c0-4.417969-3.582031-8-8-8h-176c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h176c4.417969 0 8-3.582031 8-8zm0 0"/>
                                        <path d="m418.488281 192h-96c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h96c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8zm0 0"/>
                                        <path d="m418.488281 240h-96c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h96c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8zm0 0"/>
                                        <path d="m426.488281 296c0-4.417969-3.582031-8-8-8h-104c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h104c4.417969 0 8-3.582031 8-8zm0 0"/>
                                        <path d="m426.488281 344c0-4.417969-3.582031-8-8-8h-72c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h72c4.417969 0 8-3.582031 8-8zm0 0"/>
                                        <path d="m330.488281 104c0-4.417969-3.582031-8-8-8h-64c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h64c4.417969 0 8-3.582031 8-8zm0 0"/>
                                        <path d="m426.488281 152c0-4.417969-3.582031-8-8-8h-120c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h120c4.417969 0 8-3.582031 8-8zm0 0"/>
                                        <path d="m122.488281 200h56c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8h-56c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8zm0 0"/>
                                        <path d="m218.488281 240c0-4.417969-3.582031-8-8-8h-120c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h120c4.417969 0 8-3.582031 8-8zm0 0"/>
                                        <path d="m178.488281 280h-56c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h56c4.417969 0 8-3.582031 8-8s-3.582031-8-8-8zm0 0"/>
                                        <path d="m209.113281 343.199219c19.511719-10.390625 35.691407-26.085938 46.671875-45.269531.632813-1.105469 1.320313-2.175782 1.914063-3.296876.308593-.578124.550781-1.175781.847656-1.753906 1.214844-2.335937 2.398437-4.671875 3.445313-7.0625 1.050781-2.390625 1.875-4.664062 2.730468-7.015625.246094-.679687.558594-1.34375.800782-2.03125 20.34375-59.160156-8.171876-124.027343-65.515626-149.03125-57.347656-25.003906-124.28125-1.753906-153.78125 53.414063-9.285156 17.378906-14.121093 36.789062-14.074218 56.496094-.074219 42.28125 22.132812 81.472656 58.441406 103.136718 36.308594 21.667969 81.34375 22.601563 118.519531 2.460938zm-106.800781-14.253907c-8.707031-4.746093-16.683594-10.722656-23.6875-17.746093-4.859375-4.855469-9.230469-10.171875-13.054688-15.878907-1.890624-2.828124-3.628906-5.730468-5.226562-8.710937-24.078125-45.464844-11.320312-101.703125 30.019531-132.324219 41.339844-30.621094 98.855469-26.433594 135.328125 9.851563 32.300782 32.605469 39.566406 82.464843 17.917969 122.933593v.066407c-9.539063 17.847656-24.164063 32.460937-42.015625 41.992187-30.96875 16.824219-68.363281 16.765625-99.28125-.152344zm0 0"/>
                                        <path d="m434.488281 384c-4.417969 0-8 3.582031-8 8v32c0 4.417969-3.582031 8-8 8h-32c-4.417969 0-8 3.582031-8 8s3.582031 8 8 8h32c13.257813 0 24-10.746094 24-24v-32c0-4.417969-3.582031-8-8-8zm0 0"/>
                                    </svg>`;
                span.append(newspan);
            }
            if (this.config?.markglossaryel && typeof this.config?.markglossaryel === 'function') {
                this.config.markglossaryel(phrase.phrase_id);
            }
        }

        span.unmark = () => {
            this.inner = false;
            this.markedel = false;
            span.style.background = "unset";
            if (span.action) {
                span.action.remove();
                span.action = undefined;
            }
            if (this.config?.unmarkglossaryel && typeof this.config?.unmarkglossaryel === 'function') {
                this.config.unmarkglossaryel();
            }
        }

        this.api.listeners.on(span, 'mouseenter', () => {
            if (this.markedel) this.markedel?.unmark();
            span.mark();
        }, false);

        this.api.listeners.on(span, 'mouseleave', () => {
            span.unmark();
        }, false);

        return span;
    }

    /**
     * Get current Tools`s data
     * @returns {CustomParagraphData} Current data
     * @private
     */
    get data() {
        let text = this._element.innerHTML;

        this._data.text = text;

        return this._data;
    }

    /**
     * Store data in plugin:
     * - at the this._data property
     * - at the HTML
     *
     * @param {CustomParagraphData} data — data to set
     * @private
     */
    set data(data) {
        this._element.innerHTML = "";
        if (!data.hasOwnProperty('summary_sentence_list')) return;
        let _data = createSentences(this, data);
        this._data = _data;
    }

    /**
     * Used by Editor paste handling API.
     * Provides configuration to handle P tags.
     *
     * @returns {{tags: string[]}}
     */
    static get pasteConfig() {
        return {
            tags: [ 'P' ]
        };
    }

    /**
     * Icon and title for displaying at the Toolbox
     *
     * @return {{icon: string, title: string}}
     */
    static get toolbox() {
        return {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0.2 -0.3 9 11.4" width="12" height="14">
                      <path d="M0 2.77V.92A1 1 0 01.2.28C.35.1.56 0 .83 0h7.66c.28.01.48.1.63.28.14.17.21.38.21.64v1.85c0 .26-.08.48-.23.66-.15.17-.37.26-.66.26-.28 0-.5-.09-.64-.26a1 1 0 01-.21-.66V1.69H5.6v7.58h.5c.25 0 .45.08.6.23.17.16.25.35.25.6s-.08.45-.24.6a.87.87 0 01-.62.22H3.21a.87.87 0 01-.61-.22.78.78 0 01-.24-.6c0-.25.08-.44.24-.6a.85.85 0 01.61-.23h.5V1.7H1.73v1.08c0 .26-.08.48-.23.66-.15.17-.37.26-.66.26-.28 0-.5-.09-.64-.26A1 1 0 010 2.77z"/>
                    </svg>`,
            title: 'Text'
        };
    }


    getOffsetXY(element, x = 0, y = 0) {
        x += element.offsetLeft + element.offsetParent.offsetLeft - element.offsetParent.offsetParent.offsetLeft;
        y += element.offsetTop + element.offsetParent.offsetTop - element.offsetParent.offsetParent.offsetTop;
        return [x, y];
    }
}

//module.exports = CustomParagraph;
export default CustomParagraph;
