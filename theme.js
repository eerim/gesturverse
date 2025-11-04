document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;
    const toggle = document.getElementById('darkModeToggle');
    const modeIcon = document.getElementById('modeIcon');

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        if (theme === 'dark') {
            if (modeIcon) modeIcon.innerHTML = '🌙';
            if (toggle) toggle.checked = true;
        } else {
            if (modeIcon) modeIcon.innerHTML = '☀️';
            if (toggle) toggle.checked = false;
        }
    }

    const savedTheme = localStorage.getItem('theme');
  
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme('light'); 
    }

    if (toggle) {
        toggle.addEventListener('change', (e) => {
            const newTheme = e.target.checked ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
});