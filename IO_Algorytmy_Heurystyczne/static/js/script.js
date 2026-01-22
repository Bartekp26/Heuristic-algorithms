        var batCount = document.getElementById('batCount');
        var batCountValue = document.getElementById('batCountValue');
        var comparisonBatCount = document.getElementById('comparisonBatCount');
        var comparisonBatCountValue = document.getElementById('comparisonBatCountValue');

        batCount.addEventListener('input', function() {
            batCountValue.textContent = this.value;
        });

        comparisonBatCount.addEventListener('input', function() {
            comparisonBatCountValue.textContent = this.value;
        });

        setTimeout(function() {
            var bars = document.querySelectorAll('.chart-bar');
            for (var i = 0; i < bars.length; i++) {
                bars[i].style.width = bars[i].getAttribute('data-width');
            }
        }, 1000);

        var navLinks = document.querySelectorAll('.nav-links a');
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
            });
        }

        var algoDescriptions = {
            0: {
                title: 'Algorytm Bat',
                text: 'Algorytm Bat to zaawansowana metoda optymalizacji inspirowana naturalnym zachowaniem echa u nietoperzy.' +
                    ' Algorytm wykorzystuje echolokację do poszukiwania optymalnych rozwiązań w przestrzeni przeszukiwania. ' +
                    'Funkcjonuje poprzez symulację lotu nietoperzy, które emitują ultradźwięki i nasłuchują ich ech odbijających się od przeszkód. ' +
                    'Algorytm jest szczególnie efektywny dla problemów optymalizacyjnych o wysokiej wymiarowości i charakteryzuje się bardzo szybką zbieżnością do optymalnych rozwiązań. ' +
                    'Doskonale nadaje się do rozwiązywania problemów szukania ekstremów funkcji wielomodalnych, gdzie tradycyjne metody ulegają utknięciu w optimach lokalnych. Algorytm łączy elementy zmienności losowej z deterministycznym kierowaniem poszukiwań.'
            },
            1: {
                title: 'Algorytm ABC',
                text: 'Algorytm ABC (Artificial Bee Colony) jest inspirowany naturalnym zachowaniem roju pszczół miodnych w procesie poszukiwania pożywienia. ' +
                'Symuluje społeczną behawioralną strukturę pszczoły, z trzema rolami: pszczoły pracownice, pszczoły zwiadowcy i pszczoły obserwatorki. ' +
                'Każda pszczoła pracownica eksploruje okolice zidentyfikowanego źródła pożywienia, ' +
                'a pszczoły zwiadowcy poszukują nowych złóż poprzez losowe eksplorowanie. ' +   
                'Charakteryzuje się doskonałą równowagą między eksploracją przestrzeni poszukiwań a eksploatacją obiecujących regionów. ' +
                'Doskonale sprawdza się w optymalizacji funkcji ciągłych i jest niezwykle odporny na utknięcie w optimach lokalnych. ' +
                'Algorytm wymaga relatywnie mniej parametrów niż inne metody i charakteryzuje się wysoką stabilnością konwergencji.'
            },
            2: {
                title: 'Algorytm Genetyczny',
                text: 'Algorytm genetyczny to nowoczesna metoda ewolucyjna oparta na darwinowskich mechanizmach doboru naturalnego i genetycznego dziedziczenia cech.' +
                ' Operuje na populacji kandydatów i iteracyjnie je ulepsza poprzez trzy główne operatory genetyczne: selekcję, krzyżowanie i mutację. ' +
                'Każdy osobnik w populacji ma przypisane zdolności przystosowania  określające jego szanse na reprodukcję i transmission genów do następnego pokolenia.' +
                'Szczególnie efektywny dla problemów kombinatorycznych i optymalizacji ciągłych o złożonych krajobrazach funkcji. ' +
                'Oferuje ogromną elastyczność w definiowaniu kodowania osobników, sposobu reprezentacji problemu oraz zindywidualizowanej funkcji przystosowania, ' +
                'co czyni go uniwersalnym narzędziem optymalizacyjnym. Algorytm jest szczególnie ceniony za zdolność do pracy w zmiennych i niejasnych środowiskach.'
            }
        };

        function setupAlgoToggle(containerId) {
            var container = document.querySelector(containerId);
            if (!container) return;

            var buttons = container.querySelectorAll('.algo-toggle-btn');
            var indicator = container.querySelector('.algo-toggle-indicator');

            function updateIndicatorPosition(index) {
                indicator.style.transform = 'translateX(' + (index * 100) + '%)';
                
                var descDiv = document.getElementById('algoDescription');
                if (descDiv) {
                    var desc = algoDescriptions[index];
                    descDiv.querySelector('h3').textContent = desc.title;
                    descDiv.querySelector('p').textContent = desc.text;
                }
            }

            buttons.forEach(function(btn, index) {
                btn.addEventListener('click', function() {
                    buttons.forEach(function(b) {
                        b.classList.remove('active');
                    });
                    
                    this.classList.add('active');
                    updateIndicatorPosition(index);
                });
            });
        }

        setupAlgoToggle('.algo-selector-section .algo-toggle-container');
        setupAlgoToggle('.simulator-box .algo-toggle-container');

        var functionSelect = document.getElementById('functionSelect');
        var functionInfo = document.getElementById('functionInfo');

        var functionDetails = {
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
            var n = 2;
            var A = 10;
            var val = A * n + (x*x - A*Math.cos(2*Math.PI*x)) + (y*y - A*Math.cos(2*Math.PI*y));
            return val;
        }

        function evaluateSphere(x, y) {
            var val = x*x + y*y;
            return val;
        }

        function evaluateRosenbrock(x, y) {
            var val = 100*Math.pow(y - x*x, 2) + Math.pow(1 - x, 2);
            return val;
        }

        function evaluateGriewank(x, y) {
            var val = 1 + (x*x + y*y)/4000 - Math.cos(x/1)*Math.cos(y/Math.sqrt(2));
            return val * 20;
        }

        function evaluateZakharov(x, y) {
            var val = x*x + y*y + Math.pow(0.5*x, 2) + Math.pow(0.5*y, 2);
            return val;
        }

        function generateHeatmapData(functionName) {
            var ranges = {
                rastrigin: { xMin: -5.12, xMax: 5.12, yMin: -5.12, yMax: 5.12, step: 0.2 },
                sphere: { xMin: -5.12, xMax: 5.12, yMin: -5.12, yMax: 5.12, step: 0.2 },
                rosenbrock: { xMin: -2.048, xMax: 2.048, yMin: -2.048, yMax: 2.048, step: 0.08 },
                griewank: { xMin: -100, xMax: 100, yMin: -100, yMax: 100, step: 4 },
                zakharov: { xMin: -5, xMax: 10, yMin: -5, yMax: 10, step: 0.3 }
            };
            
            var range = ranges[functionName] || ranges.rastrigin;
            var evaluateFn = window['evaluate' + functionName.charAt(0).toUpperCase() + functionName.slice(1)];
            if (!evaluateFn && functionName === 'griewank') evaluateFn = evaluateGriewank;
            if (!evaluateFn && functionName === 'zakharov') evaluateFn = evaluateZakharov;
            
            var xValues = [];
            var yValues = [];
            var zValues = [];
            
            for (var x = range.xMin; x <= range.xMax; x += range.step) {
                xValues.push(x);
            }
            
            for (var y = range.yMin; y <= range.yMax; y += range.step) {
                yValues.push(y);
            }
            
            for (var yi = 0; yi < yValues.length; yi++) {
                var row = [];
                for (var xi = 0; xi < xValues.length; xi++) {
                    row.push(evaluateFn(xValues[xi], yValues[yi]));
                }
                zValues.push(row);
            }
            
            return { x: xValues, y: yValues, z: zValues };
        }

        function plotHeatmap(functionName) {
            var data = generateHeatmapData(functionName);
            
            var trace = {
                x: data.x,
                y: data.y,
                z: data.z,
                type: 'heatmap',
                colorscale: 'Viridis',
                showscale: false,
                colorbar: {
                    title: 'Wartość'
                }
            };
            
            var layout = {
                title: functionName.charAt(0).toUpperCase() + functionName.slice(1),
                xaxis: { title: 'X' },
                yaxis: { title: 'Y' },
                height: 300,
                width: 300,
                margin: { l: 50, r: 30, t: 40, b: 50 },
                plot_bgcolor: 'rgba(26, 26, 46, 0.5)',
                paper_bgcolor: 'rgba(26, 26, 46, 0)',
                font: { color: '#ffffff', size: 11 },
                xaxis: {
                    title: 'X',
                    gridcolor: 'rgba(168, 85, 247, 0.1)',
                    titlefont: { size: 11 }
                },
                yaxis: {
                    title: 'Y',
                    gridcolor: 'rgba(168, 85, 247, 0.1)',
                    titlefont: { size: 11 }
                }
            };
            
            var config = {
                responsive: false,
                displayModeBar: false,
                displaylogo: false
            };
            
            Plotly.newPlot('functionPlotly', [trace], layout, config);
        }

        function updateFunctionInfo(value) {
            var details = functionDetails[value];
            if (details && functionInfo) {
                functionInfo.innerHTML = '<div id="functionPlotly" class="function-plotly"></div>' + 
                    '<div class="function-description">' +
                    '<strong>' + details.name + '</strong>' +
                    '<div style="margin-bottom: 0.75rem;"><strong style="color: var(--text-muted); font-weight: 600; font-size: 0.9rem;">Zakres:</strong> ' + details.range + '</div>' +
                    '<div style="margin-bottom: 0.75rem;"><strong style="color: var(--text-muted); font-weight: 600; font-size: 0.9rem;">Minimum:</strong> ' + details.minimum + '</div>' +
                    '<div><strong style="color: var(--text-muted); font-weight: 600; font-size: 0.9rem;">Charakterystyka:</strong> ' + details.description + '</div>' +
                    '</div>';
                setTimeout(function() {
                    plotHeatmap(value);
                }, 50);
            }
        }

        var functionDropdownBtn = document.getElementById('functionDropdownBtn');
        var functionDropdownMenu = document.getElementById('functionDropdownMenu');
        var functionOptions = document.querySelectorAll('.function-option');
        var functionInfo = document.getElementById('functionInfo');

        if (functionDropdownBtn) {
            functionDropdownBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                functionDropdownMenu.classList.toggle('open');
                functionDropdownBtn.classList.toggle('open');
            });
        }

        functionOptions.forEach(function(option) {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                var value = this.getAttribute('data-value');
                var name = this.textContent;
                
                document.querySelector('.function-name').textContent = name;
                
                functionOptions.forEach(function(opt) {
                    opt.classList.remove('active');
                });
                
                this.classList.add('active');
                
                functionDropdownMenu.classList.remove('open');
                functionDropdownBtn.classList.remove('open');
                
                functionInfo.style.display = 'flex';
                
                updateFunctionInfo(value);
            });
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.function-dropdown-container')) {
                functionDropdownMenu.classList.remove('open');
                functionDropdownBtn.classList.remove('open');
            }
        });

        if (functionSelect) {
            functionSelect.addEventListener('change', function() {
                updateFunctionInfo(this.value);
            });
            updateFunctionInfo(functionSelect.value);
        }

        function plotComparisonChart() {
            var algorithms = ['Algorytm Bat', 'Algorytm ABC', 'Algorytm Genetyczny'];
            var times = [2.34, 1.89, 3.12]; 

            var trace = {
                x: algorithms,
                y: times,
                type: 'bar',
                marker: {
                    color: [
                        'rgba(168, 85, 247, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                        'rgba(59, 130, 246, 0.8)'
                    ]
                }
            };

            var layout = {
                title: {
                    text: 'Czas Wykonania Algorytmów',
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
                        text: 'Czas (sekundy)',
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

            var config = {
                responsive: true,
                displayModeBar: false,
                displaylogo: false
            };

            Plotly.newPlot('comparisonPlotly', [trace], layout, config);

            document.getElementById('batTime').textContent = times[0].toFixed(2) + ' s';
            document.getElementById('abcTime').textContent = times[1].toFixed(2) + ' s';
            document.getElementById('geneticTime').textContent = times[2].toFixed(2) + ' s';
        }

        var comparisonBtn = document.querySelector('.comparison-btn');
        if (comparisonBtn) {
            comparisonBtn.addEventListener('click', function() {
                var resultsBox = document.getElementById('comparisonResults');
                var isShown = resultsBox.classList.contains('show');
                
                if (!isShown) {
                    resultsBox.classList.add('show');
                    setTimeout(function() {
                        plotComparisonChart();
                    }, 300);
                } else {
                    resultsBox.classList.remove('show');
                }
            });
        }
