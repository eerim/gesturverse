document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginFormGroup = document.getElementById('login-form-group');
    const signupFormGroup = document.getElementById('signup-form-group');
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');

    function switchForm(mode) {
        if (mode === 'signup') {
            loginFormGroup.style.display = 'none';
            signupFormGroup.style.display = 'block';
        } else {
            loginFormGroup.style.display = 'block';
            signupFormGroup.style.display = 'none';
        }
    }

    if (switchToSignup) {
        switchToSignup.addEventListener('click', () => switchForm('signup'));
    }
    if (switchToLogin) {
        switchToLogin.addEventListener('click', () => switchForm('login'));
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const emailInput = document.getElementById('login-email');
            const userEmail = emailInput.value.trim(); 
            
            if (!userEmail) {
                alert("Пожалуйста, введите ваш Email для симуляции входа!");
                return;
            }

            if (window.logInSimulation) {
                window.logInSimulation(userEmail); 
            } else {
                console.error("Error: logInSimulation function not found. Check auth.js path.");
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const emailInput = document.getElementById('signup-email');
            const userEmail = emailInput.value.trim();
            const passwordInput = document.getElementById('signup-password');
            const confirmPasswordInput = document.getElementById('signup-confirm-password');
            
            if (!userEmail || passwordInput.value.length < 6 || passwordInput.value !== confirmPasswordInput.value) {
                alert("Ошибка регистрации: проверьте email и пароль (должен быть не менее 6 символов и совпадать).");
                return;
            }

            if (window.logInSimulation) {
                window.logInSimulation(userEmail); 
            }
        });
    }

});