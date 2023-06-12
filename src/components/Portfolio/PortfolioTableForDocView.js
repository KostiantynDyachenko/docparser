import React, { useState, useRef, useEffect } from "react";
import { process } from "@progress/kendo-data-query";
import {Grid, GridColumn as Column, GridColumnMenuCheckboxFilter} from '@progress/kendo-react-grid';
import DocumentTypeCell from "../Table/Cell/DocumentTypeCell";
import NameWithDocumentTypeCell from "../Table/Cell/NameWithDocumentTypeCell";
import GroupNameCell from "../Table/Cell/GroupNameCell";
import { ColumnMenu } from "../Table/ColumnMenu";
import {
    SetCurrentFolder,
    SetCurrentFolderData,
    SetCurrentGroup,
    SetCurrentPage,
    SetCurrentRowsPerPage,
    SetCurrentUserFilter,
    SetTableData, SetTableRowsSelected, ToggleTableRowSelected, SetLastSelectedIndex
} from "../../modules/tableManager/tableManager";
import {connect} from "react-redux";
import {useLocation, withRouter} from "react-router-dom";
import {SetLoader, SetRefresh, UploadFiles} from "../../modules/fileManager/fileManager";
import {SetModal} from "../../modules/modalManager/modalManager";
import {openContextMenu} from "../../modules/contextMenuManager/contextMenuManager";
import {Api} from "../Api";

const TEXT_EDITOR = "TEXT_EDITOR";

const mapDispatchToProps = (dispatch) => {
    return {
        UploadFiles: files => dispatch(UploadFiles(files)),
        SetTableData: data => dispatch(SetTableData(data)),
        SetCurrentUserFilter: int => dispatch(SetCurrentUserFilter(int)),
        SetCurrentGroup: int => dispatch(SetCurrentGroup(int)),
        SetCurrentFolder: int => dispatch(SetCurrentFolder(int)),
        SetCurrentFolderData: int => dispatch(SetCurrentFolderData(int)),
        SetCurrentPage: int => dispatch(SetCurrentPage(int)),
        SetCurrentRowsPerPage: int => dispatch(SetCurrentRowsPerPage(int)),
        SetRefresh: bool => dispatch(SetRefresh(bool)),
        SetModal: name => props => dispatch(SetModal(name)(props)),
        openContextMenu: (x, y, actions, handleActions) => dispatch(openContextMenu(x, y, actions, handleActions)),
        SetLoader: bool => dispatch(SetLoader(bool)),
        ToggleTableRowSelected: (data, index) => dispatch(ToggleTableRowSelected(data, index)),
        SetTableRowsSelected: (data, indices, bool) => dispatch(SetTableRowsSelected(data, indices, bool)),
        SetLastSelectedIndex: int => dispatch(SetLastSelectedIndex(int)),
    }
}

const mapStateToProps = (state) => {
    return {
        tableData: state.tableManager.tableData,
        currentFolder: state.tableManager.currentFolder,
        currentFolderData: state.tableManager.currentFolderData,
        currentUserFilter: state.tableManager.currentUserFilter,
        currentGroup: state.tableManager.currentGroup,
        currentPage: state.tableManager.currentPage,
        rowsPerPage: state.tableManager.rowsPerPage,
        selectedRows: state.tableManager.selectedRows,
    }
}

function PortfolioTableForDocView(props) {

    const { search } = useLocation();

    const filterDataWithCurrentFilter = (_data) => {
        return _data.filter(d => {
            switch (props.currentFilter) {
                default:
                case "all":
                    return true;
                case "originals":
                    return [0, 1].includes(d.algorithmtype);
                case "processed":
                    return [0, 2, 3].includes(d.algorithmtype);
            }
        });
    }

    const createDataState = (_dataState, dataState = {}) => {
        let dataFilter = {
            ...dataState,
            ..._dataState
        }

        return {
            data: process(filterDataWithCurrentFilter(props.data), dataFilter),
            dataState: dataFilter
        }
    }
    const intialState = createDataState({
        skip: props.rowsPerPage * props.currentPage,
        take: props.rowsPerPage
    });

    const [data, setData] = useState(intialState.data);
    const [dataState, setDataState] = useState(intialState.dataState);
    const lastSelectedIndex = useRef(0);

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener(("keydown"), onKeyDown)
        }
    }, []);

    useEffect(() => {
        const updatedState = createDataState(dataState);
        setData(updatedState.data);
        setDataState(updatedState.dataState);
    }, [props.data, props.currentFilter]);

    useEffect(() => {
        const updatedState = createDataState(intialState.dataState ,dataState);
        setData(updatedState.data);
        setDataState(updatedState.dataState);
    }, [props.currentFilter])

    // useEffect(() => {
    //     console.log("data", data);
    //     console.log("props", props);
    // }, [data]);

    const onKeyDown = (e) => {
        if (e.key === "Shift" && e.shiftKey) {
            document.onselectstart = function() {
                return false;
            }
            window.addEventListener("keyup", onKeyUp);
        }
    }

    const onKeyUp = (e) => {
        document.onselectstart = function() {
            return true;
        }
        window.removeEventListener("keyup", onKeyUp);
    }

    const pageChange = (event) => {
        let updatedState = createDataState(event.page, dataState);
        setData(updatedState.data);
        setDataState(updatedState.dataState);
        let page = event.page.skip / event.page.take;
        props.SetCurrentPage(page);
    }

    const rowDoubleClick = (event) => {
        console.log('double click', event.dataItem);
        props.setDocIdToShow(event.dataItem.documentid);
        props.setIsDocShown(true);
    }

    const updateTableData = (_data) => {
        const indices = [];
        _data.forEach((r, i) => {
            if (r.selected) indices.push(i);
        });
        props.SetTableRowsSelected(props.tableData, indices, true);
    }

    const rowClick = (event) => {
        let last = lastSelectedIndex.current;
        let _data = props.data.map(d => Object.assign({}, {...d}));
        const current = props.data.findIndex(dataItem => dataItem === event.dataItem);

        if (!event.nativeEvent.shiftKey) {
            lastSelectedIndex.current = last = current;
            props.SetLastSelectedIndex(lastSelectedIndex.current);
        }

        if (!event.nativeEvent.ctrlKey) {
            _data.forEach(item => (item.selected = false));
        }

        const select = !event.dataItem.selected;
        for (let i = Math.min(last, current); i <= Math.max(last, current); i++) {
            _data[i].selected = select;
        }
        updateTableData(_data);
        props.setData(_data);
    }

    const selectionChange = (event) => {
        const _data = [...props.data];
        const data = _data.map(item => {
            const _item = {
                ...item
            }
            if (_item.documentid === event.dataItem.documentid){
                _item.selected = !event.dataItem.selected;
            }
            return _item;
        });
        updateTableData(data);
        props.setData(data);
    }

    const headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        const data = props.data.map(item => {
            const _item = {
                ...item,
                selected: checked
            }
            return _item;
        });
        updateTableData(data);
        props.setData(data);
    }

    const dataStateChange = (event) => {
        let updatedState = createDataState(event.dataState);
        setData(updatedState.data);
        setDataState(updatedState.dataState);
        updateTableData(updatedState.data.data);
    }

    const ColumnMenuCheckboxFilter = (_props) => {
        return (
            <div>
                <GridColumnMenuCheckboxFilter
                    {..._props}
                    data={filterDataWithCurrentFilter(props.data)}
                    expanded={true}
                    searchBox={() => null}
                />
            </div>
        );
    }

    return (
        <div style={{width: 'calc(100% - 16px)', margin: '5px auto'}}>
            <Grid
                data={data}
                onDataStateChange={dataStateChange}
                style={{ maxHeight: '100%', height: "auto" }}
                selectedField="selected"
                onSelectionChange={selectionChange}
                onHeaderSelectionChange={headerSelectionChange}
                onPageChange={pageChange}
                // onRowClick={rowClick}
                onRowDoubleClick={rowDoubleClick}
                pageable={{
                    buttonCount: 9,
                    info: true,
                    type: "numeric",
                    pageSizes: [10, 25, 50, 100],
                    previousNext: true
                }}
                sortable={true}
                scrollable="scrollable"
                sort={dataState.sort}
                filter={dataState.filter}
                group={dataState.group}
                skip={dataState.skip}
                take={dataState.take}
                total={data.length}
            >
                <Column field="documentid"
                        title="id"
                        width="70px"
                />
                <Column field="name"
                        title="Name"
                        cell={NameWithDocumentTypeCell}
                        filter="text"
                        columnMenu={ColumnMenu}
                />
                {
                    (props.currentFilter === "processed") ? (
                        <Column field="algorithmtypestr"
                                title="AiOperation"
                                filter="text"
                                width="140px"
                                columnMenu={ColumnMenuCheckboxFilter}
                        />
                    ) : (null)
                }
            </Grid>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioTableForDocView);
