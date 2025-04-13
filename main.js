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
        this.dom.dashboard = document.getElementById('dashboard');
        this.dom.dashboardWheelScore = document.getElementById('dashboard-wheel-score');
        this.dom.dashboardGoalsCount = document.getElementById('dashboard-goals-count');
        this.dom.dashboardRitualsProgress = document.getElementById('dashboard-rituals-progress');
        this.dom.dashboardAlerts = document.getElementById('dashboard-alerts');
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
                this.showDashboard();
            });
        }
        // Dashboard: add a button to enter the main app
        if (this.dom.dashboard) {
            let btn = document.createElement('button');
            btn.textContent = "Accéder à l'application complète";
            btn.className = "mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold text-lg shadow hover:bg-indigo-700 transition";
            btn.onclick = () => this.showMainApp();
            this.dom.dashboard.appendChild(btn);

            // Dashboard navigation shortcuts
            const btnWheel = document.getElementById('dashboard-to-wheel');
            const btnGoals = document.getElementById('dashboard-to-goals');
            const btnRituals = document.getElementById('dashboard-to-rituals');
            if (btnWheel) btnWheel.onclick = () => { this.showMainApp(); this.showApp('wheel'); };
            if (btnGoals) btnGoals.onclick = () => { this.showMainApp(); this.showApp('goals'); };
            if (btnRituals) btnRituals.onclick = () => { this.showMainApp(); this.showApp('rituals'); };
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
        // Dashboard nav button
        const navDashboard = document.getElementById('nav-dashboard');
        if (navDashboard) {
            navDashboard.addEventListener('click', () => {
                this.showDashboard();
            });
        }
    },

    // --- View Management ---

    showLandingPage: function() {
        if (this.dom.landingPage) this.dom.landingPage.classList.remove('hidden');
        if (this.dom.dashboard) this.dom.dashboard.classList.add('hidden');
        if (this.dom.mainAppContent) this.dom.mainAppContent.classList.add('hidden');
        // Peut-être remettre le focus sur le bouton start si pertinent
        // if (this.dom.startAppButton) this.dom.startAppButton.focus();
    },

    showDashboard: function() {
        if (this.dom.landingPage) this.dom.landingPage.classList.add('hidden');
        if (this.dom.dashboard) {
            this.dom.dashboard.classList.remove('hidden');
            this.fillDashboard();
        }
        if (this.dom.mainAppContent) this.dom.mainAppContent.classList.add('hidden');
    },

    showMainApp: function() {
        if (this.dom.landingPage) this.dom.landingPage.classList.add('hidden');
        if (this.dom.dashboard) this.dom.dashboard.classList.add('hidden');
        if (this.dom.mainAppContent) {
            this.dom.mainAppContent.classList.remove('hidden');
            // Force le layout flex pour que flex-grow fonctionne
            this.dom.mainAppContent.style.display = 'flex';
        }
        // Show the default or last viewed app
        // Ensure the first app ('wheel') is rendered *after* main content is visible
        this.showApp(this.currentApp);
    },

    fillDashboard: function() {
        // Score global Roue de la Vie
        if (typeof WheelApp !== 'undefined' && WheelApp.calculateAverages) {
            const { globalScore } = WheelApp.calculateAverages();
            if (this.dom.dashboardWheelScore) this.dom.dashboardWheelScore.textContent = globalScore ? globalScore.toFixed(1) : '-';
        }
        // Objectifs actifs
        if (typeof GoalsApp !== 'undefined' && GoalsApp.pillarsData) {
            let count = 0;
            GoalsApp.pillarsData.forEach(pillar => {
                pillar.subPillars.forEach(sub => {
                    count += sub.goals.filter(g => g && g.trim() !== '').length;
                });
            });
            if (this.dom.dashboardGoalsCount) this.dom.dashboardGoalsCount.textContent = count;
        }
        // Progression rituels du jour
        if (typeof RitualsApp !== 'undefined' && RitualsApp.rituals && RitualsApp.history) {
            const todayKey = RitualsApp.getDateKey ? RitualsApp.getDateKey() : (new Date()).toISOString().split('T')[0];
            const activeRituals = RitualsApp.rituals.filter(r => r.active);
            const total = activeRituals.length;
            const completed = RitualsApp.history[todayKey]?.completed?.length || 0;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
            if (this.dom.dashboardRitualsProgress) this.dom.dashboardRitualsProgress.textContent = `${percent}%`;
        }
        // Alertes sur domaines faibles (score <= 5)
        let alerts = '';
        if (typeof WheelApp !== 'undefined' && WheelApp.pillars) {
            WheelApp.pillars.forEach(pillar => {
                if (pillar.subPillars) {
                    pillar.subPillars.forEach(sub => {
                        if (typeof sub.score === 'number' && sub.score <= 5) {
                            alerts += `<div class="bg-red-100 text-red-700 rounded px-3 py-2 mb-2">
                                <i class="fas fa-exclamation-triangle mr-2"></i>
                                Domaine faible : <b>${pillar.name} > ${sub.name}</b> (score ${sub.score})
                            </div>`;
                        }
                    });
                }
            });
        }
        this.dom.dashboardAlerts.innerHTML = alerts || '<div class="text-green-700">Aucun domaine critique détecté.</div>';
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
    // Correction ultime : forcer le rendu de la vue active après toute l'init
    setTimeout(() => {
        if (MainApp && typeof MainApp.showApp === 'function' && MainApp.currentApp) {
            MainApp.showApp(MainApp.currentApp);
        }
    }, 0);
});
