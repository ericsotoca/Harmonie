/* ========================================= */
/* == App 2: Objectifs ==================== */
/* ========================================= */

const GoalsApp = {
    // --- Data ---
    pillarsData: [
        // Utilisation des IDs descriptifs cohérents avec WheelApp vFinale
        { id: "sante", name: "Santé", icon: "fa-heartbeat", subPillars: [ { id: "sante-phy", name: "Physique", goals: ['', '', '']}, { id: "sante-men", name: "Mental", goals: ['', '', ''] }, { id: "sante-som", name: "Sommeil", goals: ['', '', ''] }, { id: "sante-nut", name: "Nutrition", goals: ['', '', ''] }, { id: "sante-ene", name: "Énergie", goals: ['', '', ''] } ] },
        { id: "famille", name: "Famille", icon: "fa-users", subPillars: [ { id: "fam-pro", name: "Proches", goals: ['', '', ''] }, { id: "fam-com", name: "Communication", goals: ['', '', ''] }, { id: "fam-tmp", name: "Temps passé", goals: ['', '', ''] }, { id: "fam-sou", name: "Soutien", goals: ['', '', ''] }, { id: "fam-har", name: "Harmonie", goals: ['', '', ''] } ] },
        { id: "finances", name: "Finances", icon: "fa-coins", subPillars: [ { id: "fin-rev", name: "Revenus", goals: ['', '', ''] }, { id: "fin-ep", name: "Épargne", goals: ['', '', ''] }, { id: "fin-dep", name: "Dépenses", goals: ['', '', ''] }, { id: "fin-inv", name: "Investissements", goals: ['', '', ''] }, { id: "fin-sec", name: "Sécurité", goals: ['', '', ''] } ] },
        { id: "carriere", name: "Carrière", icon: "fa-briefcase", subPillars: [ { id: "car-sat", name: "Satisfaction", goals: ['', '', ''] }, { id: "car-pro", name: "Progression", goals: ['', '', ''] }, { id: "car-equ", name: "Équilibre", goals: ['', '', ''] }, { id: "car-com", name: "Compétences", goals: ['', '', ''] }, { id: "car-rec", name: "Reconnaissance", goals: ['', '', ''] } ] },
        { id: "loisirs", name: "Loisirs", icon: "fa-gamepad", subPillars: [ { id: "loi-tmp", name: "Temps libre", goals: ['', '', ''] }, { id: "loi-pas", name: "Passions", goals: ['', '', ''] }, { id: "loi-det", name: "Détente", goals: ['', '', ''] }, { id: "loi-cre", name: "Créativité", goals: ['', '', ''] }, { id: "loi-soc", name: "Social", goals: ['', '', ''] } ] },
        { id: "devperso", name: "Développement perso", icon: "fa-brain", subPillars: [ { id: "dev-app", name: "Apprentissage", goals: ['', '', ''] }, { id: "dev-obj", name: "Objectifs", goals: ['', '', ''] }, { id: "dev-con", name: "Confiance", goals: ['', '', ''] }, { id: "dev-res", name: "Résilience", goals: ['', '', ''] }, { id: "dev-cla", name: "Clarté", goals: ['', '', ''] } ] },
        { id: "relations", name: "Relations sociales", icon: "fa-user-friends", subPillars: [ { id: "rel-ami", name: "Amis", goals: ['', '', ''] }, { id: "rel-res", name: "Réseau", goals: ['', '', ''] }, { id: "rel-eco", name: "Écoute", goals: ['', '', ''] }, { id: "rel-par", name: "Partage", goals: ['', '', ''] }, { id: "rel-qua", name: "Qualité", goals: ['', '', ''] } ] },
        { id: "cadrevie", name: "Cadre de vie", icon: "fa-home", subPillars: [ { id: "cad-log", name: "Logement", goals: ['', '', ''] }, { id: "cad-env", name: "Environnement", goals: ['', '', ''] }, { id: "cad-org", name: "Organisation", goals: ['', '', ''] }, { id: "cad-con", name: "Confort", goals: ['', '', ''] }, { id: "cad-est", name: "Esthétique", goals: ['', '', ''] } ] }
    ],
    currentPillarIndex: 0,
    editingTarget: null,
    dom: {},

    // --- Initialization ---
    init: function() {
        console.log("GoalsApp Initializing...");

        // 1. Inject HTML FIRST
        this.injectInitialHTML();

        // 2. Defer the rest of the initialization to allow DOM update
        setTimeout(() => {
            console.log("GoalsApp: Running deferred initialization...");
            // 2a. THEN Cache DOM Elements
            this.cacheDomElements();
            // Check if caching worked this time
            if (!this.dom.appContent || !this.dom.pillarTitle) {
                console.error("GoalsApp: Critical DOM elements still not found after deferred caching. Aborting init.");
                const container = document.getElementById('app-goals');
                if(container) container.innerHTML = '<p style="color:red; text-align:center; padding: 20px;">Erreur critique : Impossible d\'initialiser l\'application Objectifs. Le DOM n\'est pas prêt.</p>';
                return; // Stop initialization
            }

            // 2b. THEN Load Data
            this.loadGoals(); // Load saved goals from localStorage
            // 2c. THEN Add Event Listeners
            this.addEventListeners();

            // 2d. THEN Set Initial view state
            const welcomeDismissed = localStorage.getItem('goalsApp_welcomeDismissed') === 'true';
            if (!welcomeDismissed && this.dom.welcomeScreen) {
                this.showWelcomeScreen();
            } else {
                const isActiveOnInit = document.getElementById('app-goals')?.classList.contains('active');
                if (this.dom.welcomeScreen) this.dom.welcomeScreen.style.display = 'none';
                if (this.dom.appContent) this.dom.appContent.style.display = 'block';

                if (isActiveOnInit) {
                    this.renderPillar();
                }
            }
            // Set initial theme safely
            this.setTheme(this.pillarsData[this.currentPillarIndex]?.id || 'sante');
            console.log("GoalsApp Initialized (Deferred part complete).");

        }, 0); // Delay of 0ms pushes execution after current stack
    },

    /** Injects the static HTML structure for GoalsApp */
    injectInitialHTML: function() {
        const container = document.getElementById('app-goals');
        if (!container) {
            console.error("GoalsApp: Container #app-goals not found!");
            return;
        }
        if (container.innerHTML.trim() !== '') {
           // console.log("GoalsApp HTML already present.");
            return;
        }
        container.innerHTML = `
            <div class="goals-container">
                <!-- Écran d'accueil -->
                <div id="goals-welcome-screen" style="display: none;">
                    <h1><i class="fas fa-route"></i> Bienvenue sur Mon Parcours d'Objectifs !</h1>
                    <p>Définissez, suivez et atteignez vos objectifs personnels dans tous les domaines importants de votre vie. Transformez vos intentions en actions concrètes et façonnez la vie qui vous ressemble.</p>
                    <button id="goals-start-button">Commencer mon parcours <i class="fas fa-arrow-right"></i></button>
                </div>
                <!-- Contenu principal de l'application -->
                <div id="goals-app-content" style="display: none;">
                    <header id="goals-pillar-header">
                        <i id="goals-pillar-icon" class="fas fa-question-circle"></i>
                        <h2 id="goals-pillar-title">Titre du Pilier</h2>
                    </header>
                    <main id="goals-pillar-content"><p class="text-center text-gray-500 p-4">Chargement...</p></main>
                    <nav id="goals-navigation">
                        <button id="goals-prev-button"><i class="fas fa-arrow-left"></i> Précédent</button>
                        <button id="goals-next-button">Suivant <i class="fas fa-arrow-right"></i></button>
                    </nav>
                </div>
            </div>
            <!-- Popup pour modifier/supprimer -->
            <div id="goals-popup" style="display: none;" class="goals-modal">
                 <div class="goals-modal-content">
                    <h4>Modifier l'objectif</h4>
                    <textarea id="goals-popup-text" rows="5" cols="50" aria-label="Texte de l'objectif"></textarea>
                    <div class="goals-popup-buttons">
                        <button id="goals-popup-save" class="save"><i class="fas fa-save"></i> Enregistrer</button>
                        <button id="goals-popup-delete" class="danger"><i class="fas fa-trash-alt"></i> Supprimer</button>
                        <button id="goals-popup-close" class="secondary"><i class="fas fa-times"></i> Fermer</button>
                    </div>
                </div>
            </div>
        `;
        // console.log("GoalsApp HTML potentially injected.");
    },

    cacheDomElements: function() {
        this.dom = {
            appContainer: document.getElementById('app-goals'),
            welcomeScreen: document.getElementById('goals-welcome-screen'),
            startButton: document.getElementById('goals-start-button'),
            appContent: document.getElementById('goals-app-content'),
            pillarHeader: document.getElementById('goals-pillar-header'),
            pillarTitle: document.getElementById('goals-pillar-title'),
            pillarIcon: document.getElementById('goals-pillar-icon'),
            pillarContent: document.getElementById('goals-pillar-content'),
            prevButton: document.getElementById('goals-prev-button'),
            nextButton: document.getElementById('goals-next-button'),
            popup: document.getElementById('goals-popup'),
            popupText: document.getElementById('goals-popup-text'),
            popupSaveBtn: document.getElementById('goals-popup-save'),
            popupDeleteBtn: document.getElementById('goals-popup-delete'),
            popupCloseBtn: document.getElementById('goals-popup-close'),
        };
        console.log("GoalsApp DOM elements caching attempted.");
    },

    addEventListeners: function() {
        this.dom.startButton?.addEventListener('click', () => this.startApp());
        this.dom.prevButton?.addEventListener('click', () => this.navigate(-1));
        this.dom.nextButton?.addEventListener('click', () => this.navigate(1));
        this.dom.pillarContent?.addEventListener('click', (e) => {
            if (e.target && e.target.matches('.goals-objectif input')) {
                this.ouvrirPopup(e.target);
            }
        });
        this.dom.popupSaveBtn?.addEventListener('click', () => this.modifierObjectif());
        this.dom.popupDeleteBtn?.addEventListener('click', () => this.supprimerObjectif());
        this.dom.popupCloseBtn?.addEventListener('click', () => this.fermerPopup());
        document.addEventListener('keydown', (e) => {
             if (e.key === 'Escape' && this.dom.popup?.style.display === 'block') {
                 this.fermerPopup();
             }
        });
        this.dom.popup?.addEventListener('click', (e) => {
             if (e.target === this.dom.popup) {
                 this.fermerPopup();
             }
         });
        console.log("GoalsApp event listeners added.");
    },

    showWelcomeScreen: function() {
        if(this.dom.welcomeScreen) this.dom.welcomeScreen.style.display = 'block';
        if(this.dom.appContent) this.dom.appContent.style.display = 'none';
        this.setTheme(this.pillarsData[0]?.id || 'sante');
    },

    showAppContent: function() {
        if(this.dom.welcomeScreen) this.dom.welcomeScreen.style.display = 'none';
        if(this.dom.appContent) this.dom.appContent.style.display = 'block';
        setTimeout(() => {
            if (!this.dom.pillarContent) {
                 console.error("GoalsApp: pillarContent still not available before rendering in showAppContent.");
                 return;
            }
            this.renderPillar();
        }, 0);
    },

    startApp: function() {
        localStorage.setItem('goalsApp_welcomeDismissed', 'true');
        this.showAppContent();
    },

    loadGoals: function() {
        const savedGoalsData = localStorage.getItem('personalGoals_data');
        if (savedGoalsData) {
            try {
                const loadedPillars = JSON.parse(savedGoalsData);
                if (Array.isArray(loadedPillars) && loadedPillars.length === this.pillarsData.length) {
                     this.pillarsData = this.pillarsData.map((defaultPillar, pIndex) => {
                        const loadedPillar = loadedPillars.find(lp => lp.id === defaultPillar.id) || loadedPillars[pIndex];
                        if (loadedPillar && Array.isArray(loadedPillar.subPillars)) {
                            defaultPillar.subPillars = defaultPillar.subPillars.map((defaultSubPillar, spIndex) => {
                                const loadedSubPillar = loadedPillar.subPillars.find(lsp => lsp.id === defaultSubPillar.id) || loadedPillar.subPillars[spIndex];
                                if (loadedSubPillar && Array.isArray(loadedSubPillar.goals)) {
                                    const goals = loadedSubPillar.goals.slice(0, 3).map(g => String(g || ''));
                                    while (goals.length < 3) goals.push('');
                                    defaultSubPillar.goals = goals;
                                } else {
                                    defaultSubPillar.goals = ['', '', ''];
                                }
                                return defaultSubPillar;
                            });
                        } else {
                             defaultPillar.subPillars.forEach(sp => { sp.goals = ['', '', '']; });
                        }
                        defaultPillar.id = defaultPillar.id;
                        defaultPillar.name = defaultPillar.name;
                        defaultPillar.icon = defaultPillar.icon;
                        return defaultPillar;
                    });
                    console.log("GoalsApp: Goals loaded successfully.");
                } else {
                   console.warn("GoalsApp: Loaded data structure mismatch or length difference. Using defaults.");
                   this.initializeDefaultGoals();
                }
            } catch (e) {
                console.error("GoalsApp: Error parsing saved goals. Using defaults.", e);
                this.initializeDefaultGoals();
                localStorage.removeItem('personalGoals_data');
            }
        } else {
             console.log("GoalsApp: No saved goals found. Initializing defaults.");
             this.initializeDefaultGoals();
        }
    },

    initializeDefaultGoals: function() {
        this.pillarsData.forEach(pillar => {
             if (Array.isArray(pillar.subPillars)) {
                pillar.subPillars.forEach(subPillar => {
                    subPillar.goals = ['', '', ''];
                });
             } else {
                  pillar.subPillars = [];
             }
        });
    },

    saveGoals: function() {
        try {
            const dataToSave = this.pillarsData.map(p => ({
                id: p.id,
                subPillars: p.subPillars.map(sp => ({
                    id: sp.id,
                    goals: sp.goals
                }))
            }));
            localStorage.setItem('personalGoals_data', JSON.stringify(dataToSave));
        } catch (e) {
            console.error("GoalsApp: Failed to save goals.", e);
            if (typeof WheelApp !== 'undefined' && WheelApp.showNotification) {
                 const message = e.name === 'QuotaExceededError'
                    ? "Erreur: Espace de stockage local plein. Impossible de sauvegarder les objectifs."
                    : "Erreur : Impossible de sauvegarder les objectifs.";
                 WheelApp.showNotification(message, 5000);
            }
        }
    },

    renderPillar: function() {
        if (!this.dom.appContent || !this.dom.pillarTitle || !this.dom.pillarIcon || !this.dom.pillarContent || !this.pillarsData || this.pillarsData.length === 0) {
            console.error("GoalsApp: Cannot render pillar, critical DOM elements or data missing. Aborting render.", { /* ... */ });
            if(document.getElementById('goals-pillar-content')) {
                 document.getElementById('goals-pillar-content').innerHTML = `<p class="text-red-500 p-4 text-center">Erreur critique : Impossible d'afficher le contenu des objectifs.</p>`;
             }
            return;
        }

        const pillar = this.pillarsData[this.currentPillarIndex];
        if (!pillar || !pillar.id || !pillar.name) {
            console.error(`GoalsApp: Invalid pillar data at index: ${this.currentPillarIndex}`, pillar);
             if(this.dom.pillarContent) this.dom.pillarContent.innerHTML = `<p class="text-red-500 p-4 text-center">Erreur : Données de pilier invalides.</p>`;
             return;
        }

        this.dom.pillarTitle.textContent = pillar.name;
        this.dom.pillarIcon.className = `fas ${pillar.icon || 'fa-question-circle'}`;
        this.setTheme(pillar.id);

        let contentHTML = '';
        if (Array.isArray(pillar.subPillars) && pillar.subPillars.length > 0) {
            pillar.subPillars.forEach(subPillar => {
                 if (!subPillar || !subPillar.id || !subPillar.name) {
                      console.warn(`Skipping invalid subpillar in pillar ${pillar.name}:`, subPillar);
                      return;
                 }
                 const goals = Array.isArray(subPillar.goals) && subPillar.goals.length === 3 ? subPillar.goals : ['', '', ''];
                contentHTML += `
                    <div class="goals-sous-pilier" data-subpillar-id="${subPillar.id}">
                        <h3>${subPillar.name}</h3>
                        <div class="goals-objectif">
                            <span class="goals-objectif-label">Objectif 1:</span>
                            <input type="text" value="${this.escapeHTML(goals[0])}" placeholder="Cliquez pour définir..." data-pillar-id="${pillar.id}" data-subpillar-id="${subPillar.id}" data-goal-index="0" readonly>
                        </div>
                        <div class="goals-objectif">
                            <span class="goals-objectif-label">Objectif 2:</span>
                            <input type="text" value="${this.escapeHTML(goals[1])}" placeholder="Cliquez pour définir..." data-pillar-id="${pillar.id}" data-subpillar-id="${subPillar.id}" data-goal-index="1" readonly>
                        </div>
                        <div class="goals-objectif">
                            <span class="goals-objectif-label">Objectif 3:</span>
                            <input type="text" value="${this.escapeHTML(goals[2])}" placeholder="Cliquez pour définir..." data-pillar-id="${pillar.id}" data-subpillar-id="${subPillar.id}" data-goal-index="2" readonly>
                        </div>
                    </div>`;
            });
        } else {
            contentHTML = `<p class="text-gray-500 p-4 text-center">Aucun sous-pilier défini pour ce domaine.</p>`;
        }

        this.dom.pillarContent.innerHTML = contentHTML;
        this.updateNavButtons();
    },

    setTheme: function(pillarId) {
        if (this.dom.appContainer && pillarId) {
            this.dom.appContainer.dataset.theme = pillarId;
        } else if (this.dom.appContainer) {
             this.dom.appContainer.dataset.theme = 'sante';
        }
    },

    navigate: function(direction) {
        const newIndex = this.currentPillarIndex + direction;
        if (newIndex >= 0 && newIndex < this.pillarsData.length) {
            this.currentPillarIndex = newIndex;
            this.renderPillar();
            this.dom.appContent?.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },

    updateNavButtons: function() {
        if (!this.dom.prevButton || !this.dom.nextButton) return;
        this.dom.prevButton.disabled = (this.currentPillarIndex === 0);
        this.dom.nextButton.disabled = (this.currentPillarIndex >= this.pillarsData.length - 1);
    },

    ouvrirPopup: function(targetInput) {
        if (!this.dom.popup || !this.dom.popupText || !targetInput) {
            console.error("GoalsApp: Cannot open popup, missing elements.");
            return;
        }
        this.editingTarget = targetInput;
        this.dom.popupText.value = targetInput.value; // Value is already escaped HTML
        this.dom.popup.style.display = 'block';
        this.dom.popupText.focus();
        this.dom.popupText.select();
    },

    fermerPopup: function() {
        if (!this.dom.popup) return;
        this.dom.popup.style.display = 'none';
        if (this.editingTarget && document.body.contains(this.editingTarget)) {
           // Optional: this.editingTarget.focus();
        }
        this.editingTarget = null;
    },

    modifierObjectif: function() {
        if (!this.editingTarget || !this.dom.popupText) {
             console.error("GoalsApp: Cannot modify goal, missing target or textarea.");
             this.fermerPopup();
             return;
         }
        const pillarId = this.editingTarget.dataset.pillarId;
        const subPillarId = this.editingTarget.dataset.subpillarId;
        const goalIndex = parseInt(this.editingTarget.dataset.goalIndex, 10);
        const newGoalText = this.dom.popupText.value.trim();

        const pillar = this.pillarsData.find(p => p.id === pillarId);
        if (pillar) {
            const subPillar = pillar.subPillars.find(sp => sp.id === subPillarId);
            if (subPillar && Array.isArray(subPillar.goals) && !isNaN(goalIndex) && goalIndex >= 0 && goalIndex < subPillar.goals.length) {
                subPillar.goals[goalIndex] = newGoalText;
                this.editingTarget.value = this.escapeHTML(newGoalText); // Escape for display
                this.saveGoals();
                this.fermerPopup();
                console.log(`GoalsApp: Goal updated for ${pillar.name} > ${subPillar.name} [${goalIndex}]`);
            } else {
                 console.error(`GoalsApp: SubPillar or goal index invalid/mismatch for saving.`);
                 this.fermerPopup();
            }
        } else {
             console.error(`GoalsApp: Pillar not found for saving: ${pillarId}`);
             this.fermerPopup();
        }
    },

    supprimerObjectif: function() {
        if (!this.editingTarget) {
             console.error("GoalsApp: Cannot delete goal, missing target.");
             this.fermerPopup();
             return;
         }
        const pillarId = this.editingTarget.dataset.pillarId;
        const subPillarId = this.editingTarget.dataset.subpillarId;
        const goalIndex = parseInt(this.editingTarget.dataset.goalIndex, 10);
        const pillar = this.pillarsData.find(p => p.id === pillarId);
        if (pillar) {
            const subPillar = pillar.subPillars.find(sp => sp.id === subPillarId);
            if (subPillar && Array.isArray(subPillar.goals) && !isNaN(goalIndex) && goalIndex >= 0 && goalIndex < subPillar.goals.length) {
                subPillar.goals[goalIndex] = '';
                this.editingTarget.value = '';
                this.saveGoals();
                this.fermerPopup();
                console.log(`GoalsApp: Goal cleared for ${pillar.name} > ${subPillar.name} [${goalIndex}]`);
            } else {
                 console.warn(`GoalsApp: Cannot clear goal, invalid index or subpillar/goals array not found.`);
                 this.fermerPopup();
            }
        } else {
            console.error(`GoalsApp: Pillar not found for clearing goal: ${pillarId}`);
            this.fermerPopup();
        }
    },

     escapeHTML: function(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;')
                 .replace(/"/g, '&quot;')
                 .replace(/'/g, '&apos;');
    }

}; // Fin de l'objet GoalsApp
