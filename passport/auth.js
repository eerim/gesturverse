/** Checks if a user is currently logged in
 * @returns {object | null} */
function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        return JSON.parse(userData);
    }
    return null;
}

window.logoutUser = function() {
    localStorage.removeItem('currentUser');
    console.log("User logged out.");
    window.location.href = '/web-final/index.html'; 
}

/**
 * Gets the array of stamps
 * @returns {Array<string>} */
function getCurrentUserStamps() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return [];
    }

    const email = currentUser.email;
    const fullUserData = JSON.parse(localStorage.getItem(email));
    
    return fullUserData && fullUserData.stamps ? fullUserData.stamps : [];
}

function updateNavForAuth() {
    const user = getCurrentUser();
    const authLinkPlaceholder = document.getElementById('auth-link-placeholder');

    if (!authLinkPlaceholder) return;
    
    if (user) {
        authLinkPlaceholder.innerHTML = `
            <a class="me-4" href="/web-final/passport/passport.html">My Passport 🛂</a>
            <a class="btn btn-sm" id="logout-btn" style="background-color: var(--color-primary); color: white; border: none; font-weight: 500;" href="#">Log Out</a>
        `;
        document.getElementById('logout-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
        
    } else {
        authLinkPlaceholder.innerHTML = `
            <a class="btn btn-sm" style="background-color: var(--color-secondary); color: white; border: none; font-weight: 500;" href="sign.html">Log In</a>
        `;
    }
}

document.addEventListener('DOMContentLoaded', updateNavForAuth);

window.updateStamps = function(stampId) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.warn("User not logged in. Cannot save stamp.");
        return;
    }

    const email = currentUser.email;
    let fullUserData = JSON.parse(localStorage.getItem(email));

    if (!fullUserData || !fullUserData.stamps) {
        fullUserData = fullUserData || {};
        fullUserData.stamps = [];
    }

    if (!fullUserData.stamps.includes(stampId)) {
        fullUserData.stamps.push(stampId);
        localStorage.setItem(email, JSON.stringify(fullUserData));
        console.log(`✅ Stamp ${stampId} added to user: ${email}`);
    }
}

window.logInSimulation = (emailAddress) => {
    let user = { 
        email: emailAddress || 'simulated@gesturverse.com', 
        isLoggedIn: true
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    if (!localStorage.getItem(user.email)) {
        const initialProfile = {
            email: user.email,
            stamps: []
        };
        localStorage.setItem(user.email, JSON.stringify(initialProfile));
    }

    updateNavForAuth(); 

    console.log(`[AUTH] Successfully logged in as ${user.email}. Redirecting...`); 

    setTimeout(() => {
        if (window.location.pathname.includes('sign.html')) {
            window.location.href = '/web-final/index.html'; 
        } else {
            window.location.reload(); 
        }
    }, 50);
};