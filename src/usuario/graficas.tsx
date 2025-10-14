import React, { useEffect, useRef } from "react";

const Graficas: React.FC = () => {
  const plotlyRef = useRef<HTMLDivElement>(null);
  const vegaRef = useRef<HTMLDivElement>(null);
  const bokehRef = useRef<HTMLDivElement>(null);

  // Cargar scripts externos desde CDN
  const loadScript = (src: string): Promise<void> =>
    new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(`Error loading ${src}`);
      document.body.appendChild(script);
    });

  useEffect(() => {
    // Cargar Plotly
    loadScript("https://cdn.plot.ly/plotly-latest.min.js")
      .then(() => {
        const plotly = (window as any).Plotly;
        plotly.newPlot(plotlyRef.current, [
          {
            x: [1, 2, 3, 4],
            y: [10, 15, 13, 17],
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "red" },
          },
        ]);
      })
      .catch(console.error);

    // Cargar Vega
    loadScript("https://cdn.jsdelivr.net/npm/vega@5")
      .then(() => loadScript("https://cdn.jsdelivr.net/npm/vega-lite@5"))
      .then(() => loadScript("https://cdn.jsdelivr.net/npm/vega-embed@6"))
      .then(() => {
        const vegaEmbed = (window as any).vegaEmbed;
        const spec = {
          $schema: "https://vega.github.io/schema/vega-lite/v5.json",
          description: "Gráfico de barras simple",
          data: {
            values: [
              { category: "A", amount: 28 },
              { category: "B", amount: 55 },
              { category: "C", amount: 43 },
            ],
          },
          mark: "bar",
          encoding: {
            x: { field: "category", type: "nominal" },
            y: { field: "amount", type: "quantitative" },
          },
        };
        vegaEmbed(vegaRef.current, spec);
      })
      .catch(console.error);

    // Cargar BokehJS
    loadScript("https://cdn.bokeh.org/bokeh/release/bokeh-3.4.1.min.js")
      .then(() => {
        const Bokeh = (window as any).Bokeh;

        const plt = Bokeh.Plotting;
        const fig = plt.figure({
          title: "Gráfico de Bokeh",
          width: 400,
          height: 300,
        });

        fig.circle({ x: [1, 2, 3], y: [4, 5, 6], size: 10, color: "navy" });

        plt.show(fig, bokehRef.current);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-xl font-bold text-center">Gráficas</h1>

      <div>
        <h2 className="font-semibold mb-2">📈 Plotly</h2>
        <div ref={plotlyRef} />
      </div>

      <div>
        <h2 className="font-semibold mb-2">📊 Vega-Lite</h2>
        <div ref={vegaRef} />
      </div>

      <div>
        <h2 className="font-semibold mb-2">🧮 BokehJS</h2>
        <div ref={bokehRef} />
      </div>
    </div>
  );
};

export default Graficas;
