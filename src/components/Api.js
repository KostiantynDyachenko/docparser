// import * as Utils from './utils/utils';
// import { getCookie } from "./utils/utils";
import axios from "axios";
import ToastService from "./Toast/ToastService";

const API_URL = process.env.REACT_APP_API_URL;

const Api = {
    async axiospost(path, body, options = {}) {
        let response = await axios({
            method: "post",
            url: `${API_URL}${path}`,
            data: body,
            ...options
        });
        return response;
    },

    async fetch(path, options = {}) {
        let response = await fetch(`${API_URL}${path}`, options);
        // if response is ok
        if (response.status === 200) {
            let json = await response.json();
            // parse json here and return it with the response
            response._json = json;
            response.json = () => new Promise(resolve => {
                resolve(response._json);
            });
            return response;
        }
        // throw an error and return undefined if status is not ok
        else {
            let json = await response.json();
            ToastService.Toast({
                icon: "error",
                message: json
            });
            console.error(`${response.status} Error:`, response);
            return undefined;
        }
    },

    async getCsrf() {
        const response = await Api.fetch(`/user/csrf/`, {
            method: 'GET',
            credentials: 'include'
        });
        return response._json.data;
    },

    async ping() {
        const response = await Api.fetch(`/user/ping/`, {
            method: 'GET',
            credentials: 'include'
        });
        return response;
    },

    async createUser(body) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/user/createUser/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            },
            body: JSON.stringify(body)
        });
        return response;
    },

    async login(body) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/user/login/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            },
            body: JSON.stringify(body)
        });
        return response;
    },

    async logout() {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/user/logout/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async uploadFile(body, config) {
        let csrf = await this.getCsrf();

        const response = await Api.axiospost(`/parser/uploadFile/`, body, {
            withCredentials: true,
            headers: {
                'X-CSRFToken': csrf
            },
            ...config
        });

        return response;
    },

    async getSummaryByDocID(id) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/parser/getSummaryByDocID/${id}/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async getDocumentType(type) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/parser/getDocumentType/${type}/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },


    async getDocumentsByParentID(parentid, groupid = 0) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/parser/getDocumentsByParentID/${parentid}/${groupid}/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async getFolderStructureByGroupID(groupid, parentid) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/parser/getFolderStructureByGroupID/${groupid}/${parentid}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async updateDocument(body) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/parser/updateDocument/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            },
            body: JSON.stringify(body)
        });
        return response;
    },

    async downloadDocument(documentid) {
        let element = document.createElement("a");
        element.setAttribute("href", `${API_URL}/parser/downloadDocument/${documentid}/`);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },

    async getDocument(documentid) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/parser/getDocument/${documentid}/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async deleteDocument(documentid) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/parser/deleteDocument/${documentid}/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async updateDocumentSection(body) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/parser/updateDocumentSection/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            },
            body: JSON.stringify(body)
        });
        return response;
    },

    async reprocessDocument(body) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/parser/reprocessDocument/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            },
            body: JSON.stringify(body)
        });
        return response;
    },

    async getDocumentSectionBySectionID(sectionid) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/parser/getDocumentSectionBySectionID/${sectionid}/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async getSearchSummaryContext(sentenceid) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/parser/getSearchSummaryContext/${sentenceid}/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async getUsersForGroup(groupid) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/user/getUsersForGroup/${groupid}/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async getDocumentsForGroup(groupid) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/parser/getDocumentsForGroup/${groupid}/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    // gets context for before or after, status 1 = before; status 2 = after;
    async getMoreContext(paragraphid, status) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/parser/getMoreContext/${paragraphid}/${status}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async getPhraseTypes() {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/parser/getPhraseTypes/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async getPhrasesByPhraseType(documentid, phraseid) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/parser/getPhrasesByPhraseType/${documentid}/${phraseid}/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async getOriginalTextFromAlgorithm(documentid) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/parser/getOriginalTextFromAlgorithm/${documentid}/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async getOriginalTextFromOriginalDocument(documentid) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/parser/getOriginalTextFromOriginalDocument/${documentid}/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async superviseAISentence(sentenceid, supervisedai_id, userChoice) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/nlp/superviseAISentence/${sentenceid}/${supervisedai_id}/${userChoice}/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async superviseAIWord(wordid, supervisedai_id, userChoice) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/nlp/superviseAIWord/${wordid}/${supervisedai_id}/${userChoice}/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async superviseAIPhrase(phrase_id, supervisedai_id, userChoice) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/nlp/superviseAIPhrase/${phrase_id}/${supervisedai_id}/${userChoice}/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async toggleAITraining(documentid, superviseaiid) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/nlp/toggleAITraining/${documentid}/${superviseaiid}/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async getSupervisedAI() {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/nlp/getSupervisedAI/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async getQuestionAnswered(body) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/nlp/getQuestionAnswered/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            },
            body: JSON.stringify(body)
        });
        return response;
    },

    async getComparedDocumentListQuestionAnswered(body) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/nlp/getComparedDocumentListQuestionAnswered/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            },
            body: JSON.stringify(body)
        });
        return response;
    },

    async getTextColorPhraseTypes() {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/parser/getTextColorPhraseTypes/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    },

    async superviseAIWordsAndConfirmSentence(body) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/nlp/superviseAIWordsAndConfirmSentence/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            },
            body: JSON.stringify(body)
        });
        return response;
    },

    async getWordInference(body) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/parser/getWordInference/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            },
            body: JSON.stringify(body)
        });
        return response;
    },

    async getDiagramOutline(body) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/nlp/getDiagramOutline/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            },
            body: JSON.stringify(body)
        });
        return response;
    },

    async getLogicExpressionDetails(conditionFormulaId, body) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/nlp/getLogicExpressionDetails/${conditionFormulaId}/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            },
            body: JSON.stringify(body)
        });
        return response;
    },

    async getTranslationConditionalBlockByDocumentId(documentId) {
        let csrf = await this.getCsrf();

        const response = await Api.fetch(`/nlp/getTranslationConditionalBlockByDocumentId/{documentId}/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrf
            }
        });
        return response;
    }
}

export { Api }
