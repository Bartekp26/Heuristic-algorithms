// algorytm-toggle.js - Obsługa przełączania algorytmów

const algoDescriptions = {
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
    const container = document.querySelector(containerId);
    if (!container) return;

    const buttons = container.querySelectorAll('.algo-toggle-btn');
    const indicator = container.querySelector('.algo-toggle-indicator');

    function updateIndicatorPosition(index) {
        indicator.style.transform = 'translateX(' + (index * 100) + '%)';
        
        const descDiv = document.getElementById('algoDescription');
        if (descDiv) {
            const desc = algoDescriptions[index];
            descDiv.querySelector('h3').textContent = desc.title;
            descDiv.querySelector('p').textContent = desc.text;
        }
    }

    buttons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            buttons.forEach(b => {
                b.classList.remove('active');
            });
            
            this.classList.add('active');
            updateIndicatorPosition(index);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupAlgoToggle('.algo-selector-section .algo-toggle-container');
    setupAlgoToggle('.simulator-box .algo-toggle-container');
});
