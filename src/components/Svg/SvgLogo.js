import * as React from "react";

function SvgLogo(props) {
    const fill = props.fill || "#0ea47a";
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             width="36px"
             height="36px"
             viewBox="0 0 50 50"
             {...props}
        >
            <g fill={fill} transform="matrix(1, 0, 0, 1, -2, -20)">
                <path d="M21.42 37.08 l2.28 -8.34 l24.96 0 l-2.28 8.34 l-16.62 0 l-5.94 22.2 l-8.34 0 z M13.14 37.08 l2.28 -8.34 l-8.34 0 l-2.28 8.34 l8.34 0 z"></path>
            </g>
        </svg>
    );
}

export default SvgLogo;
