"use client";
import Logo from "../../../public/Images/LogoCasaJardin.png";
import Image from "next/image";
import Maps from "./Maps";
import Whatsapp from "./Whatsapp";

export default function But_aside() {
  return (
    <aside
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#FFFFFF",
        padding: "5px",
        borderRadius: "5px",
      }}
    >
      {/* Bloque del Logo y el Texto */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Image src={Logo} alt="Logo Casa Jardín" width={50} height={50} />
        <h2 style={{ marginTop: "10px", fontSize: "14px", fontFamily: "Cursive" }}>
          Centro Educativo y Terapéutico "Casa Jardín"
        </h2>
      </div>

      {/* Bloque de los Botones */}
      <div
        style={{
          display: "flex",
          gap: "15px",
        }}
      >
        {/* Botón de WhatsApp */}
        <Whatsapp />

        {/* Botón de Google Maps */}
        <Maps />
      </div>
    </aside>
  );
}
