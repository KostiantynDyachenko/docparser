import { combineReducers } from "redux";
import sessionManager from "./sessionManager/sessionManager";
import fileManager from "./fileManager/fileManager";
import modalManager from "./modalManager/modalManager";
import progressManager from "./progressManager/progressManager";
import contextMenuManager from "./contextMenuManager/contextMenuManager";
import tableManager from "./tableManager/tableManager";
import eventManager from "./eventManager/eventManager";
import flowChartManager from "./flowChartManager/flowChartManager";

export default combineReducers({
    sessionManager,
    fileManager,
    modalManager,
    progressManager,
    contextMenuManager,
    tableManager,
    eventManager,
    flowChartManager
});
