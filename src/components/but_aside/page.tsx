"use client";

export default function But_aside() {
  return (
    <aside
      style={{
        display: "flex",
        justifyContent: "space-around",
        fontFamily: "Cursive",
        color: "#FFFFFF",
      }}
    >
      <div>
        <h1 className="text-lg">Casa Jardín</h1>
      </div>
      <div>
        <h2>Centro Educativo y Terapéutico "Casa Jardín"</h2>
        {/* Dirección como hipervínculo */}
        <h5>
          <a
            href="https://www.google.com/maps?q=Padre+Becher+991,+Crespo"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#FFFFFF", textDecoration: "underline" }}
          >
            Padre Becher 991, Crespo
          </a>
        </h5>
        <h5>Tel: 343-500 8302</h5>
      </div>
    </aside>
  );
}