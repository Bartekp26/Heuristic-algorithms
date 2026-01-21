document.addEventListener('DOMContentLoaded', function() {
    const batCount = document.getElementById('batCount');
    const batCountValue = document.getElementById('batCountValue');
    const comparisonBatCount = document.getElementById('comparisonBatCount');
    const comparisonBatCountValue = document.getElementById('comparisonBatCountValue');

    if (batCount) {
        batCount.addEventListener('input', function() {
            batCountValue.textContent = this.value;
        });
    }

    if (comparisonBatCount) {
        comparisonBatCount.addEventListener('input', function() {
            comparisonBatCountValue.textContent = this.value;
        });
    }

    setTimeout(function() {
        const bars = document.querySelectorAll('.chart-bar');
        for (let i = 0; i < bars.length; i++) {
            bars[i].style.width = bars[i].getAttribute('data-width');
        }
    }, 1000);

    const navLinks = document.querySelectorAll('.nav-links a');
    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
