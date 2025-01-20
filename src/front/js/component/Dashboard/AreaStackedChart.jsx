import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AreaStackedChart = ({ data, leyendaSinDatos }) => {
    // Definir colores para cada área
    const colores = ["#4caf50", "#ff0058"]; // Verdes para ingresos, rojos para egresos
    console.log(data)
    return (
        <div className="area-chart-container">

            {leyendaSinDatos && <p className="mt-3 text-secondary"> {leyendaSinDatos} </p>}

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />

                    {/* Área para Ingresos */}
                    <Area 
                        type="monotone" 
                        dataKey="ingresos" 
                        stackId="1" 
                        fill={colores[0]} 
                        stroke={colores[0]} 
                        fillOpacity={0.6} 
                    />
                    {/* Área para Egresos */}
                    <Area 
                        type="monotone" 
                        dataKey="egresos" 
                        stackId="1" 
                        fill={colores[1]} 
                        stroke={colores[1]} 
                        fillOpacity={0.6} 
                    />
                </AreaChart>
            </ResponsiveContainer>

        </div>
    );
};

export default AreaStackedChart;
