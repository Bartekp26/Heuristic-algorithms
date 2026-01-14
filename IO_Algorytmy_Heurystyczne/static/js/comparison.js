// comparison.js - Obsługa porównania algorytmów

function plotComparisonChart(bestValues) {
    const algorithms = ['Algorytm Bat', 'Algorytm ABC', 'Algorytm Genetyczny'];
    const values = bestValues || [2.34, 1.89, 3.12]; 

    const trace = {
        x: algorithms,
        y: values,
        type: 'bar',
        marker: {
            color: [
                'rgba(168, 85, 247, 0.8)',
                'rgba(236, 72, 153, 0.8)',
                'rgba(59, 130, 246, 0.8)'
            ]
        }
    };

    const layout = {
        title: {
            text: 'Porównanie najlepszej wartości algorytmu',
            font: {
                size: 20,
                color: '#a855f7',
                family: 'Segoe UI, sans-serif',
                weight: 'bold'
            },
            x: 0.5,
            xanchor: 'center'
        },
        xaxis: {
            gridcolor: 'rgba(168, 85, 247, 0.1)',
            tickfont: {
                size: 14,
                color: '#b8b8d1',
                family: 'Segoe UI, sans-serif'
            },
            showgrid: true
        },
        yaxis: {
            title: {
                text: 'Best Value',
                font: {
                    size: 14,
                    color: '#a855f7',
                    weight: 'bold'
                }
            },
            gridcolor: 'rgba(168, 85, 247, 0.1)',
            tickfont: {
                size: 14,
                color: '#b8b8d1',
                family: 'Segoe UI, sans-serif'
            }
        },
        height: 400,
        plot_bgcolor: 'rgba(26, 26, 46, 0.5)',
        paper_bgcolor: 'rgba(26, 26, 46, 0)',
        font: { color: '#ffffff', size: 14 },
        margin: { l: 70, r: 60, t: 80, b: 60 }
    };

    const config = {
        responsive: true,
        displayModeBar: false,
        displaylogo: false
    };

    Plotly.newPlot('comparisonPlotly', [trace], layout, config);

    document.getElementById('batTime').textContent = values[0].toFixed(6);
    document.getElementById('abcTime').textContent = values[1].toFixed(6);
    document.getElementById('geneticTime').textContent = values[2].toFixed(6);
}

function plotConvergenceChart(convergenceData) {
    const traces = [
        {
            y: convergenceData.bat,
            name: 'Algorytm Bat',
            type: 'scatter',
            mode: 'lines',
            line: { color: 'rgba(168, 85, 247, 0.8)', width: 2 }
        },
        {
            y: convergenceData.abc,
            name: 'Algorytm ABC',
            type: 'scatter',
            mode: 'lines',
            line: { color: 'rgba(236, 72, 153, 0.8)', width: 2 }
        },
        {
            y: convergenceData.genetic,
            name: 'Algorytm Genetyczny',
            type: 'scatter',
            mode: 'lines',
            line: { color: 'rgba(59, 130, 246, 0.8)', width: 2 }
        }
    ];

    const layout = {
        title: {
            text: 'Krzywa Zbieżności Algorytmów',
            font: {
                size: 20,
                color: '#a855f7',
                family: 'Segoe UI, sans-serif',
                weight: 'bold'
            },
            x: 0.5,
            xanchor: 'center'
        },
        xaxis: {
            title: 'Iteracja',
            gridcolor: 'rgba(168, 85, 247, 0.1)',
            tickfont: {
                size: 12,
                color: '#b8b8d1'
            }
        },
        yaxis: {
            title: {
                text: 'Best Value',
                font: {
                    size: 14,
                    color: '#a855f7',
                    weight: 'bold'
                }
            },
            gridcolor: 'rgba(168, 85, 247, 0.1)',
            tickfont: {
                size: 12,
                color: '#b8b8d1'
            },
            type: 'log'
        },
        height: 400,
        plot_bgcolor: 'rgba(26, 26, 46, 0.5)',
        paper_bgcolor: 'rgba(26, 26, 46, 0)',
        font: { color: '#ffffff', size: 12 },
        legend: {
            x: 0.7,
            y: 0.95,
            bgcolor: 'rgba(26, 26, 46, 0.8)',
            bordercolor: 'rgba(168, 85, 247, 0.5)',
            borderwidth: 1
        },
        margin: { l: 70, r: 60, t: 80, b: 60 }
    };

    const config = {
        responsive: true,
        displayModeBar: false,
        displaylogo: false
    };

    Plotly.newPlot('convergencePlotly', traces, layout, config);
}

async function runComparisonAlgorithms() {
    try {
        const n = document.getElementById('comparisonBatCount').value;

        const functionNameSpan = document.querySelector('#comparisonFunctionDropdownBtn .function-name');
        const funcName = functionNameSpan?.textContent.toLowerCase() || 'rastrigin';
        
        const response = await fetch(`/GetAlgorithmsData/${funcName}/${n}`);
        const data = await response.json();
        
        if (data.error) {
            console.error('Błąd API:', data.error);
            alert('Błąd: ' + data.error);
            return;
        }
        
        const bestValues = data.algorithms.map(algo => algo.best_value);
        
        const convergenceData = {
            bat: data.algorithms[1].convergence || [],
            abc: data.algorithms[0].convergence || [],
            genetic: data.algorithms[2].convergence || []
        };
        
        plotComparisonChart(bestValues);
        plotConvergenceChart(convergenceData);
        
    } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
        alert('Błąd podczas pobierania danych algorytmów');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const comparisonBtn = document.querySelector('.comparison-btn');
    if (comparisonBtn) {
        comparisonBtn.addEventListener('click', function() {
            const resultsBox = document.getElementById('comparisonResults');
            const isShown = resultsBox.classList.contains('show');
            
            if (!isShown) {
                resultsBox.classList.add('show');
                setTimeout(function() {
                    runComparisonAlgorithms();
                }, 300);
            } else {
                resultsBox.classList.remove('show');
            }
        });
    }
});
