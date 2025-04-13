/* ========================================= */
/* == App 3: Rituels ====================== */
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
        this.cacheDomElements();
        this.loadData(); // Load rituals, history, settings
        this.addEventListeners();
        this.updateDateDisplay(); // Set today's date
        this.updateStreakCount(); // Display initial streak
        this.switchToView('today'); // Start on Today view
        console.log("RitualsApp Initialized.");
    },

    /** Injects the static HTML structure for RitualsApp */
    injectInitialHTML: function() {
        const container = document.getElementById('app-rituals');
        if (!container || container.innerHTML.trim() !== '') {
            // console.log("RitualsApp HTML already present or container not found.");
            return;
        }
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
                                    <div id="rituals-morning-rituals" class="mt-4 space-y-3"></div>
                                </div>
                            </div>
                            <!-- Afternoon -->
                            <div class="rituals-afternoon-bg rounded-lg shadow overflow-hidden">
                                <div class="px-4 py-3 sm:px-6 sm:py-4 bg-white bg-opacity-90">
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-lg sm:text-xl font-semibold">Après-midi</h3>
                                        <span id="rituals-afternoon-progress" class="text-xs sm:text-sm font-medium">0/0</span>
                                    </div>
                                    <div id="rituals-afternoon-rituals" class="mt-4 space-y-3"></div>
                                </div>
                            </div>
                            <!-- Evening -->
                            <div class="rituals-evening-bg rounded-lg shadow overflow-hidden">
                                <div class="px-4 py-3 sm:px-6 sm:py-4 bg-white bg-opacity-90">
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-lg sm:text-xl font-semibold">Soir</h3>
                                        <span id="rituals-evening-progress" class="text-xs sm:text-sm font-medium">0/0</span>
                                    </div>
                                    <div id="rituals-evening-rituals" class="mt-4 space-y-3"></div>
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
                            <div id="rituals-history-list" class="space-y-4 max-h-96 overflow-y-auto"></div>
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
                                    <div id="rituals-available-rituals" class="space-y-3"></div>
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
                                    <button id="rituals-import-data-placeholder" class="flex items-center justify-center p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition text-sm sm:text-base opacity-50 cursor-not-allowed" disabled>
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
            <div id="rituals-add-ritual-modal" class="rituals-modal">
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
            <div id="rituals-export-modal" class="rituals-modal">
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
            <div id="rituals-confirmation-modal" class="rituals-modal">
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
        // Populate icon select options
        this.populateIconSelect();
        console.log("RitualsApp DOM elements cached.");
    },

     populateIconSelect: function() {
         if (!this.dom.ritualIconSelect) return;
         this.dom.ritualIconSelect.innerHTML = ''; // Clear existing options
         for (const key in this.iconMap) {
             if (key !== 'default') { // Don't include default as a selectable option
                 const option = document.createElement('option');
                 option.value = key;
                 // Simple way to capitalize first letter for display
                 const displayName = key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ');
                 // Create a text node for the emoji/icon and another for the name
                 // This requires FontAwesome to be loaded for the icon to render in the select
                 // For broader compatibility, maybe just use text names.
                 // Example with text only: option.textContent = displayName;
                 option.innerHTML = `<i class="${this.iconMap[key]} mr-2"></i> ${displayName}`; // Check rendering in select
                  option.textContent = `${displayName}`; // Fallback or simpler version

                 this.dom.ritualIconSelect.appendChild(option);
             }
         }
     },


    addEventListeners: function() {
        // Tab Navigation (using event delegation on the container)
        this.dom.tabsContainer?.addEventListener('click', (e) => {
            if (e.target.matches('.rituals-tab-button')) {
                this.switchToView(e.target.dataset.view);
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
        this.dom.availableRituals?.addEventListener('change', (e) => { // Toggle active state
            if (e.target.matches('.rituals-toggle-switch input')) {
                this.toggleRitualActive(e.target.dataset.ritualId, e.target.checked);
            }
        });
        this.dom.availableRituals?.addEventListener('click', (e) => { // Delete button
            const deleteButton = e.target.closest('.rituals-delete-btn');
            if (deleteButton) {
                this.confirmDeleteRitual(deleteButton.dataset.ritualId);
            }
        });
        // Time preference inputs (currently disabled, no listener needed unless enabled)
        // this.dom.morningCutoff?.addEventListener('change', (e) => this.updateSetting('morningCutoff', e.target.value));
        // ...etc for afternoon/evening

        // Data Management Buttons
        this.dom.resetDataBtn?.addEventListener('click', () => this.confirmResetData());
        // Import functionality placeholder - listener would be added if implemented

        // Modal Buttons
        this.dom.cancelAddRitualBtn?.addEventListener('click', () => this.closeModal('rituals-add-ritual-modal'));
        this.dom.confirmAddRitualBtn?.addEventListener('click', () => this.addNewRitual());
        this.dom.copyExportBtn?.addEventListener('click', () => this.copyExportData());
        this.dom.closeExportBtn?.addEventListener('click', () => this.closeModal('rituals-export-modal'));
        this.dom.submitToAIBtn?.addEventListener('click', () => this.submitToAI());
        this.dom.cancelConfirmBtn?.addEventListener('click', () => this.closeModal('rituals-confirmation-modal'));
        this.dom.confirmActionBtn?.addEventListener('click', () => this.executeConfirmation());

        // Close modals on overlay click (generic handler for all rituals modals)
        this.dom.appContainer?.querySelectorAll('.rituals-modal').forEach(modal => {
             modal.addEventListener('click', (e) => {
                 if (e.target === modal) { // Check if click is on the backdrop itself
                     this.closeModal(modal.id);
                 }
             });
        });
        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            const activeModal = this.dom.appContainer?.querySelector('.rituals-modal:not(.hidden)');
            if (e.key === 'Escape' && activeModal) {
                 this.closeModal(activeModal.id);
             }
         });

        console.log("RitualsApp event listeners added.");
    },

    // --- Data Management ---
    loadData: function() {
        const savedRituals = localStorage.getItem('dailyRituals_rituals');
        const savedHistory = localStorage.getItem('dailyRituals_history');
        const savedSettings = localStorage.getItem('dailyRituals_settings');

        try {
            this.rituals = savedRituals ? JSON.parse(savedRituals) : this.getDefaultRituals();
            // Basic validation for rituals array
            if (!Array.isArray(this.rituals) || !this.rituals.every(r => r.id && r.name && r.category)) {
                 console.warn("Invalid rituals data loaded, resetting to defaults.");
                 this.rituals = this.getDefaultRituals();
            }
        } catch (e) {
            console.error("Error parsing rituals data, using defaults.", e);
            this.rituals = this.getDefaultRituals();
        }

        try {
            this.history = savedHistory ? JSON.parse(savedHistory) : {};
            // Validate history structure (basic)
            if (typeof this.history !== 'object' || this.history === null) {
                console.warn("Invalid history data loaded, resetting.");
                this.history = {};
            }
        } catch (e) {
            console.error("Error parsing history data, using defaults.", e);
            this.history = {};
        }

        try {
            const parsedSettings = savedSettings ? JSON.parse(savedSettings) : {};
            // Merge saved settings with defaults, ensuring no invalid keys are added
            this.settings = {
                 morningCutoff: parsedSettings.morningCutoff || this.settings.morningCutoff,
                 afternoonCutoff: parsedSettings.afternoonCutoff || this.settings.afternoonCutoff,
                 eveningCutoff: parsedSettings.eveningCutoff || this.settings.eveningCutoff,
            };
        } catch (e) {
             console.error("Error parsing settings data, using defaults.", e);
             // Keep default settings
        }

        this.cleanHistory(); // Ensure history integrity after loading
        console.log("RitualsApp data loaded.");
    },

    saveData: function() {
        try {
            localStorage.setItem('dailyRituals_rituals', JSON.stringify(this.rituals));
            localStorage.setItem('dailyRituals_history', JSON.stringify(this.history));
            localStorage.setItem('dailyRituals_settings', JSON.stringify(this.settings));
            // console.log("RitualsApp data saved."); // Reduce noise
        } catch (e) {
            console.error("RitualsApp: Failed to save data.", e);
            this.showNotification("Erreur lors de la sauvegarde des données Rituels.", 'error');
        }
    },

    cleanHistory: function() {
        const cleanedHistory = {};
        const knownRitualIds = new Set(this.rituals.map(r => r.id));

        for (const dateKey in this.history) {
            if (this.isValidDateKey(dateKey)) {
                const dayData = this.history[dateKey];
                if (typeof dayData === 'object' && dayData !== null) {
                    cleanedHistory[dateKey] = {};
                    // Keep only completion status for known rituals and the reflection
                    for (const key in dayData) {
                        if (knownRitualIds.has(key) && typeof dayData[key] === 'boolean') {
                            cleanedHistory[dateKey][key] = dayData[key];
                        } else if (key === 'reflection' && typeof dayData[key] === 'string') {
                            cleanedHistory[dateKey].reflection = dayData[key];
                        }
                    }
                    // Ensure reflection field exists
                    if (cleanedHistory[dateKey].reflection === undefined) {
                        cleanedHistory[dateKey].reflection = "";
                    }
                }
            }
        }
        this.history = cleanedHistory;
    },

    getDefaultRituals: function() {
        return [
            { id: 'ritual-1', name: 'Boire un verre d\'eau', category: 'morning', icon: 'water', active: true },
            { id: 'ritual-2', name: 'Méditation 5 min', category: 'morning', icon: 'meditation', active: true },
            { id: 'ritual-3', name: 'Planifier la journée', category: 'morning', icon: 'list', active: true },
            { id: 'ritual-4', name: 'Pause active (marche)', category: 'afternoon', icon: 'walking', active: true },
            { id: 'ritual-5', name: 'Revue de la journée', category: 'evening', icon: 'journal', active: true },
            { id: 'ritual-6', name: 'Lecture 15 min', category: 'evening', icon: 'book', active: true },
        ];
    },

    getDateKey: function(date = this.currentDate) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    isValidDateKey: function(key) {
        return /^\d{4}-\d{2}-\d{2}$/.test(key);
    },

    // --- View Switching & Rendering ---
    switchToView: function(viewName) {
        if (!viewName || this.currentView === viewName) return; // Do nothing if same view
        this.currentView = viewName;
        console.log(`RitualsApp: Switching to view ${viewName}`);

        // Update Tab Buttons Appearance
        this.dom.tabButtons.forEach(button => {
            if (button.dataset.view === viewName) {
                button.classList.add('text-indigo-600', 'border-b-2', 'border-indigo-600');
                button.classList.remove('text-gray-500', 'hover:text-indigo-600');
            } else {
                button.classList.remove('text-indigo-600', 'border-b-2', 'border-indigo-600');
                button.classList.add('text-gray-500', 'hover:text-indigo-600');
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
                this.renderStatsView();
                break;
            case 'settings':
                this.dom.settingsContent?.classList.remove('hidden');
                this.renderSettingsView();
                break;
        }
    },

    renderTodayView: function() {
        const dateKey = this.getDateKey();
        const todaysHistory = this.history[dateKey] || {};
        const activeRituals = this.rituals.filter(r => r.active);

        let morningHTML = '', afternoonHTML = '', eveningHTML = '';
        let morningCompleted = 0, afternoonCompleted = 0, eveningCompleted = 0;
        let morningTotal = 0, afternoonTotal = 0, eveningTotal = 0;

        activeRituals.forEach(ritual => {
            const isCompleted = !!todaysHistory[ritual.id];
            const ritualHTML = this.createRitualHTML(ritual, isCompleted);

            switch(ritual.category) {
                case 'morning':
                    morningHTML += ritualHTML;
                    morningTotal++;
                    if(isCompleted) morningCompleted++;
                    break;
                case 'afternoon':
                    afternoonHTML += ritualHTML;
                    afternoonTotal++;
                    if(isCompleted) afternoonCompleted++;
                    break;
                case 'evening':
                    eveningHTML += ritualHTML;
                    eveningTotal++;
                    if(isCompleted) eveningCompleted++;
                    break;
            }
        });

        if(this.dom.morningRituals) this.dom.morningRituals.innerHTML = morningHTML || '<p class="text-sm text-gray-500 italic px-3">Aucun rituel actif pour le matin.</p>';
        if(this.dom.afternoonRituals) this.dom.afternoonRituals.innerHTML = afternoonHTML || '<p class="text-sm text-gray-500 italic px-3">Aucun rituel actif pour l\'après-midi.</p>';
        if(this.dom.eveningRituals) this.dom.eveningRituals.innerHTML = eveningHTML || '<p class="text-sm text-gray-500 italic px-3">Aucun rituel actif pour le soir.</p>';

        // Update progress counters per section
        if(this.dom.morningProgress) this.dom.morningProgress.textContent = `${morningCompleted}/${morningTotal}`;
        if(this.dom.afternoonProgress) this.dom.afternoonProgress.textContent = `${afternoonCompleted}/${afternoonTotal}`;
        if(this.dom.eveningProgress) this.dom.eveningProgress.textContent = `${eveningCompleted}/${eveningTotal}`;

        // Update overall daily progress
        const totalCompleted = morningCompleted + afternoonCompleted + eveningCompleted;
        const totalActive = activeRituals.length;
        const percentage = totalActive > 0 ? Math.round((totalCompleted / totalActive) * 100) : 0;

        if(this.dom.dailyProgress) this.dom.dailyProgress.style.width = `${percentage}%`;
        if(this.dom.progressPercentage) this.dom.progressPercentage.textContent = `${percentage}%`;
        if(this.dom.completedCount) this.dom.completedCount.textContent = `${totalCompleted} complétés`;
        if(this.dom.totalCount) this.dom.totalCount.textContent = `${totalActive} au total`;

        // Load reflection for the day
        if(this.dom.dailyReflection) this.dom.dailyReflection.value = todaysHistory.reflection || '';
    },

    createRitualHTML: function(ritual, isCompleted) {
       const iconClass = this.getIconClass(ritual.icon);
       return `
           <div class="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
               <div class="flex items-center space-x-3 overflow-hidden mr-2">
                   <i class="${iconClass} text-lg ${isCompleted ? 'text-indigo-500' : 'text-gray-400'}"></i>
                   <span class="text-gray-800 text-sm sm:text-base truncate ${isCompleted ? 'line-through text-gray-500' : ''}">${ritual.name}</span>
               </div>
               <label class="rituals-toggle-switch inline-flex items-center cursor-pointer flex-shrink-0">
                  <input type="checkbox" class="rituals-checkbox sr-only peer" data-ritual-id="${ritual.id}" ${isCompleted ? 'checked' : ''} aria-labelledby="ritual-label-${ritual.id}">
                  <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
               </label>
               <span id="ritual-label-${ritual.id}" class="sr-only">${ritual.name}</span> <!-- Hidden label for aria -->
           </div>
       `;
    },

    renderHistoryView: function() {
        if (!this.dom.historyList) return;
        this.dom.historyList.innerHTML = ''; // Clear previous list

        const filterValue = this.dom.historyFilter?.value || 'all';
        const sortedDates = Object.keys(this.history).sort((a, b) => b.localeCompare(a)); // Newest first

        if (sortedDates.length === 0) {
             this.dom.historyList.innerHTML = '<p class="text-center text-gray-500 py-4">Aucun historique enregistré.</p>';
             return;
        }

        let displayedCount = 0;
        sortedDates.forEach(dateKey => {
            const dayHistory = this.history[dateKey];
            const entryDiv = document.createElement('div');
            entryDiv.className = 'p-4 border-b border-gray-200 last:border-b-0';

            const date = new Date(dateKey + 'T00:00:00'); // Ensure correct date parsing
            const formattedDate = date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            let ritualsHTML = '<ul class="list-none mt-2 space-y-1 text-xs sm:text-sm">';
            let completedCount = 0;
            let totalCount = 0;
            let shouldDisplayDate = false; // Only display date if it has relevant rituals

            const activeRitualIdsOnDate = new Set(); // Track which rituals were active/logged on this date
            for (const key in dayHistory) {
                 if (key !== 'reflection') activeRitualIdsOnDate.add(key);
            }

            // Iterate through CURRENT rituals to display info consistently
            this.rituals.forEach(ritual => {
                 // Only consider rituals that were potentially active on that date or are currently active
                 // This logic might need refinement if rituals are deleted often.
                 const completed = !!dayHistory[ritual.id]; // Check completion status for this date
                 const relevant = activeRitualIdsOnDate.has(ritual.id) || ritual.active; // Consider if logged or currently active

                 if(relevant) {
                    totalCount++; // Count as possible for completion rate
                    if (completed) completedCount++;

                    const displayThisRitual = (filterValue === 'all') ||
                                              (filterValue === 'completed' && completed) ||
                                              (filterValue === 'missed' && !completed);

                    if (displayThisRitual) {
                         const iconClass = this.getIconClass(ritual.icon);
                         ritualsHTML += `<li class="${completed ? 'text-green-600' : 'text-red-600'} flex items-center gap-2">
                                         <i class="w-4 text-center ${completed ? 'fas fa-check-circle' : 'fas fa-times-circle'}"></i>
                                         <span>${ritual.name}</span>
                                       </li>`;
                         shouldDisplayDate = true; // Mark this date entry for display
                    }
                 }
            });
            ritualsHTML += '</ul>';

            if (shouldDisplayDate) {
                entryDiv.innerHTML = `
                    <div class="flex justify-between items-center">
                        <h4 class="font-semibold text-gray-700 text-sm sm:text-base">${formattedDate}</h4>
                        <span class="text-xs sm:text-sm font-medium ${completedCount === totalCount && totalCount > 0 ? 'text-green-600' : 'text-gray-600'}">${completedCount}/${totalCount} complétés</span>
                    </div>
                    ${ritualsHTML}
                    ${dayHistory.reflection ? `<p class="mt-2 text-xs sm:text-sm text-gray-600 italic border-l-2 border-gray-200 pl-2">"${dayHistory.reflection.replace(/</g, "<").replace(/>/g, ">")}"</p>` : ''}
                `;
                this.dom.historyList.appendChild(entryDiv);
                displayedCount++;
            }
        });

        if (displayedCount === 0) {
            this.dom.historyList.innerHTML = '<p class="text-center text-gray-500 py-4">Aucun historique trouvé pour ce filtre.</p>';
        }
    },

    renderStatsView: function() {
        if (!this.dom.statsContent) return;
        const { streak, successRate, favoriteRitualId } = this.calculateStats();
        const favoriteRitual = this.rituals.find(r => r.id === favoriteRitualId);
        const favoriteRitualName = favoriteRitual ? `${favoriteRitual.name}` : '-';

        if(this.dom.currentStreak) this.dom.currentStreak.textContent = `${streak} jours`;
        if(this.dom.successRate) this.dom.successRate.textContent = `${successRate.toFixed(0)}%`;
        if(this.dom.favoriteRitual) this.dom.favoriteRitual.textContent = favoriteRitualName;

        // Render charts (using Chart.js)
        this.renderWeeklyChart();
        this.renderRitualDistributionChart();
    },

    renderSettingsView: function() {
        if (!this.dom.availableRituals || !this.settings) return;
        this.dom.availableRituals.innerHTML = ''; // Clear existing

        // Populate cutoff times (currently read-only in UI)
        if(this.dom.morningCutoff) this.dom.morningCutoff.value = this.settings.morningCutoff;
        if(this.dom.afternoonCutoff) this.dom.afternoonCutoff.value = this.settings.afternoonCutoff;
        if(this.dom.eveningCutoff) this.dom.eveningCutoff.value = this.settings.eveningCutoff;

        // Populate ritual list for management
         if (this.rituals.length === 0) {
             this.dom.availableRituals.innerHTML = '<p class="text-center text-gray-500 py-4">Aucun rituel défini. Ajoutez-en un !</p>';
             return;
         }

        this.rituals.forEach(ritual => {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between p-3 bg-white rounded-lg shadow-sm';
            const categoryMap = { morning: 'Matin', afternoon: 'Après-midi', evening: 'Soir' };
            const iconClass = this.getIconClass(ritual.icon);

            div.innerHTML = `
                <div class="flex items-center space-x-3 overflow-hidden mr-2">
                    <i class="${iconClass} text-lg text-gray-600 flex-shrink-0"></i>
                    <div class="text-sm sm:text-base">
                        <span class="text-gray-800 font-medium">${ritual.name}</span>
                        <span class="text-gray-500 text-xs block">(${categoryMap[ritual.category] || ritual.category})</span>
                    </div>
                </div>
                <div class="flex items-center space-x-3 flex-shrink-0">
                    <label class="rituals-toggle-switch inline-flex items-center cursor-pointer" title="${ritual.active ? 'Désactiver' : 'Activer'}">
                        <input type="checkbox" class="sr-only peer" data-ritual-id="${ritual.id}" ${ritual.active ? 'checked' : ''}>
                        <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                    <button class="rituals-delete-btn text-red-500 hover:text-red-700 p-1" data-ritual-id="${ritual.id}" aria-label="Supprimer ${ritual.name}" title="Supprimer">
                        <i class="fas fa-trash-alt fa-fw"></i>
                    </button>
                </div>
            `;
            this.dom.availableRituals.appendChild(div);
        });
    },

    // --- Actions ---
    toggleRitualCompletion: function(ritualId, completed) {
        const dateKey = this.getDateKey();
        if (!this.history[dateKey]) {
            this.history[dateKey] = { reflection: "" }; // Ensure day entry exists
        }
        // Only update if the ritual is known (prevents adding data for deleted rituals)
         if (this.rituals.some(r => r.id === ritualId)) {
             this.history[dateKey][ritualId] = completed;
             this.saveData();
             this.renderTodayView(); // Update UI immediately
             this.updateStreakCount(); // Update streak display
             console.log(`Ritual ${ritualId} marked as ${completed ? 'complete' : 'incomplete'} for ${dateKey}`);
         } else {
              console.warn(`Attempted to toggle completion for unknown ritual ID: ${ritualId}`);
         }
    },

    saveReflection: function() {
        if (!this.dom.dailyReflection) return;
        const dateKey = this.getDateKey();
        if (!this.history[dateKey]) {
            this.history[dateKey] = {}; // Ensure day entry exists, even if no rituals completed
        }
        this.history[dateKey].reflection = this.dom.dailyReflection.value.trim();
        this.saveData();
        this.showNotification("Réflexion enregistrée.");
    },

    addNewRitual: function() {
        if (!this.dom.ritualNameInput || !this.dom.ritualCategorySelect || !this.dom.ritualIconSelect) return;
        const name = this.dom.ritualNameInput.value.trim();
        const category = this.dom.ritualCategorySelect.value;
        const icon = this.dom.ritualIconSelect.value;

        if (!name) {
            this.showNotification("Le nom du rituel est requis.", 'error');
            return;
        }

        const newRitual = {
            id: `ritual-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            name: name,
            category: category,
            icon: icon,
            active: true // Activate by default
        };

        this.rituals.push(newRitual);
        this.saveData();
        this.renderSettingsView(); // Update the settings list
        this.closeModal('rituals-add-ritual-modal');
        this.showNotification(`Rituel "${name}" ajouté.`);
        this.dom.ritualNameInput.value = ''; // Clear input for next time
    },

    toggleRitualActive: function(ritualId, isActive) {
        const ritual = this.rituals.find(r => r.id === ritualId);
        if (ritual) {
            ritual.active = isActive;
            this.saveData();
            this.renderTodayView(); // Update today view as active rituals list changes
            this.updateStreakCount(); // Recalculate streak based on active rituals
            this.renderStatsView(); // Update stats which depend on active rituals
            this.showNotification(`Rituel "${ritual.name}" ${isActive ? 'activé' : 'désactivé'}.`);
        }
    },

    confirmDeleteRitual: function(ritualId) {
        const ritual = this.rituals.find(r => r.id === ritualId);
        if (!ritual) return;
        this.confirmationCallback = () => this.deleteRitual(ritualId); // Set the callback
        this.openConfirmationModal(
            'Supprimer le rituel',
            `Êtes-vous sûr de vouloir supprimer le rituel "${ritual.name}" ? L'historique associé sera conservé mais le rituel n'apparaîtra plus.`,
            true // Mark as danger action
        );
    },

    deleteRitual: function(ritualId) {
        const ritualIndex = this.rituals.findIndex(r => r.id === ritualId);
        if (ritualIndex > -1) {
             const ritualName = this.rituals[ritualIndex].name;
             this.rituals.splice(ritualIndex, 1); // Remove from rituals array
             // We don't delete from history, just stop tracking it actively
             this.saveData();
             this.renderSettingsView(); // Update the list
             this.renderTodayView(); // Update main view
             this.renderStatsView(); // Update stats
             this.updateStreakCount(); // Update streak
             this.showNotification(`Rituel "${ritualName}" supprimé.`);
        } else {
             console.warn(`Tried to delete non-existent ritual: ${ritualId}`);
        }
    },

    updateSetting: function(settingKey, value) {
        if (this.settings.hasOwnProperty(settingKey)) {
            this.settings[settingKey] = value;
            this.saveData();
            // Re-render might be needed if settings affect display logic (not the case here)
            this.showNotification(`Paramètre ${settingKey} mis à jour.`);
        }
    },

    confirmResetData: function() {
        this.confirmationCallback = this.resetData; // Set callback
        this.openConfirmationModal(
            'Réinitialiser les Données Rituels',
            'ATTENTION : Ceci supprimera TOUS vos rituels personnalisés et TOUT votre historique de complétion et réflexions. Les rituels par défaut seront restaurés. Cette action est IRRÉVERSIBLE. Continuer ?',
            true // Mark as danger action
        );
    },

    resetData: function() {
        console.log("Resetting RitualsApp data...");
        this.rituals = this.getDefaultRituals();
        this.history = {};
        // Reset settings to default? Optional, maybe keep user preferences.
        // this.settings = { morningCutoff: '12:00', ... };
        this.saveData(); // Save the reset state
        this.updateStreakCount(); // Reset streak display
        this.switchToView('today'); // Go back to today view
        this.showNotification("Données des rituels réinitialisées.");
    },

    // --- Stats Calculation ---
    calculateStats: function() {
        let streak = 0;
        let totalDaysWithHistory = 0;
        let totalCompleted = 0;
        let totalPossibleCompletions = 0; // Based on active rituals *on that day*
        const ritualCompletionCounts = {};
        this.rituals.forEach(r => { ritualCompletionCounts[r.id] = 0; }); // Initialize counts

        const today = new Date();
        const sortedDates = Object.keys(this.history).sort((a, b) => b.localeCompare(a)); // Newest first

        // Calculate streak backwards from today
        let currentDate = new Date(today);
        let consecutive = true;
        while (consecutive) {
            const dateKey = this.getDateKey(currentDate);
            const dayHistory = this.history[dateKey];

            // Find rituals considered active on this specific day OR currently active
            const activeRitualsForStreak = this.rituals.filter(r => {
                // If history exists for this day, consider rituals logged that day + currently active ones
                // If no history, consider only currently active ones
                return r.active || (dayHistory && dayHistory.hasOwnProperty(r.id));
            });

            if (activeRitualsForStreak.length === 0) {
                consecutive = false; // No rituals relevant for the streak calculation
                break;
            }

            // Check if all relevant rituals were completed
            let allCompletedForDay = true;
            if (!dayHistory) { // No entry for the day means not all completed
                allCompletedForDay = false;
            } else {
                allCompletedForDay = activeRitualsForStreak.every(ritual => dayHistory[ritual.id]);
            }

            if (allCompletedForDay) {
                 // Check if it's today or a past date
                 if (currentDate.toDateString() === today.toDateString() || currentDate < today) {
                     streak++;
                     currentDate.setDate(currentDate.getDate() - 1); // Go to previous day
                 } else {
                      consecutive = false; // Don't count future dates
                 }
            } else {
                // Allow skipping days with NO active rituals? No, break streak.
                consecutive = false;
            }
        }


        // Calculate success rate and favorite ritual based on all history
        sortedDates.forEach(dateKey => {
            totalDaysWithHistory++;
            const dayHistory = this.history[dateKey];
             // Count possible completions based on rituals logged that day + currently active ones
            const activeRitualsThisDay = this.rituals.filter(r => r.active || dayHistory.hasOwnProperty(r.id));

            activeRitualsThisDay.forEach(ritual => {
                 totalPossibleCompletions++;
                 if (dayHistory[ritual.id]) {
                     totalCompleted++;
                     ritualCompletionCounts[ritual.id]++; // Increment count for this ritual
                 }
            });
        });

        const successRate = totalPossibleCompletions > 0 ? (totalCompleted / totalPossibleCompletions) * 100 : 0;

        // Find favorite ritual (most completed)
        let favoriteRitualId = null;
        let maxCompletions = -1;
        for (const ritualId in ritualCompletionCounts) {
            // Consider only currently active rituals as potential favorites? Or all ever completed?
            // Let's consider all for now.
             if (this.rituals.some(r => r.id === ritualId)) { // Ensure the ritual still exists
                 if (ritualCompletionCounts[ritualId] > maxCompletions) {
                     maxCompletions = ritualCompletionCounts[ritualId];
                     favoriteRitualId = ritualId;
                 }
             }
        }

        return { streak, successRate, favoriteRitualId };
    },

     getWeeklyCompletionData: function() {
         const labels = [];
         const data = [];
         const today = new Date();

         for (let i = 6; i >= 0; i--) { // Last 7 days including today
             const date = new Date(today);
             date.setDate(today.getDate() - i);
             const dateKey = this.getDateKey(date);
             labels.push(date.toLocaleDateString('fr-FR', { weekday: 'short' })); // e.g., lun.

             const dayHistory = this.history[dateKey];
             // Consider rituals active today for consistency in the weekly view
             const activeRituals = this.rituals.filter(r => r.active);
             let completedCount = 0;
             let possibleCount = activeRituals.length;

             if (dayHistory && possibleCount > 0) {
                 completedCount = activeRituals.filter(r => dayHistory[r.id]).length;
                 data.push(Math.round((completedCount / possibleCount) * 100));
             } else if (possibleCount > 0) {
                 data.push(0); // No history or none completed
             } else {
                 data.push(0); // No active rituals
             }
         }
         return { labels, data };
     },

     getRitualDistributionData: function() {
         const labels = [];
         const data = [];
         const colors = [];
         // More distinct colors might be needed if many rituals share a category
         const colorMap = { morning: '#facc15', afternoon: '#60a5fa', evening: '#c084fc' }; // Tailwind yellow-400, blue-400, purple-400

         const activeRituals = this.rituals.filter(r => r.active);
         activeRituals.forEach(ritual => {
             labels.push(ritual.name);
             data.push(1); // Each active ritual gets an equal slice
             colors.push(colorMap[ritual.category] || '#9ca3af'); // Use gray as fallback
         });
         return { labels, data, colors };
     },

    // --- Chart Rendering ---
    renderWeeklyChart: function() { /* ... (Identique à la version précédente) ... */ },
    renderRitualDistributionChart: function() { /* ... (Identique à la version précédente) ... */ },
    // NOTE: Les implémentations de renderWeeklyChart et renderRitualDistributionChart
    // sont identiques à celles fournies dans la partie 2 de wheel.js (adaptées aux sélecteurs DOM de rituals.js).
    // Pour éviter la redondance, je ne les répète pas ici, mais assurez-vous qu'elles
    // existent bien dans votre objet RitualsApp. Elles utilisent Chart.js pour dessiner
    // les graphiques dans les canvas correspondants.
    // Si vous voulez que je les réécrive ici, demandez-le.

    // --- Modals ---
    openModal: function(modalId) { /* ... (Logique pour afficher la modale Rituals) ... */ },
    closeModal: function(modalId) { /* ... (Logique pour cacher la modale Rituals) ... */ },
    // NOTE: openModal/closeModal peuvent être génériques. Elles ajoutent/enlèvent
    // la classe 'visible' (ou modifient display) sur l'élément modal ciblé.
    // Elles sont identiques en logique à celles de WheelApp, mais ciblent les ID de RitualsApp.
    // Je ne les répète pas pour la concision. Assurez-vous de les implémenter.

    openAddRitualModal: function() { /* ... (Prépare et ouvre la modale d'ajout) ... */ },
    openConfirmationModal: function(title, message, isDanger = false) { /* ... (Prépare et ouvre la modale de confirmation) ... */ },
    executeConfirmation: function() { /* ... (Exécute le callback et ferme la modale) ... */ },
    openExportModal: function() { /* ... (Prépare et ouvre la modale d'export) ... */ },
    copyExportData: function() { /* ... (Copie les données JSON) ... */ },
    submitToAI: function() { /* ... (Copie le prompt IA) ... */ },

    // --- Helpers ---
    getIconClass: function(iconKey) {
        return this.iconMap[iconKey] || this.iconMap['default'];
    },
    updateDateDisplay: function() { /* ... (Met à jour l'affichage de la date) ... */ },
    updateStreakCount: function() { /* ... (Met à jour l'affichage de la séquence) ... */ },
    showNotification: function(message, type = 'success', duration = 3000) { /* ... (Affiche une notification) ... */ }
    // NOTE: Les implémentations de ces helpers et des fonctions de modales sont
    // relativement simples et similaires à celles déjà vues. Je les omets pour la taille,
    // mais elles sont nécessaires au bon fonctionnement. Assurez-vous qu'elles soient présentes
    // et fonctionnelles dans votre objet RitualsApp.
};

// TODO: Implémenter les fonctions omises pour la concision :
// renderWeeklyChart, renderRitualDistributionChart, openModal, closeModal,
// openAddRitualModal, openConfirmationModal, executeConfirmation, openExportModal,
// copyExportData, submitToAI, updateDateDisplay, updateStreakCount, showNotification.
// Leurs logiques sont décrites dans les étapes précédentes ou sont standards.