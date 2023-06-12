class OriginalContextTool {
    static get isInline() {
        return true;
    }

    get state() {
        return this._state;
    }

    set state(state) {
        this._state = state;
    }

    constructor({api, config}) {
        this.api = api;
        this.config = config;
        this.button = null;
        this._state = false;
        this._selection = null;

        this.tag = 'span';
        this.class = 'cdx-lookup';
    }

    render() {
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-alt"
                        role="img" xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 384 512">
                            <path fill="inherit" d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"></path>
                        </svg>`;
        this.button.classList.add(this.api.styles.inlineToolButton);

        return this.button;
    }

    surround(range, ...props) {
        if (this.state) {
            this.unwrap(range);
            return;
        }

        this.wrap(range);
    }

    checkState(selection) {
        const mark = this.api.selection.findParentTag(this.tag, this.class);

        this.state = !!mark;
    }

    wrap(range, sentence_id) {
        let selected = document.getElementsByClassName(this.class);
        if (selected[0]) {
            // remove selection
            let newspan = document.createElement('span');
            newspan.innerHTML = selected[0].innerHTML;
            selected[0].parentNode.replaceChild(newspan, selected[0]);
        }
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
        this.config.displayoriginal(sentence_id, { x: wrapper[0].offsetLeft + wrapper[0].parentElement.offsetLeft, y: y, width: width });
    }

    unwrap(range) {
        const text = range.extractContents();
        range.insertNode(text);
        // if (this._selection) {
        //     this._selection.parentNode.replaceChild(this._selection, this._selection.innerHTML);
        // }
        // this._selection = null;
        // const mark = this.api.selection.findParentTag('MARK');
        // const text = range.extractContents();
        //
        // mark.remove();
        //
        // range.insertNode(text);
    }

    getOffsetXY(element, x = 0, y = 0) {
        x += element.offsetLeft + element.offsetParent.offsetLeft - element.offsetParent.offsetParent.offsetLeft;
        y += element.offsetTop + element.offsetParent.offsetTop - element.offsetParent.offsetParent.offsetTop;
        return [x, y];
    }
}

export default OriginalContextTool;
