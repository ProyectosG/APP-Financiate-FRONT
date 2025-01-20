import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const PieChartComponent = ({ data, leyendaSinDatos, capitalInicial, capitalActual }) => {
    // Definir colores para cada sección del pastel
    const colores = ["#4caf50", "#ff0058"];
    
    return (
        <div className="pie-chart-container">
            <div className="legend-container">
                <p className="legend-text capital-inicial">
                    Capital Inicial: {new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(capitalInicial)}
                </p>
            </div>

            {leyendaSinDatos && <p className="mt-3 text-secondary"> {leyendaSinDatos} </p>}

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value" // El valor a graficar
                        nameKey="name" // El nombre de cada categoría
                        cx="50%" // Centrado horizontal
                        cy="50%" // Centrado vertical
                        outerRadius={100} // Radio del pastel
                        label={({ name, value }) => `${name}: ${value}`} // Mostrar nombre y valor
                        labelStyle={{
                            fontSize: "14px", // Tamaño de fuente
                            fontWeight: "500", // Peso de la fuente
                            fill: "#555", // Color de la fuente
                        }}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            <div className="legend-container">
                <p className="legend-text capital-actual">
                    Capital Actual: 
                    <span className="highlighted-number">
                        {new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(capitalActual)}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default PieChartComponent;
