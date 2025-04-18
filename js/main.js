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

        // --- AI Tab: Génération des fichiers et prompts ---
        setTimeout(() => {
            const btnWheel = document.getElementById('ai-download-wheel');
            const btnWheelGoals = document.getElementById('ai-download-wheel-goals');
            if (btnWheel) {
                btnWheel.onclick = function () {
                    let data = {};
                    if (typeof WheelApp !== 'undefined' && WheelApp.pillars) {
                        data = { pillars: WheelApp.pillars, history: WheelApp.history || [] };
                    }
                    const prompt = `Je souhaite analyser mes données de la Roue de la Vie pour identifier mes domaines forts et faibles. Pour chaque domaine où mon "goal" est supérieur à mon "score", je veux des suggestions de 3 actions concrètes et des rituels quotidiens pour m'aider à progresser.\n\nDonnées :\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
                    const blob = new Blob([prompt], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'roue_de_la_vie_prompt.txt';
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
                };
            }
            const btnCopyWheel = document.getElementById('ai-copy-wheel');
            if (btnCopyWheel) {
                btnCopyWheel.onclick = function () {
                    let data = {};
                    if (typeof WheelApp !== 'undefined' && WheelApp.pillars) {
                        data = { pillars: WheelApp.pillars, history: WheelApp.history || [] };
                    }
                    const prompt = `Je souhaite analyser mes données de la Roue de la Vie pour identifier mes domaines forts et faibles. Pour chaque domaine où mon "goal" est supérieur à mon "score", je veux des suggestions de 3 actions concrètes et des rituels quotidiens pour m'aider à progresser.\n\nDonnées :\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
                    navigator.clipboard.writeText(prompt).then(() => {
                        btnCopyWheel.textContent = "Copié !";
                        setTimeout(() => { btnCopyWheel.textContent = "Copier dans le presse-papier"; }, 1500);
                    });
                };
            }
            if (btnWheelGoals) {
                btnWheelGoals.onclick = function () {
                    let data = {};
                    if (typeof WheelApp !== 'undefined' && typeof GoalsApp !== 'undefined') {
                        data = {
                            pillars: WheelApp.pillars,
                            history: WheelApp.history || [],
                            goals: GoalsApp.pillarsData
                        };
                    }
                    const prompt = `Voici mes données de la Roue de la Vie et mes Objectifs. Peux-tu m'aider à faire le point sur mes domaines forts/faibles et me suggérer 3 rituels quotidiens personnalisés pour améliorer ma situation ?\n\nDonnées :\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
                    const blob = new Blob([prompt], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'roue_de_la_vie_objectifs_rituels_prompt.txt';
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
                };
            }
            const btnCopyWheelGoals = document.getElementById('ai-copy-wheel-goals');
            if (btnCopyWheelGoals) {
                btnCopyWheelGoals.onclick = function () {
                    let data = {};
                    if (typeof WheelApp !== 'undefined' && typeof GoalsApp !== 'undefined') {
                        data = {
                            pillars: WheelApp.pillars,
                            history: WheelApp.history || [],
                            goals: GoalsApp.pillarsData
                        };
                    }
                    const prompt = `Voici mes données de la Roue de la Vie et mes Objectifs. Peux-tu m'aider à faire le point sur mes domaines forts/faibles et me suggérer 3 rituels quotidiens personnalisés pour améliorer ma situation ?\n\nDonnées :\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
                    navigator.clipboard.writeText(prompt).then(() => {
                        btnCopyWheelGoals.textContent = "Copié !";
                        setTimeout(() => { btnCopyWheelGoals.textContent = "Copier dans le presse-papier"; }, 1500);
                    });
                };
            }
        }, 0);
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
            dashboard: document.getElementById('dashboard'),
            wheel: document.getElementById('app-wheel'),
            goals: document.getElementById('app-goals'),
            rituals: document.getElementById('app-rituals'),
            ai: document.getElementById('app-ai'),
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
            // Suppression du bouton "Accéder à l'application complète" s'il existe déjà
            const oldBtn = this.dom.dashboard.querySelector('.dashboard-mainapp-btn');
            if (oldBtn) oldBtn.remove();

            // Dashboard navigation shortcuts (harmonisé avec la nav principale)
            const btnDashboard = document.getElementById('dashboard-to-dashboard');
            const btnWheel = document.getElementById('dashboard-to-wheel');
            const btnGoals = document.getElementById('dashboard-to-goals');
            const btnRituals = document.getElementById('dashboard-to-rituals');
            if (btnDashboard) btnDashboard.onclick = () => { this.showDashboard(); };
            if (btnWheel) btnWheel.onclick = () => { this.showMainApp(); this.showApp('wheel'); };
            if (btnGoals) btnGoals.onclick = () => { this.showMainApp(); this.showApp('goals'); };
            if (btnRituals) btnRituals.onclick = () => { this.showMainApp(); this.showApp('rituals'); };
        }

        // Main Navigation Buttons
        // Correction : re-sélectionner tous les boutons à chaque fois (menu unique en haut)
        document.querySelectorAll('.main-nav button[data-app]').forEach(button => {
            button.onclick = (event) => {
                const appName = event.currentTarget.dataset.app;
                if (appName === "dashboard") {
                    this.showDashboard();
                } else if (appName) {
                    this.showApp(appName);
                }
            };
        });
        // (Suppression du gestionnaire spécifique dashboard, car géré dans la boucle ci-dessus)
    },

    // --- View Management ---
showLandingPage: function() {
    if (this.dom.landingPage) this.dom.landingPage.classList.remove('hidden');
    if (this.dom.dashboard) this.dom.dashboard.classList.add('hidden');
    if (this.dom.mainAppContent) this.dom.mainAppContent.classList.add('hidden');
    // Hide the top navigation menu on the landing page
    if (this.dom.mainNav) this.dom.mainNav.classList.add('hidden');
    // Peut-être remettre le focus sur le bouton start si pertinent
    // if (this.dom.startAppButton) this.dom.startAppButton.focus();
},

    showDashboard: function() {
        if (this.dom.landingPage) this.dom.landingPage.classList.add('hidden');
        if (this.dom.dashboard) this.dom.dashboard.classList.remove('hidden');
        if (this.dom.mainAppContent) this.dom.mainAppContent.classList.remove('hidden');
        // Show the top navigation menu when leaving the landing page
        if (this.dom.mainNav) this.dom.mainNav.classList.remove('hidden');
        this.fillDashboard();
        // Active l'onglet dashboard pour la logique d'onglets
        this.showApp('dashboard');
    },

    showMainApp: function() {
        if (this.dom.landingPage) this.dom.landingPage.classList.add('hidden');
        if (this.dom.dashboard) this.dom.dashboard.classList.add('hidden');
        if (this.dom.mainAppContent) this.dom.mainAppContent.classList.remove('hidden');
        // Show the top navigation menu when leaving the landing page
        if (this.dom.mainNav) this.dom.mainNav.classList.remove('hidden');
        // Force le layout flex pour que flex-grow fonctionne
        if (this.dom.mainAppContent) this.dom.mainAppContent.style.display = 'flex';
        // Show the default or last viewed app
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
                        if (typeof sub.score === 'number' && sub.score < 5) {
                            alerts += `<div class="bg-red-100 text-red-700 rounded px-3 py-2 mb-2 dashboard-alert-link" 
                                data-pillar-id="${pillar.id}" data-subpillar-id="${sub.id}" style="cursor:pointer;">
                                <i class="fas fa-exclamation-triangle mr-2"></i>
                                Domaine faible : <b>${pillar.name} > ${sub.name}</b> (score ${sub.score})
                            </div>`;
                        }
                    });
                }
            });
        }
        this.dom.dashboardAlerts.innerHTML = alerts || '<div class="text-green-700">Aucun domaine critique détecté.</div>';

        // Ajout navigation sur clic
        setTimeout(() => {
            document.querySelectorAll('.dashboard-alert-link').forEach(div => {
                div.onclick = function () {
                    const pillarId = div.getAttribute('data-pillar-id');
                    const subPillarId = div.getAttribute('data-subpillar-id');
                    localStorage.setItem('goal_to_wheel', JSON.stringify({ pillarId, subPillarId }));
                    if (typeof MainApp !== 'undefined') {
                        MainApp.showMainApp();
                        MainApp.showApp('wheel');
                    }
                };
            });
        }, 0);
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


        // Couleurs actives selon la rubrique
        const colorMap = {
            dashboard: ['bg-indigo-600', 'hover:bg-indigo-700'],
            wheel: ['bg-blue-600', 'hover:bg-blue-700'],
            goals: ['bg-purple-600', 'hover:bg-purple-700'],
            rituals: ['bg-teal-600', 'hover:bg-teal-700'],
            ai: ['bg-pink-600', 'hover:bg-pink-700']
        };

        this.dom.navButtons.forEach(button => {
            const btnApp = button.dataset.app;
            // Retire toutes les couleurs actives potentielles
            button.classList.remove(
                'active',
                'bg-indigo-600', 'hover:bg-indigo-700',
                'bg-blue-600', 'hover:bg-blue-700',
                'bg-purple-600', 'hover:bg-purple-700',
                'bg-teal-600', 'hover:bg-teal-700',
                'bg-pink-600', 'hover:bg-pink-700',
                'text-white'
            );
            if (btnApp === appName) {
                button.classList.add('active', 'text-white');
                const colors = colorMap[appName] || ['bg-indigo-600', 'hover:bg-indigo-700'];
                button.classList.add(...colors);
                button.classList.remove('bg-gray-200', 'text-gray-800');
            } else {
                button.classList.remove('active', 'text-white');
                button.classList.add('bg-gray-200', 'text-gray-800');
            }
        });

        // Update App Containers visibility
        for (const key in this.dom.appContainers) {
            const container = this.dom.appContainers[key];
            if (container) {
                if (key === appName) {
                    container.classList.add('active');
                    container.classList.remove('hidden');
                    console.log(`Container ${key} activated.`);
                } else {
                    container.classList.remove('active');
                    container.classList.add('hidden');
                    console.log(`Container ${key} deactivated.`);
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
                        // Always show the "Aujourd'hui" tab by default when activating the Rituels app
                        RitualsApp.switchToView('today');
                        console.log("RitualsApp switched to view 'today' on activation.");
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

/* === Mode Sombre/Clair === */
function applyDarkModeSetting() {
    const dark = localStorage.getItem('harmonie_darkmode');
    if (dark === 'true') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    applyDarkModeSetting();
    const btn = document.getElementById('toggle-darkmode');
    if (btn) {
        btn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('harmonie_darkmode', isDark ? 'true' : 'false');
            btn.querySelector('i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        });
        // Set correct icon on load
        btn.querySelector('i').className = (localStorage.getItem('harmonie_darkmode') === 'true') ? 'fas fa-sun' : 'fas fa-moon';
    }
});

/* === Initialisation principale === */
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
