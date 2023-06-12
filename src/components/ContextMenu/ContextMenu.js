import React from "react";
import {connect} from "react-redux";
import {closeContextMenu} from "../../modules/contextMenuManager/contextMenuManager";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const mapDispatchToProps = (dispatch) => {
    return {
        closeContextMenu: () => dispatch(closeContextMenu()),
    }
}

const mapStateToProps = (state) => {
    return {
        contextMenu: state.contextMenuManager,
    }
}

function ContextMenu(props) {
    const actionOnClick = (action) => {
        props.contextMenu?.handleActions(action);
        props.closeContextMenu();
    }

    return (
        <Menu keepMounted
              open={props.contextMenu.bool}
              onClose={props.closeContextMenu}
              anchorReference="anchorPosition"
              anchorPosition={
                  {
                      top: props.contextMenu.y,
                      left: props.contextMenu.x
                  }
              }
        >
            {
                props.contextMenu.actions.map(action => {
                    return (
                        <MenuItem onClick={() => actionOnClick(action)} key={action}>
                            {action}
                        </MenuItem>
                    );
                })
            }
        </Menu>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);
