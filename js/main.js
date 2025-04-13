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
        // Ensure the first app ('wheel') is rendered *after* main content is visible
        this.showApp(this.currentApp);
    },

    /**
     * Displays the specified application module and hides others.
     * Updates the active state of navigation buttons and app containers.
     * Calls the appropriate rendering function for the activated app.
     * @param {string} appName - The name of the app to show ('wheel', 'goals', 'rituals').
     */
    showApp: function(appName) {
        console.log(`Switching to app: ${appName}`);
        if (!this.dom.appContainers[appName]) {
            console.error(`App container not found for: ${appName}`);
            return;
        }

        // Check if already switching to the current app (avoid redundant work)
        // Allow re-rendering if needed, but maybe not full state change
        const switchingToCurrent = this.currentApp === appName;
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
                    if (!container.classList.contains('active')) {
                        container.classList.add('active');
                        console.log(`Container ${key} activated.`);
                    }
                    // Ensure display is correct (CSS should handle via .active, but double-check)
                    // container.style.display = ''; // Let CSS handle it via .active class rule
                } else {
                    if (container.classList.contains('active')) {
                        container.classList.remove('active');
                        console.log(`Container ${key} deactivated.`);
                    }
                    // container.style.display = 'none'; // Let CSS handle it
                }
            }
        }

        // --- Call specific rendering/refresh function for the activated app ---
        // Use setTimeout to ensure the DOM has updated (container is visible) before rendering
        setTimeout(() => {
            // Double-check we are still supposed to be on this app after the timeout
            if (this.currentApp !== appName) {
                console.log(`Render call for ${appName} aborted, app changed before timeout.`);
                return;
            }

            console.log(`Attempting to render content for ${appName}...`);
            switch(appName) {
                case 'wheel':
                    if (typeof WheelApp !== 'undefined') {
                        // WheelApp.renderPillar() renders the inputs, renderChart() the graph
                        // Check if the input view should be visible
                        if (WheelApp.dom.inputView && WheelApp.dom.inputView.style.display !== 'none') {
                            WheelApp.renderPillar(); // Ensure pillar inputs are rendered/updated
                            console.log("WheelApp pillar re-rendered on activation.");
                        } else if (WheelApp.dom.chartView && WheelApp.dom.chartView.style.display !== 'none' && WheelApp.chartInstance) {
                            WheelApp.renderChart(); // Re-render chart if chart view is active
                            console.log("WheelApp chart re-rendered on activation.");
                        } else {
                            // Default action if neither view is explicitly visible? Render pillar?
                            WheelApp.renderPillar();
                             console.log("WheelApp pillar rendered as default on activation.");
                        }
                    } else {
                         console.error("WheelApp not defined during render call.");
                    }
                    break;
                case 'goals':
                    if (typeof GoalsApp !== 'undefined') {
                         // Check if the main app content area is visible before rendering
                         if (GoalsApp.dom.appContent && GoalsApp.dom.appContent.style.display !== 'none') {
                            GoalsApp.renderPillar(); // Render the current pillar's content
                            console.log("GoalsApp pillar rendered on activation.");
                         } else {
                            // If welcome screen is still somehow visible, maybe show app content first?
                            // This case shouldn't happen often if welcome dismissal is handled correctly.
                            GoalsApp.showAppContent(); // This function includes renderPillar after a timeout
                            console.log("GoalsApp forcing app content view on activation.");
                         }
                    } else {
                         console.error("GoalsApp not defined during render call.");
                    }
                    break;
                case 'rituals':
                    if (typeof RitualsApp !== 'undefined') {
                        // RitualsApp uses switchToView which handles rendering the correct content
                        // Call it with the currently stored view for RitualsApp
                        RitualsApp.switchToView(RitualsApp.currentView);
                        console.log(`RitualsApp switched to view '${RitualsApp.currentView}' on activation.`);
                    } else {
                         console.error("RitualsApp not defined during render call.");
                    }
                    break;
                default:
                    console.warn(`No specific render action defined for app: ${appName}`);
            }
        }, 50); // 50ms delay - adjust if needed, 0 might even work sometimes

    } // End of showApp function

}; // End of MainApp object

// Initialize the main application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    MainApp.init();
});