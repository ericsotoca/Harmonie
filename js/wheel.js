/* ========================================= */
/* == App 1: Roue de la Vie =============== */
/* ========================================= */

const WheelApp = {
    // --- Constants & Icons ---
    deleteIconSVG: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>`,
    noteIconSVG: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>`,
    helpIconHTML: `<span class="wheel-help-icon" aria-hidden="true" tabindex="0">?</span>`,
    PREMIUM_PRESS_DURATION: 5000, // 5 seconds for premium activation (reduced)
    MAX_HISTORY_ENTRIES: 100, // Max history entries to keep
    MINI_TREND_COUNT: 7, // Number of entries for the mini trend graph

    // --- Default Data & Tooltips ---
    // Using a function to get a fresh copy each time, preventing accidental modification
    getDefaultPillarsData: function() {
        return [
             { id: "sante", name: "Santé", tooltip: "Bien-être physique et mental général.", subPillars: [
                 { id: "sante-phy", name: "Physique", score: 5, note: "", goal: 10, isAction: false, tooltip: "Activité physique, énergie, absence de douleur, forme." },
                 { id: "sante-men", name: "Mental", score: 5, note: "", goal: 10, isAction: false, tooltip: "Clarté d'esprit, gestion du stress, santé émotionnelle." },
                 { id: "sante-som", name: "Sommeil", score: 5, note: "", goal: 10, isAction: false, tooltip: "Qualité et quantité du sommeil récupérateur." },
                 { id: "sante-nut", name: "Nutrition", score: 5, note: "", goal: 10, isAction: false, tooltip: "Équilibre et qualité de l'alimentation." },
                 { id: "sante-ene", name: "Énergie", score: 5, note: "", goal: 10, isAction: false, tooltip: "Niveau de vitalité et d'endurance au quotidien." }
             ]},
             { id: "famille", name: "Famille", tooltip: "Relations avec les membres de la famille proche.", subPillars: [
                 { id: "fam-pro", name: "Proches", score: 5, note: "", goal: 10, isAction: false, tooltip: "Qualité des liens avec le conjoint, enfants, parents..." },
                 { id: "fam-com", name: "Communication", score: 5, note: "", goal: 10, isAction: false, tooltip: "Facilité et ouverture dans les échanges familiaux." },
                 { id: "fam-tmp", name: "Temps passé", score: 5, note: "", goal: 10, isAction: false, tooltip: "Quantité et qualité du temps partagé en famille." },
                 { id: "fam-sou", name: "Soutien", score: 5, note: "", goal: 10, isAction: false, tooltip: "Sentiment de soutien mutuel reçu et donné." },
                 { id: "fam-har", name: "Harmonie", score: 5, note: "", goal: 10, isAction: false, tooltip: "Climat général, résolution des conflits, entente." }
             ]},
             { id: "finances", name: "Finances", tooltip: "Gestion de l'argent et sécurité financière.", subPillars: [
                 { id: "fin-rev", name: "Revenus", score: 5, note: "", goal: 10, isAction: false, tooltip: "Suffisance et satisfaction vis-à-vis des rentrées d'argent." }, // ID changed fin-0 to fin-rev
                 { id: "fin-ep", name: "Épargne", score: 5, note: "", goal: 10, isAction: false, tooltip: "Capacité à mettre de l'argent de côté régulièrement." }, // ID changed fin-1 to fin-ep
                 { id: "fin-dep", name: "Dépenses", score: 5, note: "", goal: 10, isAction: false, tooltip: "Maîtrise du budget et des sorties d'argent." }, // ID changed fin-2 to fin-dep
                 { id: "fin-inv", name: "Investissements", score: 5, note: "", goal: 10, isAction: false, tooltip: "Stratégies pour faire fructifier l'argent (si applicable)." }, // ID changed fin-3 to fin-inv
                 { id: "fin-sec", name: "Sécurité", score: 5, note: "", goal: 10, isAction: false, tooltip: "Sentiment de sécurité financière face aux imprévus." } // ID changed fin-4 to fin-sec
             ]},
             { id: "carriere", name: "Carrière", tooltip: "Travail, profession, activité principale.", subPillars: [
                 { id: "car-sat", name: "Satisfaction", score: 5, note: "", goal: 10, isAction: false, tooltip: "Plaisir et épanouissement dans le travail actuel." }, // ID changed car-0 to car-sat
                 { id: "car-pro", name: "Progression", score: 5, note: "", goal: 10, isAction: false, tooltip: "Opportunités d'évolution et de développement professionnel." }, // ID changed car-1 to car-pro
                 { id: "car-equ", name: "Équilibre", score: 5, note: "", goal: 10, isAction: false, tooltip: "Harmonie entre vie professionnelle et vie personnelle." }, // ID changed car-2 to car-equ
                 { id: "car-com", name: "Compétences", score: 5, note: "", goal: 10, isAction: false, tooltip: "Utilisation et développement des compétences." }, // ID changed car-3 to car-com
                 { id: "car-rec", name: "Reconnaissance", score: 5, note: "", goal: 10, isAction: false, tooltip: "Sentiment d'être reconnu et valorisé pour son travail." } // ID changed car-4 to car-rec
             ]},
             { id: "loisirs", name: "Loisirs", tooltip: "Activités de détente, passions et temps libre.", subPillars: [
                 { id: "loi-tmp", name: "Temps libre", score: 5, note: "", goal: 10, isAction: false, tooltip: "Disponibilité de temps pour soi et ses activités." }, // ID changed loi-0 to loi-tmp
                 { id: "loi-pas", name: "Passions", score: 5, note: "", goal: 10, isAction: false, tooltip: "Pratique d'activités qui passionnent et ressourcent." }, // ID changed loi-1 to loi-pas
                 { id: "loi-det", name: "Détente", score: 5, note: "", goal: 10, isAction: false, tooltip: "Capacité à se relaxer et déconnecter." }, // ID changed loi-2 to loi-det
                 { id: "loi-cre", name: "Créativité", score: 5, note: "", goal: 10, isAction: false, tooltip: "Expression de sa créativité (arts, projets...)." }, // ID changed loi-3 to loi-cre
                 { id: "loi-soc", name: "Social", score: 5, note: "", goal: 10, isAction: false, tooltip: "Activités sociales et divertissements hors relations proches." } // ID changed loi-4 to loi-soc
             ]},
             { id: "devperso", name: "Développement perso", tooltip: "Croissance personnelle, apprentissage et objectifs.", subPillars: [
                 { id: "dev-app", name: "Apprentissage", score: 5, note: "", goal: 10, isAction: false, tooltip: "Acquisition de nouvelles connaissances ou compétences." }, // ID changed dev-0 to dev-app
                 { id: "dev-obj", name: "Objectifs", score: 5, note: "", goal: 10, isAction: false, tooltip: "Clarté et poursuite des objectifs personnels." }, // ID changed dev-1 to dev-obj
                 { id: "dev-con", name: "Confiance", score: 5, note: "", goal: 10, isAction: false, tooltip: "Niveau de confiance en soi et en ses capacités." }, // ID changed dev-2 to dev-con
                 { id: "dev-res", name: "Résilience", score: 5, note: "", goal: 10, isAction: false, tooltip: "Capacité à faire face aux difficultés et à rebondir." }, // ID changed dev-3 to dev-res
                 { id: "dev-cla", name: "Clarté", score: 5, note: "", goal: 10, isAction: false, tooltip: "Connaissance de soi, de ses valeurs et de sa direction." } // ID changed dev-4 to dev-cla
             ]},
             { id: "relations", name: "Relations sociales", tooltip: "Liens avec les amis, collègues, communauté.", subPillars: [
                 { id: "rel-ami", name: "Amis", score: 5, note: "", goal: 10, isAction: false, tooltip: "Qualité et profondeur des amitiés." }, // ID changed rel-0 to rel-ami
                 { id: "rel-res", name: "Réseau", score: 5, note: "", goal: 10, isAction: false, tooltip: "Étendue et qualité du réseau social et professionnel." }, // ID changed rel-1 to rel-res
                 { id: "rel-eco", name: "Écoute", score: 5, note: "", goal: 10, isAction: false, tooltip: "Capacité à écouter activement les autres." }, // ID changed rel-2 to rel-eco
                 { id: "rel-par", name: "Partage", score: 5, note: "", goal: 10, isAction: false, tooltip: "Facilité à partager et échanger avec les autres." }, // ID changed rel-3 to rel-par
                 { id: "rel-qua", name: "Qualité", score: 5, note: "", goal: 10, isAction: false, tooltip: "Satisfaction générale de la qualité des interactions sociales." } // ID changed rel-4 to rel-qua
             ]},
             { id: "cadrevie", name: "Cadre de vie", tooltip: "Environnement matériel et organisationnel.", subPillars: [
                 { id: "cad-log", name: "Logement", score: 5, note: "", goal: 10, isAction: false, tooltip: "Satisfaction vis-à-vis du lieu de vie." }, // ID changed cad-0 to cad-log
                 { id: "cad-env", name: "Environnement", score: 5, note: "", goal: 10, isAction: false, tooltip: "Appréciation de l'environnement proche (quartier, nature...)." }, // ID changed cad-1 to cad-env
                 { id: "cad-org", name: "Organisation", score: 5, note: "", goal: 10, isAction: false, tooltip: "Niveau d'ordre et d'organisation de ses espaces." }, // ID changed cad-2 to cad-org
                 { id: "cad-con", name: "Confort", score: 5, note: "", goal: 10, isAction: false, tooltip: "Sentiment de confort et de bien-être matériel." }, // ID changed cad-3 to cad-con
                 { id: "cad-est", name: "Esthétique", score: 5, note: "", goal: 10, isAction: false, tooltip: "Appréciation de la beauté et de l'harmonie de son cadre." } // ID changed cad-4 to cad-est
             ]}
        ];
    },

    // --- Global State Variables ---
    pillars: [], // Holds the current state of pillars and subpillars data
    history: [], // Holds past evaluations
    currentPillarIndex: 0,
    chartInstance: null, // To hold the Chart.js instance
    isPremium: false,
    longPressTimer: null,
    currentTheme: 'light', // 'light' or 'dark'
    // References to debounced functions, initialized in init()
    debouncedSaveData: null,
    debouncedUpdateScoresDisplay: null,
    currentOpenModalId: null, // Track the currently open modal

    // --- Pillar Colors (defined statically, used dynamically based on theme) ---
    pillarColorsLight: [
        '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71',
        '#3498db', '#1abc9c', '#9b59b6', '#34495e'
    ],
    pillarColorsDark: [
        '#c0392b', '#d35400', '#f39c12', '#27ae60',
        '#2980b9', '#16a085', '#8e44ad', '#7f8c8d'
    ],

    // --- DOM References (cached in init) ---
    dom: {},

    // --- Utility Functions ---
    getCssVar: function(varName) {
        // Ensure the app container exists before trying to get style
        if (!this.dom.appContainer) return '';
        // Get computed style from the app container itself to respect themes
        try {
            return getComputedStyle(this.dom.appContainer).getPropertyValue(varName).trim();
        } catch (e) {
            console.warn(`WheelApp: Could not get CSS variable ${varName}`, e);
            return ''; // Return empty string on error
        }
    },

    generateId: function(prefix = 'item') {
        // Simple ID generator
        return `${prefix.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
    },

    /**
     * Displays a temporary notification message at the bottom of the screen.
     * Replaces the previous implementation to be self-contained within WheelApp.
     * @param {string} message - The message to display.
     * @param {number} [duration=3000] - How long to display the message in ms.
     */
    showNotification: function(message, duration = 3000) {
        if (!this.dom.notification) {
            console.log(`[WheelApp Notification]: ${message}`); // Fallback log
            return;
        }
        const notification = this.dom.notification;
        notification.textContent = message;
        notification.classList.add('visible'); // Use class to control visibility and animation

        // Clear existing timer if any
        if (notification.timer) clearTimeout(notification.timer);

        // Set new timer to hide the notification
        notification.timer = setTimeout(() => {
            notification.classList.remove('visible');
            // Optional: set display none after transition ends for performance
            // setTimeout(() => { notification.style.display = 'none'; }, 300);
        }, duration);
    },

    /**
     * Creates a debounced version of a function.
     * Delays invoking func until after wait milliseconds have elapsed
     * since the last time the debounced function was invoked.
     * @param {Function} func - The function to debounce.
     * @param {number} wait - The number of milliseconds to delay.
     * @returns {Function} The new debounced function.
     */
    debounce: function(func, wait) {
        let timeout;
        return (...args) => {
            const context = this; // Ensure 'this' context is preserved
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    },

    // --- Core Application Logic ---
    init: function() {
        console.log("WheelApp Initializing...");
        // Ensure the HTML content for WheelApp is present before caching DOM elements
        this.injectInitialHTML(); // Inject static HTML parts first
        this.cacheDomElements();

        // Initialize debounced functions
        this.debouncedSaveData = this.debounce(this.saveData, 500);
        this.debouncedUpdateScoresDisplay = this.debounce(this.updateScoresDisplay, 150);

        try {
            this.loadData(); // Load pillars, history, premium status
            this.setupTheme(); // Setup light/dark theme based on preference/storage
            this.updatePremiumUI(); // Show/hide premium features based on status

            const welcomeDismissed = localStorage.getItem('wheelOfLife_welcomeDismissed') === 'true';

            if (!welcomeDismissed && this.dom.welcomeView) {
                this.showWelcomeView();
            } else {
                this.showInputView(); // Default view after welcome
                if (this.pillars && this.pillars.length > 0) {
                    this.renderPillar(); // Render the first pillar
                } else {
                    this.handleNoPillars(); // Show message if no data
                }
            }
            this.addEventListeners(); // Add all necessary event listeners
        } catch (error) {
            console.error("Critical error during WheelApp initialization:", error);
            this.showNotification("Erreur critique au chargement de la Roue. Certaines fonctionnalités peuvent être indisponibles.", 6000);
            // Hide all views in case of critical error
            if(this.dom.welcomeView) this.dom.welcomeView.style.display = 'none';
            if(this.dom.inputView) this.dom.inputView.style.display = 'none';
            if(this.dom.chartView) this.dom.chartView.style.display = 'none';
        } finally {
            if (this.dom.loadingMessage) this.dom.loadingMessage.style.display = 'none';
        }
        console.log("WheelApp Initialized.");
    },

    /**
     * Injects the static HTML structure for WheelApp into its container.
     * This replaces needing the HTML directly in index.html.
     */
    injectInitialHTML: function() {
        const container = document.getElementById('app-wheel');
        if (!container) {
            console.error("WheelApp: Container #app-wheel not found!");
            return;
        }
        // Always inject the HTML, even if the container is not empty
        container.innerHTML = `
            <!-- Welcome View -->
            <div id="wheel-welcomeView" class="wheel-main-view" style="display: none;">
                <img src="assets/logo-placeholder.png" alt="La Roue de la Vie Interactive" class="wheel-logo" id="wheel-appLogo"> <!-- Placeholder logo -->
                <h2>Bienvenue sur la Roue de la Vie Interactive !</h2>
                <p style="text-align: center; font-size: 1.1em; color: var(--wheel-secondary-text-color); margin-bottom: 25px;">
                    Prenez de la hauteur et redécouvrez votre équilibre global.
                </p>
                <p>Cet outil vous aide à obtenir une image claire et honnête de l'équilibre actuel entre les différents domaines essentiels de votre existence.</p>
                <h4>Le Piège de la Focalisation Excessive</h4>
                <p>Il est facile de focaliser son attention sur un problème spécifique (travail, relation, finance...), perdant ainsi de vue la situation globale et amplifiant le sentiment de déséquilibre.</p>
                <h4>La Solution : Défocaliser avec la Roue</h4>
                <p>En vous invitant à évaluer <em>tous</em> les piliers importants, cet outil vous aide à :</p>
                <ul>
                    <li>Prendre du recul et voir la "carte complète".</li>
                    <li>Identifier vos forces et les domaines satisfaisants.</li>
                    <li>Relativiser les difficultés dans un contexte global.</li>
                </ul>
                <h4>Les Bienfaits</h4>
                <p>Gagnez en clarté, ciblez mieux vos efforts, réduisez le sentiment d'être submergé(e), célébrez vos réussites et agissez de manière plus alignée.</p>
                <p style="margin-top: 25px; font-style: italic; color: var(--wheel-secondary-text-color);">Vos données sont confidentielles et stockées uniquement dans votre navigateur.</p>
                <div class="wheel-text-center wheel-mt-2">
                    <button id="wheel-startEvaluationBtn" class="wheel-button-like" style="padding: 15px 30px; font-size: 1.1em;">Commencer mon évaluation</button>
                </div>
            </div>

            <!-- Input View (Main evaluation area) -->
            <div id="wheel-inputView" class="wheel-main-view" style="display: none;">
                <!-- Theme Switch supprimé -->

                <div id="wheel-pillarNavigation" class="wheel-pillar-nav" role="navigation" aria-label="Navigation entre les piliers">
                    <!-- Pillar nav buttons added by JS -->
                </div>
                <div id="wheel-globalScore" aria-live="polite">Note globale : - / 20</div>
                <div id="wheel-pillarDisplay">
                    <!-- Pillar content will be rendered here by JS -->
                </div>
                <div id="wheel-pillarAverageScore" aria-live="polite">Moyenne Pilier : - / 10</div>
                <div class="wheel-nav-buttons">
                    <button id="wheel-prevBtn" aria-label="Aller au pilier précédent (Flèche Gauche)">Précédent</button>
                    <button id="wheel-nextBtn" aria-label="Aller au pilier suivant (Flèche Droite)">Suivant</button>
                </div>
                <button id="wheel-showChartBtn" class="wheel-w-100 wheel-mt-2" aria-label="Afficher le graphique et sauvegarder l'évaluation">Afficher la Roue & Sauvegarder</button>
                <div class="wheel-mt-2 wheel-text-center" style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
                    <button id="wheel-personalizeBtn" style="display: none;" aria-label="Ouvrir les options de personnalisation">Personnaliser</button>
                    <button id="wheel-helpBtn" aria-label="Ouvrir l'aide">Aide</button>
                </div>
            </div>

            <!-- Chart View -->
            <div id="wheel-chartView" class="wheel-main-view" style="display: none;">
                <h2>Votre Roue de la Vie</h2>
                <canvas id="wheel-radarChart" aria-label="Graphique radar des scores de la roue de la vie"></canvas>
                <div class="wheel-mt-2 wheel-mb-2" style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
                    <button id="wheel-historyBtn" aria-label="Ouvrir l'historique des évaluations">Historique</button>
                    <button id="wheel-returnToInputBtn" aria-label="Revenir à la saisie des notes">Retour au Menu</button>
                </div>
            </div>

            <!-- Loading Message & Notifications -->
            <div id="wheel-loadingMessage" class="wheel-loading-message" style="display: block;">Chargement...</div>
            <div id="wheel-notification" class="wheel-notification"></div>

            <!-- Overlay & Modals Container -->
            <div id="wheel-overlay"> <!-- Initially hidden via CSS -->

                <!-- History Popup -->
                <div id="wheel-historyPopup" class="wheel-popup" role="dialog" aria-labelledby="wheel-historyTitle" aria-modal="true">
                    <button class="wheel-popup-close-btn" data-modal-id="wheel-historyPopup" aria-label="Fermer la fenêtre d'historique">×</button>
                    <h3 id="wheel-historyTitle">Historique des évaluations</h3>
                    <div class="wheel-history-scroll-container wheel-text-center">
                        <button id="wheel-historyScrollToBottomBtn" class="wheel-icon-button" aria-label="Aller aux boutons en bas" title="Aller aux boutons en bas" style="display: none;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z" /></svg>
                        </button>
                    </div>
                    <div id="wheel-miniTrendGraphContainer">
                        <!-- Mini trend graph will be rendered here -->
                    </div>
                    <div id="wheel-historyContent"></div>
                    <div id="wheel-compareControls">
                        <button id="wheel-compareBtn" disabled aria-label="Comparer les 2 évaluations sélectionnées">Comparer (2)</button>
                    </div>
                    <div class="wheel-popup-buttons">
                        <input type="file" id="wheel-importFile" accept=".json" style="display: none;">
                        <button id="wheel-importBtn" class="wheel-button-like" style="display: none;">Importer (JSON)</button>
                        <button id="wheel-exportBtn" class="wheel-button-like" style="display: none;">Exporter Tout (JSON)</button>
                        <button id="wheel-actionKeysBtn" class="wheel-button-like" aria-label="Voir les actions clés définies">Voir Actions Clés</button>
                        <button id="wheel-copyHistoryBtn" class="wheel-button-like" aria-label="Copier l'historique et prompt pour analyse IA">Copier pour IA</button>
                        <button id="wheel-resetAppBtn" class="wheel-danger-button" aria-label="Réinitialiser toutes les données de l'application">Tout Réinitialiser</button>
                        <button class="wheel-button-like secondary" data-modal-id="wheel-historyPopup" aria-label="Fermer la fenêtre d'historique">Fermer</button> <!-- Added secondary style possibility -->
                    </div>
                </div>

                <!-- Customization Popup -->
                <div id="wheel-customizationPopup" class="wheel-popup" role="dialog" aria-labelledby="wheel-customizationTitle" aria-modal="true">
                    <button class="wheel-popup-close-btn" data-modal-id="wheel-customizationPopup" aria-label="Fermer la fenêtre de personnalisation">×</button>
                    <h3 id="wheel-customizationTitle">Personnaliser les Piliers</h3>
                    <div id="wheel-customizationContent"></div>
                    <div class="wheel-popup-buttons">
                        <button id="wheel-saveCustomizationBtn" aria-label="Sauvegarder les changements de personnalisation">Sauvegarder & Fermer</button>
                        <button class="wheel-button-like secondary" data-modal-id="wheel-customizationPopup" aria-label="Annuler et fermer la fenêtre de personnalisation">Annuler</button>
                    </div>
                </div>

                <!-- Help Popup -->
                <div id="wheel-helpPopup" class="wheel-popup" role="dialog" aria-labelledby="wheel-helpTitle" aria-modal="true">
                    <button class="wheel-popup-close-btn" data-modal-id="wheel-helpPopup" aria-label="Fermer la fenêtre d'aide">×</button>
                    <h3 id="wheel-helpTitle">Aide - La Roue de la Vie</h3>
                    <p>La Roue de la Vie est un outil d'auto-évaluation pour visualiser l'équilibre dans différents domaines de votre vie.</p>
                    <ul>
                        <li>Naviguez entre les "Piliers" avec "Précédent" / "Suivant", la barre de navigation rapide, ou les flèches ← → du clavier (hors champs texte).</li>
                        <li>Notez chaque "Sous-Pilier" de 1 (bas) à 10 (haut) avec le curseur (ou clavier).</li>
                        <li>Cliquez sur ${this.helpIconHTML} pour des indices sur le domaine.</li>
                        <li>Cliquez sur ${this.noteIconSVG} pour ajouter une note détaillée. Marquez une note comme "Action Clé" pour la retrouver facilement via l'historique.</li>
                        <li>Définissez un objectif optionnel (1-10) pour chaque sous-pilier. Utilisez les boutons "Objectif 10 pour tous" ou "Notes à 5" pour gagner du temps.</li>
                        <li>Cliquez sur "Afficher la Roue & Sauvegarder" pour voir le graphique et enregistrer l'évaluation (remplace l'entrée du jour si < 24h).</li>
                        <li>Dans "Historique", cochez deux entrées et "Comparer". Voyez la tendance globale et accédez à vos "Actions Clés".</li>
                        <li id="wheel-helpPersonalizeSection" style="display: none;">"Personnaliser" (premium) permet de renommer les sous-piliers.</li>
                        <li id="wheel-helpImportSection" style="display: none;">"Importer" (premium, depuis l'historique) permet de charger des données JSON.</li>
                        <li>Activez le mode Premium via un appui long (5s) sur le logo sur l'écran d'accueil.</li>
                        <li>Utilisez l'interrupteur (☀️/🌙) pour changer de thème.</li>
                        <li>Exportez vos données via "Copier pour IA" ou "Exporter Tout (JSON)".</li>
                        <li>L'application fonctionne hors ligne (sauvegarde locale).</li>
                    </ul>
                    <div class="wheel-popup-buttons">
                        <button class="wheel-button-like secondary" data-modal-id="wheel-helpPopup" aria-label="Fermer la fenêtre d'aide">Fermer</button>
                    </div>
                </div>

                <!-- Note Popup -->
                <div id="wheel-notePopup" class="wheel-popup" role="dialog" aria-labelledby="wheel-notePopupTitle" aria-modal="true">
                    <button class="wheel-popup-close-btn" data-modal-id="wheel-notePopup" aria-label="Fermer la fenêtre de note">×</button>
                    <h4 id="wheel-notePopupTitle">Ajouter/Modifier une Note pour <span id="wheel-notePopupSubPillarName"></span></h4>
                    <textarea id="wheel-notePopupTextarea" placeholder="Écrivez vos réflexions, détails, contexte, prochaines étapes ici..." aria-label="Champ pour ajouter ou modifier une note"></textarea>
                    <div class="wheel-action-key-checkbox">
                        <input type="checkbox" id="wheel-notePopupActionKey" aria-label="Marquer cette note comme une action clé">
                        <label for="wheel-notePopupActionKey">Marquer comme Action Clé</label>
                    </div>
                    <div class="wheel-popup-buttons">
                        <button id="wheel-saveNoteBtn" aria-label="Sauvegarder la note">Sauvegarder</button>
                        <button class="wheel-button-like secondary" data-modal-id="wheel-notePopup" aria-label="Annuler et fermer la fenêtre de note">Annuler</button>
                    </div>
                </div>

                <!-- Action Keys Popup -->
                <div id="wheel-actionKeysPopup" class="wheel-popup" role="dialog" aria-labelledby="wheel-actionKeysTitle" aria-modal="true">
                    <button class="wheel-popup-close-btn" data-modal-id="wheel-actionKeysPopup" aria-label="Fermer la fenêtre des actions clés">×</button>
                    <h3 id="wheel-actionKeysTitle">Vos Actions Clés</h3>
                    <div id="wheel-actionKeysContent">
                        <!-- Action keys will be rendered here -->
                    </div>
                    <p style="font-size: 0.85em; color: var(--wheel-secondary-text-color); margin-top:15px;">Ce sont les notes que vous avez marquées comme "Action Clé".</p>
                    <div class="wheel-popup-buttons">
                        <button class="wheel-button-like secondary" data-modal-id="wheel-actionKeysPopup" aria-label="Fermer la fenêtre des actions clés">Fermer</button>
                    </div>
                </div>

            </div> <!-- End Overlay -->
        `;
        console.log("WheelApp HTML injected.");
    },

    cacheDomElements: function() {
        this.dom = {
            appContainer: document.getElementById('app-wheel'),
            welcomeView: document.getElementById('wheel-welcomeView'),
            startEvaluationBtn: document.getElementById('wheel-startEvaluationBtn'),
            inputView: document.getElementById('wheel-inputView'),
            chartView: document.getElementById('wheel-chartView'),
            pillarDisplay: document.getElementById('wheel-pillarDisplay'),
            pillarNavigation: document.getElementById('wheel-pillarNavigation'),
            globalScoreDisplay: document.getElementById('wheel-globalScore'),
            pillarAverageScoreDisplay: document.getElementById('wheel-pillarAverageScore'),
            prevBtn: document.getElementById('wheel-prevBtn'),
            nextBtn: document.getElementById('wheel-nextBtn'),
            showChartBtn: document.getElementById('wheel-showChartBtn'),
            radarChartCanvas: document.getElementById('wheel-radarChart'),
            historyContent: document.getElementById('wheel-historyContent'),
            overlay: document.getElementById('wheel-overlay'),
            themeCheckbox: document.getElementById('wheel-theme-checkbox'),
            customizationContent: document.getElementById('wheel-customizationContent'),
            notePopup: document.getElementById('wheel-notePopup'),
            notePopupSubPillarName: document.getElementById('wheel-notePopupSubPillarName'),
            notePopupTextarea: document.getElementById('wheel-notePopupTextarea'),
            notePopupActionKeyCheckbox: document.getElementById('wheel-notePopupActionKey'),
            saveNoteBtn: document.getElementById('wheel-saveNoteBtn'),
            historyPopup: document.getElementById('wheel-historyPopup'),
            historyScrollBtn: document.getElementById('wheel-historyScrollToBottomBtn'),
            miniTrendGraphContainer: document.getElementById('wheel-miniTrendGraphContainer'),
            compareControls: document.getElementById('wheel-compareControls'),
            compareBtn: document.getElementById('wheel-compareBtn'),
            personalizeBtn: document.getElementById('wheel-personalizeBtn'),
            helpBtn: document.getElementById('wheel-helpBtn'),
            historyBtn: document.getElementById('wheel-historyBtn'),
            returnToInputBtn: document.getElementById('wheel-returnToInputBtn'),
            importBtn: document.getElementById('wheel-importBtn'),
            importFileElement: document.getElementById('wheel-importFile'),
            exportBtn: document.getElementById('wheel-exportBtn'),
            actionKeysBtn: document.getElementById('wheel-actionKeysBtn'),
            copyHistoryBtn: document.getElementById('wheel-copyHistoryBtn'),
            resetAppBtn: document.getElementById('wheel-resetAppBtn'),
            saveCustomizationBtn: document.getElementById('wheel-saveCustomizationBtn'),
            appLogo: document.getElementById('wheel-appLogo'), // Could be null if welcome view is skipped
            loadingMessage: document.getElementById('wheel-loadingMessage'),
            notification: document.getElementById('wheel-notification'),
            // Popups by ID for easier management
            customizationPopup: document.getElementById('wheel-customizationPopup'),
            helpPopup: document.getElementById('wheel-helpPopup'),
            actionKeysPopup: document.getElementById('wheel-actionKeysPopup'),
            // Help sections
            helpPersonalizeSection: document.getElementById('wheel-helpPersonalizeSection'),
            helpImportSection: document.getElementById('wheel-helpImportSection'),
        };
         // Add listeners to all close buttons inside the overlay
         this.dom.overlay?.querySelectorAll('.wheel-popup-close-btn, button[data-modal-id]').forEach(btn => {
             const modalId = btn.dataset.modalId || btn.closest('.wheel-popup')?.id;
             if(modalId) {
                 btn.addEventListener('click', () => this.closeModal(modalId));
             }
         });
         // Close modal on overlay click
         this.dom.overlay?.addEventListener('click', (event) => {
             if (event.target === this.dom.overlay) {
                 this.closeAllModals();
             }
         });
        console.log("WheelApp DOM elements cached.");
    },

    handleNoPillars: function() {
        if (!this.dom.inputView || !this.dom.pillarDisplay) return;
        this.showInputView(); // Make sure input view is visible
        this.dom.pillarDisplay.innerHTML = `<p class='wheel-text-center wheel-mt-2'>Aucun pilier n'est défini. Veuillez essayer de recharger l'application ou de réinitialiser les données via l'historique (s'il est accessible).</p>`;
        if (this.dom.globalScoreDisplay) this.dom.globalScoreDisplay.textContent = `Note globale : - / 20`;
        if (this.dom.pillarAverageScoreDisplay) this.dom.pillarAverageScoreDisplay.textContent = `Moyenne Pilier : - / 10`;
        if (this.dom.prevBtn) this.dom.prevBtn.disabled = true;
        if (this.dom.nextBtn) this.dom.nextBtn.disabled = true;
        if (this.dom.showChartBtn) this.dom.showChartBtn.disabled = true;
        if (this.dom.inputView) this.dom.inputView.style.setProperty('--wheel-pillar-border-color', 'transparent');
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }
    },

    loadData: function() {
        const storedPillars = localStorage.getItem('wheelOfLife_pillars');
        const storedHistory = localStorage.getItem('wheelOfLife_history');
        const defaultPillars = this.getDefaultPillarsData(); // Get a fresh default structure

        try {
            const parsedPillars = storedPillars ? JSON.parse(storedPillars) : null;
            this.pillars = parsedPillars && Array.isArray(parsedPillars) && parsedPillars.length > 0
                         ? this.migrateDataStructure(parsedPillars, defaultPillars) // Pass defaults for migration reference
                         : defaultPillars; // Use fresh defaults if no stored data or invalid
        } catch (e) {
            console.error("Error loading/parsing pillars from localStorage (WheelApp), resetting to defaults:", e);
            this.pillars = defaultPillars;
            localStorage.removeItem('wheelOfLife_pillars'); // Clear corrupted data
            this.showNotification("Données des piliers corrompues. Réinitialisation aux valeurs par défaut.");
        }

        try {
            const parsedHistory = storedHistory ? JSON.parse(storedHistory) : [];
            // Filter and validate history entries
            this.history = Array.isArray(parsedHistory)
                ? parsedHistory.filter(entry => entry && entry.id && entry.date && entry.timestamp && Array.isArray(entry.scores))
                : [];
            this.history.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)); // Sort newest first
        } catch (e) {
            console.error("Error loading/parsing history from localStorage (WheelApp), resetting history:", e);
            this.history = [];
            localStorage.removeItem('wheelOfLife_history'); // Clear corrupted data
            this.showNotification("Historique corrompu. Réinitialisation.");
        }

        // Ensure pillars array is valid after loading/migration
        if (!Array.isArray(this.pillars) || this.pillars.length === 0) {
            console.warn("Pillars array invalid after load/migration (WheelApp), forcing defaults.");
            this.pillars = defaultPillars;
        }

        // Reset index if out of bounds
        this.currentPillarIndex = Math.max(0, Math.min(this.currentPillarIndex, this.pillars.length - 1));

        // Load premium status
        this.isPremium = localStorage.getItem('wheelOfLife_premiumStatus') === 'true';
        console.log("WheelApp data loaded. Premium:", this.isPremium);
    },

    /**
     * Migrates loaded data structure to ensure consistency with the latest default structure.
     * Adds missing fields, potentially renames fields, etc.
     * @param {Array} loadedPillars - The pillars data loaded from localStorage.
     * @param {Array} defaultPillars - The current default pillar structure for reference.
     * @returns {Array} The migrated pillars data.
     */
    migrateDataStructure: function(loadedPillars, defaultPillars) {
        console.log("Running data migration check for WheelApp...");
        if (!Array.isArray(loadedPillars) || !Array.isArray(defaultPillars)) return defaultPillars;

        const defaultMap = new Map(defaultPillars.map(p => [p.id, p]));
        const migratedPillars = [];

        loadedPillars.forEach((loadedPillar, pIdx) => {
            if (!loadedPillar || typeof loadedPillar !== 'object') return; // Skip invalid entries

            const defaultPillar = defaultMap.get(loadedPillar.id) || defaultPillars[pIdx]; // Find corresponding default by ID or index
            const pillarId = loadedPillar.id || defaultPillar?.id || this.generateId(loadedPillar.name || `pillar-${pIdx}`);

            const migratedPillar = {
                id: pillarId,
                name: loadedPillar.name || defaultPillar?.name || `Pilier ${pIdx + 1}`,
                tooltip: loadedPillar.tooltip !== undefined ? loadedPillar.tooltip : (defaultPillar?.tooltip || ""),
                subPillars: []
            };

            const defaultSubPillars = defaultPillar ? new Map(defaultPillar.subPillars.map(sp => [sp.id, sp])) : new Map();

            if (Array.isArray(loadedPillar.subPillars)) {
                loadedPillar.subPillars.forEach((loadedSubPillar, spIdx) => {
                    if (!loadedSubPillar || typeof loadedSubPillar !== 'object') return; // Skip invalid

                    const defaultSubPillar = defaultSubPillars.get(loadedSubPillar.id) || defaultPillar?.subPillars[spIdx];
                    const subPillarId = loadedSubPillar.id || defaultSubPillar?.id || this.generateId(`${pillarId}-${loadedSubPillar.name || `sub-${spIdx}`}`);

                    migratedPillar.subPillars.push({
                        id: subPillarId,
                        name: loadedSubPillar.name || defaultSubPillar?.name || `Sous-pilier ${spIdx + 1}`,
                        score: (loadedSubPillar.score !== undefined && !isNaN(parseInt(loadedSubPillar.score))) ? parseInt(loadedSubPillar.score) : (defaultSubPillar?.score ?? 5),
                        note: loadedSubPillar.note !== undefined ? loadedSubPillar.note : (defaultSubPillar?.note ?? ""),
                        goal: (loadedSubPillar.goal !== undefined && !isNaN(parseInt(loadedSubPillar.goal))) ? parseInt(loadedSubPillar.goal) : (defaultSubPillar?.goal ?? 10),
                        isAction: typeof loadedSubPillar.isAction === 'boolean' ? loadedSubPillar.isAction : (defaultSubPillar?.isAction ?? false),
                        tooltip: loadedSubPillar.tooltip !== undefined ? loadedSubPillar.tooltip : (defaultSubPillar?.tooltip || "")
                    });
                });
            } else if (defaultPillar?.subPillars) {
                // If loaded has no subpillars but default does, copy defaults
                migratedPillar.subPillars = JSON.parse(JSON.stringify(defaultPillar.subPillars));
            }

            migratedPillars.push(migratedPillar);
        });

         // Add any missing default pillars if the loaded data didn't include them
         defaultPillars.forEach(defaultPillar => {
             if (!migratedPillars.some(mp => mp.id === defaultPillar.id)) {
                 console.log(`Adding missing default pillar: ${defaultPillar.name}`);
                 migratedPillars.push(JSON.parse(JSON.stringify(defaultPillar)));
             }
         });


        // Filter out any pillars that might have become invalid during migration
        const finalPillars = migratedPillars.filter(p => p.id && p.name && Array.isArray(p.subPillars));

         if (finalPillars.length !== loadedPillars.length || finalPillars.length !== defaultPillars.length) {
             console.warn("Pillar structure changed during migration. Review might be needed.");
         }

        return finalPillars;
    },


    saveData: function() {
        try {
            localStorage.setItem('wheelOfLife_pillars', JSON.stringify(this.pillars));
            localStorage.setItem('wheelOfLife_history', JSON.stringify(this.history));
             // Premium status saved separately on change
            // console.log("WheelApp data saved."); // Reduce console noise
        } catch (e) {
            console.error("Error saving WheelApp data to localStorage:", e);
            if (e.name === 'QuotaExceededError') {
                this.showNotification("Erreur: Espace de stockage local plein. Impossible de sauvegarder.", 5000);
            } else {
                this.showNotification("Erreur : Impossible de sauvegarder les données.", 5000);
            }
        }
    },

    savePremiumStatus: function() {
        try {
            localStorage.setItem('wheelOfLife_premiumStatus', this.isPremium);
            console.log("WheelApp premium status saved:", this.isPremium);
        } catch (e) {
             console.error("Error saving premium status to localStorage:", e);
        }
    },

    activatePremium: function() {
        if (this.isPremium) return;
        console.log("Activating WheelApp Premium Mode...");
        this.isPremium = true;
        this.savePremiumStatus();
        this.updatePremiumUI();
        this.showNotification("Mode Premium activé ! Fonctionnalités supplémentaires débloquées.", 4000);
    },

    updatePremiumUI: function() {
        const displayValue = this.isPremium ? 'inline-block' : 'none';
        if (this.dom.personalizeBtn) this.dom.personalizeBtn.style.display = displayValue;
        if (this.dom.importBtn) this.dom.importBtn.style.display = displayValue;
        if (this.dom.exportBtn) this.dom.exportBtn.style.display = displayValue;

        // Update help text visibility
        if (this.dom.helpPersonalizeSection) this.dom.helpPersonalizeSection.style.display = this.isPremium ? 'list-item' : 'none';
        if (this.dom.helpImportSection) this.dom.helpImportSection.style.display = this.isPremium ? 'list-item' : 'none';
         console.log("WheelApp Premium UI updated. Status:", this.isPremium);
    },

    handleLogoPressStart: function(event) {
        // Only activate on welcome screen logo
        if (!this.dom.welcomeView || this.dom.welcomeView.style.display === 'none') return;
        if (this.isPremium) return; // Already premium

        event.preventDefault(); // Prevent default actions like image dragging
        clearTimeout(this.longPressTimer); // Clear any previous timer
        this.showNotification("Maintenez appuyé pour activer le mode Premium...", this.PREMIUM_PRESS_DURATION);
        this.longPressTimer = setTimeout(() => {
            this.activatePremium();
             // Clear notification explicitly if premium activated this way
             if(this.dom.notification && this.dom.notification.timer) {
                 clearTimeout(this.dom.notification.timer);
                 this.dom.notification.classList.remove('visible');
             }
             this.showNotification("Mode Premium activé !", 4000); // Show confirmation
        }, this.PREMIUM_PRESS_DURATION);
         console.log("Logo press started...");
    },

    handleLogoPressEnd: function() {
        // Only clear if timer was actually running
        if(this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
             console.log("Logo press ended/cancelled.");
             // Optional: hide the "maintenez appuyé" notification if it's still visible
             // Requires tracking the notification message or using a specific ID
        }
    },

    // --- Theme Management ---
    setupTheme: function() {
        if (!this.dom.themeCheckbox || !this.dom.appContainer) return;
        const savedTheme = localStorage.getItem('wheelOfLife_theme');
        // Respect system preference ONLY if no theme is saved
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        let useDarkTheme = false;

        if (savedTheme) {
            useDarkTheme = savedTheme === 'dark';
        } else {
            useDarkTheme = prefersDark;
        }

        this.dom.themeCheckbox.checked = useDarkTheme;
        this.applyTheme(useDarkTheme);

        // Listen for system theme changes ONLY if no theme is explicitly saved
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            // Check again if a theme preference has been saved in the meantime
            if (!localStorage.getItem('wheelOfLife_theme')) {
                console.log("System color scheme changed:", e.matches ? "Dark" : "Light");
                this.applyTheme(e.matches);
                this.dom.themeCheckbox.checked = e.matches;
                // Re-render chart if it's currently visible
                if (this.chartInstance && this.dom.chartView?.style.display !== 'none') {
                    this.renderChart();
                }
            }
        });
    },

    toggleTheme: function() {
        if (!this.dom.themeCheckbox || !this.dom.appContainer) return;
        const isDark = this.dom.themeCheckbox.checked;
        this.applyTheme(isDark);
        // Save the user's explicit choice
        localStorage.setItem('wheelOfLife_theme', isDark ? 'dark' : 'light');
        // Re-render chart if it's currently visible
        if (this.chartInstance && this.dom.chartView?.style.display !== 'none') {
            this.renderChart();
        }
    },

    applyTheme: function(isDark) {
        if (!this.dom.appContainer) return;
        this.currentTheme = isDark ? 'dark' : 'light';
        if (isDark) {
            this.dom.appContainer.classList.add('dark-theme');
            // document.body.classList.add('dark-theme'); // Optional: Apply to body too if needed globally
        } else {
            this.dom.appContainer.classList.remove('dark-theme');
            // document.body.classList.remove('dark-theme');
        }
        console.log(`WheelApp theme applied: ${this.currentTheme}`);
        // Pillar border color depends on theme, update it if input view is visible
        if (this.dom.inputView?.style.display !== 'none') {
             this.updatePillarBorderColor();
        }
    },

    updatePillarBorderColor: function() {
         if (!this.dom.inputView || !this.pillars || this.pillars.length === 0) return;
         const pillarIndex = this.currentPillarIndex;
         const colorPalette = this.currentTheme === 'dark' ? this.pillarColorsDark : this.pillarColorsLight;
         const color = colorPalette[pillarIndex % colorPalette.length];
         this.dom.inputView.style.setProperty('--wheel-pillar-border-color', color);
    },

    // ... End of Part 1 ... //
};

/* ========================================= */
/* == App 1: Roue de la Vie (Partie 2) ==== */
/* ========================================= */

// --- View Management ---

Object.assign(WheelApp, { // Merging methods into the existing WheelApp object

    showWelcomeView: function() {
        if (this.dom.welcomeView) this.dom.welcomeView.style.display = 'block';
        if (this.dom.inputView) this.dom.inputView.style.display = 'none';
        if (this.dom.chartView) this.dom.chartView.style.display = 'none';
        // Maybe focus logo or start button
        if (this.dom.appLogo && !this.isPremium) this.dom.appLogo.focus();
        else if (this.dom.startEvaluationBtn) this.dom.startEvaluationBtn.focus();
    },

    showInputView: function() {
        if (this.dom.welcomeView) this.dom.welcomeView.style.display = 'none';
        if (this.dom.inputView) this.dom.inputView.style.display = 'block';
        if (this.dom.chartView) this.dom.chartView.style.display = 'none';

        // Ensure pillar border color is updated on view switch
        this.updatePillarBorderColor();

        // Auto-focus the first element for better navigation (optional)
        // Consider focusing the pillar nav or the first slider
        const firstPillarNavButton = this.dom.pillarNavigation?.querySelector('button');
        if (firstPillarNavButton) {
           // firstPillarNavButton.focus(); // Focus might be annoying for some users
        } else if (this.dom.nextBtn && !this.dom.nextBtn.disabled) {
           // this.dom.nextBtn.focus();
        }
    },

    showChartView: function() {
        if (!this.pillars || this.pillars.length === 0) {
             this.showNotification("Aucun pilier à afficher. Veuillez d'abord faire une évaluation.");
             return; // Don't show chart view if no pillars
        }
        if (this.dom.welcomeView) this.dom.welcomeView.style.display = 'none';
        if (this.dom.inputView) this.dom.inputView.style.display = 'none';
        if (this.dom.chartView) this.dom.chartView.style.display = 'block';
        this.renderChart(); // Render the chart when the view is shown
        this.dom.appContainer?.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
        // Focus the history button for accessibility
        if (this.dom.historyBtn) {
            // this.dom.historyBtn.focus();
        }
    },

    startEvaluation: function() {
        localStorage.setItem('wheelOfLife_welcomeDismissed', 'true');
        if (this.pillars && this.pillars.length > 0) {
            this.currentPillarIndex = 0; // Start from the first pillar
            this.renderPillar();
            this.showInputView();
            // Optional: Focus the first interactive element
            const firstSlider = this.dom.inputView?.querySelector('input[type="range"]');
            if (firstSlider) {
               // firstSlider.focus();
            }
        } else {
            this.handleNoPillars(); // Show error message if no pillars
        }
    },

    // --- UI Rendering ---

    renderPillar: function() {
        if (!this.pillars || this.pillars.length === 0) {
            this.handleNoPillars();
            return;
        }
        // Ensure index is valid
        if (this.currentPillarIndex < 0 || this.currentPillarIndex >= this.pillars.length) {
            this.currentPillarIndex = 0;
        }

        const pillar = this.pillars[this.currentPillarIndex];
        this.updatePillarBorderColor(); // Update border color based on current pillar and theme

        // Icônes pour chaque pilier
        const pillarIcons = {
            "sante": "fa-heartbeat",
            "famille": "fa-users",
            "finances": "fa-coins",
            "carriere": "fa-briefcase",
            "loisirs": "fa-gamepad",
            "devperso": "fa-brain",
            "relations": "fa-user-friends",
            "cadrevie": "fa-home"
        };

        // Render Pillar Navigation Tabs
        if (this.dom.pillarNavigation) {
            this.dom.pillarNavigation.innerHTML = this.pillars.map((p, idx) => {
                const icon = pillarIcons[p.id] || "fa-circle";
                return `<button class="wheel-pillar-nav-button ${idx === this.currentPillarIndex ? 'active' : ''}"
                        onclick="WheelApp.navigateToPillar(${idx})"
                        aria-label="Aller au pilier ${p.name}"
                        aria-current="${idx === this.currentPillarIndex ? 'true' : 'false'}"
                        title="${p.name}">
                        <i class="fas ${icon}" aria-hidden="true"></i>
                    </button>`;
            }).join('');
        }

        // Affichage des alertes domaines faibles juste sous les onglets
        if (this.dom.pillarNavigation) {
            let alerts = '';
            const currentPillar = this.pillars[this.currentPillarIndex];
            if (currentPillar && currentPillar.subPillars) {
                currentPillar.subPillars.forEach(sub => {
                    if (typeof sub.score === 'number' && sub.score < 5) {
                        alerts += `<div class="wheel-alert-low bg-red-100 text-red-700 rounded px-3 py-2 mb-2" style="margin-top:8px;">
                            <i class="fas fa-exclamation-triangle mr-2"></i>
                            Domaine faible : <b>${currentPillar.name} > ${sub.name}</b> (score ${sub.score})
                        </div>`;
                    }
                });
            }
            // Supprimer l'ancien bloc si présent
            const old = this.dom.pillarNavigation.parentElement.querySelector('.wheel-alerts-low-block');
            if (old) old.remove();
            if (alerts) {
                const alertDiv = document.createElement('div');
                alertDiv.className = 'wheel-alerts-low-block';
                alertDiv.innerHTML = alerts;
                this.dom.pillarNavigation.insertAdjacentElement('afterend', alertDiv);
            }
        }

        // Function to create tooltip HTML safely
        const createTooltipHTML = (text) => {
            if (!text) return '';
            // Basic sanitization: replace < and > to prevent HTML injection in tooltip text
            const sanitizedText = text.replace(/</g, "<").replace(/>/g, ">");
            return `<span class="wheel-help-icon" aria-hidden="true" tabindex="0">?<span class="wheel-tooltiptext">${sanitizedText}</span></span>`;
        };

        // Render Pillar Header and Action Buttons
        let pillarHTML = `
            <h3 id="wheel-pillar-title">
                <span>${pillar.name}</span>
                ${createTooltipHTML(pillar.tooltip)}
                <span style="font-weight:normal; font-size: 0.8em; margin-left: auto;">(${this.currentPillarIndex + 1}/${this.pillars.length})</span>
            </h3>
            <div class="wheel-pillar-actions">
                <button onclick="WheelApp.applyGoalToAllSubPillars('${pillar.id}', 10)" aria-label="Appliquer l'objectif 10 à tous les sous-piliers de ${pillar.name}">Objectif 10 pour tous</button>
                <button onclick="WheelApp.resetPillarScores('${pillar.id}', 5)" aria-label="Réinitialiser les notes de tous les sous-piliers de ${pillar.name} à 5">Notes à 5</button>
            </div>
        `;

        // Render Sub-Pillars
        if (!pillar.subPillars || pillar.subPillars.length === 0) {
            pillarHTML += "<p class='wheel-text-center'>Ce pilier n'a pas de sous-piliers définis.</p>";
        } else {
            pillar.subPillars.forEach((subPillar) => {
                const displayScore = (typeof subPillar.score === 'number' && !isNaN(subPillar.score)) ? subPillar.score : 5;
                const displayGoal = (typeof subPillar.goal === 'number' && !isNaN(subPillar.goal)) ? subPillar.goal : 10;
                const noteIconColorClass = subPillar.note ? 'wheel-note-active' : ''; // Add class if note exists?

                // Ajout classe rouge si score < 5
                const alertClass = displayScore < 5 ? 'wheel-sub-pillar--alert' : '';

                // Ajout du bouton "Créer un objectif" si objectif > score
                let createGoalBtn = '';
                if (displayGoal > displayScore) {
                    createGoalBtn = `<button class="wheel-create-goal-btn" data-pillar-id="${pillar.id}" data-subpillar-id="${subPillar.id}" data-subpillar-name="${subPillar.name}" style="margin-left:10px; color:#fff; background:#6366f1; border:none; border-radius:4px; padding:2px 8px; font-size:0.85em; cursor:pointer;">Créer un objectif</button>`;
                }
                // Recherche des objectifs liés à ce sous-pilier
                let linkedGoalsHTML = '';
                if (typeof GoalsApp !== 'undefined' && GoalsApp.pillarsData) {
                    const goals = [];
                    GoalsApp.pillarsData.forEach(gPillar => {
                        gPillar.subPillars.forEach(gSub => {
                            if (
                                (gSub.id === subPillar.id || gSub.name === subPillar.name) &&
                                Array.isArray(gSub.goals)
                            ) {
                                gSub.goals.forEach(goalText => {
                                    if (goalText && goalText.trim() !== '') {
                                        goals.push(goalText);
                                    }
                                });
                            }
                        });
                    });
                    if (goals.length > 0) {
                        linkedGoalsHTML = `<div class="mt-1 mb-2 text-xs text-purple-700">
                            <i class="fas fa-bullseye mr-1"></i>
                            Objectifs associés :
                            <ul class="ml-4 list-disc">
                                ${goals.map(g => `<li>${g}</li>`).join('')}
                            </ul>
                            <a href="#" class="underline text-indigo-600 hover:text-indigo-800" onclick="
                                localStorage.setItem('wheel_to_goal', JSON.stringify({pillarId: '${pillar.id}', subPillarId: '${subPillar.id}', subPillarName: '${subPillar.name}'}));
                                if(typeof MainApp!=='undefined'){MainApp.showMainApp();MainApp.showApp('goals');}
                                return false;
                            ">Voir/modifier dans Objectifs</a>
                        </div>`;
                    }
                }

                pillarHTML += `
                    <div class="wheel-sub-pillar ${alertClass}" id="wheel-subpillar-div-${subPillar.id}">
                        <div class="wheel-sub-pillar-header">
                            <label for="wheel-range-${subPillar.id}" id="wheel-label-${subPillar.id}">
                                <span>${subPillar.name}</span>
                                ${createTooltipHTML(subPillar.tooltip)}
                                ${createGoalBtn}
                            </label>
                            ${linkedGoalsHTML}
                            <div class="wheel-sub-pillar-controls">
                                <input type="range" id="wheel-range-${subPillar.id}" min="1" max="10" value="${displayScore}"
                                       oninput="WheelApp.updateScore('${pillar.id}', '${subPillar.id}', this.value, true)"
                                       aria-labelledby="wheel-label-${subPillar.id} wheel-slider-value-${subPillar.id}"
                                       aria-valuemin="1" aria-valuemax="10" aria-valuenow="${displayScore}">
                                <output class="wheel-slider-value" id="wheel-slider-value-${subPillar.id}" for="wheel-range-${subPillar.id}">${displayScore}</output>
                            </div>
                        </div>
                        <div class="wheel-sub-pillar-details">
                            <div class="wheel-detail-group">
                                <label for="wheel-goal-${subPillar.id}">Objectif:</label>
                                <input type="number" id="wheel-goal-${subPillar.id}" min="1" max="10" value="${displayGoal}"
                                       onchange="WheelApp.updateGoal('${pillar.id}', '${subPillar.id}', this.value)"
                                       aria-label="Objectif pour ${subPillar.name}">
                            </div>
                            <!-- Suppression du bouton note (icône crayon) -->
                        </div>
                    </div>`;
            });
        }
        if (this.dom.pillarDisplay) this.dom.pillarDisplay.innerHTML = pillarHTML;

        // Scroll automatique si navigation depuis Objectifs (goal_to_wheel)
        try {
            const goalToWheel = JSON.parse(localStorage.getItem('goal_to_wheel') || 'null');
            if (goalToWheel && goalToWheel.pillarId) {
                const targetIndex = this.pillars.findIndex(p => p.id === goalToWheel.pillarId);
                if (targetIndex !== -1 && targetIndex !== this.currentPillarIndex) {
                    this.currentPillarIndex = targetIndex;
                    localStorage.setItem('goal_to_wheel', JSON.stringify(goalToWheel)); // conserver pour le scroll
                    this.renderPillar();
                    return;
                }
                // Scroll sur le sous-pilier
                setTimeout(() => {
                    const targetDiv = this.dom.pillarDisplay.querySelector(`#wheel-subpillar-div-${goalToWheel.subPillarId}`);
                    if (targetDiv) {
                        targetDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        targetDiv.classList.add('wheel-sub-pillar--alert');
                        setTimeout(() => targetDiv.classList.remove('wheel-sub-pillar--alert'), 2000);
                    }
                    localStorage.removeItem('goal_to_wheel');
                }, 0);
            }
        } catch (e) {}

        this.updateNavigationButtons();
        this.updateScoresDisplay(); // Update scores immediately after rendering
        if (this.dom.showChartBtn) this.dom.showChartBtn.disabled = false; // Enable chart button
    },


    /**
     * Calculates the average score for each pillar and the global score.
     * @returns {{pillarAverages: number[], globalScore: number}} Object containing arrays of averages and the global score.
     */
    calculateAverages: function() {
        if (!this.pillars || this.pillars.length === 0) {
            return { pillarAverages: [], globalScore: 0 };
        }
        let totalScoreSum = 0;
        let totalSubPillarsCount = 0;

        const pillarAverages = this.pillars.map(pillar => {
            if (!pillar.subPillars || pillar.subPillars.length === 0) return NaN; // No average if no subpillars

            const validScores = pillar.subPillars
                .map(sub => sub.score)
                .filter(score => typeof score === 'number' && !isNaN(score));

            if (validScores.length === 0) return NaN; // No average if no valid scores

            const pillarSum = validScores.reduce((acc, score) => acc + score, 0);
            totalScoreSum += pillarSum;
            totalSubPillarsCount += validScores.length; // Count only valid scores toward global average
            return pillarSum / validScores.length;
        });

        // Global score based on the average of ALL valid subpillar scores, then scaled to /20
        const globalAverage = totalSubPillarsCount > 0 ? totalScoreSum / totalSubPillarsCount : 0;
        const globalScore = globalAverage * 2; // Scale average (out of 10) to score (out of 20)

        return { pillarAverages, globalScore };
    },

    /**
     * Updates the display of the global score and the current pillar's average score.
     */
    updateScoresDisplay: function() {
        if (!this.pillars || this.pillars.length === 0) {
             if (this.dom.globalScoreDisplay) this.dom.globalScoreDisplay.textContent = `Note globale : - / 20`;
             if (this.dom.pillarAverageScoreDisplay) this.dom.pillarAverageScoreDisplay.textContent = `Moyenne Pilier : - / 10`;
             return;
         }
        const { pillarAverages, globalScore } = this.calculateAverages();

        if (this.dom.globalScoreDisplay) {
            this.dom.globalScoreDisplay.textContent = `Note globale : ${globalScore.toFixed(1)} / 20`;
        }

        const currentPillarAverage = pillarAverages[this.currentPillarIndex];
        if (this.dom.pillarAverageScoreDisplay) {
            this.dom.pillarAverageScoreDisplay.textContent = `Moyenne Pilier : ${!isNaN(currentPillarAverage) ? currentPillarAverage.toFixed(1) : '-'} / 10`;
        }
    },


    // --- User Interaction Handlers ---

    /**
     * Finds a specific sub-pillar object within the data structure.
     * @param {string} pillarId - The ID of the parent pillar.
     * @param {string} subPillarId - The ID of the sub-pillar to find.
     * @returns {object | null} The sub-pillar object or null if not found.
     */
    findSubPillar: function(pillarId, subPillarId) {
        const pillar = this.pillars.find(p => p.id === pillarId);
        if (!pillar || !Array.isArray(pillar.subPillars)) {
            console.warn(`Pillar not found or invalid structure (WheelApp): ${pillarId}`);
            return null;
        }
        const subPillar = pillar.subPillars.find(sp => sp.id === subPillarId);
        if (!subPillar) {
            // This might happen during migration or if IDs change, log it.
            console.warn(`SubPillar not found (WheelApp): ${subPillarId} in pillar ${pillarId}`);
        }
        return subPillar;
    },

    /**
     * Updates the score of a sub-pillar and the UI.
     * @param {string} pillarId - ID of the pillar.
     * @param {string} subPillarId - ID of the sub-pillar.
     * @param {string|number} value - The new score value (1-10).
     * @param {boolean} [fromInput=false] - True if called directly from the range input event.
     */
    updateScore: function(pillarId, subPillarId, value, fromInput = false) {
        const score = parseInt(value);
        // Basic validation
        if (isNaN(score) || score < 1 || score > 10) {
             console.warn(`Invalid score value received (WheelApp): ${value}`);
             // Optionally reset the input value to the previous valid score
             return;
        }

        const subPillar = this.findSubPillar(pillarId, subPillarId);
        if (subPillar) {
            subPillar.score = score;
            // Update the corresponding output display if called from input
            if (fromInput) {
                const output = document.getElementById(`wheel-slider-value-${subPillarId}`);
                if (output) output.textContent = score;
                // Also update aria-valuenow for accessibility
                const rangeInput = document.getElementById(`wheel-range-${subPillarId}`);
                if (rangeInput) rangeInput.setAttribute('aria-valuenow', score);
            }
            // Use debounced functions for updating scores and saving data
            this.debouncedUpdateScoresDisplay();
            this.debouncedSaveData();
        }
    },

    /**
     * Updates the note and action key status of a sub-pillar.
     * @param {string} pillarId - ID of the pillar.
     * @param {string} subPillarId - ID of the sub-pillar.
     * @param {string} noteValue - The text content of the note.
     * @param {boolean} isActionValue - Whether the note is marked as an action key.
     */
    updateNote: function(pillarId, subPillarId, noteValue, isActionValue) {
        const subPillar = this.findSubPillar(pillarId, subPillarId);
        if (subPillar) {
            subPillar.note = noteValue.trim(); // Store trimmed note
            subPillar.isAction = !!isActionValue; // Ensure boolean value
            this.debouncedSaveData();
            // Optional: Update note icon appearance if needed (e.g., add class)
            const noteButton = document.querySelector(`#wheel-subpillar-div-${subPillarId} .wheel-note-button`);
            if(noteButton) {
                noteButton.classList.toggle('wheel-note-active', !!subPillar.note);
            }
        }
    },

    /**
     * Updates the goal value of a sub-pillar.
     * @param {string} pillarId - ID of the pillar.
     * @param {string} subPillarId - ID of the sub-pillar.
     * @param {string|number} value - The new goal value (1-10).
     */
    updateGoal: function(pillarId, subPillarId, value) {
        const goal = parseInt(value);
        const input = document.getElementById(`wheel-goal-${subPillarId}`);
        const subPillar = this.findSubPillar(pillarId, subPillarId);

        if (subPillar) {
            if (!isNaN(goal) && goal >= 1 && goal <= 10) {
                subPillar.goal = goal;
                this.debouncedSaveData(); // Save the change
            } else {
                // Revert input value if invalid
                if (input) input.value = subPillar.goal !== undefined ? subPillar.goal : 10;
                this.showNotification("L'objectif doit être un nombre entre 1 et 10.", 3000);
            }
        }
    },

    /**
     * Applies a specific goal value to all sub-pillars of the current pillar.
     * @param {string} pillarId - The ID of the pillar to modify.
     * @param {number} goalValue - The goal value to apply (e.g., 10).
     */
    applyGoalToAllSubPillars: function(pillarId, goalValue) {
        const pillar = this.pillars.find(p => p.id === pillarId);
        if (!pillar || !Array.isArray(pillar.subPillars)) return;

        let changed = false;
        pillar.subPillars.forEach(sp => {
            if (sp.goal !== goalValue) {
                sp.goal = goalValue;
                // Update the corresponding input field in the UI
                const input = document.getElementById(`wheel-goal-${sp.id}`);
                if (input) input.value = goalValue;
                changed = true;
            }
        });

        if (changed) {
            this.debouncedSaveData();
            this.showNotification(`Objectif ${goalValue} appliqué à tous les sous-piliers de "${pillar.name}".`);
        } else {
            this.showNotification(`Tous les objectifs pour "${pillar.name}" étaient déjà à ${goalValue}.`);
        }
    },

    /**
     * Resets the scores of all sub-pillars of the current pillar to a specific value.
     * @param {string} pillarId - The ID of the pillar to modify.
     * @param {number} scoreValue - The score value to apply (e.g., 5).
     */
    resetPillarScores: function(pillarId, scoreValue) {
        const pillar = this.pillars.find(p => p.id === pillarId);
        if (!pillar || !Array.isArray(pillar.subPillars)) return;

        let changed = false;
        pillar.subPillars.forEach(sp => {
            if (sp.score !== scoreValue) {
                sp.score = scoreValue;
                // Update the corresponding UI elements (slider and output)
                const rangeInput = document.getElementById(`wheel-range-${sp.id}`);
                const output = document.getElementById(`wheel-slider-value-${sp.id}`);
                if (rangeInput) {
                    rangeInput.value = scoreValue;
                    rangeInput.setAttribute('aria-valuenow', scoreValue);
                }
                if (output) output.textContent = scoreValue;
                changed = true;
            }
        });

        if (changed) {
            this.debouncedUpdateScoresDisplay(); // Update pillar/global averages
            this.debouncedSaveData();
            this.showNotification(`Notes réinitialisées à ${scoreValue} pour "${pillar.name}".`);
        } else {
             this.showNotification(`Toutes les notes pour "${pillar.name}" étaient déjà à ${scoreValue}.`);
        }
    },

    // --- Navigation ---

    /**
     * Navigates to a specific pillar by its index.
     * @param {number} index - The index of the pillar to navigate to.
     */
    navigateToPillar: function(index) {
        if (index === this.currentPillarIndex || index < 0 || index >= this.pillars.length) {
            return; // No change or invalid index
        }
        this.currentPillarIndex = index;
        this.renderPillar(); // Render the new pillar content
        // Scroll the app container to the top smoothly
        this.dom.appContainer?.scrollTo({ top: 0, behavior: 'smooth' });
    },

    /**
     * Navigates to the next or previous pillar.
     * @param {number} direction - +1 for next, -1 for previous.
     */
    changePillar: function(direction) {
        if (!this.pillars || this.pillars.length <= 1) return; // No navigation if 0 or 1 pillar

        let newIndex = this.currentPillarIndex + direction;
        // Wrap around
        if (newIndex < 0) {
            newIndex = this.pillars.length - 1;
        } else if (newIndex >= this.pillars.length) {
            newIndex = 0;
        }
        this.navigateToPillar(newIndex);
    },

    /**
     * Updates the enabled/disabled state of the Previous/Next buttons.
     */
    updateNavigationButtons: function() {
        const numPillars = this.pillars ? this.pillars.length : 0;
        // Buttons are always enabled if wrapping is allowed (which it is now)
        // Disable only if there's only 1 pillar or less
        if (this.dom.prevBtn) this.dom.prevBtn.disabled = numPillars <= 1;
        if (this.dom.nextBtn) this.dom.nextBtn.disabled = numPillars <= 1;
    },

    // --- Chart Rendering ---
    /**
     * Renders the radar chart using Chart.js.
     * Can optionally render a comparison chart if comparisonData is provided.
     * @param {object | null} [comparisonData=null] - Data for comparison chart { labels: [], datasets: [] }.
     */
    renderChart: function(comparisonData = null) {
        if (!this.dom.radarChartCanvas) {
            console.error("WheelApp: Radar chart canvas element not found.");
            return;
        }
        // Ensure Chart.js library is loaded
        if (typeof Chart === 'undefined') {
            console.error("Chart.js library is not loaded! Cannot render chart.");
            this.showNotification("Erreur: Impossible de charger la bibliothèque de graphiques.", 5000);
            // Optionally, display a message in the chart area
            this.dom.radarChartCanvas.parentElement.innerHTML = '<p class="text-red-500 text-center">Erreur: Bibliothèque Chart.js non chargée.</p>';
            return;
        }

        const ctx = this.dom.radarChartCanvas.getContext('2d');
        if (!ctx) {
            console.error("WheelApp: Failed to get 2D context from radar chart canvas.");
            return;
        }

        // Get theme-dependent colors using getCssVar
        const themeTextColor = this.getCssVar('--wheel-text-color') || '#2c3e50';
        const themeSecondaryTextColor = this.getCssVar('--wheel-secondary-text-color') || '#34495e';
        const themeGridColor = this.getCssVar('--wheel-grid-color') || '#dbe4e9';
        const themeContainerBgColor = this.getCssVar('--wheel-container-bg') || 'white';
        const themeTooltipBgColor = this.getCssVar('--wheel-tooltip-bg') || 'rgba(52, 73, 94, 0.95)';
        const themeTooltipTextColor = this.getCssVar('--wheel-tooltip-text-color') || 'white';
        const scoreBgColor = this.getCssVar('--wheel-chart-bg-color') || 'rgba(52,152,219,0.2)';
        const scoreBorderColor = this.getCssVar('--wheel-chart-border-color') || '#3498db';
        const goalBgColor = this.getCssVar('--wheel-goal-bg-color') || 'rgba(231,76,60,0.1)';
        const goalBorderColor = this.getCssVar('--wheel-goal-border-color') || '#e74c3c';
        // Comparison colors (can be customized)
        const compareColor1 = scoreBorderColor; // Use main score color for first dataset
        const compareColor2 = goalBorderColor;  // Use goal color for second dataset


        // Common Chart.js options
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: true, // Let Chart.js manage aspect ratio
            scales: {
                r: {
                    min: 0,
                    max: 10,
                    ticks: {
                        stepSize: 2,
                        backdropColor: themeContainerBgColor, // Background for ticks
                        color: themeSecondaryTextColor, // Tick label color
                        font: { size: 10 }
                    },
                    pointLabels: {
                        color: themeTextColor, // Pillar label color
                        font: { size: 11, weight: '500' }
                    },
                    grid: { color: themeGridColor }, // Grid lines
                    angleLines: { color: themeGridColor } // Lines from center to labels
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: themeTextColor,
                        usePointStyle: true, // Use point style for legend items
                        boxWidth: 10,
                        padding: 15,
                        font: { size: 11 }
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: themeTooltipBgColor,
                    titleColor: themeTooltipTextColor,
                    bodyColor: themeTooltipTextColor,
                    borderColor: themeGridColor,
                    borderWidth: 1,
                    padding: 10,
                    cornerRadius: 4,
                    usePointStyle: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            if (context.parsed.r !== null && !isNaN(context.parsed.r)) {
                                label += context.parsed.r.toFixed(1); // Format to one decimal place
                            } else {
                                label += '-'; // Show dash if value is invalid
                            }
                            return label;
                        }
                    }
                }
            },
            // Disable animations for faster updates, especially on theme change
            animation: { duration: 0 },
            elements: {
                line: { borderWidth: 2.5 },
                point: { radius: 4, hoverRadius: 6, pointStyle: 'circle' }
            }
        };

        let chartData;
        let chartOptions = { ...commonOptions }; // Clone common options

        if (comparisonData && comparisonData.datasets && comparisonData.datasets.length === 2) {
            // --- Comparison Chart ---
            const labels = comparisonData.labels;
            chartData = {
                labels: labels,
                datasets: comparisonData.datasets.map((dataset, index) => {
                    const color = index === 0 ? compareColor1 : compareColor2;
                    // Make comparison lines slightly thinner and maybe dashed for the second one
                    const borderWidth = index === 0 ? 2.5 : 2;
                    const borderDash = index === 0 ? [] : [4, 4];
                    return {
                        label: dataset.label,
                        data: dataset.data,
                        backgroundColor: color.replace(')', ', 0.2)').replace('rgb', 'rgba'), // Add alpha
                        borderColor: color,
                        borderWidth: borderWidth,
                        borderDash: borderDash,
                        pointBackgroundColor: color,
                        pointBorderColor: '#fff', // White border around points
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: color,
                    };
                })
            };
            chartOptions.plugins.legend.labels.usePointStyle = true; // Keep point style for comparison legend
             console.log("Rendering Comparison Chart");

        } else {
            // --- Standard Chart (Current Scores + Goals) ---
            if (!this.pillars || this.pillars.length === 0) {
                if (this.chartInstance) { this.chartInstance.destroy(); this.chartInstance = null; }
                console.warn("WheelApp: Cannot render standard chart, no pillars data.");
                return;
            }

            const { pillarAverages } = this.calculateAverages();
            const pillarGoalsAverages = this.pillars.map(pillar => {
                if (!pillar.subPillars || pillar.subPillars.length === 0) return NaN;
                const validGoals = pillar.subPillars.map(sub => sub.goal).filter(goal => typeof goal === 'number' && !isNaN(goal));
                if (validGoals.length === 0) return NaN;
                const sum = validGoals.reduce((acc, goal) => acc + goal, 0);
                return sum / validGoals.length;
            });

            const labels = this.pillars.map(p => p.name);

            chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Score Actuel',
                        data: pillarAverages.map(avg => isNaN(avg) ? 0 : avg), // Use 0 for NaN averages
                        backgroundColor: scoreBgColor,
                        borderColor: scoreBorderColor,
                        pointBackgroundColor: scoreBorderColor,
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: scoreBorderColor,
                    },
                    {
                        label: 'Objectif Moyen',
                        data: pillarGoalsAverages.map(avg => isNaN(avg) ? 0 : avg), // Use 0 for NaN averages
                        backgroundColor: goalBgColor,
                        borderColor: goalBorderColor,
                        borderWidth: 1.5,
                        borderDash: [6, 3], // Dashed line for goals
                        pointBackgroundColor: goalBorderColor,
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: goalBorderColor,
                        pointRadius: 3, // Smaller points for goals
                        pointHoverRadius: 5,
                    }
                ]
            };
            chartOptions.plugins.legend.labels.usePointStyle = false; // Use line style for standard legend
             console.log("Rendering Standard Chart");
        }

        // Destroy previous instance if exists
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        // Create new Chart instance
        try {
            this.chartInstance = new Chart(ctx, {
                type: 'radar',
                data: chartData,
                options: chartOptions
            });
        } catch (error) {
             console.error("Error creating Chart.js instance:", error);
             this.showNotification("Erreur lors de l'affichage du graphique.", 5000);
        }
    },

    // ... End of Part 2 ... //
});

/* ========================================= */
/* == App 1: Roue de la Vie (Partie 3) ==== */
/* ========================================= */

Object.assign(WheelApp, { // Merging methods into the existing WheelApp object

    // --- History Management ---

    /**
     * Saves the current evaluation (pillar averages and subpillar details) to history.
     * Replaces the last entry if it was made within the last 24 hours.
     */
    saveToHistory: function() {
        if (!this.pillars || this.pillars.length === 0) {
             this.showNotification("Aucune donnée à sauvegarder dans l'historique.");
             return false; // Indicate save failed
        }
        const { pillarAverages } = this.calculateAverages(); // Get current averages
        const timestamp = Date.now();
        const twentyFourHoursInMillis = 24 * 60 * 60 * 1000;

        // Create a deep copy of current subpillar data for the history entry
        const scoresData = this.pillars.map((p, index) => ({
            pillarId: p.id,
            pillarName: p.name,
            average: (!isNaN(pillarAverages[index]) ? pillarAverages[index] : 0), // Store calculated average
            subPillars: p.subPillars.map(sp => ({ ...sp })) // Deep copy subpillar details
        }));

        const newEntry = {
            id: `hist-${timestamp}-${Math.random().toString(36).substr(2, 5)}`,
            date: new Date(timestamp).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
            timestamp: timestamp,
            scores: scoresData
        };

        // Ensure history is sorted before checking the last entry
        this.history.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        const lastEntry = this.history.length > 0 ? this.history[0] : null;

        // Check if the last entry is recent (within 24 hours)
        if (lastEntry && (timestamp - (lastEntry.timestamp || 0)) < twentyFourHoursInMillis) {
            console.log("Replacing recent history entry (< 24h) (WheelApp).");
            this.history[0] = newEntry; // Replace the most recent entry
        } else {
            console.log("Adding new entry to history (WheelApp).");
            this.history.push(newEntry);
            // Re-sort after adding
            this.history.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        }

        // Limit history size
        if (this.history.length > this.MAX_HISTORY_ENTRIES) {
            this.history = this.history.slice(0, this.MAX_HISTORY_ENTRIES);
            console.log(`History limited to the last ${this.MAX_HISTORY_ENTRIES} entries (WheelApp).`);
        }
        this.saveData(); // Save the updated history
        return true; // Indicate save success
    },

    /**
     * Displays the history popup with evaluation entries and comparison controls.
     */
    showHistory: function() {
        if (!this.dom.historyContent || !this.dom.miniTrendGraphContainer || !this.dom.compareControls) return;
        this.dom.historyContent.innerHTML = ''; // Clear previous content
        this.dom.miniTrendGraphContainer.innerHTML = ''; // Clear trend graph

        if (this.history.length === 0) {
            this.dom.historyContent.innerHTML = "<p class='wheel-text-center'>Aucun historique disponible pour le moment.</p>";
            if (this.dom.historyScrollBtn) this.dom.historyScrollBtn.style.display = 'none';
            this.dom.compareControls.style.display = 'none';
            return;
        }

        // Render the mini trend graph first
        this.renderMiniTrendGraph();

        const ul = document.createElement('ul');
        this.history.forEach((entry, index) => {
            // Validate entry structure
            if (!entry || !entry.scores || !Array.isArray(entry.scores)) {
                console.warn("Skipping invalid history entry (WheelApp):", entry);
                return;
            }

            const li = document.createElement('li');
            li.className = 'wheel-history-entry';
            li.setAttribute('data-entry-id', entry.id); // Add ID for potential future use

            // Calculate global score for this specific entry
            const entryAverages = entry.scores.map(s => s.average).filter(avg => !isNaN(avg));
            const entryGlobalAverage = entryAverages.length > 0 ? entryAverages.reduce((sum, avg) => sum + avg, 0) / entryAverages.length : 0;
            const entryGlobalScore = entryGlobalAverage * 2;

            // Find previous entry for comparison diffs
            const prevEntry = this.history[index + 1]; // History is sorted newest first

            let entryHTML = `
                <div>
                    <input type="checkbox" class="wheel-history-compare-checkbox" data-entry-id="${entry.id}" onchange="WheelApp.updateCompareControls()" aria-label="Sélectionner l'entrée du ${entry.date} pour comparaison">
                    <strong>${entry.date || 'Date inconnue'}</strong>
                    <span style="font-size: 0.9em; color: var(--wheel-secondary-text-color);">(Score Global: ${entryGlobalScore.toFixed(1)}/20)</span>
                </div>
                <div class="wheel-history-scores">`;

            entry.scores.forEach(currentScore => {
                entryHTML += `<span style="display: inline-block; min-width: 150px;">${currentScore.pillarName || 'Pilier inconnu'}: ${currentScore.average !== undefined ? currentScore.average.toFixed(1) : '-'}</span>`;

                // Calculate and display score difference vs previous entry
                if (prevEntry && prevEntry.scores && Array.isArray(prevEntry.scores)) {
                    const prevPillarScore = prevEntry.scores.find(ps => ps.pillarId === currentScore.pillarId);
                    if (prevPillarScore && prevPillarScore.average !== undefined && currentScore.average !== undefined) {
                        const diff = currentScore.average - prevPillarScore.average;
                        if (Math.abs(diff) > 0.05) { // Show diff only if significant
                            const diffClass = diff > 0 ? 'positive' : 'negative';
                            const diffSign = diff > 0 ? '+' : '';
                            entryHTML += ` <span class="wheel-score-diff ${diffClass}" title="vs ${prevPillarScore.average.toFixed(1)} le ${prevEntry.date || ''}">(${diffSign}${diff.toFixed(1)})</span>`;
                        }
                    }
                }
                entryHTML += '<br>'; // New line for next pillar score
            });
            entryHTML += '</div>';
            li.innerHTML = entryHTML;
            ul.appendChild(li);
        });

        this.dom.historyContent.appendChild(ul);
        this.dom.compareControls.style.display = 'block'; // Show compare button section
        this.updateCompareControls(); // Update compare button state

        // Show/hide scroll-to-bottom button based on content height
        if (this.dom.historyPopup && this.dom.historyScrollBtn) {
            // Use setTimeout to allow the browser to render the content first
            setTimeout(() => {
                if (document.getElementById('wheel-historyPopup')) { // Check if popup still exists
                    const isScrollable = this.dom.historyPopup.scrollHeight > this.dom.historyPopup.clientHeight;
                    this.dom.historyScrollBtn.style.display = isScrollable ? 'inline-block' : 'none';
                }
            }, 100); // 100ms delay might be enough
        }
    },

    /** Renders the mini trend graph in the history popup */
    renderMiniTrendGraph: function() {
        if (this.history.length < 2 || !this.dom.miniTrendGraphContainer) {
            if(this.dom.miniTrendGraphContainer) this.dom.miniTrendGraphContainer.innerHTML = '';
            return;
        }

        // Get the last N entries, reverse to show oldest first (left to right)
        const trendData = this.history.slice(0, this.MINI_TREND_COUNT).reverse();
        const scores = trendData.map(entry => {
            const entryAverages = entry.scores.map(s => s.average).filter(avg => !isNaN(avg));
            const globalAverage = entryAverages.length > 0 ? entryAverages.reduce((sum, avg) => sum + avg, 0) / entryAverages.length : 0;
            return globalAverage * 2; // Score out of 20
        });

        const maxValue = 20; // Max possible score
        let graphHTML = `
            <div class="wheel-mini-trend-graph">
                <h5>Tendance Globale Récente (/20)</h5>
                <div class="wheel-trend-bars">`;

        scores.forEach((score, index) => {
            const percentageHeight = maxValue > 0 ? Math.max(0, Math.min(100, (score / maxValue * 100))) : 0; // Ensure 0-100 range
            const dateLabel = trendData[index].date.split(',')[0]; // Get only the date part
            graphHTML += `
                <div class="wheel-trend-bar-item" title="${trendData[index].date}: ${score.toFixed(1)}/20">
                     <div class="wheel-bar-value">${score.toFixed(1)}</div>
                    <div class="wheel-trend-bar" style="height: ${percentageHeight}%;"></div>
                    <span class="wheel-trend-date-label">${dateLabel}</span>
                </div>`;
        });

        graphHTML += `</div></div>`;
        this.dom.miniTrendGraphContainer.innerHTML = graphHTML;
    },

    /** Scrolls the history popup content to the bottom buttons */
    historyScrollToBottom: function() {
        if (this.dom.historyPopup) {
            const buttonsContainer = this.dom.historyPopup.querySelector('.wheel-popup-buttons');
            if (buttonsContainer) {
                buttonsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                // Fallback: scroll the whole popup
                this.dom.historyPopup.scrollTo({ top: this.dom.historyPopup.scrollHeight, behavior: 'smooth' });
            }
        }
    },

    /** Updates the state (enabled/disabled) of the compare button based on selection */
    updateCompareControls: function() {
        const selectedCheckboxes = this.dom.historyContent?.querySelectorAll('.wheel-history-compare-checkbox:checked');
        const count = selectedCheckboxes ? selectedCheckboxes.length : 0;
        if (this.dom.compareBtn) {
             this.dom.compareBtn.disabled = count !== 2;
             this.dom.compareBtn.textContent = `Comparer (${count})`;
         }
    },

    /** Compares two selected history entries by rendering a comparison chart */
    compareSelectedEntries: function() {
        const selectedCheckboxes = this.dom.historyContent?.querySelectorAll('.wheel-history-compare-checkbox:checked');
        if (!selectedCheckboxes || selectedCheckboxes.length !== 2) {
            this.showNotification("Veuillez sélectionner exactement deux évaluations à comparer.");
            return;
        }

        const entryIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.entryId);
        const entriesToCompare = entryIds.map(id => this.history.find(entry => entry.id === id));

        if (entriesToCompare.some(entry => !entry || !entry.scores)) {
            this.showNotification("Erreur: Impossible de comparer les entrées sélectionnées (données manquantes).");
            console.error("Invalid entries selected for comparison (WheelApp):", entriesToCompare);
            return;
        }

        // Ensure pillar names are consistent for labels (use current pillar names)
        const currentPillarLabels = this.pillars.map(p => p.name);

        const comparisonDatasets = entriesToCompare.map(entry => {
            // Map historical scores to the current pillar structure/order
            const data = currentPillarLabels.map(label => {
                const currentPillar = this.pillars.find(p => p.name === label);
                if (!currentPillar) return 0; // Pillar might have been removed/renamed
                const historicalScore = entry.scores.find(s => s.pillarId === currentPillar.id);
                return historicalScore ? (historicalScore.average || 0) : 0; // Default to 0 if not found
            });
            return { label: `Éval. ${entry.date}`, data: data };
        });

        const comparisonChartData = { labels: currentPillarLabels, datasets: comparisonDatasets };

        this.closeModal('wheel-historyPopup');
        this.showChartView(); // Switch to chart view
        this.renderChart(comparisonChartData); // Render the comparison chart
        this.showNotification(`Comparaison des évaluations du ${entriesToCompare[0].date} et ${entriesToCompare[1].date}.`);
    },

    /** Renders the list of action keys in the corresponding popup */
    renderActionKeys: function() {
        if (!this.dom.actionKeysContent) return;
        this.dom.actionKeysContent.innerHTML = ''; // Clear previous
        const actions = [];

        // Iterate through history to find action keys
        this.history.forEach(entry => {
            if (!entry || !entry.scores) return;
            entry.scores.forEach(pillarScore => {
                if (!pillarScore.subPillars) return;
                pillarScore.subPillars.forEach(sp => {
                    if (sp.isAction && sp.note) { // Check if marked as action and has a note
                        actions.push({
                            date: entry.date,
                            pillarName: pillarScore.pillarName || 'Pilier inconnu',
                            subPillarName: sp.name || 'Sous-pilier inconnu',
                            note: sp.note,
                        });
                    }
                });
            });
        });

        // Sort actions by date (most recent first - history is already sorted)
        // actions.sort((a, b) => new Date(b.date) - new Date(a.date)); // Not needed if history is sorted

        if (actions.length === 0) {
            this.dom.actionKeysContent.innerHTML = `<p class='wheel-text-center'>Aucune action clé définie pour le moment.</p><p class='wheel-text-center' style="font-size: 0.9em;">Utilisez l'icône ${this.noteIconSVG} puis cochez la case "Marquer comme Action Clé".</p>`;
            return;
        }

        const ul = document.createElement('ul');
        actions.forEach(action => {
            const li = document.createElement('li');
            li.className = 'wheel-action-key-entry';
            li.innerHTML = `
                <strong>${action.pillarName} > ${action.subPillarName}</strong>
                <span style="font-size: 0.8em; color: var(--wheel-secondary-text-color); margin-left: 5px;">(${action.date})</span>
                <div class="wheel-action-key-note">${action.note.replace(/</g, "<").replace(/>/g, ">")}</div>
                `; // Basic sanitization for note display
            ul.appendChild(li);
        });
        this.dom.actionKeysContent.appendChild(ul);
    },

    /** Copies history data formatted for AI analysis to the clipboard */
    copyHistory: function() {
        if (this.history.length === 0) {
            this.showNotification("L'historique est vide, rien à copier.");
            return;
        }
        try {
            // Create a deep copy to avoid modifying original data if needed
            const historyForAI = JSON.parse(JSON.stringify(this.history));
            // Optional: Add current pillar structure for context?
            // const dataForAI = { currentPillars: this.pillars, history: historyForAI };
            const historyJson = JSON.stringify(historyForAI, null, 2); // Pretty print JSON

            const promptText = `Bonjour ! Voici mon historique d'évaluations de la Roue de la Vie, au format JSON. Chaque entrée représente une évaluation à une date donnée, avec les scores moyens par pilier et les détails (note, objectif, score, isAction) pour chaque sous-pilier.\n\nPeux-tu m'aider à analyser ces données pour :\n1. Identifier les tendances d'évolution (positives et négatives) dans les différents domaines de ma vie ?\n2. Repérer mes points forts et mes points faibles récurrents ?\n3. Mettre en évidence les "Actions Clés" (isAction: true) que j'ai notées et voir si elles ont eu un impact sur les scores suivants ?\n4. Me suggérer des pistes de réflexion ou d'action concrètes pour améliorer mon équilibre global et travailler sur les domaines les moins satisfaisants, en te basant sur mes notes et objectifs passés ?\n\nVoici les données :\n\n\`\`\`json\n${historyJson}\n\`\`\`\n\nMerci pour ton analyse et tes conseils !`;

            navigator.clipboard.writeText(promptText).then(() => {
                this.showNotification("Historique formaté et prompt pour IA copiés ! Collez dans votre IA préférée.", 5000);
            }).catch(err => {
                console.error("Erreur lors de la copie vers le presse-papiers (WheelApp) :", err);
                this.showNotification("Erreur : Impossible de copier. Vérifiez les permissions du navigateur ou copiez manuellement.", 4000);
            });
        } catch (error) {
            console.error("Erreur lors de la préparation des données pour la copie (WheelApp) :", error);
            this.showNotification("Erreur lors de la préparation des données pour la copie.", 4000);
        }
    },

    /** Exports all app data (pillars, history, premium status) as a JSON file */
    exportData: function() {
        if (!this.isPremium) {
            this.showNotification("La fonction d'exportation est réservée aux utilisateurs Premium.");
            return;
        }
        try {
            const dataToExport = {
                appVersion: "1.0", // Add versioning for future migrations
                exportTimestamp: new Date().toISOString(),
                premiumStatus: this.isPremium,
                pillars: this.pillars,
                history: this.history,
                // Add theme preference?
                // theme: localStorage.getItem('wheelOfLife_theme') || 'light'
            };
            const dataStr = JSON.stringify(dataToExport, null, 2); // Pretty print
            const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            const dateStr = new Date().toISOString().slice(0, 10);
            a.download = `roue_de_la_vie_export_${dateStr}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url); // Clean up the object URL
            document.body.removeChild(a);
            this.showNotification("Données exportées avec succès.");
        } catch (error) {
            console.error("Erreur lors de l'exportation JSON (WheelApp) :", error);
            this.showNotification("Erreur lors de la création du fichier d'exportation.", 4000);
        }
    },

    /** Handles the file input change event for importing data */
    handleImportFile: function(event) {
        if (!this.isPremium) {
            this.showNotification("La fonction d'importation est réservée aux utilisateurs Premium.");
            event.target.value = ''; // Clear the file input
            return;
        }

        const file = event.target.files[0];
        if (!file) {
            this.showNotification("Aucun fichier sélectionné.");
            return;
        }
        // Basic validation on file type
        if (!file.type.match('application/json')) {
            this.showNotification("Fichier invalide. Veuillez sélectionner un fichier JSON exporté depuis cette application.", 4000);
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => { // Use arrow function to keep 'this' context
            let importedData;
            try {
                importedData = JSON.parse(e.target.result);
                if (!importedData || typeof importedData !== 'object') {
                    throw new Error("Le contenu du fichier n'est pas un objet JSON valide.");
                }

                // Validate imported data structure (basic checks)
                const hasPillars = importedData.pillars && Array.isArray(importedData.pillars);
                const hasHistory = importedData.history && Array.isArray(importedData.history);
                const hasPremium = typeof importedData.premiumStatus === 'boolean';

                if (!hasPillars && !hasHistory) {
                     throw new Error("Le fichier JSON ne contient ni piliers ni historique valides.");
                 }

                if (!confirm("Importer ces données remplacera votre configuration et historique actuels de la Roue de la Vie. Êtes-vous sûr de vouloir continuer ?")) {
                    event.target.value = ''; // Clear input if cancelled
                    return;
                }

                // --- Apply Imported Data ---
                let pillarsToImport = this.getDefaultPillarsData(); // Start with defaults
                if (hasPillars) {
                    // Run migration on imported pillars
                     pillarsToImport = this.migrateDataStructure(importedData.pillars, this.getDefaultPillarsData());
                     this.pillars = pillarsToImport;
                    console.log("Imported pillars applied.");
                } else {
                    this.pillars = pillarsToImport; // Use defaults if none imported
                    this.showNotification("Piliers non trouvés dans l'import, utilisation des piliers par défaut.");
                }

                if (hasHistory) {
                    // Filter and sort imported history
                     this.history = importedData.history.filter(entry => entry && entry.id && entry.date && entry.timestamp && Array.isArray(entry.scores));
                     this.history.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                     console.log(`Imported ${this.history.length} history entries.`);
                } else {
                    this.history = []; // Clear history if none imported
                }

                 if (hasPremium) {
                    this.isPremium = importedData.premiumStatus;
                    this.savePremiumStatus();
                    this.updatePremiumUI();
                    console.log("Imported premium status applied:", this.isPremium);
                }
                 // Apply imported theme preference?
                 // if (importedData.theme) { ... }

                // --- Save and Refresh UI ---
                this.saveData(); // Save combined/imported data
                this.currentPillarIndex = 0; // Reset to first pillar
                this.renderPillar(); // Render the UI with new data
                this.showHistory(); // Update history display in the popup (if opened later)
                this.showInputView(); // Go back to input view after import
                this.showNotification("Données importées et appliquées avec succès.");

            } catch (err) {
                console.error("Erreur lors de l'importation JSON (WheelApp) :", err);
                this.showNotification(`Erreur d'importation: ${err.message}. Fichier invalide ou corrompu.`, 6000);
            } finally {
                // Always clear the file input after processing
                event.target.value = '';
            }
        };

        reader.onerror = () => {
            this.showNotification("Erreur lors de la lecture du fichier.", 4000);
            event.target.value = ''; // Clear input on error
        };

        reader.readAsText(file);
    },

    /** Resets all WheelApp data after confirmation */
    resetApp: function() {
        if (!confirm("ATTENTION : Êtes-vous absolument sûr de vouloir réinitialiser TOUTES les données de la Roue de la Vie (piliers, historique, notes, statut premium) ? Cette action est IRRÉVERSIBLE.")) {
            return;
        }

        console.log("Resetting WheelApp data...");
        // Clear data from localStorage
        localStorage.removeItem('wheelOfLife_pillars');
        localStorage.removeItem('wheelOfLife_history');
        localStorage.removeItem('wheelOfLife_premiumStatus');
        localStorage.removeItem('wheelOfLife_theme'); // Also reset theme
        localStorage.removeItem('wheelOfLife_welcomeDismissed'); // Show welcome again

        // Reset in-memory state
        this.pillars = this.getDefaultPillarsData(); // Get fresh defaults
        this.history = [];
        this.isPremium = false;
        this.currentPillarIndex = 0;
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }

        // Update UI
        this.updatePremiumUI();
        this.setupTheme(); // Re-setup theme (will check system preference now)
        this.renderPillar();
        this.showWelcomeView(); // Show welcome screen again after reset
        this.closeAllModals();
        this.showNotification("Application Roue de la Vie entièrement réinitialisée.", 4000);
        // No need to call saveData() as we just cleared localStorage
    },

    // --- Modal Management ---

    /**
     * Opens a specific modal popup.
     * @param {string} modalId - The ID of the modal element to open.
     */
    openModal: function(modalId) {
        this.closeAllModals(); // Close any other open modals first
        const modal = document.getElementById(modalId);
        if (!modal) {
             console.error(`Modal with ID ${modalId} not found (WheelApp).`);
             return;
        }

        // Prepare modal content if necessary
        if (modalId === 'wheel-historyPopup') {
            this.showHistory(); // Render history content when opening
        } else if (modalId === 'wheel-customizationPopup') {
             if (!this.isPremium) {
                 this.showNotification("La personnalisation est une fonctionnalité Premium.");
                 return; // Don't open if not premium
             }
            this.renderCustomizationForm(); // Render customization form
        } else if (modalId === 'wheel-actionKeysPopup') {
             this.renderActionKeys(); // Render action keys list
        }

        // Show overlay and modal
        if (this.dom.overlay) this.dom.overlay.classList.add('visible');
        modal.style.display = 'block'; // Use block display
        modal.setAttribute('aria-hidden', 'false');
        this.currentOpenModalId = modalId; // Track open modal

        // Focus the first focusable element in the modal
        const focusableElements = modal.querySelectorAll(
            'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 50); // Timeout helps ensure element is ready
        }
    },

    /** Closes a specific modal */
    closeModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal || modal.style.display === 'none') {
             return; // Already closed or doesn't exist
        }

        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        this.currentOpenModalId = null; // Clear tracked modal

        // Hide overlay only if no other modals are somehow open
        // (Shouldn't happen with closeAllModals in openModal, but safe check)
        const anyModalOpen = this.dom.appContainer?.querySelector('.wheel-popup[style*="display: block"]');
        if (!anyModalOpen && this.dom.overlay) {
            this.dom.overlay.classList.remove('visible');
        }

        // --- Restore Focus ---
        // Try to restore focus to the button that opened the modal (heuristic)
        let triggerButton = null;
         if (modalId === 'wheel-historyPopup' && this.dom.historyBtn) triggerButton = this.dom.historyBtn;
         else if (modalId === 'wheel-helpPopup' && this.dom.helpBtn) triggerButton = this.dom.helpBtn;
         else if (modalId === 'wheel-customizationPopup' && this.dom.personalizeBtn) triggerButton = this.dom.personalizeBtn;
         else if (modalId === 'wheel-actionKeysPopup' && this.dom.actionKeysBtn) triggerButton = this.dom.actionKeysBtn;
         // Add more specific triggers if needed (e.g., note button)

         if(triggerButton && document.body.contains(triggerButton)) { // Check if button still exists
            // triggerButton.focus();
         } else {
             // Fallback focus if trigger unknown or gone (e.g., return to nav)
             if (this.dom.inputView?.style.display !== 'none' && this.dom.nextBtn) {
                // this.dom.nextBtn.focus();
             } else if (this.dom.chartView?.style.display !== 'none' && this.dom.returnToInputBtn) {
                // this.dom.returnToInputBtn.focus();
             }
         }
    },

    /** Closes all currently open modals */
    closeAllModals: function() {
        this.dom.appContainer?.querySelectorAll('.wheel-popup').forEach(modal => {
            if (modal.style.display !== 'none') {
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
            }
        });
        if (this.dom.overlay) {
            this.dom.overlay.classList.remove('visible');
        }
        this.currentOpenModalId = null;
    },

    // --- Specific Popup Handling (Note, Customization) ---

    openNotePopup: function(pillarId, subPillarId) {
        const subPillar = this.findSubPillar(pillarId, subPillarId);
        if (!subPillar || !this.dom.notePopup || !this.dom.notePopupSubPillarName || !this.dom.notePopupTextarea || !this.dom.notePopupActionKeyCheckbox || !this.dom.saveNoteBtn) {
            console.error("Cannot open note popup (WheelApp): missing elements or invalid subpillar.");
            return;
        }

        this.dom.notePopupSubPillarName.textContent = subPillar.name;
        this.dom.notePopupTextarea.value = subPillar.note || '';
        this.dom.notePopupActionKeyCheckbox.checked = subPillar.isAction || false;

        // Store IDs on the save button for retrieval
        this.dom.saveNoteBtn.dataset.pillarId = pillarId;
        this.dom.saveNoteBtn.dataset.subPillarId = subPillarId;

        this.openModal('wheel-notePopup');
        this.dom.notePopupTextarea.focus(); // Focus the textarea
    },

    saveNoteFromPopup: function() {
        if (!this.dom.saveNoteBtn || !this.dom.notePopupTextarea || !this.dom.notePopupActionKeyCheckbox) return;

        const pillarId = this.dom.saveNoteBtn.dataset.pillarId;
        const subPillarId = this.dom.saveNoteBtn.dataset.subPillarId;
        const noteText = this.dom.notePopupTextarea.value;
        const isAction = this.dom.notePopupActionKeyCheckbox.checked;

        if (pillarId && subPillarId) {
            this.updateNote(pillarId, subPillarId, noteText, isAction);
            this.showNotification("Note sauvegardée.");
            this.closeModal('wheel-notePopup');
        } else {
             console.error("Cannot save note: Missing IDs (WheelApp).");
             this.showNotification("Erreur lors de la sauvegarde de la note.");
        }
    },

    renderCustomizationForm: function() {
        if (!this.dom.customizationContent) return;
        this.dom.customizationContent.innerHTML = ''; // Clear previous

        this.pillars.forEach((pillar) => {
            const pillarDiv = document.createElement('div');
            pillarDiv.className = 'wheel-customization-section';
            // Pillar name is not editable for now
            pillarDiv.innerHTML = `
                <h4>Pilier: ${pillar.name} (Non modifiable)</h4>
                <h5>Sous-Piliers:</h5>
            `;

            if (pillar.subPillars && pillar.subPillars.length > 0) {
                pillar.subPillars.forEach((subPillar) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'wheel-customization-item';
                    itemDiv.innerHTML = `
                        <input type="text" value="${subPillar.name}" data-pillar-id="${pillar.id}" data-subpillar-id="${subPillar.id}" placeholder="Nom du sous-pilier" aria-label="Nom du sous-pilier ${subPillar.name} pour le pilier ${pillar.name}">
                        <!-- Delete button (future feature)
                        <button class="wheel-icon-button wheel-danger-button" onclick="WheelApp.confirmDeleteSubPillar('${pillar.id}', '${subPillar.id}')" aria-label="Supprimer le sous-pilier ${subPillar.name}">
                            ${this.deleteIconSVG}
                        </button>
                        -->
                    `;
                    pillarDiv.appendChild(itemDiv);
                });
            } else {
                pillarDiv.innerHTML += "<p>Aucun sous-pilier.</p>";
            }
            this.dom.customizationContent.appendChild(pillarDiv);
        });
         this.dom.customizationContent.innerHTML += `<p style="font-size: 0.9em; color: var(--wheel-secondary-text-color); margin-top:10px;">La suppression/ajout de piliers/sous-piliers n'est pas encore supportée.</p>`;
    },

    saveCustomization: function() {
        if (!this.dom.customizationContent) return;
         let changed = false;
        const inputs = this.dom.customizationContent.querySelectorAll('input[type="text"][data-subpillar-id]');

        inputs.forEach(input => {
            const pillarId = input.dataset.pillarId;
            const subPillarId = input.dataset.subpillarId;
            const newName = input.value.trim();

            if (!pillarId || !subPillarId) return; // Skip if IDs missing

            const subPillar = this.findSubPillar(pillarId, subPillarId);
            if (subPillar && newName && subPillar.name !== newName) {
                subPillar.name = newName;
                changed = true;
            } else if (subPillar && !newName) {
                 input.value = subPillar.name; // Restore original name if empty
                 this.showNotification(`Le nom du sous-pilier ne peut pas être vide (${subPillar.name}).`);
             }
        });

        if (changed) {
            this.saveData(); // Save changes
            this.renderPillar(); // Re-render the current pillar view to reflect name changes
            this.showNotification("Personnalisation sauvegardée.");
        } else {
             this.showNotification("Aucune modification détectée.");
        }
        this.closeModal('wheel-customizationPopup');
    },

    // Placeholder for future delete functionality
    confirmDeleteSubPillar: function(pillarId, subPillarId) {
         this.showNotification("Fonctionnalité de suppression non implémentée.");
         /*
         const subPillar = this.findSubPillar(pillarId, subPillarId);
         if (!subPillar) return;
         if (!confirm(`Êtes-vous sûr de vouloir supprimer le sous-pilier "${subPillar.name}" ? Cette action est irréversible.`)) return;
         // Logic to remove subpillar from this.pillars[...].subPillars
         // this.saveData();
         // this.renderCustomizationForm();
         // this.renderPillar();
         // this.showNotification("Sous-pilier supprimé.");
         */
    },


    // --- Event Listeners Setup ---
    addEventListeners: function() {
        // Welcome Screen Button
        this.dom.startEvaluationBtn?.addEventListener('click', () => this.startEvaluation());

        // Lien Roue → Objectifs : bouton "Créer un objectif"
        if (this.dom.pillarDisplay) {
            this.dom.pillarDisplay.addEventListener('click', (e) => {
                const btn = e.target.closest('.wheel-create-goal-btn');
                if (btn) {
                    // Stocker l'info dans localStorage
                    const pillarId = btn.getAttribute('data-pillar-id');
                    const subPillarId = btn.getAttribute('data-subpillar-id');
                    const subPillarName = btn.getAttribute('data-subpillar-name');
                    localStorage.setItem('wheel_to_goal', JSON.stringify({
                        pillarId, subPillarId, subPillarName
                    }));
                    // Basculer sur l'onglet Objectifs
                    if (typeof MainApp !== 'undefined') {
                        MainApp.showMainApp();
                        MainApp.showApp('goals');
                    }
                }
            });
        }

        // Input View Buttons
        this.dom.prevBtn?.addEventListener('click', () => this.changePillar(-1));
        this.dom.nextBtn?.addEventListener('click', () => this.changePillar(1));
        this.dom.showChartBtn?.addEventListener('click', () => {
            if (this.saveToHistory()) { // Save first, then show chart
                this.showChartView();
                 this.showNotification("Évaluation sauvegardée.");
            }
        });
        this.dom.personalizeBtn?.addEventListener('click', () => this.openModal('wheel-customizationPopup'));
        this.dom.helpBtn?.addEventListener('click', () => this.openModal('wheel-helpPopup'));

        // Chart View Buttons
        this.dom.historyBtn?.addEventListener('click', () => this.openModal('wheel-historyPopup'));
        this.dom.returnToInputBtn?.addEventListener('click', () => this.showInputView());

        // Theme Toggle
        this.dom.themeCheckbox?.addEventListener('change', () => this.toggleTheme());

        // History Popup Buttons
        this.dom.historyScrollBtn?.addEventListener('click', () => this.historyScrollToBottom());
        this.dom.compareBtn?.addEventListener('click', () => this.compareSelectedEntries());
        this.dom.importBtn?.addEventListener('click', () => this.dom.importFileElement?.click()); // Trigger hidden file input
        this.dom.importFileElement?.addEventListener('change', (e) => this.handleImportFile(e));
        this.dom.exportBtn?.addEventListener('click', () => this.exportData());
        this.dom.actionKeysBtn?.addEventListener('click', () => this.openModal('wheel-actionKeysPopup'));
        this.dom.copyHistoryBtn?.addEventListener('click', () => this.copyHistory());
        this.dom.resetAppBtn?.addEventListener('click', () => this.resetApp());

        // Note Popup Button
        this.dom.saveNoteBtn?.addEventListener('click', () => this.saveNoteFromPopup());

        // Customization Popup Button
        this.dom.saveCustomizationBtn?.addEventListener('click', () => this.saveCustomization());

        // Keyboard Navigation for Pillars (Global listener, filtered)
        document.addEventListener('keydown', (e) => {
            // Only act if WheelApp is active and no modal is open and focus is not in input/textarea
            const isActive = this.dom.appContainer?.classList.contains('active');
            const isModalOpen = this.dom.overlay?.classList.contains('visible');
            const isInputFocused = document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'SELECT');
            const isInputViewVisible = this.dom.inputView?.style.display !== 'none';

            if (!isActive || isModalOpen || isInputFocused || !isInputViewVisible) {
                return;
            }

            if (e.key === 'ArrowLeft') {
                this.changePillar(-1);
                e.preventDefault(); // Prevent browser back navigation
            } else if (e.key === 'ArrowRight') {
                this.changePillar(1);
                e.preventDefault();
            }
        });

        // Keyboard Navigation for Sliders (Event delegation on the container)
        this.dom.inputView?.addEventListener('keydown', (e) => {
            if (e.target.type === 'range' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                const range = e.target;
                const step = e.key === 'ArrowLeft' ? -1 : 1;
                const newValue = Math.min(Math.max(parseInt(range.value) + step, 1), 10);
                if (newValue !== parseInt(range.value)) {
                    range.value = newValue;
                    // Dispatch input event to trigger updateScore
                    const event = new Event('input', { bubbles: true });
                    range.dispatchEvent(event);
                }
                e.preventDefault(); // Prevent page scroll
            }
        });

        // Long press for Premium (only if logo exists and welcome view shown)
        this.dom.appLogo?.addEventListener('mousedown', (e) => this.handleLogoPressStart(e));
        this.dom.appLogo?.addEventListener('touchstart', (e) => this.handleLogoPressStart(e), { passive: false }); // Need passive false to preventDefault
        this.dom.appLogo?.addEventListener('mouseup', () => this.handleLogoPressEnd());
        this.dom.appLogo?.addEventListener('mouseleave', () => this.handleLogoPressEnd());
        this.dom.appLogo?.addEventListener('touchend', () => this.handleLogoPressEnd());
        this.dom.appLogo?.addEventListener('touchcancel', () => this.handleLogoPressEnd());

        // Keyboard accessibility for modals (Escape key)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentOpenModalId) {
                 this.closeModal(this.currentOpenModalId);
             }
         });

        console.log("WheelApp event listeners added.");
    }

}); // End of Object.assign(WheelApp, { ... })

// Note: The WheelApp object should now be complete.
