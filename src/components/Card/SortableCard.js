import { forwardRef, useImperativeHandle, useRef } from 'react';
import { DragSource, DropTarget, } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import Checkbox from '@material-ui/core/Checkbox';

const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    backgroundColor: 'white',
    cursor: 'move',
    height: "40px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center"
};
const SortableCard = forwardRef(function SortableCard({ text, isDragging, connectDragSource, connectDropTarget, last, displayCheckbox, toggleSelected, selected, index }, ref) {
    const elementRef = useRef(null);
    connectDragSource(elementRef);
    connectDropTarget(elementRef);
    const opacity = isDragging ? 0 : 1;
    const marginBottom = '.5rem';
    useImperativeHandle(ref, () => ({
        getNode: () => elementRef.current,
    }));
    let styleobj = { ...style, opacity };
    if (!last) styleobj = {...styleobj, marginBottom};
    return (
        <div ref={elementRef} style={styleobj}>
            {displayCheckbox ? (<Checkbox checked={selected} onChange={toggleSelected(index)} size="small" style={{ padding: "0" }} />) : null}
            <span style={{ marginLeft: displayCheckbox ? "4px" : "0" }}>
                {text}
            </span>
        </div>
    );
});
export default DropTarget(ItemTypes.SortableCard, {
    hover(props, monitor, component) {
        if (!component) {
            return null;
        }
        // node = HTML Div element from imperative API
        const node = component.getNode();
        if (!node) {
            return null;
        }
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }
        // Determine rectangle on screen
        const hoverBoundingRect = node.getBoundingClientRect();
        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        // Determine mouse position
        const clientOffset = monitor.getClientOffset();
        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%
        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }
        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }
        // Time to actually perform the action
        props.moveCard(dragIndex, hoverIndex);
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
}, (connect) => ({
    connectDropTarget: connect.dropTarget(),
}))(DragSource(ItemTypes.SortableCard, {
    beginDrag: (props) => ({
        id: props.id,
        index: props.index,
    }),
}, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))(SortableCard));
