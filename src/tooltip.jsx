import styled from "styled-components";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const Container = styled.div`
  padding: 10px 15px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 1px 3px 10px 5px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  position: absolute;
  z-index: 3000;
  width: 200px;
  box-sizing: border-box;
  left: ${(props) => (props.$position ? `${props.$position.left}` : `0px`)};
  right: ${(props) => (props.$position ? `${props.$position.right}` : `auto`)};
  bottom: ${(props) =>
    props.$position ? `${props.$position.bottom}` : `auto`};
  top: ${(props) => (props.$position ? `${props.$position.top}` : `0px`)};
  transform-origin: center;
  opacity: 0;
  transform: scale(0.9);
  visibility: "hidden";

  @media only screen and (max-width: 450px) {
    width: 250px;
  }
`;

export default function Tooltip({ showTooltip, toolTipData }) {
  const tooltip = useRef();

  const [innerData, setInnerData] = useState({
    position: null,
    seatData: { seat: "NA 10", loc: "Dera Ghazi Khan" },
    data: [
      { candidate: "Maulana Mohammad Qasim", party: "MMA", votes: 297872 },
      {
        candidate: "Nawabzada Abdul Qadir Khan",
        party: "PPPP",
        votes: "231380",
      },
    ],
    turnout: 25,
    margin: 20,
  });

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

  useEffect(() => {
    if (toolTipData) {
      setInnerData(toolTipData);
    }
  }, [toolTipData]);

  const { seatData, data, position, turnout, margin } = innerData;

  return (
    <Container $position={position} ref={tooltip}>
        <p>Example Tooltip</p>
      {/*innerData && (
        <>
          <TopPanel
            seat={seatData.seat}
            loc={seatData.loc}
            margin={margin}
            turnout={turnout}
          />
          {data.length === 0 && <p>Data unavailable</p>}
          {data[0] && (
            <PartyDetail
              winner
              name={data[0].candidate}
              party={data[0].party}
              votes={!data[1] ? "Uncont." : data[0].votes}
            />
          )}
          {data[1] && (
            <PartyDetail
              name={data[1].candidate}
              party={data[1].party}
              votes={data[1].votes}
            />
          )}

          <Dict $display={!data.length === 0}>
            {data[0] && (
              <p>
                <b>{data[0].party}</b>: {Dictionary[data[0].party]}
              </p>
            )}
            {data[1] && data[0].party !== data[1].party && (
              <p>
                <b>{data[1].party}</b>: {Dictionary[data[1].party]}
              </p>
            )}
          </Dict>
        </>
      )*/}
    </Container>
  );
}

const Dict = styled.div`
  padding-top: 5px;
  font-size: 0.75rem;
`;

const DetailsContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1.25fr;
  padding: 8px 0px;
  border-top: ${(props) => (props.$winner ? `1px solid #C8C8C8` : `none`)};
  border-bottom: ${(props) => (props.$winner ? `1px solid #C8C8C8` : `none`)};
  font-weight: ${(props) => (props.$winner ? 700 : 400)};
  text-transform: capitalize;

  .name {
    font-size: 0.9rem;
  }

  .party,
  .votes {
    font-size: 0.775rem;
    text-align: right;
    padding: 0px 0.25rem;
  }

  @media only screen and (max-width: 850px) {
    .name {
      font-size: 1rem;
    }

    .party,
    .votes {
      font-size: 0.875rem;
      text-align: right;
    }
  }

  @media only screen and (max-width: 450px) {
    .name {
      font-size: 1.25rem;
    }

    .party,
    .votes {
      font-size: 1.1rem;
      text-align: right;
    }
  }
`;

function PartyDetail({ winner, name, party, votes }) {
  return (
    <DetailsContainer $winner={winner}>
      <p className="name">{name.toLowerCase()}</p>
      <p className="party">{party}</p>
      <p className="votes">{votes}</p>
    </DetailsContainer>
  );
}

const TopPanelContainer = styled.div`
  padding: 0.8rem 0px;
`;

const LocationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0px;

  .seat,
  .percentages {
    font-weight: 700;
    font-size: 0.9rem;
  }

  .percentages {
    font-weight: 400;
  }

  .percentages > span {
    font-family: "DM Serif Text";
  }

  .loc {
    font-weight: 400;
    font-size: 0.75rem;
  }

  @media only screen and (max-width: 850px) {
    .seat,
    .percentages {
      font-size: 1rem;
    }

    .loc {
      font-size: 0.85rem;
    }
  }

  @media only screen and (max-width: 450px) {
    .seat,
    .percentages {
      font-size: 1.2rem;
    }

    .loc {
      font-size: 1rem;
    }
  }
`;

function TopPanel({ seat, loc, turnout, margin }) {
  return (
    <TopPanelContainer>
      <LocationContainer>
        <p className="seat">{seat}</p>
        <p className="loc">{loc}</p>
      </LocationContainer>

      <LocationContainer>
        <p className="percentages">
          <span>Vote Margin:</span> {margin === "N/A" ? margin : `${margin}%`}
        </p>
        <p className="percentages">
          <span>Turnout:</span> {turnout ? `${turnout}%` : `N/A`}
        </p>
      </LocationContainer>
    </TopPanelContainer>
  );
}
