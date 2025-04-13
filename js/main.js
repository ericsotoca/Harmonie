/* ========================================= */
/* == Main Application Logic ============== */
/* ========================================= */

const MainApp = {
    // --- DOM Elements ---
    dom: {},

    // --- State ---
    currentApp: 'wheel', // Default app to show first after landing

    // --- Initialization ---
    init: function() {
        console.log("MainApp Initializing...");
        this.cacheDomElements();
        this.addEventListeners();

        // Check if landing page should be shown or skipped (e.g., based on localStorage)
        // For now, always show landing page first.
        this.showLandingPage();

        // Initialize sub-modules (they should handle their own internal state/rendering)
        // Ensure the sub-app objects (WheelApp, GoalsApp, RitualsApp) are defined
        // in their respective files before this init runs.
        if (typeof WheelApp !== 'undefined') WheelApp.init();
        else console.error("WheelApp is not defined. Check js/wheel.js");

        if (typeof GoalsApp !== 'undefined') GoalsApp.init();
        else console.error("GoalsApp is not defined. Check js/goals.js");

        if (typeof RitualsApp !== 'undefined') RitualsApp.init();
        else console.error("RitualsApp is not defined. Check js/rituals.js");

        console.log("MainApp Initialized.");
    },

    cacheDomElements: function() {
        this.dom.landingPage = document.getElementById('landing-page');
        this.dom.startAppButton = document.getElementById('start-app-btn');
        this.dom.mainAppContent = document.getElementById('main-app-content');
        this.dom.mainNav = document.querySelector('.main-nav');
        this.dom.navButtons = this.dom.mainNav ? this.dom.mainNav.querySelectorAll('button[data-app]') : [];
        this.dom.appContainers = {
            wheel: document.getElementById('app-wheel'),
            goals: document.getElementById('app-goals'),
            rituals: document.getElementById('app-rituals'),
        };
    },

    addEventListeners: function() {
        // Start Button on Landing Page
        if (this.dom.startAppButton) {
            this.dom.startAppButton.addEventListener('click', () => {
                this.showMainApp();
            });
        }

        // Main Navigation Buttons
        this.dom.navButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const appName = event.currentTarget.dataset.app;
                if (appName) {
                    this.showApp(appName);
                }
            });
        });
    },

    // --- View Management ---

    showLandingPage: function() {
        if (this.dom.landingPage) this.dom.landingPage.classList.remove('hidden');
        if (this.dom.mainAppContent) this.dom.mainAppContent.classList.add('hidden');
         // Peut-être remettre le focus sur le bouton start si pertinent
         // if (this.dom.startAppButton) this.dom.startAppButton.focus();
    },

    showMainApp: function() {
        if (this.dom.landingPage) this.dom.landingPage.classList.add('hidden');
        if (this.dom.mainAppContent) {
             this.dom.mainAppContent.classList.remove('hidden');
             // Force le layout flex pour que flex-grow fonctionne
             this.dom.mainAppContent.style.display = 'flex';
        }

        // Show the default or last viewed app
        this.showApp(this.currentApp); // Show 'wheel' by default
    },

    /**
     * Displays the specified application module and hides others.
     * Updates the active state of navigation buttons and app containers.
     * @param {string} appName - The name of the app to show ('wheel', 'goals', 'rituals').
     */
    showApp: function(appName) {
        console.log(`Switching to app: ${appName}`);
        if (!this.dom.appContainers[appName]) {
            console.error(`App container not found for: ${appName}`);
            return;
        }
        this.currentApp = appName;

        // Update Navigation Buttons state
        this.dom.navButtons.forEach(button => {
            if (button.dataset.app === appName) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // Update App Containers visibility
        for (const key in this.dom.appContainers) {
            const container = this.dom.appContainers[key];
            if (container) {
                if (key === appName) {
                    container.classList.add('active');
                    // container.style.display = 'block'; // La classe .active gère ça via CSS
                } else {
                    container.classList.remove('active');
                    // container.style.display = 'none';
                }
            }
        }

        // Optional: Call a 'refresh' or 'render' function for the specific app
        // This is useful if the app needs to redraw charts or update UI after being hidden.
        switch(appName) {
            case 'wheel':
                // WheelApp might need to re-render chart if dimensions changed while hidden
                 if (typeof WheelApp !== 'undefined' && WheelApp.chartInstance) {
                     // Use a small timeout to ensure the container is fully visible before rendering
                     setTimeout(() => {
                        if (this.currentApp === 'wheel' && WheelApp.chartInstance) { // Double check we are still on wheel
                             WheelApp.renderChart(); // Re-render current chart (could be comparison)
                             console.log("WheelApp chart re-rendered on activation.");
                         }
                     }, 50);
                 }
                break;
            case 'goals':
                // GoalsApp might need to re-render if data could change in background (unlikely here)
                // if (typeof GoalsApp !== 'undefined') GoalsApp.renderPillar();
                break;
            case 'rituals':
                // RitualsApp might need to re-render stats charts
                 if (typeof RitualsApp !== 'undefined') {
                    // Use a small timeout
                    setTimeout(() => {
                         if (this.currentApp === 'rituals') { // Double check
                             RitualsApp.renderStatsView(); // Re-render stats including charts
                             console.log("RitualsApp stats re-rendered on activation.");
                         }
                     }, 50);
                 }
                break;
        }
    }
};

// Initialize the main application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    MainApp.init();
});