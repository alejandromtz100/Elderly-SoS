import React from "react";
import Plot from "react-plotly.js";

const GraficasMultiples: React.FC = () => {
  const charts = [
    {
      id: 1,
      title: "Plotly (interactivo)",
      type: "custom",
    },
    {
      id: 2,
      title: "Seaborn (Python)",
      type: "img",
      src: "http://127.0.0.1:8000/grafica/seaborn",
    },
    {
      id: 3,
      title: "Bokeh (interactivo Python)",
      type: "iframe",
      src: "http://127.0.0.1:8000/grafica/bokeh",
    },
    {
      id: 4,
      title: "Ggplot (Python)",
      type: "img",
      src: "http://127.0.0.1:8000/grafica/ggplot",
    },
    {
      id: 5,
      title: "Altair (interactivo Python)",
      type: "iframe",
      src: "http://127.0.0.1:8000/grafica/altair",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        📊 Dashboard de Gráficas 
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "20px",
        }}
      >
        {charts.map((chart) => (
          <div
            key={chart.id}
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              padding: "15px",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>{chart.title}</h3>

            {chart.type === "custom" && (
              <div
                style={{
                  background: "#f9f9f9",
                  padding: "20px",
                  borderRadius: "8px",
                  height: "400px",
                }}
              >
                <Plot
                  data={[
                    {
                      x: [1, 2, 3, 4, 5, 6],
                      y: [12, 19, 8, 15, 22, 18],
                      type: "scatter",
                      mode: "lines+markers",
                      name: "Línea",
                      line: { color: "#1f77b4", width: 3 },
                      marker: { size: 8 },
                    },
                    {
                      x: [1, 2, 3, 4, 5, 6],
                      y: [9, 14, 20, 10, 12, 25],
                      type: "bar",
                      name: "Barras",
                      marker: { color: "#ff7f0e" },
                    },
                  ]}
                  layout={{
                    width: 380,
                    height: 380,
                    title: "Ejemplo Interactivo Plotly",
                    showlegend: true,
                    legend: { x: 0, y: 1.2 },
                    plot_bgcolor: "#ffffff",
                    paper_bgcolor: "#f9f9f9",
                  }}
                  style={{ width: "100%", height: "100%" }}
                  config={{ responsive: true, displayModeBar: true }}
                />
              </div>
            )}

            {chart.type === "img" && (
              <img
                src={chart.src}
                alt={chart.title}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
            )}

            {chart.type === "iframe" && (
              <iframe
                src={chart.src}
                width="100%"
                height="400"
                style={{
                  border: "none",
                  borderRadius: "8px",
                }}
                title={chart.title}
              ></iframe>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraficasMultiples;
