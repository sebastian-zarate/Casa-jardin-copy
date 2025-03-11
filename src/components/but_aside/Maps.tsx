import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <button
        className="Btn"
        onClick={() => {
          try {
            window.open(
              "https://www.google.com/maps?q=Padre+Becher+991,+Crespo",
              "_blank"
            );
          } catch (error) {
            console.error("Error al abrir Google Maps:", error);


          }
        }}
      >
        <div className="sign w-2 h-2">
          <svg className="socialSvg mapsSvg" viewBox="0 0 24 24" >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 4.28 5.55 11.74 6.28 12.66.4.5 1.04.5 1.44 0C13.45 20.74 19 13.28 19 9c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
          </svg>
        </div>
        <div className="text">Ubicación</div>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .Btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 45px;
    height: 45px;
    max-height: 50px;
    max-width: 150px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-duration: 0.3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
    background-color:rgb(36, 49, 70); /* Color de Google Maps */
  }

  .sign {
    width: 100%;
    transition-duration: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sign svg {
    width: 25px;
  }

  .sign svg path {
    fill: white;
  }

  .text {
    position: absolute;
    right: 0%;
    width: 0%;
    opacity: 0;
    color: white;
    font-size: 1.2em;
    font-weight: 600;
    transition-duration: 0.3s;
  }

  .Btn:hover {
    width: 150px;
    border-radius: 40px;
    transition-duration: 0.3s;
  }

  .Btn:hover .sign {
    width: 30%;
    transition-duration: 0.3s;
    padding-left: 10px;
  }

  .Btn:hover .text {
    opacity: 1;
    width: 70%;
    transition-duration: 0.3s;
    padding-right: 10px;
  }

  .Btn:active {
    transform: translate(2px, 2px);
  }
`;

export default Button;
