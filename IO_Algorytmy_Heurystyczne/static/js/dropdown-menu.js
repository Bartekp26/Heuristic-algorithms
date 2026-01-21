function initializeFunctionDropdowns() {
    const dropdownContainers = document.querySelectorAll('.function-dropdown-container');
    
    dropdownContainers.forEach(container => {
        const dropdownBtn = container.querySelector('.function-dropdown-btn');
        const dropdownMenu = container.querySelector('.function-dropdown-menu');
        const functionOptions = container.querySelectorAll('.function-option');
        
        if (!dropdownBtn || !dropdownMenu) return;
        
        dropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('open');
            dropdownBtn.classList.toggle('open');
        });
        
        functionOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                const value = this.getAttribute('data-value');
                const name = this.textContent;
                
                const functionNameSpan = dropdownBtn.querySelector('.function-name');
                if (functionNameSpan) {
                    functionNameSpan.textContent = name;
                }
                
                functionOptions.forEach(opt => {
                    opt.classList.remove('active');
                });
                this.classList.add('active');
                
                dropdownMenu.classList.remove('open');
                dropdownBtn.classList.remove('open');
                
                const functionInfo = container.closest('.simulator-box')?.querySelector('#functionInfo');
                if (functionInfo) {
                    functionInfo.style.display = 'flex';
                    updateFunctionInfo(value);
                }
            });
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.function-dropdown-container')) {
            document.querySelectorAll('.function-dropdown-menu').forEach(menu => {
                menu.classList.remove('open');
            });
            document.querySelectorAll('.function-dropdown-btn').forEach(btn => {
                btn.classList.remove('open');
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeFunctionDropdowns);
