import './style.css';

const root = document.getElementById('root');

root.innerHTML = `
    <header class="mb-10 text-center">
        <div class="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">OpenClaw</div>
        <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight">Agent Query Interface</h1>
        <p class="mt-3 text-lg text-slate-600">Transform your natural language requests into actionable insights.</p>
    </header>
    
    <div class="space-y-6">
        <div class="relative">
            <label for="queryInput" class="block text-sm font-medium text-slate-700 mb-2">How can I help you today?</label>
            <textarea id="queryInput" 
                class="w-full h-40 p-4 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none shadow-sm text-slate-800 placeholder-slate-400" 
                placeholder="e.g. Find a hotel room in Manhattan for me with two queen beds, check-in on 2/28/2026..."></textarea>
            <div class="absolute bottom-3 right-3 text-xs text-slate-400" id="charCount">0 characters</div>
        </div>
        
        <div class="flex justify-end items-center gap-4">
            <button id="searchBtn" class="bg-blue-600 hover:bg-blue-700 active:transform active:scale-95 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all flex items-center gap-2">
                <span id="btnText">Execute Task</span>
                <svg id="loadingIcon" class="hidden animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </button>
        </div>
    </div>
    
    <div id="results" class="mt-12 hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="flex items-center gap-2 mb-4">
            <div class="h-2 w-2 rounded-full bg-green-500"></div>
            <h2 class="text-xl font-bold text-slate-800">Agent Output</h2>
        </div>
        <div id="resultsContent" class="prose prose-slate max-w-none p-6 bg-slate-50 border border-slate-200 rounded-xl min-h-[150px] shadow-inner text-slate-700">
            <!-- Results will be injected here -->
        </div>
        <div class="mt-4 flex justify-between text-sm text-slate-500">
            <span id="timestamp"></span>
            <button id="copyBtn" class="hover:text-blue-600 transition flex items-center gap-1">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                Copy Response
            </button>
        </div>
    </div>
`;

const queryInput = document.getElementById('queryInput');
const charCount = document.getElementById('charCount');
const searchBtn = document.getElementById('searchBtn');
const btnText = document.getElementById('btnText');
const loadingIcon = document.getElementById('loadingIcon');
const resultsDiv = document.getElementById('results');
const resultsContent = document.getElementById('resultsContent');
const timestampSpan = document.getElementById('timestamp');
const copyBtn = document.getElementById('copyBtn');

queryInput.addEventListener('input', () => {
    charCount.textContent = `${queryInput.value.length} characters`;
});

searchBtn.addEventListener('click', async () => {
    const query = queryInput.value.trim();
    if (!query) return;
    
    // UI State: Loading
    searchBtn.disabled = true;
    btnText.textContent = 'Agent Working...';
    loadingIcon.classList.remove('hidden');
    resultsDiv.classList.remove('hidden');
    resultsContent.innerHTML = `
        <div class="flex flex-col items-center justify-center py-10 gap-3">
            <div class="flex gap-1">
                <div class="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div class="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div class="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
            <p class="text-slate-500 italic">Thinking and researching...</p>
        </div>
    `;
    
    try {
        // Mocking the call to an OpenClaw agent
        const response = await mockOpenClawCall(query);
        resultsContent.innerHTML = response;
        timestampSpan.textContent = `Completed at ${new Date().toLocaleTimeString()}`;
    } catch (error) {
        resultsContent.innerHTML = `
            <div class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <strong>Error:</strong> ${error.message}
            </div>
        `;
    } finally {
        searchBtn.disabled = false;
        btnText.textContent = 'Execute Task';
        loadingIcon.classList.add('hidden');
    }
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(resultsContent.innerText);
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '<span>✓ Copied!</span>';
    setTimeout(() => copyBtn.innerHTML = originalText, 2000);
});

async function mockOpenClawCall(query) {
    // Simulated processing delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Scenario-based mock responses
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('hotel') && lowerQuery.includes('manhattan')) {
        return `
            <div class="space-y-6">
                <p class="font-medium text-slate-800">I found several hotel options in Manhattan for your stay from Feb 28 to Mar 2, 2026. Here are the best available matches south of Wien Hall:</p>
                
                <div class="grid gap-4 md:grid-cols-2">
                    <div class="p-4 border border-blue-100 bg-blue-50/50 rounded-xl shadow-sm">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-lg text-blue-900">Hotel Belleclaire</h3>
                            <span class="bg-blue-600 text-white text-xs px-2 py-1 rounded">8.4/10</span>
                        </div>
                        <ul class="text-sm space-y-1 text-slate-700 mb-4">
                            <li><strong>Beds:</strong> 2 Queen Beds</li>
                            <li><strong>Location:</strong> Upper West Side</li>
                            <li><strong>Price:</strong> $367 / night</li>
                        </ul>
                        <a href="https://www.booking.com/hotel/us/belleclaire.html" target="_blank" class="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">Book Now →</a>
                    </div>

                    <div class="p-4 border border-blue-100 bg-blue-50/50 rounded-xl shadow-sm">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-lg text-blue-900">Arthouse Hotel</h3>
                            <span class="bg-blue-600 text-white text-xs px-2 py-1 rounded">7.9/10</span>
                        </div>
                        <ul class="text-sm space-y-1 text-slate-700 mb-4">
                            <li><strong>Beds:</strong> 2 Queen Beds</li>
                            <li><strong>Location:</strong> Upper West Side</li>
                            <li><strong>Price:</strong> $499 / night</li>
                        </ul>
                        <a href="https://www.booking.com/hotel/us/arthouse-hotel.html" target="_blank" class="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">Book Now →</a>
                    </div>
                </div>
                
                <div class="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                    <strong>Note:</strong> Closer options were unavailable for these specific dates during the search.
                </div>
            </div>
        `;
    }
    
    return `
        <div class="space-y-4">
            <p>Task analyzed: <code class="bg-slate-200 px-1 rounded">${query.substring(0, 50)}${query.length > 50 ? '...' : ''}</code></p>
            <p>To integrate this with your live OpenClaw agent, you would replace this mock function with a fetch call to your OpenClaw Gateway:</p>
            <pre class="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs">
fetch('https://your-openclaw-gateway/turn', {
  method: 'POST',
  body: JSON.stringify({ message: query })
})</pre>
        </div>
    `;
}
