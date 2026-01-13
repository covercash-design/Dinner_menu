// --- STATE ---
let currentDay = 'Mon';
let weeklyPlan = {
    'Mon': { main: null, side: null, sweet: null },
    'Tue': { main: null, side: null, sweet: null },
    'Wed': { main: null, side: null, sweet: null },
    'Thu': { main: null, side: null, sweet: null },
    'Fri': { main: null, side: null, sweet: null }
};
let filter = 'all';

// --- DOM ELEMENTS ---
// (We grab these after DOMContentLoaded)
let mainsGrid, sidesGrid, sweetsGrid, ideasList, emergencyList;
let mainSlot, sideSlot, sweetSlot;
let mealSummary, totalTimeDisplay, energyDisplay;
let modal, modalContent, modalTitle, settingsModal, apiKeyInput;
let currentDayLabel, printGrid;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Bind DOM elements
    mainsGrid = document.getElementById('mains-grid');
    sidesGrid = document.getElementById('sides-grid');
    sweetsGrid = document.getElementById('sweets-grid');
    ideasList = document.getElementById('ideas-list');
    emergencyList = document.getElementById('emergency-list');
    mainSlot = document.getElementById('main-slot');
    sideSlot = document.getElementById('side-slot');
    sweetSlot = document.getElementById('sweet-slot');
    mealSummary = document.getElementById('meal-summary');
    totalTimeDisplay = document.getElementById('total-time-display');
    energyDisplay = document.getElementById('energy-display');
    modal = document.getElementById('recipe-modal');
    modalContent = document.getElementById('modal-content');
    modalTitle = document.getElementById('modal-title');
    settingsModal = document.getElementById('settings-modal');
    apiKeyInput = document.getElementById('api-key-input');
    currentDayLabel = document.getElementById('current-day-label');
    printGrid = document.getElementById('print-grid');

    // Load and Render
    loadPlanFromStorage();
    renderAllTabs();
    selectDay('Mon');
    initCharts();
    
    // Check for saved key
    const savedKey = localStorage.getItem('dinner_menu_gemini_key');
    if(savedKey && apiKeyInput) apiKeyInput.value = savedKey;
});

// --- STATE MANAGEMENT ---
function loadPlanFromStorage() {
    const saved = localStorage.getItem('weekly_dinner_plan');
    if(saved) weeklyPlan = JSON.parse(saved);
}

function savePlanToStorage() {
    localStorage.setItem('weekly_dinner_plan', JSON.stringify(weeklyPlan));
    updatePrintView();
}

// --- DRAG AND DROP ---
function drag(ev, type, idOrName) {
    ev.dataTransfer.setData("type", type);
    ev.dataTransfer.setData("idOrName", idOrName);
}

function allowDrop(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.add('drag-over');
}

function leaveDrop(ev) {
    ev.currentTarget.classList.remove('drag-over');
}

function drop(ev, targetSlotType) {
    ev.preventDefault();
    ev.currentTarget.classList.remove('drag-over');
    const draggedType = ev.dataTransfer.getData("type");
    const idOrName = ev.dataTransfer.getData("idOrName");

    if (draggedType === targetSlotType) {
        if (draggedType === 'main') {
            const dish = mainsData.find(m => m.id === idOrName);
            if (dish) selectMain(dish);
        } else if (draggedType === 'side') {
            selectSide(idOrName);
        } else if (draggedType === 'sweet') {
            selectSweet(idOrName);
        }
    }
}

// --- CORE LOGIC ---
function selectDay(day) {
    currentDay = day;
    document.querySelectorAll('.day-tab').forEach(btn => {
        if(btn.id === `day-${day}`) {
            btn.classList.add('bg-stone-800', 'text-white', 'shadow-md');
            btn.classList.remove('text-stone-500', 'hover:bg-stone-100');
        } else {
            btn.classList.remove('bg-stone-800', 'text-white', 'shadow-md');
            btn.classList.add('text-stone-500', 'hover:bg-stone-100');
        }
    });
    const fullDays = {'Mon':'Monday', 'Tue':'Tuesday', 'Wed':'Wednesday', 'Thu':'Thursday', 'Fri':'Friday'};
    currentDayLabel.textContent = fullDays[day];
    renderPlateBuilder();
    renderAllTabs(); // Re-render lists to show correct highlights for this day
}

function renderPlateBuilder() {
    const plan = weeklyPlan[currentDay];
    
    // Main Slot
    if(plan.main) {
        mainSlot.className = "bg-white border-2 border-orange-500 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[12rem] shadow-sm transition-all";
        mainSlot.innerHTML = `
            <span class="text-4xl mb-2">${plan.main.icon}</span>
            <h3 class="text-xl font-bold text-stone-800 leading-tight mb-2">${plan.main.name}</h3>
            <p class="text-sm text-stone-500 mb-4">Est: ${plan.main.timeDisplay}</p>
            <div class="flex gap-2">
                <button onclick="generateRecipe()" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-medium px-3 py-2 rounded-full hover:shadow-lg transition flex items-center gap-2">✨ Recipe</button>
                ${plan.main.pdfLink ? `<a href="${plan.main.pdfLink}" target="_blank" class="bg-stone-100 text-stone-600 text-xs font-medium px-3 py-2 rounded-full hover:bg-stone-200 transition">📄 PDF</a>` : ''}
            </div>
        `;
    } else {
        mainSlot.className = "border-2 border-dashed border-stone-300 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[12rem] transition-all bg-stone-50 relative group";
        mainSlot.innerHTML = `<span class="text-4xl mb-3 opacity-30 pointer-events-none">🍗</span><h3 class="text-lg font-medium text-stone-400 pointer-events-none">Select Main</h3><p class="text-xs text-stone-400 pointer-events-none">Drag Main Here</p>`;
    }

    // Side Slot
    if(plan.side) {
        sideSlot.className = "bg-white border-2 border-green-500 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[12rem] shadow-sm transition-all";
        sideSlot.innerHTML = `
            <span class="text-4xl mb-2">🥗</span>
            <h3 class="text-xl font-bold text-stone-800 leading-tight mb-4">${plan.side}</h3>
            <button onclick="suggestSide()" class="text-xs text-purple-600 font-medium hover:underline flex items-center gap-1">✨ Ask AI</button>
        `;
    } else {
        sideSlot.className = "border-2 border-dashed border-stone-300 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[12rem] transition-all bg-stone-50 relative";
        sideSlot.innerHTML = `<span class="text-4xl mb-3 opacity-30 pointer-events-none">🥗</span><h3 class="text-lg font-medium text-stone-400 pointer-events-none">Select Side</h3><p class="text-xs text-stone-400 pointer-events-none">Drag Side Here</p>`;
    }

    // Sweet Slot
    if(plan.sweet) {
        sweetSlot.className = "bg-white border-2 border-pink-500 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[12rem] shadow-sm transition-all";
        sweetSlot.innerHTML = `<span class="text-4xl mb-2">🍪</span><h3 class="text-xl font-bold text-pink-700 leading-tight mb-2">${plan.sweet}</h3><button onclick="selectSweet(null)" class="text-xs text-stone-400 underline">Remove</button>`;
    } else {
        sweetSlot.className = "border-2 border-dashed border-stone-300 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[12rem] transition-all bg-stone-50 relative";
        sweetSlot.innerHTML = `<span class="text-4xl mb-3 opacity-30 pointer-events-none">🍪</span><h3 class="text-lg font-medium text-stone-400 pointer-events-none">Something Sweet</h3><p class="text-xs text-stone-400 pointer-events-none">Drag Sweet Here</p>`;
    }

    updateSummary();
}

// --- SELECTION HANDLERS ---
function selectMain(dish) {
    weeklyPlan[currentDay].main = dish;
    savePlanToStorage();
    renderPlateBuilder();
    renderMains(); 
}

function selectSide(side) {
    weeklyPlan[currentDay].side = side;
    savePlanToStorage();
    renderPlateBuilder();
    renderSides();
}

function selectSweet(sweet) {
    weeklyPlan[currentDay].sweet = sweet;
    savePlanToStorage();
    renderPlateBuilder();
    renderSweets();
}

function resetDay() {
    weeklyPlan[currentDay] = { main: null, side: null, sweet: null };
    savePlanToStorage();
    renderPlateBuilder();
    renderAllTabs();
}

// --- RENDERING TABS ---
function renderAllTabs() {
    renderMains(); renderSides(); renderSweets(); renderIdeas(); renderEmergency();
}

function renderMains() {
    mainsGrid.innerHTML = '';
    const filtered = filter === 'all' ? mainsData : mainsData.filter(m => m.category === filter);
    filtered.forEach(dish => {
        const card = document.createElement('div');
        const isSelected = weeklyPlan[currentDay].main?.id === dish.id;
        card.draggable = true;
        card.ondragstart = (event) => drag(event, 'main', dish.id);
        card.className = `draggable-source bg-white border border-stone-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition group ${isSelected ? 'selected-card' : ''}`;
        card.onclick = () => selectMain(dish);
        let colorClass = dish.category === 'Low' ? 'bg-green-400' : dish.category === 'Med' ? 'bg-amber-400' : dish.category === 'Slow' ? 'bg-orange-400' : 'bg-red-400';
        card.innerHTML = `
            <div class="flex justify-between items-start mb-2 pointer-events-none"><div class="flex items-center gap-2"><span class="text-xl">${dish.icon}</span><span class="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">${dish.energy}</span></div><div class="w-2 h-2 rounded-full ${colorClass}"></div></div>
            <h3 class="font-bold text-stone-800 mb-1 group-hover:text-orange-700 transition pointer-events-none">${dish.name}</h3>
            <div class="flex justify-between items-end mt-2 pointer-events-none"><span class="text-xs text-stone-500 font-mono">⏱ ${dish.timeDisplay}</span></div>
        `;
        mainsGrid.appendChild(card);
    });
}

function renderSides() {
    sidesGrid.innerHTML = '';
    sidesData.forEach(side => {
        const card = document.createElement('div');
        const isSelected = weeklyPlan[currentDay].side === side;
        card.draggable = true;
        card.ondragstart = (event) => drag(event, 'side', side);
        card.className = `draggable-source bg-white border border-stone-200 rounded-lg p-3 cursor-pointer hover:bg-green-50 hover:border-green-200 transition text-center ${isSelected ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : ''}`;
        card.onclick = () => selectSide(side);
        card.innerHTML = `<span class="text-sm font-medium text-stone-700 pointer-events-none">${side}</span>`;
        sidesGrid.appendChild(card);
    });
}

function renderSweets() {
    sweetsGrid.innerHTML = '';
    sweetsData.forEach(sweet => {
        const card = document.createElement('div');
        const isSelected = weeklyPlan[currentDay].sweet === sweet;
        card.draggable = true;
        card.ondragstart = (event) => drag(event, 'sweet', sweet);
        card.className = `draggable-source bg-white border border-stone-200 rounded-lg p-3 text-center cursor-pointer hover:bg-pink-50 hover:border-pink-200 transition ${isSelected ? 'border-pink-500 bg-pink-50 ring-1 ring-pink-500' : ''}`;
        card.onclick = () => selectSweet(sweet);
        card.innerHTML = `<span class="text-sm font-medium text-stone-700 pointer-events-none">${sweet}</span>`;
        sweetsGrid.appendChild(card);
    });
}

function renderIdeas() {
    ideasList.innerHTML = '';
    newIdeasData.forEach(idea => {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between bg-white border border-stone-200 p-4 rounded-lg';
        item.innerHTML = `<div><h4 class="font-bold text-stone-800">${idea.name}</h4><p class="text-xs text-stone-500">${idea.meta}</p></div>`;
        ideasList.appendChild(item);
    });
}

function renderEmergency() {
    emergencyList.innerHTML = '';
    emergencyData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'bg-white p-4 rounded shadow-sm border border-red-200 font-bold text-stone-700';
        div.textContent = item;
        emergencyList.appendChild(div);
    });
}

function updatePrintView() {
    printGrid.innerHTML = '';
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const fullDays = {'Mon':'Monday', 'Tue':'Tuesday', 'Wed':'Wednesday', 'Thu':'Thursday', 'Fri':'Friday'};
    
    days.forEach(day => {
        const plan = weeklyPlan[day];
        if(plan.main || plan.side || plan.sweet) {
            const row = document.createElement('div');
            row.className = 'flex border-b border-stone-200 py-4 break-inside-avoid';
            row.innerHTML = `
                <div class="w-32 font-bold text-stone-800 text-xl">${fullDays[day]}</div>
                <div class="flex-1">
                    <div class="font-bold text-lg text-stone-900">${plan.main ? plan.main.name : '<span class="text-stone-300 italic">No Main</span>'}</div>
                    <div class="text-stone-600">${plan.side ? '+ ' + plan.side : ''}</div>
                    ${plan.sweet ? `<div class="text-pink-600 text-sm mt-1">🍪 ${plan.sweet}</div>` : ''}
                </div>
                <div class="w-24 text-right text-sm text-stone-500">
                    ${plan.main ? plan.main.timeDisplay : ''}
                </div>
            `;
            printGrid.appendChild(row);
        }
    });
    
    if(printGrid.children.length === 0) {
        printGrid.innerHTML = '<div class="text-center text-stone-400 py-10">Plan is empty. Go select some meals!</div>';
    }
}

function updateSummary() {
    const plan = weeklyPlan[currentDay];
    if (plan.main) {
        mealSummary.classList.remove('hidden');
        totalTimeDisplay.textContent = `Total Est. Time: ${plan.main.timeDisplay} + Sides`;
        energyDisplay.textContent = `Energy Required: ${plan.main.energy}`;
    } else {
        mealSummary.classList.add('hidden');
    }
}

function filterMains(category) {
    filter = category;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.textContent.includes(category) || (category === 'all' && btn.textContent === 'All')) {
            btn.classList.add('bg-stone-800', 'text-white'); btn.classList.remove('bg-white', 'text-stone-600');
        } else {
            btn.classList.remove('bg-stone-800', 'text-white'); btn.classList.add('bg-white', 'text-stone-600');
        }
    });
    renderMains();
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`content-${tabId}`).classList.remove('hidden');
    document.querySelectorAll('button[id^="tab-"]').forEach(btn => { btn.classList.remove('border-stone-800', 'text-stone-800', 'bg-stone-50'); btn.classList.add('border-transparent'); });
    const activeBtn = document.getElementById(`tab-${tabId}`);
    activeBtn.classList.remove('border-transparent'); activeBtn.classList.add('border-stone-800', 'text-stone-800', 'bg-stone-50');
}

function randomizeMeal() {
    const randomMain = mainsData[Math.floor(Math.random() * mainsData.length)];
    const randomSide = sidesData[Math.floor(Math.random() * sidesData.length)];
    const randomSweet = sweetsData[Math.floor(Math.random() * sweetsData.length)];
    
    weeklyPlan[currentDay] = { main: randomMain, side: randomSide, sweet: randomSweet };
    savePlanToStorage();
    renderPlateBuilder();
    renderAllTabs();
    switchTab('mains');
}

function openSettings() { settingsModal.classList.remove('hidden'); }
function closeSettings() { settingsModal.classList.add('hidden'); }
function saveSettings() {
    const key = apiKeyInput.value.trim();
    if(key) {
        localStorage.setItem('dinner_menu_gemini_key', key);
        closeSettings();
        alert("API Key saved securely to this browser.");
    } else {
        localStorage.removeItem('dinner_menu_gemini_key');
        closeSettings();
        alert("API Key removed. Fallback mode active.");
    }
}

async function generateRecipe() {
    const plan = weeklyPlan[currentDay];
    if (!plan.main) return;
    const key = localStorage.getItem('dinner_menu_gemini_key');
    
    if (!key) { 
        const query = encodeURIComponent(`recipe for ${plan.main.name} ${plan.main.notes || ''}`);
        window.open(`https://www.google.com/search?q=${query}`, '_blank');
        return; 
    }

    modal.classList.remove('hidden');
    modalContent.innerHTML = `<div class="flex flex-col items-center justify-center py-12"><div class="text-4xl mb-4 sparkle-spin">✨</div><p class="text-stone-500 animate-pulse">Consulting the digital chef...</p></div>`;
    modalTitle.textContent = "Generating...";

    const prompt = `Generate a concise recipe card for "${plan.main.name}". Notes: "${plan.main.notes}". Energy Level: ${plan.main.energy}. Format as Markdown.`;
    const result = await callGemini(prompt, key);
    
    if (result) {
        modalTitle.textContent = `Recipe: ${plan.main.name}`;
        modalContent.innerHTML = marked.parse(result);
    } else {
        modalContent.innerHTML = `<p class="text-red-500 text-center">API Error. Check your key.</p>`;
    }
}

async function suggestSide() {
    const plan = weeklyPlan[currentDay];
    if (!plan.main) return;
    const key = localStorage.getItem('dinner_menu_gemini_key');
    
    if (!key) { 
        const query = encodeURIComponent(`best side dish pairing for ${plan.main.name}`);
        window.open(`https://www.google.com/search?q=${query}`, '_blank');
        return; 
    }

    const originalContent = sideSlot.innerHTML;
    sideSlot.innerHTML = `<div class="flex flex-col items-center"><div class="text-2xl mb-2 sparkle-spin">✨</div><p class="text-xs text-stone-500">Thinking...</p></div>`;

    const prompt = `Suggest ONE perfect side dish for "${plan.main.name}". Return ONLY the side name on line 1 and a 1-sentence reason on line 2.`;
    const result = await callGemini(prompt, key);

    if (result) {
        const lines = result.split('\n').filter(line => line.trim() !== '');
        const sideName = lines[0] || "Garlic Bread";
        
        weeklyPlan[currentDay].side = sideName;
        savePlanToStorage();
        renderPlateBuilder();
        renderSides();
    } else {
        sideSlot.innerHTML = originalContent;
        alert("AI Error. Check your key.");
    }
}

async function callGemini(prompt, key) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${key}`;
    try {
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (e) { return null; }
}

function closeModal() { modal.classList.add('hidden'); }
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

function initCharts() {
    const ctxEnergy = document.getElementById('energyChart').getContext('2d');
    new Chart(ctxEnergy, { type: 'doughnut', data: { labels: ['Low', 'Med', 'Slow', 'Pizza'], datasets: [{ data: [2, 4, 4, 1], backgroundColor: ['#4ade80', '#fbbf24', '#fb923c', '#f87171'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } } });

    const ctxTime = document.getElementById('timeChart').getContext('2d');
    new Chart(ctxTime, { type: 'bar', data: { labels: ['Thai Soup', 'Tortilla', 'Mozz Chx', 'Soy Meatloaves', 'Onion Chx', 'Korean Loaf', 'Chili', 'Potato Soup', 'Corn Chowder', 'Beef Roast'], datasets: [{ label: 'Minutes', data: [20, 25, 30, 40, 40, 45, 120, 240, 120, 420], backgroundColor: '#a8a29e', borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } } });
}
