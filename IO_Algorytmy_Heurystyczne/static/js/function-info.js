const functionDetails = {
    rastrigin: {
        name: 'Rastrigin',
        range: '[-5.12, 5.12]',
        minimum: 'f(0,0,...,0) = 0',
        description: 'Wysoko multimodalna, bardzo wiele lokalnych optimów, jest trudna dla algorytmów optymalizacyjnych'
    },
    sphere: {
        name: 'Sphere',
        range: '[-5.12, 5.12]',
        minimum: 'f(0,0,...,0) = 0',
        description: 'Funkcja unimodalna, gładka, łatwa do optymalizacji, standardowy benchmark dla algorytmów'
    },
    rosenbrock: {
        name: 'Rosenbrock',
        range: '[-2.048, 2.048]',
        minimum: 'f(1,1,...,1) = 0',
        description: 'Wąska dolina paraboliczna, trudna do znalezienia optimum, wymaga precyzji algorytmu'
    },
    griewank: {
        name: 'Griewank',
        range: '[-600, 600]',
        minimum: 'f(0,0,...,0) = 0',
        description: 'Multimodalna z ostrymi pikami, dużo lokalnych optimów, szybko zmienne wartości funkcji'
    },
    zakharov: {
        name: 'Zakharov',
        range: '[-5, 10]',
        minimum: 'f(0,0,...,0) = 0',
        description: 'Umiarkowanie trudna, unimodalna w centrum, liczba wymiarów wpływa na trudność'
    }
};


function evaluateRastrigin(x, y) {
    const n = 2;
    const A = 10;
    return A * n + (x*x - A*Math.cos(2*Math.PI*x)) + (y*y - A*Math.cos(2*Math.PI*y));
}

function evaluateSphere(x, y) {
    return x*x + y*y;
}

function evaluateRosenbrock(x, y) {
    return 100*Math.pow(y - x*x, 2) + Math.pow(1 - x, 2);
}

function evaluateGriewank(x, y) {
    const val = 1 + (x*x + y*y)/4000 - Math.cos(x/1)*Math.cos(y/Math.sqrt(2));
    return val * 20;
}

function evaluateZakharov(x, y) {
    return x*x + y*y + Math.pow(0.5*x, 2) + Math.pow(0.5*y, 2);
}

function generateHeatmapData(functionName) {
    const ranges = {
        rastrigin: { xMin: -5.12, xMax: 5.12, yMin: -5.12, yMax: 5.12, step: 0.2 },
        sphere: { xMin: -5.12, xMax: 5.12, yMin: -5.12, yMax: 5.12, step: 0.2 },
        rosenbrock: { xMin: -2.048, xMax: 2.048, yMin: -2.048, yMax: 2.048, step: 0.08 },
        griewank: { xMin: -100, xMax: 100, yMin: -100, yMax: 100, step: 4 },
        zakharov: { xMin: -5, xMax: 10, yMin: -5, yMax: 10, step: 0.3 }
    };
    
    const range = ranges[functionName] || ranges.rastrigin;
    let evaluateFn = window['evaluate' + functionName.charAt(0).toUpperCase() + functionName.slice(1)];
    if (!evaluateFn && functionName === 'griewank') evaluateFn = evaluateGriewank;
    if (!evaluateFn && functionName === 'zakharov') evaluateFn = evaluateZakharov;
    
    const xValues = [];
    const yValues = [];
    const zValues = [];
    
    for (let x = range.xMin; x <= range.xMax; x += range.step) {
        xValues.push(x);
    }
    
    for (let y = range.yMin; y <= range.yMax; y += range.step) {
        yValues.push(y);
    }
    
    for (let yi = 0; yi < yValues.length; yi++) {
        const row = [];
        for (let xi = 0; xi < xValues.length; xi++) {
            row.push(evaluateFn(xValues[xi], yValues[yi]));
        }
        zValues.push(row);
    }
    
    return { x: xValues, y: yValues, z: zValues };
}

function plotHeatmap(functionName) {
    const data = generateHeatmapData(functionName);
    
    const trace = {
        x: data.x,
        y: data.y,
        z: data.z,
        type: 'heatmap',
        colorscale: 'Viridis',
        hovertemplate: 'x: %{x:.2f}<br>y: %{y:.2f}<br>f(x,y): %{z:.2f}<extra></extra>',
        colorbar: {
            thickness: 15,
            len: 0.7
        }
    };

    const layout = {
        xaxis: { title: 'x' },
        height: 300,
        width: 380,
        plot_bgcolor: 'rgba(26, 26, 46, 0.5)',
        paper_bgcolor: 'rgba(26, 26, 46, 0)',
        font: { color: '#ffffff', size: 12 },
        margin: { l: 50, r: 50, t: 20, b: 30 }
    };

    const config = {
        responsive: false,
        displayModeBar: false,
        displaylogo: false
    };

    const plotDiv = document.getElementById('functionPlotly');
    if (plotDiv) {
        Plotly.newPlot('functionPlotly', [trace], layout, config);
    }
}

function updateFunctionInfo(functionName) {
    const details = functionDetails[functionName];
    if (!details) return;
    
    const descriptionDiv = document.querySelector('.function-description');
    if (descriptionDiv) {
        const html = `
            <p><strong>${details.name}</strong></p>
            <p class="func-info-item">Zakres: ${details.range}</p>
            <p class="func-info-item">Minimum globalne: ${details.minimum}</p>
            <p class="func-info-item">Charakterystyka: ${details.description}</p>
        `;
        descriptionDiv.innerHTML = html;
    }
    
    plotHeatmap(functionName);
}

document.addEventListener('DOMContentLoaded', function() {
    updateFunctionInfo('rastrigin');
});
