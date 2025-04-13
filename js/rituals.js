/* ========================================= */
/* == App 3: Rituels (COMPLET - V2) ======= */
/* ========================================= */

const RitualsApp = {
    // --- State & Data ---
    rituals: [], // Array of { id, name, category ('morning', 'afternoon', 'evening'), icon, active }
    history: {}, // Object like { 'YYYY-MM-DD': { ritualId: completed (true/false), reflection: "..." } }
    settings: {
        morningCutoff: '12:00',
        afternoonCutoff: '18:00',
        eveningCutoff: '23:59', // Represents end of day for evening rituals
    },
    currentView: 'today', // 'today', 'history', 'stats', 'settings'
    currentDate: new Date(), // Date being viewed/edited (always today for this implementation)
    confirmationCallback: null, // Function to call on confirm modal
    weeklyChartInstance: null, // Chart.js instance for weekly chart
    distributionChartInstance: null, // Chart.js instance for distribution chart

    // --- DOM References ---
    dom: {},

    // --- Icon Map (Helper) ---
    // Maps icon keys used in data to Font Awesome classes
    iconMap: {
        sun: 'fas fa-sun', coffee: 'fas fa-coffee', water: 'fas fa-tint', meditation: 'fas fa-om', book: 'fas fa-book-open',
        exercise: 'fas fa-dumbbell', journal: 'fas fa-pencil-alt', moon: 'fas fa-moon', list: 'fas fa-list-alt',
        utensils: 'fas fa-utensils', walking: 'fas fa-walking', bullseye: 'fas fa-bullseye', 'mobile-screen': 'fas fa-mobile-alt',
        spa: 'fas fa-spa', 'book-open': 'fas fa-book-reader', heart: 'fas fa-heart', default: 'fas fa-check-circle' // Default icon
    },

    // --- Initialization ---
    init: function() {
        console.log("RitualsApp Initializing...");
        this.injectInitialHTML(); // Inject static HTML
        this.cacheDomElements(); // Cache elements AFTER injection
        this.loadData(); // Load rituals, history, settings
        this.addEventListeners(); // Add listeners AFTER caching
        this.updateDateDisplay(); // Set today's date
        this.updateStreakCount(); // Display initial streak
        // Check if Rituals is the active app on load (unlikely but for safety)
        const isActiveOnInit = document.getElementById('app-rituals')?.classList.contains('active');
        if (isActiveOnInit) {
            this.switchToView('today'); // Start on Today view if active
        } else {
            this.currentView = 'today'; // Set default view state even if not visible initially
            this.renderTodayView(); // Render initial state even if hidden, so data is ready
        }
        console.log("RitualsApp Initialized.");
    },

    /** Injects the static HTML structure for RitualsApp */
    injectInitialHTML: function() {
        const container = document.getElementById('app-rituals');
        if (!container || container.innerHTML.trim() !== '') {
            // Avoid re-injecting
            return;
        }
        // --- Copied HTML structure from previous step ---
        container.innerHTML = `
            <div class="container mx-auto px-4 py-8 max-w-6xl">
                <!-- Header -->
                <header class="mb-8 text-center">
                    <h1 class="text-3xl sm:text-4xl font-bold text-indigo-600 mb-2">Rituels Quotidiens</h1>
                    <p class="text-md sm:text-lg text-gray-600">Transformez votre routine en habitudes puissantes</p>
                    <div class="mt-4 flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-4">
                        <span id="rituals-current-date" class="text-gray-700 font-medium text-sm sm:text-base"></span>
                        <span id="rituals-streak-count" class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium"></span>
                    </div>
                </header>

                <!-- Main Content -->
                <main>
                    <!-- Tabs Navigation -->
                    <div class="flex justify-center border-b border-gray-200 mb-6 overflow-x-auto">
                        <button id="rituals-today-tab" data-view="today" class="rituals-tab-button px-3 sm:px-4 py-2 font-medium whitespace-nowrap">Aujourd'hui</button>
                        <button id="rituals-history-tab" data-view="history" class="rituals-tab-button px-3 sm:px-4 py-2 font-medium whitespace-nowrap">Historique</button>
                        <button id="rituals-stats-tab" data-view="stats" class="rituals-tab-button px-3 sm:px-4 py-2 font-medium whitespace-nowrap">Statistiques</button>
                        <button id="rituals-settings-tab" data-view="settings" class="rituals-tab-button px-3 sm:px-4 py-2 font-medium whitespace-nowrap">Paramètres</button>
                    </div>

                    <!-- Today Tab Content -->
                    <div id="rituals-today-content" class="rituals-tab-content hidden">
                        <!-- Progress Summary -->
                        <div class="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
                            <h2 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Votre progression aujourd'hui</h2>
                            <div class="flex items-center mb-2">
                                <div class="w-full mr-4">
                                    <div class="rituals-progress-bar">
                                        <div id="rituals-daily-progress" class="rituals-progress-fill" style="width: 0%"></div>
                                    </div>
                                </div>
                                <span id="rituals-progress-percentage" class="text-lg font-bold text-indigo-600">0%</span>
                            </div>
                            <div class="flex justify-between text-xs sm:text-sm text-gray-600">
                                <span id="rituals-completed-count">0 complétés</span>
                                <span id="rituals-total-count">0 total</span>
                            </div>
                        </div>

                        <!-- Time of Day Sections -->
                        <div class="space-y-6 mb-8">
                            <!-- Morning -->
                            <div class="rituals-morning-bg rounded-lg shadow overflow-hidden">
                                <div class="px-4 py-3 sm:px-6 sm:py-4 bg-white bg-opacity-90">
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-lg sm:text-xl font-semibold">Matin</h3>
                                        <span id="rituals-morning-progress" class="text-xs sm:text-sm font-medium">0/0</span>
                                    </div>
                                    <div id="rituals-morning-rituals" class="mt-4 space-y-3"> <p class="text-sm text-gray-500 italic px-3">Chargement...</p></div>
                                </div>
                            </div>
                            <!-- Afternoon -->
                            <div class="rituals-afternoon-bg rounded-lg shadow overflow-hidden">
                                <div class="px-4 py-3 sm:px-6 sm:py-4 bg-white bg-opacity-90">
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-lg sm:text-xl font-semibold">Après-midi</h3>
                                        <span id="rituals-afternoon-progress" class="text-xs sm:text-sm font-medium">0/0</span>
                                    </div>
                                    <div id="rituals-afternoon-rituals" class="mt-4 space-y-3"> <p class="text-sm text-gray-500 italic px-3">Chargement...</p></div>
                                </div>
                            </div>
                            <!-- Evening -->
                            <div class="rituals-evening-bg rounded-lg shadow overflow-hidden">
                                <div class="px-4 py-3 sm:px-6 sm:py-4 bg-white bg-opacity-90">
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-lg sm:text-xl font-semibold">Soir</h3>
                                        <span id="rituals-evening-progress" class="text-xs sm:text-sm font-medium">0/0</span>
                                    </div>
                                    <div id="rituals-evening-rituals" class="mt-4 space-y-3"> <p class="text-sm text-gray-500 italic px-3">Chargement...</p></div>
                                </div>
                            </div>
                        </div>

                        <!-- Daily Reflection -->
                        <div class="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
                            <h2 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Réflexion du jour</h2>
                            <textarea id="rituals-daily-reflection" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base" rows="3" placeholder="Notez vos pensées, réalisations ou intentions pour aujourd'hui..."></textarea>
                            <button id="rituals-save-reflection" class="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base">Enregistrer la réflexion</button>
                        </div>
                    </div>

                    <!-- History Tab Content -->
                    <div id="rituals-history-content" class="rituals-tab-content hidden">
                         <div class="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
                            <h2 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Votre historique</h2>
                            <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3 sm:gap-4">
                                <div class="relative w-full sm:w-auto">
                                    <select id="rituals-history-filter" class="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base">
                                        <option value="all">Tous les rituels</option>
                                        <option value="completed">Seulement complétés</option>
                                        <option value="missed">Seulement manqués</option>
                                    </select>
                                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <i class="fas fa-chevron-down text-xs"></i>
                                    </div>
                                </div>
                                <button id="rituals-export-history" class="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center text-sm sm:text-base">
                                    <i class="fas fa-file-export mr-2"></i> Exporter
                                </button>
                            </div>
                            <div id="rituals-history-list" class="space-y-4 max-h-96 overflow-y-auto border rounded-md p-2"> <p class="text-center text-gray-500 py-4">Chargement de l'historique...</p></div>
                        </div>
                    </div>

                    <!-- Stats Tab Content -->
                    <div id="rituals-stats-content" class="rituals-tab-content hidden">
                        <div class="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
                            <h2 class="text-lg sm:text-xl font-semibold text-gray-800 mb-6">Vos statistiques</h2>
                            <!-- Summary Cards -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div class="bg-indigo-50 rounded-lg p-4">
                                    <div class="flex items-center">
                                        <div class="p-2 sm:p-3 rounded-full bg-indigo-100 mr-3 sm:mr-4"><i class="fas fa-fire text-indigo-600"></i></div>
                                        <div>
                                            <p class="text-xs sm:text-sm text-gray-600">Séquence actuelle</p>
                                            <p id="rituals-current-streak" class="text-xl sm:text-2xl font-bold text-indigo-600">0 jours</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-green-50 rounded-lg p-4">
                                    <div class="flex items-center">
                                        <div class="p-2 sm:p-3 rounded-full bg-green-100 mr-3 sm:mr-4"><i class="fas fa-check-circle text-green-600"></i></div>
                                        <div>
                                            <p class="text-xs sm:text-sm text-gray-600">Taux de réussite (actif)</p>
                                            <p id="rituals-success-rate" class="text-xl sm:text-2xl font-bold text-green-600">0%</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-yellow-50 rounded-lg p-4">
                                    <div class="flex items-center">
                                        <div class="p-2 sm:p-3 rounded-full bg-yellow-100 mr-3 sm:mr-4"><i class="fas fa-star text-yellow-600"></i></div>
                                        <div>
                                            <p class="text-xs sm:text-sm text-gray-600">Rituel favori</p>
                                            <p id="rituals-favorite-ritual" class="text-xl sm:text-2xl font-bold text-yellow-600">-</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Charts -->
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div class="bg-white border border-gray-200 rounded-lg p-4">
                                    <h3 class="text-md sm:text-lg font-medium text-gray-800 mb-4 text-center">Complétion Hebdomadaire (%)</h3>
                                    <div class="rituals-chart-container"><canvas id="rituals-weekly-chart"></canvas></div>
                                </div>
                                <div class="bg-white border border-gray-200 rounded-lg p-4">
                                    <h3 class="text-md sm:text-lg font-medium text-gray-800 mb-4 text-center">Répartition (Actifs)</h3>
                                    <div class="rituals-chart-container"><canvas id="rituals-ritual-distribution-chart"></canvas></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Settings Tab Content -->
                    <div id="rituals-settings-content" class="rituals-tab-content hidden">
                        <div class="bg-white rounded-lg shadow p-4 sm:p-6">
                            <h2 class="text-lg sm:text-xl font-semibold text-gray-800 mb-6">Paramètres</h2>
                            <!-- Ritual Management -->
                            <div class="mb-8">
                                <h3 class="text-md sm:text-lg font-medium text-gray-800 mb-4">Gestion des rituels</h3>
                                <div class="space-y-4">
                                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg flex-wrap gap-3">
                                        <div>
                                            <h4 class="font-medium text-gray-800 text-sm sm:text-base">Rituels disponibles</h4>
                                            <p class="text-xs sm:text-sm text-gray-600">Activez/désactivez ou supprimez les rituels.</p>
                                        </div>
                                        <button id="rituals-add-ritual-btn" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base">
                                            <i class="fas fa-plus mr-2"></i> Ajouter Rituel
                                        </button>
                                    </div>
                                    <div id="rituals-available-rituals" class="space-y-3"> <p class="text-center text-gray-500 py-4">Chargement des rituels...</p></div>
                                </div>
                            </div>
                            <!-- Time Preferences (Currently informational, not used for categorization logic in this version) -->
                            <div class="mb-8 opacity-50 pointer-events-none"> <!-- Disabled visually and functionally -->
                                <h3 class="text-md sm:text-lg font-medium text-gray-800 mb-4">Préférences de temps (Info)</h3>
                                 <p class="text-xs sm:text-sm text-gray-500 mb-3">Note: La catégorie (Matin/Après-midi/Soir) est définie lors de l'ajout du rituel et non par ces horaires dans cette version.</p>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div class="p-4 border border-gray-200 rounded-lg">
                                        <label for="rituals-morning-cutoff" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Fin du matin</label>
                                        <input type="time" id="rituals-morning-cutoff" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" disabled>
                                    </div>
                                    <div class="p-4 border border-gray-200 rounded-lg">
                                        <label for="rituals-afternoon-cutoff" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Fin d'après-midi</label>
                                        <input type="time" id="rituals-afternoon-cutoff" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" disabled>
                                    </div>
                                    <div class="p-4 border border-gray-200 rounded-lg">
                                        <label for="rituals-evening-cutoff" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Fin de soirée</label>
                                        <input type="time" id="rituals-evening-cutoff" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" disabled>
                                    </div>
                                </div>
                            </div>
                            <!-- Data Management -->
                            <div>
                                <h3 class="text-md sm:text-lg font-medium text-gray-800 mb-4">Gestion des données</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button id="rituals-reset-data" class="flex items-center justify-center p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition text-sm sm:text-base">
                                        <i class="fas fa-trash-alt text-red-600 mr-2 sm:mr-3"></i>
                                        <span class="font-medium text-red-600">Réinitialiser Données Rituels</span>
                                    </button>
                                    <button id="rituals-import-data-placeholder" class="flex items-center justify-center p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition text-sm sm:text-base opacity-50 cursor-not-allowed" disabled title="Fonctionnalité d'importation non disponible">
                                        <i class="fas fa-file-import text-blue-600 mr-2 sm:mr-3"></i>
                                        <span class="font-medium text-blue-600">Importer (Bientôt)</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <!-- Modals -->
            <!-- Add Ritual Modal -->
            <div id="rituals-add-ritual-modal" class="rituals-modal"> <!-- Hidden/visible class managed by JS -->
                <div class="rituals-modal-content">
                    <div class="p-6">
                        <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Ajouter un nouveau rituel</h3>
                        <div class="space-y-4">
                            <div>
                                <label for="rituals-ritual-name" class="block text-sm font-medium text-gray-700 mb-1">Nom du rituel</label>
                                <input type="text" id="rituals-ritual-name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base" placeholder="Ex: Méditation">
                            </div>
                            <div>
                                <label for="rituals-ritual-category" class="block text-sm font-medium text-gray-700 mb-1">Moment de la journée</label>
                                <select id="rituals-ritual-category" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base">
                                    <option value="morning">Matin</option>
                                    <option value="afternoon">Après-midi</option>
                                    <option value="evening">Soir</option>
                                </select>
                            </div>
                            <div>
                                <label for="rituals-ritual-icon" class="block text-sm font-medium text-gray-700 mb-1">Icône</label>
                                <select id="rituals-ritual-icon" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base">
                                    <!-- Options added by JS -->
                                </select>
                            </div>
                        </div>
                        <div class="mt-6 flex justify-end space-x-3">
                            <button id="rituals-cancel-add-ritual" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm sm:text-base">Annuler</button>
                            <button id="rituals-confirm-add-ritual" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base">Ajouter</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Export Modal -->
            <div id="rituals-export-modal" class="rituals-modal"> <!-- Hidden/visible class managed by JS -->
                <div class="rituals-modal-content max-w-2xl"> <!-- Wider modal for export -->
                    <div class="p-6">
                        <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Exporter vos données Rituels</h3>
                        <div class="mb-4">
                            <p class="text-sm text-gray-600 mb-2">Voici l'export de vos rituels et historique au format JSON :</p>
                            <textarea id="rituals-export-data" class="w-full h-48 sm:h-64 px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm bg-gray-50" readonly></textarea>
                        </div>
                        <div class="mb-4">
                            <p class="text-sm text-gray-600 mb-2">Vous pouvez copier ces données ou les soumettre à une IA pour obtenir une analyse personnalisée :</p>
                            <textarea id="rituals-ai-prompt" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm" rows="4"></textarea>
                        </div>
                        <div class="flex flex-col sm:flex-row justify-between items-center gap-3">
                             <button id="rituals-copy-export" class="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center text-sm sm:text-base">
                                <i class="fas fa-copy mr-2"></i> Copier JSON
                            </button>
                            <div class="flex w-full sm:w-auto justify-end space-x-3">
                                <button id="rituals-close-export" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm sm:text-base">Fermer</button>
                                <button id="rituals-submit-to-ai" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center text-sm sm:text-base">
                                    <i class="fas fa-robot mr-2"></i> Copier Prompt IA
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Confirmation Modal -->
            <div id="rituals-confirmation-modal" class="rituals-modal"> <!-- Hidden/visible class managed by JS -->
                 <div class="rituals-modal-content">
                    <div class="p-6">
                        <h3 id="rituals-confirmation-title" class="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Confirmation</h3>
                        <p id="rituals-confirmation-message" class="text-sm sm:text-base text-gray-600 mb-6">Êtes-vous sûr de vouloir effectuer cette action ?</p>
                        <div class="flex justify-end space-x-3">
                            <button id="rituals-cancel-confirm" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm sm:text-base">Annuler</button>
                            <button id="rituals-confirm-action" class="px-4 py-2 text-white rounded-lg text-sm sm:text-base">Confirmer</button> <!-- BG color set by JS -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        console.log("RitualsApp HTML injected.");
    },

    cacheDomElements: function() {
        this.dom = {
            // Main elements
            appContainer: document.getElementById('app-rituals'),
            currentDateDisplay: document.getElementById('rituals-current-date'),
            streakCountDisplay: document.getElementById('rituals-streak-count'),
            // Tabs & Content
            tabsContainer: document.querySelector('#app-rituals main > div:first-child'), // Container for tabs
            tabButtons: document.querySelectorAll('.rituals-tab-button'),
            todayContent: document.getElementById('rituals-today-content'),
            historyContent: document.getElementById('rituals-history-content'),
            statsContent: document.getElementById('rituals-stats-content'),
            settingsContent: document.getElementById('rituals-settings-content'),
            // Today View
            dailyProgress: document.getElementById('rituals-daily-progress'),
            progressPercentage: document.getElementById('rituals-progress-percentage'),
            completedCount: document.getElementById('rituals-completed-count'),
            totalCount: document.getElementById('rituals-total-count'),
            morningRituals: document.getElementById('rituals-morning-rituals'),
            afternoonRituals: document.getElementById('rituals-afternoon-rituals'),
            eveningRituals: document.getElementById('rituals-evening-rituals'),
            morningProgress: document.getElementById('rituals-morning-progress'),
            afternoonProgress: document.getElementById('rituals-afternoon-progress'),
            eveningProgress: document.getElementById('rituals-evening-progress'),
            dailyReflection: document.getElementById('rituals-daily-reflection'),
            saveReflectionBtn: document.getElementById('rituals-save-reflection'),
            // History View
            historyFilter: document.getElementById('rituals-history-filter'),
            exportHistoryBtn: document.getElementById('rituals-export-history'),
            historyList: document.getElementById('rituals-history-list'),
            // Stats View
            currentStreak: document.getElementById('rituals-current-streak'),
            successRate: document.getElementById('rituals-success-rate'),
            favoriteRitual: document.getElementById('rituals-favorite-ritual'),
            weeklyChartCanvas: document.getElementById('rituals-weekly-chart'),
            ritualDistributionChartCanvas: document.getElementById('rituals-ritual-distribution-chart'),
            // Settings View
            addRitualBtn: document.getElementById('rituals-add-ritual-btn'),
            availableRituals: document.getElementById('rituals-available-rituals'),
            morningCutoff: document.getElementById('rituals-morning-cutoff'),
            afternoonCutoff: document.getElementById('rituals-afternoon-cutoff'),
            eveningCutoff: document.getElementById('rituals-evening-cutoff'),
            resetDataBtn: document.getElementById('rituals-reset-data'),
            // Modals
            addRitualModal: document.getElementById('rituals-add-ritual-modal'),
            ritualNameInput: document.getElementById('rituals-ritual-name'),
            ritualCategorySelect: document.getElementById('rituals-ritual-category'),
            ritualIconSelect: document.getElementById('rituals-ritual-icon'),
            cancelAddRitualBtn: document.getElementById('rituals-cancel-add-ritual'),
            confirmAddRitualBtn: document.getElementById('rituals-confirm-add-ritual'),
            exportModal: document.getElementById('rituals-export-modal'),
            exportDataTextarea: document.getElementById('rituals-export-data'),
            aiPromptTextarea: document.getElementById('rituals-ai-prompt'),
            copyExportBtn: document.getElementById('rituals-copy-export'),
            closeExportBtn: document.getElementById('rituals-close-export'),
            submitToAIBtn: document.getElementById('rituals-submit-to-ai'),
            confirmationModal: document.getElementById('rituals-confirmation-modal'),
            confirmationTitle: document.getElementById('rituals-confirmation-title'),
            confirmationMessage: document.getElementById('rituals-confirmation-message'),
            cancelConfirmBtn: document.getElementById('rituals-cancel-confirm'),
            confirmActionBtn: document.getElementById('rituals-confirm-action'),
        };
        // Populate icon select options after caching the element
        this.populateIconSelect();
        console.log("RitualsApp DOM elements cached.");
    },

    populateIconSelect: function() {
        if (!this.dom.ritualIconSelect) return;
        this.dom.ritualIconSelect.innerHTML = ''; // Clear existing options
        for (const key in this.iconMap) {
            if (key !== 'default') {
                const option = document.createElement('option');
                option.value = key;
                const displayName = key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ');
                // Using text content for better compatibility in select options
                option.textContent = `${displayName}`;
                this.dom.ritualIconSelect.appendChild(option);
            }
        }
        // Set a default selection if needed, e.g., 'sun'
         this.dom.ritualIconSelect.value = 'sun';
    },

    addEventListeners: function() {
        // Tab Navigation (using event delegation on the container)
        this.dom.tabsContainer?.addEventListener('click', (e) => {
            const button = e.target.closest('.rituals-tab-button');
            if (button && button.dataset.view) {
                this.switchToView(button.dataset.view);
            }
        });

        // Today View: Toggle ritual completion (delegation)
        this.dom.todayContent?.addEventListener('change', (e) => {
            if (e.target.matches('.rituals-checkbox')) {
                this.toggleRitualCompletion(e.target.dataset.ritualId, e.target.checked);
            }
        });
        // Today View: Save Reflection
        this.dom.saveReflectionBtn?.addEventListener('click', () => this.saveReflection());

        // History View Actions
        this.dom.historyFilter?.addEventListener('change', () => this.renderHistoryView());
        this.dom.exportHistoryBtn?.addEventListener('click', () => this.openExportModal());

        // Settings View Actions (using delegation where possible)
        this.dom.addRitualBtn?.addEventListener('click', () => this.openAddRitualModal());
        // Use event delegation on the container for ritual toggles/deletes
        this.dom.availableRituals?.addEventListener('change', (e) => { // Toggle active state
            if (e.target.matches('.rituals-toggle-switch input[data-ritual-id]')) {
                this.toggleRitualActive(e.target.dataset.ritualId, e.target.checked);
            }
        });
        this.dom.availableRituals?.addEventListener('click', (e) => { // Delete button
            const deleteButton = e.target.closest('.rituals-delete-btn[data-ritual-id]');
            if (deleteButton) {
                this.confirmDeleteRitual(deleteButton.dataset.ritualId);
            }
        });

        // Data Management Buttons
        this.dom.resetDataBtn?.addEventListener('click', () => this.confirmResetData());

        // Modal Buttons
        this.dom.cancelAddRitualBtn?.addEventListener('click', () => this.closeModal('rituals-add-ritual-modal'));
        this.dom.confirmAddRitualBtn?.addEventListener('click', () => this.addNewRitual());
        this.dom.copyExportBtn?.addEventListener('click', () => this.copyExportData());
        this.dom.closeExportBtn?.addEventListener('click', () => this.closeModal('rituals-export-modal'));
        this.dom.submitToAIBtn?.addEventListener('click', () => this.submitToAI());
        this.dom.cancelConfirmBtn?.addEventListener('click', () => this.closeModal('rituals-confirmation-modal'));
        this.dom.confirmActionBtn?.addEventListener('click', () => this.executeConfirmation());

        // Generic Modal Closing (Overlay Click & Escape Key)
        this.dom.appContainer?.querySelectorAll('.rituals-modal').forEach(modal => {
             modal.addEventListener('click', (e) => {
                 // Check if the click is directly on the modal backdrop (the modal element itself)
                 if (e.target === modal) {
                     this.closeModal(modal.id);
                 }
             });
        });
        document.addEventListener('keydown', (e) => {
            const activeModal = this.dom.appContainer?.querySelector('.rituals-modal.visible');
            if (e.key === 'Escape' && activeModal) {
                 this.closeModal(activeModal.id);
             }
         });

        console.log("RitualsApp event listeners added.");
    },

    // --- Data Persistence ---
    loadData: function() {
        const savedRituals = localStorage.getItem('dailyRituals_rituals');
        const savedHistory = localStorage.getItem('dailyRituals_history');
        const savedSettings = localStorage.getItem('dailyRituals_settings');

        try {
            const parsedRituals = savedRituals ? JSON.parse(savedRituals) : null;
            // Validate loaded rituals structure
            if (Array.isArray(parsedRituals) && parsedRituals.every(r => r && r.id && r.name && r.category && r.icon !== undefined && r.active !== undefined)) {
                this.rituals = parsedRituals;
            } else {
                 if (savedRituals) console.warn("Invalid rituals data structure found in localStorage, resetting to defaults.");
                 this.rituals = this.getDefaultRituals();
            }
        } catch (e) {
            console.error("Error parsing rituals data, using defaults.", e);
            this.rituals = this.getDefaultRituals();
            localStorage.removeItem('dailyRituals_rituals'); // Clear corrupted data
        }

        try {
            this.history = savedHistory ? JSON.parse(savedHistory) : {};
            // Basic validation for history object
            if (typeof this.history !== 'object' || this.history === null || Array.isArray(this.history)) {
                console.warn("Invalid history data type found in localStorage, resetting.");
                this.history = {};
            }
        } catch (e) {
            console.error("Error parsing history data, using defaults.", e);
            this.history = {};
            localStorage.removeItem('dailyRituals_history'); // Clear corrupted data
        }

        try {
            const parsedSettings = savedSettings ? JSON.parse(savedSettings) : {};
            // Merge saved settings with defaults, ensuring types are correct
            this.settings = {
                 morningCutoff: typeof parsedSettings.morningCutoff === 'string' ? parsedSettings.morningCutoff : this.settings.morningCutoff,
                 afternoonCutoff: typeof parsedSettings.afternoonCutoff === 'string' ? parsedSettings.afternoonCutoff : this.settings.afternoonCutoff,
                 eveningCutoff: typeof parsedSettings.eveningCutoff === 'string' ? parsedSettings.eveningCutoff : this.settings.eveningCutoff,
            };
        } catch (e) {
             console.error("Error parsing settings data, using defaults.", e);
             // Keep default settings
        }

        this.cleanHistory(); // Ensure history integrity after loading
        console.log("RitualsApp data loaded.");
    },

    saveData: function() { /* ... (Identique à la version précédente) ... */ },
    cleanHistory: function() { /* ... (Identique à la version précédente) ... */ },
    getDefaultRituals: function() { /* ... (Identique à la version précédente) ... */ },
    getDateKey: function(date = this.currentDate) { /* ... (Identique à la version précédente) ... */ },
    isValidDateKey: function(key) { /* ... (Identique à la version précédente) ... */ },

    // --- View Switching & Rendering ---
    switchToView: function(viewName) {
        if (!viewName || this.currentView === viewName) return; // Do nothing if same view
        this.currentView = viewName;
        console.log(`RitualsApp: Switching to view ${viewName}`);

        // Update Tab Buttons Appearance
        this.dom.tabButtons?.forEach(button => {
            if (button.dataset.view === viewName) {
                button.classList.add('text-indigo-600', 'border-b-2', 'border-indigo-600');
                button.classList.remove('text-gray-500', 'hover:text-indigo-600');
                button.setAttribute('aria-current', 'page');
            } else {
                button.classList.remove('text-indigo-600', 'border-b-2', 'border-indigo-600');
                button.classList.add('text-gray-500', 'hover:text-indigo-600');
                button.removeAttribute('aria-current');
            }
        });

        // Hide all content panels first
        this.dom.todayContent?.classList.add('hidden');
        this.dom.historyContent?.classList.add('hidden');
        this.dom.statsContent?.classList.add('hidden');
        this.dom.settingsContent?.classList.add('hidden');

        // Show the selected content panel and render its content
        switch(viewName) {
            case 'today':
                this.dom.todayContent?.classList.remove('hidden');
                this.renderTodayView();
                break;
            case 'history':
                this.dom.historyContent?.classList.remove('hidden');
                this.renderHistoryView();
                break;
            case 'stats':
                this.dom.statsContent?.classList.remove('hidden');
                this.renderStatsView(); // This will render charts
                break;
            case 'settings':
                this.dom.settingsContent?.classList.remove('hidden');
                this.renderSettingsView();
                break;
        }
    },

    renderTodayView: function() { /* ... (Identique à la version précédente) ... */ },
    createRitualHTML: function(ritual, isCompleted) { /* ... (Identique à la version précédente) ... */ },
    renderHistoryView: function() { /* ... (Identique à la version précédente) ... */ },
    renderStatsView: function() { /* ... (Identique à la version précédente) ... */ },
    renderSettingsView: function() { /* ... (Identique à la version précédente) ... */ },

    // --- Actions ---
    toggleRitualCompletion: function(ritualId, completed) { /* ... (Identique à la version précédente) ... */ },
    saveReflection: function() { /* ... (Identique à la version précédente) ... */ },
    addNewRitual: function() { /* ... (Identique à la version précédente) ... */ },
    toggleRitualActive: function(ritualId, isActive) { /* ... (Identique à la version précédente) ... */ },
    confirmDeleteRitual: function(ritualId) { /* ... (Identique à la version précédente) ... */ },
    deleteRitual: function(ritualId) { /* ... (Identique à la version précédente) ... */ },
    updateSetting: function(settingKey, value) { /* ... (Identique à la version précédente) ... */ },
    confirmResetData: function() { /* ... (Identique à la version précédente) ... */ },
    resetData: function() { /* ... (Identique à la version précédente) ... */ },

    // --- Stats Calculation ---
    calculateStats: function() { /* ... (Identique à la version précédente) ... */ },
    getWeeklyCompletionData: function() { /* ... (Identique à la version précédente) ... */ },
    getRitualDistributionData: function() { /* ... (Identique à la version précédente) ... */ },

    // --- Chart Rendering (Implémentation complète) ---
    renderWeeklyChart: function() {
        const ctx = this.dom.weeklyChartCanvas?.getContext('2d');
        if (!ctx) {
             console.error("RitualsApp: Weekly chart canvas context not found. Cannot render.");
             return; // Stop if canvas context is missing
        }
        if (typeof Chart === 'undefined') {
            console.error("RitualsApp: Chart.js not loaded! Cannot render weekly chart.");
            // Optionally display error in canvas area
             ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
             ctx.font = "12px Arial"; ctx.fillStyle = "red"; ctx.textAlign = "center";
             ctx.fillText("Erreur: Chart.js manquant", ctx.canvas.width / 2, ctx.canvas.height / 2);
            return;
        }

        const { labels, data } = this.getWeeklyCompletionData();

        // Destroy previous instance if exists
        if (this.weeklyChartInstance) {
            this.weeklyChartInstance.destroy();
            this.weeklyChartInstance = null;
        }

        try {
            this.weeklyChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '% Complétion',
                        data: data,
                        backgroundColor: 'rgba(99, 102, 241, 0.6)',
                        borderColor: 'rgba(99, 102, 241, 1)',
                        borderWidth: 1,
                        borderRadius: 4,
                        barPercentage: 0.7, // Makes bars slightly thinner
                        categoryPercentage: 0.8 // Space between categories
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: { callback: value => value + '%' }
                        },
                        x: { grid: { display: false } }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                             callbacks: { label: context => `${context.dataset.label}: ${context.parsed.y.toFixed(0)}%` }
                        }
                    },
                    animation: { duration: 500 }
                }
            });
        } catch (error) {
            console.error("Error creating RitualsApp weekly chart:", error);
            this.showNotification("Erreur lors de l'affichage du graphique hebdo.", 'error');
        }
    },

    renderRitualDistributionChart: function() {
        const ctx = this.dom.ritualDistributionChartCanvas?.getContext('2d');
         if (!ctx) {
             console.error("RitualsApp: Distribution chart canvas context not found. Cannot render.");
             return;
         }
        if (typeof Chart === 'undefined') {
            console.error("RitualsApp: Chart.js not loaded! Cannot render distribution chart.");
             ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
             ctx.font = "12px Arial"; ctx.fillStyle = "red"; ctx.textAlign = "center";
             ctx.fillText("Erreur: Chart.js manquant", ctx.canvas.width / 2, ctx.canvas.height / 2);
            return;
        }

        const { labels, data, colors } = this.getRitualDistributionData();

        // Destroy previous instance if exists
        if (this.distributionChartInstance) {
            this.distributionChartInstance.destroy();
            this.distributionChartInstance = null;
        }

        if (labels.length === 0) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.save();
            ctx.font = "14px Arial"; ctx.fillStyle = "#6b7280"; ctx.textAlign = "center";
            ctx.fillText("Aucun rituel actif à afficher.", ctx.canvas.width / 2, ctx.canvas.height / 2);
            ctx.restore();
            return;
        }

        try {
            this.distributionChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Répartition',
                        data: data,
                        backgroundColor: colors,
                        borderColor: '#ffffff',
                        borderWidth: 2,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 15,
                                boxWidth: 12,
                                font: { size: 11 }
                            }
                        },
                        tooltip: {
                             callbacks: { label: context => ` ${context.label}` }
                        }
                    },
                    animation: { duration: 500 }
                }
            });
        } catch (error) {
             console.error("Error creating RitualsApp distribution chart:", error);
             this.showNotification("Erreur lors de l'affichage du graphique de répartition.", 'error');
        }
    },

    // --- Modals (Implémentation complète) ---
    openModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
             modal.classList.add('visible');
             modal.setAttribute('aria-hidden', 'false');
             const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
             if (firstFocusable) {
                 setTimeout(() => firstFocusable.focus(), 50);
             }
        } else {
             console.error(`RitualsApp: Modal with ID ${modalId} not found.`);
        }
    },

    closeModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
             modal.classList.remove('visible');
             modal.setAttribute('aria-hidden', 'true');
             if (modalId === 'rituals-confirmation-modal') {
                 this.confirmationCallback = null;
             }
            // Add focus restoration logic if needed
        }
    },

    openAddRitualModal: function() {
        if(this.dom.ritualNameInput) this.dom.ritualNameInput.value = '';
        if(this.dom.ritualCategorySelect) this.dom.ritualCategorySelect.value = 'morning';
        if(this.dom.ritualIconSelect) this.dom.ritualIconSelect.value = 'sun';
        this.openModal('rituals-add-ritual-modal');
    },

    openConfirmationModal: function(title, message, isDanger = false) {
        if (!this.dom.confirmationModal) return; // Check if modal exists
        if (this.dom.confirmationTitle) this.dom.confirmationTitle.textContent = title;
        if (this.dom.confirmationMessage) this.dom.confirmationMessage.textContent = message;
        if (this.dom.confirmActionBtn) {
            this.dom.confirmActionBtn.classList.remove('bg-red-600', 'hover:bg-red-700', 'bg-indigo-600', 'hover:bg-indigo-700');
            if (isDanger) {
                this.dom.confirmActionBtn.classList.add('bg-red-600', 'hover:bg-red-700');
            } else {
                this.dom.confirmActionBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
            }
        }
        this.openModal('rituals-confirmation-modal');
    },

    executeConfirmation: function() {
        if (typeof this.confirmationCallback === 'function') {
            try {
                 this.confirmationCallback.call(this); // Execute the callback
            } catch (error) {
                 console.error("Error executing confirmation callback:", error);
                 this.showNotification("Une erreur est survenue lors de la confirmation.", 'error');
            }
        }
        this.closeModal('rituals-confirmation-modal'); // Close modal regardless
    },

    openExportModal: function() {
         if (!this.dom.exportModal) return; // Check if modal exists
        if (!this.dom.exportDataTextarea || !this.dom.aiPromptTextarea) {
            console.error("RitualsApp: Export modal textareas not found.");
            return;
        }
        const exportObj = {
             appVersion: "1.0",
             exportTimestamp: new Date().toISOString(),
             settings: this.settings,
             rituals: this.rituals,
             history: this.history
        };
        const jsonData = JSON.stringify(exportObj, null, 2);
        this.dom.exportDataTextarea.value = jsonData;

        const aiPromptBase = `Voici mes données de suivi de rituels quotidiens au format JSON (rituels définis, historique de complétion jour par jour, et paramètres). Peux-tu analyser ces données pour identifier mes points forts, mes points faibles, mes tendances, et me donner des conseils personnalisés pour améliorer ma constance et l'efficacité de ma routine ?\n\nDonnées :\n\`\`\`json\n${jsonData}\n\`\`\``;
        this.dom.aiPromptTextarea.value = aiPromptBase;

        this.openModal('rituals-export-modal');
    },

    copyExportData: function() {
        if (!this.dom.exportDataTextarea) return;
        navigator.clipboard.writeText(this.dom.exportDataTextarea.value)
            .then(() => this.showNotification("Données JSON copiées dans le presse-papiers."))
            .catch(err => {
                console.error("RitualsApp: Failed to copy export data", err);
                this.showNotification("Erreur lors de la copie du JSON.", 'error');
            });
    },

    submitToAI: function() {
        if (!this.dom.aiPromptTextarea) return;
        const promptText = this.dom.aiPromptTextarea.value;
        navigator.clipboard.writeText(promptText)
            .then(() => {
                this.showNotification("Prompt pour IA copié ! Collez-le dans votre outil IA préféré.", 'info', 5000);
            })
            .catch(err => {
                console.error("RitualsApp: Failed to copy AI prompt", err);
                this.showNotification("Erreur lors de la copie du prompt.", 'error');
            });
    },

    // --- Helpers (Implémentation complète) ---
    getIconClass: function(iconKey) {
        return this.iconMap[iconKey] || this.iconMap['default'];
    },

    updateDateDisplay: function() {
        if (this.dom.currentDateDisplay) {
            this.currentDate = new Date(); // Always show today's date
            this.dom.currentDateDisplay.textContent = this.currentDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }
    },

    updateStreakCount: function() {
        if (this.dom.streakCountDisplay) {
             try {
                 // Use setTimeout to ensure calculations happen after potential state updates
                 setTimeout(() => {
                     const { streak } = this.calculateStats();
                     // Check again if element exists before updating
                     if (this.dom.streakCountDisplay) {
                          this.dom.streakCountDisplay.textContent = `${streak} jours de suite 🔥`;
                     }
                 }, 0);
             } catch (error) {
                  console.error("Error calculating stats for streak:", error);
                  if (this.dom.streakCountDisplay) { // Check before updating
                      this.dom.streakCountDisplay.textContent = `Séquence: Erreur`;
                  }
             }
        }
    },

    showNotification: function(message, type = 'success', duration = 3000) {
        // Prioritize WheelApp's notification system if available
        if (typeof WheelApp !== 'undefined' && WheelApp.showNotification) {
            WheelApp.showNotification(message, duration);
        } else {
            // Fallback console log if WheelApp system isn't available
            console.log(`[RitualsApp Notification - ${type}]: ${message}`);
            // As a last resort, uncomment alert, but it's disruptive
            // alert(`[${type.toUpperCase()}] ${message}`);
        }
    }
}; // Fin de l'objet RitualsApp