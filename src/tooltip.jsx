import styled from "styled-components";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const Container = styled.div`
  padding: 15px;
  padding-left : 10px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 1px 3px 10px 5px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  border-left: 8px solid #808960;
  position: absolute;
  z-index: 3000;
  box-sizing: border-box;
  display : flex;
  flex-direction: column;
  left: ${(props) => (props.$position ? `${props.$position.left}` : `0px`)};
  right: ${(props) => (props.$position ? `${props.$position.right}` : `auto`)};
  bottom: ${(props) =>
    props.$position ? `${props.$position.bottom}` : `auto`};
  top: ${(props) => (props.$position ? `${props.$position.top}` : `0px`)};
  transform-origin: center;
  opacity: 0;
  visibility: "hidden";

  @media only screen and (max-width: 450px) {
    width: 250px;
  }
`;

export default function Tooltip({ showTooltip, toolTipData }) {
  const tooltip = useRef();

  const [innerData, setInnerData] = useState({});

  useEffect(() => {
    if (showTooltip) {
      tooltip.current.style.visibility = "visible";
      gsap.fromTo(
        tooltip.current,
        { opacity: "0", transform: "scale(0.95)" },
        { opacity: "1", transform: "scale(1)", duration: 0.35 }
      );
    } else {
      tooltip.current.style.visibility = "hidden";
    }
  }, [showTooltip]);

  return (
    <Container $position={toolTipData.position} ref={tooltip}>
      <div>
        <div className="flex items-center justify-between border-b-2 border-gray-200 pb-2">
          <h5 className="text-sm font-bold leading-none text-gray-900 dark:text-white">{toolTipData.data.ProvinceName}
          </h5>
        </div>
        <DataRows
          rows={toolTipData.data.rows}
        />
      </div>
    </Container>
  );
}

function DataRows({ rows }) {
  return (
    <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
      {rows.map(row => (
        <li key={row.name} className="py-1">
          <div className="flex items-end">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-left font-semibold pr-3 text-gray-900 truncate dark:text-white">
                {row.name}
              </p>
            </div>
            <div className="inline-flex items-center text-xs text-gray-900 dark:text-white">
              {row.val}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}