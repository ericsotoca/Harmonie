/* ========================================= */
/* == App 2: Objectifs ==================== */
/* ========================================= */

const GoalsApp = {
    // --- Data ---
    // Structure similaire à WheelApp pour la cohérence des piliers/sous-piliers.
    // Les objectifs sont stockés dans le tableau 'goals'.
    pillarsData: [
        { id: "sante", name: "Santé", icon: "fa-heartbeat", subPillars: [ { id: "sante-phy", name: "Physique", goals: []}, { id: "sante-men", name: "Mental", goals: [] }, { id: "sante-som", name: "Sommeil", goals: [] }, { id: "sante-nut", name: "Nutrition", goals: [] }, { id: "sante-ene", name: "Énergie", goals: [] } ] },
        { id: "famille", name: "Famille", icon: "fa-users", subPillars: [ { id: "fam-pro", name: "Proches", goals: [] }, { id: "fam-com", name: "Communication", goals: [] }, { id: "fam-tmp", name: "Temps passé", goals: [] }, { id: "fam-sou", name: "Soutien", goals: [] }, { id: "fam-har", name: "Harmonie", goals: [] } ] },
        { id: "finances", name: "Finances", icon: "fa-coins", subPillars: [ { id: "fin-rev", name: "Revenus", goals: [] }, { id: "fin-ep", name: "Épargne", goals: [] }, { id: "fin-dep", name: "Dépenses", goals: [] }, { id: "fin-inv", name: "Investissements", goals: [] }, { id: "fin-sec", name: "Sécurité", goals: [] } ] },
        { id: "carriere", name: "Carrière", icon: "fa-briefcase", subPillars: [ { id: "car-sat", name: "Satisfaction", goals: [] }, { id: "car-pro", name: "Progression", goals: [] }, { id: "car-equ", name: "Équilibre", goals: [] }, { id: "car-com", name: "Compétences", goals: [] }, { id: "car-rec", name: "Reconnaissance", goals: [] } ] },
        { id: "loisirs", name: "Loisirs", icon: "fa-gamepad", subPillars: [ { id: "loi-tmp", name: "Temps libre", goals: [] }, { id: "loi-pas", name: "Passions", goals: [] }, { id: "loi-det", name: "Détente", goals: [] }, { id: "loi-cre", name: "Créativité", goals: [] }, { id: "loi-soc", name: "Social", goals: [] } ] },
        { id: "devperso", name: "Développement perso", icon: "fa-brain", subPillars: [ { id: "dev-app", name: "Apprentissage", goals: [] }, { id: "dev-obj", name: "Objectifs", goals: [] }, { id: "dev-con", name: "Confiance", goals: [] }, { id: "dev-res", name: "Résilience", goals: [] }, { id: "dev-cla", name: "Clarté", goals: [] } ] },
        { id: "relations", name: "Relations sociales", icon: "fa-user-friends", subPillars: [ { id: "rel-ami", name: "Amis", goals: [] }, { id: "rel-res", name: "Réseau", goals: [] }, { id: "rel-eco", name: "Écoute", goals: [] }, { id: "rel-par", name: "Partage", goals: [] }, { id: "rel-qua", name: "Qualité", goals: [] } ] },
        { id: "cadrevie", name: "Cadre de vie", icon: "fa-home", subPillars: [ { id: "cad-log", name: "Logement", goals: [] }, { id: "cad-env", name: "Environnement", goals: [] }, { id: "cad-org", name: "Organisation", goals: [] }, { id: "cad-con", name: "Confort", goals: [] }, { id: "cad-est", name: "Esthétique", goals: [] } ] }
    ],
    currentPillarIndex: 0,
    editingTarget: null, // DOM element being edited via popup
    dom: {}, // To store cached DOM elements

    // --- Initialization ---
    init: function() {
        console.log("GoalsApp Initializing...");
        this.injectInitialHTML(); // Inject static HTML parts
        this.cacheDomElements();
        this.loadGoals(); // Load saved goals from localStorage
        this.addEventListeners();
        // Initial view state: show welcome screen if not dismissed
        const welcomeDismissed = localStorage.getItem('goalsApp_welcomeDismissed') === 'true';
        if (!welcomeDismissed && this.dom.welcomeScreen) {
            this.showWelcomeScreen();
        } else {
            this.showAppContent();
        }
        this.setTheme(this.pillarsData[this.currentPillarIndex].id); // Set initial theme
        console.log("GoalsApp Initialized.");
    },

    /** Injects the static HTML structure for GoalsApp */
    injectInitialHTML: function() {
        const container = document.getElementById('app-goals');
        if (!container || container.innerHTML.trim() !== '') {
             // console.log("GoalsApp HTML already present or container not found.");
            return;
        }
        container.innerHTML = `
            <div class="goals-container">
                <!-- Écran d'accueil -->
                <div id="goals-welcome-screen" style="display: none;"> <!-- Controlled by JS -->
                    <h1><i class="fas fa-route"></i> Bienvenue sur Mon Parcours d'Objectifs !</h1>
                    <p>
                        Définissez, suivez et atteignez vos objectifs personnels dans tous les domaines importants de votre vie. Transformez vos intentions en actions concrètes et façonnez la vie qui vous ressemble.
                    </p>
                    <button id="goals-start-button">Commencer mon parcours <i class="fas fa-arrow-right"></i></button>
                </div>

                <!-- Contenu principal de l'application -->
                <div id="goals-app-content" style="display: none;"> <!-- Controlled by JS -->
                    <header id="goals-pillar-header">
                        <i id="goals-pillar-icon" class="fas fa-question-circle"></i> <!-- Icône par défaut -->
                        <h2 id="goals-pillar-title">Titre du Pilier</h2>
                    </header>

                    <main id="goals-pillar-content">
                        <!-- Le contenu du pilier actif sera injecté ici par JS -->
                    </main>

                    <nav id="goals-navigation">
                        <button id="goals-prev-button"><i class="fas fa-arrow-left"></i> Précédent</button>
                        <button id="goals-next-button">Suivant <i class="fas fa-arrow-right"></i></button>
                    </nav>
                </div>
            </div>

            <!-- Popup pour modifier/supprimer -->
            <div id="goals-popup" style="display: none;"> <!-- Controlled by JS -->
                <h4>Modifier l'objectif</h4>
                <textarea id="goals-popup-text" rows="5" cols="50" aria-label="Texte de l'objectif"></textarea>
                <div class="goals-popup-buttons">
                    <button id="goals-popup-save" class="save"><i class="fas fa-save"></i> Enregistrer</button>
                    <button id="goals-popup-delete" class="danger"><i class="fas fa-trash-alt"></i> Supprimer</button>
                    <button id="goals-popup-close" class="secondary"><i class="fas fa-times"></i> Fermer</button>
                </div>
            </div>
        `;
        console.log("GoalsApp HTML injected.");
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
    },

    addEventListeners: function() {
        // Welcome screen button
        this.dom.startButton?.addEventListener('click', () => this.startApp());

        // Navigation buttons
        this.dom.prevButton?.addEventListener('click', () => this.navigate(-1));
        this.dom.nextButton?.addEventListener('click', () => this.navigate(1));

        // Event delegation for handling clicks on goal inputs
        this.dom.pillarContent?.addEventListener('click', (e) => {
            // Target the input directly or a container if preferred
            if (e.target && e.target.matches('.goals-objectif input')) {
                this.ouvrirPopup(e.target);
            }
        });

        // Popup buttons
        this.dom.popupSaveBtn?.addEventListener('click', () => this.modifierObjectif());
        this.dom.popupDeleteBtn?.addEventListener('click', () => this.supprimerObjectif());
        this.dom.popupCloseBtn?.addEventListener('click', () => this.fermerPopup());

        // Close popup with Escape key
        this.dom.popup?.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.fermerPopup();
            }
        });
    },

    // --- View Management ---
    showWelcomeScreen: function() {
        if(this.dom.welcomeScreen) this.dom.welcomeScreen.style.display = 'block';
        if(this.dom.appContent) this.dom.appContent.style.display = 'none';
        this.setTheme(this.pillarsData[0].id); // Set default theme even on welcome
    },

    showAppContent: function() {
        if(this.dom.welcomeScreen) this.dom.welcomeScreen.style.display = 'none';
        if(this.dom.appContent) this.dom.appContent.style.display = 'block';
        this.renderPillar(); // Render the current pillar when showing app content
    },

    startApp: function() {
        localStorage.setItem('goalsApp_welcomeDismissed', 'true');
        this.showAppContent();
    },

    // --- Data Persistence ---
    loadGoals: function() {
        const savedGoalsData = localStorage.getItem('personalGoals_data');
        if (savedGoalsData) {
            try {
                const loadedPillars = JSON.parse(savedGoalsData);
                // Basic validation
                if (Array.isArray(loadedPillars) && loadedPillars.length === this.pillarsData.length) {
                     // Merge loaded goals into the default structure carefully
                     this.pillarsData = this.pillarsData.map((defaultPillar, pIndex) => {
                        const loadedPillar = loadedPillars.find(lp => lp.id === defaultPillar.id) || loadedPillars[pIndex]; // Match by ID or index as fallback
                        if (loadedPillar && Array.isArray(loadedPillar.subPillars)) {
                            defaultPillar.subPillars = defaultPillar.subPillars.map((defaultSubPillar, spIndex) => {
                                const loadedSubPillar = loadedPillar.subPillars.find(lsp => lsp.id === defaultSubPillar.id) || loadedPillar.subPillars[spIndex];
                                if (loadedSubPillar && Array.isArray(loadedSubPillar.goals)) {
                                    // Ensure goals array has the expected length (e.g., 3) and contains strings
                                    const goals = loadedSubPillar.goals.slice(0, 3).map(g => String(g || ''));
                                    while (goals.length < 3) goals.push(''); // Pad with empty strings if needed
                                    defaultSubPillar.goals = goals;
                                } else {
                                    defaultSubPillar.goals = ['', '', '']; // Default empty goals if missing/invalid
                                }
                                return defaultSubPillar;
                            });
                        } else {
                             // If loaded pillar has no subpillars, keep defaults with empty goals
                             defaultPillar.subPillars.forEach(sp => { sp.goals = ['', '', '']; });
                        }
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
                localStorage.removeItem('personalGoals_data'); // Clear corrupted data
            }
        } else {
             console.log("GoalsApp: No saved goals found. Initializing defaults.");
             this.initializeDefaultGoals();
        }
    },

    initializeDefaultGoals: function() {
        // Ensure every subPillar has exactly 3 empty goal strings
        this.pillarsData.forEach(pillar => {
            pillar.subPillars.forEach(subPillar => {
                subPillar.goals = ['', '', ''];
            });
        });
    },

    saveGoals: function() {
        try {
            // Only save the necessary parts (IDs and goals array) to potentially save space
            const dataToSave = this.pillarsData.map(p => ({
                id: p.id,
                subPillars: p.subPillars.map(sp => ({
                    id: sp.id,
                    goals: sp.goals // Assuming goals is always an array of 3 strings
                }))
            }));
            localStorage.setItem('personalGoals_data', JSON.stringify(dataToSave));
            // console.log("GoalsApp: Goals saved."); // Reduce noise
        } catch (e) {
            console.error("GoalsApp: Failed to save goals.", e);
            // TODO: Notify user if storage is full? (e.g., using WheelApp.showNotification if available)
            if (typeof WheelApp !== 'undefined' && WheelApp.showNotification) {
                 if (e.name === 'QuotaExceededError') {
                     WheelApp.showNotification("Erreur: Espace de stockage local plein. Impossible de sauvegarder les objectifs.", 5000);
                 } else {
                     WheelApp.showNotification("Erreur : Impossible de sauvegarder les objectifs.", 5000);
                 }
            }
        }
    },

    // --- UI Rendering & Navigation ---
    renderPillar: function() {
        const pillar = this.pillarsData[this.currentPillarIndex];
        if (!pillar || !this.dom.pillarTitle || !this.dom.pillarIcon || !this.dom.pillarContent || !this.dom.appContainer) {
            console.error("GoalsApp: Cannot render pillar, missing DOM elements or data.");
            return;
        }

        // Update header
        this.dom.pillarTitle.textContent = pillar.name;
        this.dom.pillarIcon.className = `fas ${pillar.icon || 'fa-question-circle'}`; // Use defined icon or default
        this.setTheme(pillar.id); // Update theme color

        // Build content HTML
        let contentHTML = '';
        pillar.subPillars.forEach(subPillar => {
            contentHTML += `
                <div class="goals-sous-pilier" data-subpillar-id="${subPillar.id}">
                    <h3>${subPillar.name}</h3>
                    <div class="goals-objectif">
                        <span class="goals-objectif-label">Objectif 1:</span>
                        <input type="text" value="${subPillar.goals[0] || ''}" placeholder="Cliquez pour définir..."
                               data-pillar-id="${pillar.id}" data-subpillar-id="${subPillar.id}" data-goal-index="0" readonly>
                    </div>
                    <div class="goals-objectif">
                        <span class="goals-objectif-label">Objectif 2:</span>
                        <input type="text" value="${subPillar.goals[1] || ''}" placeholder="Cliquez pour définir..."
                               data-pillar-id="${pillar.id}" data-subpillar-id="${subPillar.id}" data-goal-index="1" readonly>
                    </div>
                    <div class="goals-objectif">
                        <span class="goals-objectif-label">Objectif 3:</span>
                        <input type="text" value="${subPillar.goals[2] || ''}" placeholder="Cliquez pour définir..."
                               data-pillar-id="${pillar.id}" data-subpillar-id="${subPillar.id}" data-goal-index="2" readonly>
                    </div>
                </div>`;
        });

        this.dom.pillarContent.innerHTML = contentHTML;
        this.updateNavButtons();
    },

    setTheme: function(pillarId) {
        // Set data-theme attribute on the app container for CSS theming
        if (this.dom.appContainer) {
            this.dom.appContainer.dataset.theme = pillarId;
        }
    },

    navigate: function(direction) {
        const newIndex = this.currentPillarIndex + direction;
        // Check boundaries
        if (newIndex >= 0 && newIndex < this.pillarsData.length) {
            this.currentPillarIndex = newIndex;
            this.renderPillar();
        }
    },

    updateNavButtons: function() {
        if(this.dom.prevButton) this.dom.prevButton.disabled = (this.currentPillarIndex === 0);
        if(this.dom.nextButton) this.dom.nextButton.disabled = (this.currentPillarIndex === this.pillarsData.length - 1);
    },

    // --- Popup Logic ---
    ouvrirPopup: function(targetInput) {
        if (!this.dom.popup || !this.dom.popupText) return;
        this.editingTarget = targetInput; // Store the input element itself
        this.dom.popupText.value = targetInput.value; // Set textarea value
        this.dom.popup.style.display = 'block'; // Show popup
        this.dom.popup.classList.add('visible'); // For potential animations
        this.dom.popupText.focus(); // Focus the textarea
        this.dom.popupText.select(); // Select existing text
    },

    fermerPopup: function() {
        if (!this.dom.popup) return;
        this.dom.popup.style.display = 'none';
        this.dom.popup.classList.remove('visible');
        // Return focus to the input that was being edited
        if (this.editingTarget && document.body.contains(this.editingTarget)) {
           // this.editingTarget.focus(); // Optional: maybe annoying
        }
        this.editingTarget = null; // Clear editing target
    },

    /** Saves the modified goal text from the popup */
    modifierObjectif: function() {
        if (!this.editingTarget || !this.dom.popupText) {
             console.error("GoalsApp: Cannot modify goal, missing target or textarea.");
             this.fermerPopup(); // Close popup even on error
             return;
         }

        const pillarId = this.editingTarget.dataset.pillarId;
        const subPillarId = this.editingTarget.dataset.subpillarId;
        const goalIndex = parseInt(this.editingTarget.dataset.goalIndex, 10);
        const newGoalText = this.dom.popupText.value.trim(); // Get trimmed text

        // Find the corresponding pillar and subpillar in our data
        const pillar = this.pillarsData.find(p => p.id === pillarId);
        if (pillar) {
            const subPillar = pillar.subPillars.find(sp => sp.id === subPillarId);
            if (subPillar && !isNaN(goalIndex) && goalIndex >= 0 && goalIndex < 3) {
                // Update the data array
                subPillar.goals[goalIndex] = newGoalText;
                // Update the input field visually on the main page
                this.editingTarget.value = newGoalText;
                this.saveGoals(); // Persist changes
                this.fermerPopup(); // Close the popup
                console.log(`GoalsApp: Goal updated for ${pillar.name} > ${subPillar.name} [${goalIndex}]`);
            } else {
                 console.error(`GoalsApp: SubPillar or goal index invalid for saving. SubPillar: ${subPillar}, Index: ${goalIndex}`);
                 this.fermerPopup();
            }
        } else {
             console.error(`GoalsApp: Pillar not found for saving: ${pillarId}`);
             this.fermerPopup();
        }
    },

    /** Clears the goal text from the popup (sets to empty string) */
    supprimerObjectif: function() {
        if (!this.editingTarget) {
             console.error("GoalsApp: Cannot delete goal, missing target.");
             this.fermerPopup();
             return;
         }

         // Confirm deletion? Optional but recommended for destructive actions
         // if (!confirm("Êtes-vous sûr de vouloir supprimer cet objectif ?")) {
         //     return;
         // }

        const pillarId = this.editingTarget.dataset.pillarId;
        const subPillarId = this.editingTarget.dataset.subpillarId;
        const goalIndex = parseInt(this.editingTarget.dataset.goalIndex, 10);

        const pillar = this.pillarsData.find(p => p.id === pillarId);
        if (pillar) {
            const subPillar = pillar.subPillars.find(sp => sp.id === subPillarId);
            // Check if goal index is valid and exists
            if (subPillar && !isNaN(goalIndex) && goalIndex >= 0 && goalIndex < subPillar.goals.length) {
                subPillar.goals[goalIndex] = ''; // Set to empty string
                this.editingTarget.value = ''; // Clear the input field visually
                this.saveGoals();
                this.fermerPopup();
                console.log(`GoalsApp: Goal cleared for ${pillar.name} > ${subPillar.name} [${goalIndex}]`);
            } else {
                 console.warn(`GoalsApp: Cannot clear goal, invalid index or subpillar not found. Index: ${goalIndex}`);
                 this.fermerPopup(); // Close even if nothing changed
            }
        } else {
            console.error(`GoalsApp: Pillar not found for clearing goal: ${pillarId}`);
            this.fermerPopup();
        }
    }
};