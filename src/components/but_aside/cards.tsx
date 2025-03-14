import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

import LogoW from "../../../public/Images/Whatsapp_logo.png"
import LogoI from "../../../public/Images/Instagram_logo.png"
import LogoM from "../../../public/Images/google_maps_new_logo_icon.png"

const Card = () => {
    const handleWhatsAppClick = () => {
      const phoneNumber = '3435008302'; // Número de teléfono de Casa Jardín
      const message = encodeURIComponent('¡Hola! Estoy interesado en tu producto.');
      const url = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(url, '_blank'); // Abre en una nueva pestaña
    };
    const handleInstagramClick = () => {
      const user = "cet.casajardin"; // Usuario de Instagram
      const url = `https://www.instagram.com/${user}`;
      window.open(url, '_blank'); // Abre en una nueva pestaña
    }
  return (
    <StyledWrapper>
      <div className="card">
       
        <button className="socialContainer containerOne"  onClick={handleInstagramClick}
            >
              <Image src={LogoI} alt="Logo Casa Jardín" width={30} height={30} />
        </button>

        <button className="socialContainer containerTwo" 
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
           <Image src={LogoM} alt="Logo Casa Jardín" width={30} height={30} />
        </button>

        <button className="socialContainer containerFour" onClick={handleWhatsAppClick}>
            <Image src={LogoW} alt="Logo Casa Jardín" width={30} height={30} />
        </button>
      </div>
    </StyledWrapper>
   
  );
}

const StyledWrapper = styled.div`
  .card {
    width: fit-content;
    height: fit-content;

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    gap: 20px;
  }

  /* for all social containers*/
  .socialContainer {
    width: 52px;
    height: 52px;

    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition-duration: 0.3s;
    border-radius: 30px;
  }
  /* instagram*/
  .containerOne:hover {
    transition-duration: 0.3s;
    transform: scale(1.3);
  }
  /* maps*/
  .containerTwo:hover {

    transition-duration: 0.3s;
    transform: scale(1.3);
  }
  /* Whatsapp*/
  .containerFour:hover {
    transition-duration: 0.3s;
    transform: scale(1.3);
  }

  .socialContainer:active {
    transform: scale(0.9);
    transition-duration: 0.3s;
  }

  .socialSvg {
    width: 17px;
  }

  .socialSvg path {
    fill: rgb(255, 255, 255);
  }

  .socialContainer:hover .socialSvg {
    animation: slide-in-top 0.3s both;
  }

  @keyframes slide-in-top {
    0% {
      transform: translateY(-50px);
      opacity: 0;
    }

    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }`;

export default Card;
