// creates cdx-sentence divs from 'this' class and 'data.summary_sentence_list'
export function createSentences(_this, data) {
    return data.summary_sentence_list.map(sentence => {
        if (sentence.phrase_list && sentence.phrase_list?.length > 0) {
            sentence.glossary = sentence.phrase_list.map(phrase => phrase.text.replace(/[()|]/g, '\\$&'));
            const reg = `(${sentence.glossary.join("|")})`;
            let begin_regex = "(?<=[\\n\\r\\s])(";
            let middle_regex = ")(?=[\\n\\r\\s,s'.!?])|(^";
            let end_regex = ")(?=[\\n\\r\\s,s'.!?])";
            let regex = `${begin_regex}${reg}${middle_regex}${reg}${end_regex}`; //begin_regex + reg + middle_regex + reg + end_regex
            const textsplit = sentence.text.split(new RegExp(regex, "gi"));
            const textsplitfilter = textsplit.filter((t, index) => !!t && textsplit.indexOf(t) === index);

            sentence.elements = textsplitfilter.map(t => {
                let phrase = sentence.phrase_list.find(phrase => phrase.text?.toLowerCase() === t?.toLowerCase());
                if (phrase) {
                    return _this.createGlossarySpan(phrase);
                }
                else {
                    return t;
                }
            });
        }
        else {
            sentence.elements = [sentence.text];
        }

        let span = document.createElement('span');
        span.classList.add('cdx-sentence');
        span.sentence_id = sentence.sentence_id;
        span.paragraph_id = sentence.paragraph_id;
        sentence.elements.forEach(element => {
            span.append(element);
            span.append(" ");
        });

        span.wrap = () => {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(span);
            selection.removeAllRanges();
            selection.addRange(range);
            _this.wrap(range, span);
        }

        span.mark = (displaynewaction = true) => {
            if (_this.markedel) _this.markedel?.unmark();
            span.classList.add('cdx-marker');
            if (displaynewaction) {
                let newspan = document.createElement('span');
                newspan.style.position = "absolute";
                newspan.classList.add("ce-custom-toolbar");
                _this.api.listeners.on(newspan, 'click', () => {
                    span.wrap();
                }, false);
                span.action = newspan;
                newspan.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-alt"
                        role="img" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 384 512">
                            <path fill="inherit" d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"></path>
                        </svg>`;
                span.append(newspan);
            }
            if (typeof _this?.markel === 'function') _this?.markel(span);
        }

        span.unmark = () => {
            span.classList.remove('cdx-marker');
            if (span.action) {
                span.action.remove();
                span.action = undefined;
            }
            let customToolbars = document.getElementsByClassName("ce-custom-toolbar");
            for (let i = 0; i < customToolbars.length; i++) {
                customToolbars[i].remove();
            }
            if (typeof _this?.unmarkel === 'function') _this?.unmarkel(span);
        }

        _this.api.listeners.on(span, 'mouseenter', () => {
            if (_this.inner) return;
            span?.mark();
        }, false);

        _this.api.listeners.on(span, 'mouseleave', () => {
            if (_this.inner) return;
            span?.unmark();
        }, false);

        sentence.span = span;
        _this._element.append(span);
        return sentence;
    });
}
export default createSentences;
