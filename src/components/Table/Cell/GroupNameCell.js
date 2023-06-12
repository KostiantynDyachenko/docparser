import * as React from "react";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        userSettings: state.sessionManager.userSettings
    }
}

const GroupNameCell = (props) => {
    let group = props.userSettings.groups.find(g => g.id === props.dataItem?.group_id);
    if (!group) return (
        <td>
            Null
        </td>
    );
    return (
        <td>
            {group.name}
        </td>
    );
}

export default connect(mapStateToProps)(GroupNameCell);
