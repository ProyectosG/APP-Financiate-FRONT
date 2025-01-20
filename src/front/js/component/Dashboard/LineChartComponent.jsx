import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChartComponent = ({ data }) => {
    return (
        <div className="line-chart-container">
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={[...data, { mes: null, ingresos: null, egresos: null }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="mes"
                        interval={0}
                        padding={{ right: 10 }}
                        tickFormatter={(mes) => (mes ? mes.substring(0, 3) : "")} // Mostrar las tres primeras letras del mes
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ingresos" stroke="#82ca9d" connectNulls={false} dot />
                    <Line type="monotone" dataKey="egresos" stroke="#ff0058" connectNulls={false} dot />
                </LineChart>
            </ResponsiveContainer>
    </div>
    );
};

export default LineChartComponent;
