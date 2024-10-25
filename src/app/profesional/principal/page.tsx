"use client "
import React, { useEffect, useState } from "react";
import Navigate from "../../../components/profesional/navigate/page";


// define la interfaz del profesional en la principal
const Profesional: React.FC = () => {

    return (
        <main className="relative min-h-screen w-screen">


            <div className="fixed justify-between w-full p-4" style={{ background: "#1CABEB" }}>

                <Navigate />
            </div>
           

        </main>


    );
}
export default Profesional;



