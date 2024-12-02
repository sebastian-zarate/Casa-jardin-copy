"use client"
import Image from "next/image"
import Logo from "../../../../public/Images/LogoCasaJardin.png";

export default function Navigate() {
    const styles = {
        inactiveTextColor: "text-white",
        hoverTextColor: "hover:text-blue-900",
        underline: "border-b-2 border-transparent hover:border-white",
    };
    
    function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
        return (
            <a
                className={`${styles.inactiveTextColor} px-4 py-2 font-medium ${styles.hoverTextColor} ${styles.underline} duration-300`}
                href={href}
            >
                {children}
            </a>
        );
    }

    return (
        <nav className="flex justify-between w-full p-8" style={{ backgroundColor: "#3f8df5" }}>
            <div className="flex items-center">
                <Image src={Logo} alt="Logo Casa Jardin" width={50} height={50} />
                <h1 className="ml-2" style={{ color: "#FFFFFF", fontFamily: 'Cursive' }}>Casa Jardín</h1>
            </div>
            <div className="ml-auto flex space-x-4 py-2" style={{ color: "#FFFFFF", fontFamily: 'Cursive' }}>
                <NavLink href="/start/Inicio">Inicio</NavLink>
                <NavLink href="/start/Nosotros">Nosotros</NavLink>
                <NavLink href="/start/Talleres">Talleres</NavLink>
                <NavLink href="/start/signup">Ingresar</NavLink>
            </div>
        </nav>
    );
}