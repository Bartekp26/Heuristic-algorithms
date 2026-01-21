document.addEventListener('DOMContentLoaded', function() {
    const runBtn = document.getElementById('runBtn');
    const plotDiv = document.getElementById('simulationPlotly');
    const simulationResultBox = document.getElementById('simulationResultBox');

    function getSelectedAlgorithm() {
        const active = document.querySelector('#simulator .algo-toggle-container .algo-toggle-btn.active');
        if (!active) return 'bat';
        const idx = active.getAttribute('data-algo');
        if (idx === '0') return 'bat';
        if (idx === '1') return 'abc';
        if (idx === '2') return 'ga';
        return 'bat';
    }


    async function fetchPositions(algorithm, func, n_agents) {
        const url = `/simulate_positions/${algorithm}/${func}/${n_agents}`;
        const resp = await fetch(url);
        return await resp.json();
    }

    function buildHeatmapTrace(functionName) {
        try {
            const data = generateHeatmapData(functionName);
            return {
                z: data.z,
                x: data.x,
                y: data.y,
                type: 'heatmap',
                colorscale: 'Viridis',
                showscale: false,
                opacity: 0.65,
                hovertemplate: 'x: %{x:.2f}<br>y: %{y:.2f}<br>f(x,y): %{z:.2f}<extra></extra>'
            };
        } catch (e) {
            return null;
        }
    }

    runBtn.addEventListener('click', async function() {
        runBtn.disabled = true;
        const algorithm = getSelectedAlgorithm();
        const func = document.querySelector('.function-option.active').getAttribute('data-value');
        const n_agents = parseInt(document.getElementById('batCount').value || 20, 10);

        const resp = await fetchPositions(algorithm, func, n_agents);
        runBtn.disabled = false;

        if (resp.error) {
            alert('Błąd serwera: ' + resp.error);
            return;
        }

        const positions = resp.positions || [];
        if (!positions.length) {
            alert('Brak danych pozycji');
            return;
        }

        const oldBtns = document.getElementById('simulationControls');
        if (oldBtns) oldBtns.remove();

        const controlsDiv = document.createElement('div');
        controlsDiv.id = 'simulationControls';
        controlsDiv.className = 'sim-controls';

        const playBtn = document.createElement('button');
        playBtn.textContent = '▶ Play';
        playBtn.className = 'simulation-control-btn';
        playBtn.onclick = () => {
            Plotly.animate(plotDiv, null, { fromcurrent: true, frame: { duration: 200, redraw: true }, transition: { duration: 0 } });
        };

        const pauseBtn = document.createElement('button');
        pauseBtn.textContent = '⏸ Pause';
        pauseBtn.className = 'simulation-control-btn';
        pauseBtn.onclick = () => {
            Plotly.animate(plotDiv, [null], { mode: 'immediate', frame: { duration: 0, redraw: false }, transition: { duration: 0 } });
        };

        controlsDiv.appendChild(playBtn);
        controlsDiv.appendChild(pauseBtn);
        plotDiv.parentElement.insertBefore(controlsDiv, plotDiv);

        const heatmap = buildHeatmapTrace(func);

        const firstFrame = positions[0];
        const xs = firstFrame.map(p => p[0]);
        const ys = firstFrame.map(p => p[1]);

        const scatter = {
            x: xs,
            y: ys,
            mode: 'markers',
            marker: {
                size: 10,
                color: 'rgba(236, 72, 153, 0.95)',
                line: { width: 2, color: 'rgba(168, 85, 247, 0.8)' },
                symbol: 'circle'
            },
            name: 'Agenci'
        };

        const data = heatmap ? [heatmap, scatter] : [scatter];

        const frames = positions.map((frame, i) => ({
            name: 'f' + i,
            data: [
                heatmap ? null : undefined, 
                {
                    x: frame.map(p => p[0]),
                    y: frame.map(p => p[1])
                }
            ].filter(v => v !== null && v !== undefined)
        }));

        const steps = positions.map((_, i) => ({
            method: 'animate',
            label: String(i),
            args: [[ 'f' + i ], { 
                mode: 'immediate',
                frame: { duration: 100, redraw: true },
                transition: { duration: 0 } 
            }]
        }));

        const layout = {
            title: {
                text: 'Symulacja: ' + algorithm.toUpperCase() + ' — ' + func,
                font: { 
                    size: 16,
                    color: '#a855f7',
                    family: 'Segoe UI, sans-serif',
                    weight: 'bold' 
                },
                x: 0.5,
                xanchor: 'center'
            },
            xaxis: {
                title: '',
                range: [ -6, 6 ],
                showgrid: false,
                zeroline: false,
                showticklabels: false,
                showline: false
            },
            yaxis: {
                title: '',
                range: [ -6, 6 ],
                showgrid: false,
                zeroline: false,
                showticklabels: false,
                showline: false,
                scaleanchor: 'x',
                scaleratio: 1
            },
            height: 480,
            width: 480,
            margin: { t: 50, b: 60, l: 30, r: 30 },
            plot_bgcolor: 'rgba(26, 26, 46, 0.5)',
            paper_bgcolor: 'rgba(26, 26, 46, 0)',
            font: { color: '#ffffff', size: 12 },
            sliders: [{
                pad: { t: 50, b: 10 },
                currentvalue: { prefix: 'Krok: ', font: { color: '#a855f7', size: 12 } },
                steps: steps,
                tickcolor: 'rgba(168, 85, 247, 0.5)',
                ticklen: 4
            }]
        };

        const config = { responsive: true, displayModeBar: false };

        if (heatmap) {
            try {
                const hdata = generateHeatmapData(func);
                layout.xaxis.range = [hdata.x[0], hdata.x[hdata.x.length - 1]];
                layout.yaxis.range = [hdata.y[0], hdata.y[hdata.y.length - 1]];
            } catch (e) {}
        }

        simulationResultBox.classList.add('visible');
        plotDiv.classList.add('visible');

        Plotly.react(plotDiv, data, layout, config).then(() => {
            const fullFrames = positions.map((frame, i) => {
                const frameData = [];
                if (heatmap) {
                    frameData.push({ z: heatmap.z, x: heatmap.x, y: heatmap.y });
                }
                frameData.push({ x: frame.map(p => p[0]), y: frame.map(p => p[1]) });
                return { name: 'f' + i, data: frameData };
            });

            Plotly.addFrames(plotDiv, fullFrames);
        }).catch(err => {
            console.error(err);
        });

    });
});
