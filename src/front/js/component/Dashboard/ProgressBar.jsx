import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ nombre_plan, monto_inicial, total, current }) => {
    const percentage = Math.min((current / total) * 100, 100); // Asegura que no supere el 100%

    // Calcular la posición en función del porcentaje
    const valuePosition = `calc(${percentage}% - 30px)`; // Centrado según el porcentaje

    // Usamos la misma posición para el porcentaje fuera de la barra
    const percentagePosition = `calc(${percentage}% + 30px)`; // Mismo valor de left para que se alinee

    // Formateo de los valores monetarios
    const formattedCurrent = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(current);
    const formattedMontoInicial = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(monto_inicial);
    const formattedTotal = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(total);

    return (
        <div className="progress-bar-container mb-5">
            {nombre_plan && <div className="progress-bar-title">{nombre_plan}</div>}

            <div className="progress-bar-wrapper">
                {/* Porcentaje fuera de la barra (arriba) */}
                {current > 0 && (
                    <div className="progress-percentage-above" style={{ left: percentagePosition }}>
                        {`${percentage.toFixed(1)}%`}
                    </div>
                )}

                <span className="percentage-left">0%</span>

                <div className="progress-bar">
                    {/* Barra de progreso con el relleno morado */}
                    <div
                        className="progress-fill"
                        style={{
                            background: 'linear-gradient(to right, rgba(128, 0, 128, 0.2), rgb(128, 0, 128))',
                        }}
                    />

                    {/* Porcentaje dentro de la barra */}
                    <div className="progress-value" style={{ left: valuePosition }}>
                        {current > 0 && formattedCurrent}
                    </div>
                </div>

                <span className="percentage-right">100%</span>
            </div>

            {/* Valores debajo de la barra */}
            <div className="progress-money">
                <span>{formattedMontoInicial}</span>
                <span>{formattedTotal}</span>
            </div>
        </div>
    );
};

export default ProgressBar;
