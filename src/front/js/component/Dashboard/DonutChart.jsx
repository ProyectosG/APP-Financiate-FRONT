import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const DonutChart = ({ data, leyendaSinDatos, capitalInicial, capitalActual }) => {
    const colores = ["#4caf50", "#ff0058"];
    
    return (
        <div className="donut-chart-container">
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
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={70}
                        label={({ name, value }) => `${name}: ${value}`}
                        labelStyle={{
                            fontSize: "14px",
                            fontWeight: "500",
                            fill: "#555",
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

export default DonutChart;
