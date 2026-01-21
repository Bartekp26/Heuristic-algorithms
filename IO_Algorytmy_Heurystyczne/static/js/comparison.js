const cfg = {
    colors: ['rgba(168, 85, 247, 0.8)', 'rgba(236, 72, 153, 0.8)', 'rgba(59, 130, 246, 0.8)'],
    algoNames: ['Algorytm Bat', 'Algorytm ABC', 'Algorytm Genetyczny'],
    algoIds: ['batTime', 'abcTime', 'geneticTime'],
    plotConfig: { responsive: true, displayModeBar: false, displaylogo: false },
    baseLayout: {
        plot_bgcolor: 'rgba(26, 26, 46, 0.5)',
        paper_bgcolor: 'rgba(26, 26, 46, 0)',
        font: { color: '#ffffff' },
        xaxis: { gridcolor: 'rgba(168, 85, 247, 0.1)' },
        yaxis: { gridcolor: 'rgba(168, 85, 247, 0.1)' }
    },
    titleStyle: { size: 20, color: '#a855f7', family: 'Segoe UI, sans-serif', weight: 'bold' },
    tickStyle: { size: 14, color: '#b8b8d1', family: 'Segoe UI, sans-serif' }
};

function plotComparisonChart(bestValuesData, funcName) {
    const values = [bestValuesData.bat, bestValuesData.abc, bestValuesData.genetic];
    const layout = {
        ...cfg.baseLayout,
        title: { text: `Porównanie: ${funcName}`, font: cfg.titleStyle, x: 0.5, xanchor: 'center' },
        xaxis: { ...cfg.baseLayout.xaxis, tickfont: cfg.tickStyle, showgrid: true },
        yaxis: { ...cfg.baseLayout.yaxis, title: { text: 'Best Value', font: { ...cfg.titleStyle, size: 14 } }, tickfont: cfg.tickStyle },
        height: 500,
        margin: { l: 70, r: 60, t: 80, b: 60 }
    };
    const trace = { x: cfg.algoNames, y: values, type: 'bar', marker: { color: cfg.colors } };
    
    Plotly.newPlot('comparisonPlotly', [trace], layout, cfg.plotConfig);
    values.forEach((v, i) => document.getElementById(cfg.algoIds[i]).textContent = v.toFixed(6));
}

function plotConvergenceChart(convergenceData, funcName) {
    const traces = cfg.algoNames.map((name, i) => ({
        y: [convergenceData.bat, convergenceData.abc, convergenceData.genetic][i],
        name, type: 'scatter', mode: 'lines',
        line: { color: cfg.colors[i], width: 2 }
    }));
    const layout = {
        ...cfg.baseLayout,
        title: { text: `Zbieżność: ${funcName}`
            , font: cfg.titleStyle, x: 0.5
            , xanchor: 'center' },
        xaxis: { ...cfg.baseLayout.xaxis
            , title: 'Iteracja'
            , tickfont: { ...cfg.tickStyle, size: 12 } 
        },
        yaxis: { ...cfg.baseLayout.yaxis
            , title: { text: 'Best Value', font: { ...cfg.titleStyle, size: 14 } }
            , tickfont: { ...cfg.tickStyle, size: 12 }
            , type: 'log' 
        },
        height: 500,
        legend: {
             x: 0.7
             , y: 0.95
             , bgcolor: 'rgba(26, 26, 46, 0.8)'
             , bordercolor: 'rgba(168, 85, 247, 0.5)'
             , borderwidth: 1 
            },
        margin: { l: 70
            , r: 60
            , t: 80
            , b: 60
         }
    };
    Plotly.newPlot('convergencePlotly', traces, layout, cfg.plotConfig);
}


async function runComparisonAlgorithms() {
    const n = document.getElementById('comparisonBatCount').value;
    const dims = document.getElementById('comparisonDimensions').value;
    const funcNameSpan = document.querySelector('#comparisonFunctionDropdownBtn .function-name')?.textContent;
    const funcName = funcNameSpan?.toLowerCase();
    
    if (funcName === 'wybierz funkcję') { alert('Proszę wybrać funkcję.'); return false; }
    try {
        const data = await fetch(`/GetAlgorithmsData/${funcName}/${n}/${dims}`).then(r => r.json());
        if (data.error) throw new Error(data.error);

        plotComparisonChart({ bat: data.algorithms[1]?.best_value, abc: data.algorithms[0]?.best_value, genetic: data.algorithms[2]?.best_value }, funcNameSpan);
        plotConvergenceChart({ bat: data.algorithms[1]?.convergence || [], abc: data.algorithms[0]?.convergence || [], genetic: data.algorithms[2]?.convergence || [] }, funcNameSpan);
        return true;
    } catch (err) { 
        console.error(err); alert('Błąd danych'); return false; 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const comparisonDimensionsSlider = document.getElementById('comparisonDimensions');
    const comparisonDimensionsValue = document.getElementById('comparisonDimensionsValue');
    const comparisonBatCountSlider = document.getElementById('comparisonBatCount');
    const comparisonBatCountValue = document.getElementById('comparisonBatCountValue');

    if (comparisonDimensionsSlider) {
        comparisonDimensionsSlider.addEventListener('input', function() {
            comparisonDimensionsValue.textContent = this.value;
        });
    }

    if (comparisonBatCountSlider) {
        comparisonBatCountSlider.addEventListener('input', function() {
            comparisonBatCountValue.textContent = this.value;
        });
    }

    document.querySelector('.comparison-btn')?.addEventListener('click', function() {
        const resultsBox = document.getElementById('comparisonResults');
        const isShown = resultsBox.classList.contains('show');
        if (!isShown) {
            setTimeout(() => runComparisonAlgorithms() && resultsBox.classList.add('show'), 300);
        } else {
            resultsBox.classList.remove('show');
        }
    });
});
