export default function newContextMenuProps(bool = false, x = 0, y = 0, actions = [], handleActions = () => {}) {
    return {
        bool: bool,
        x: x,
        y: y,
        actions: actions,
        handleActions: handleActions
    }
}
