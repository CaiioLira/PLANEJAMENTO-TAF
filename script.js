// --- TEMA E DARK MODE ---
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    appState.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    saveState();
    updateThemeIcons();
}

function applyTheme() {
    if (appState.theme === 'light') {
        document.documentElement.classList.remove('dark');
    } else {
        document.documentElement.classList.add('dark');
    }
    updateThemeIcons();
}

function updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    document.getElementById('icon-sun-desktop').classList.toggle('hidden', !isDark);
    document.getElementById('icon-moon-desktop').classList.toggle('hidden', isDark);
    document.getElementById('icon-sun-mobile').classList.toggle('hidden', !isDark);
    document.getElementById('icon-moon-mobile').classList.toggle('hidden', isDark);
}

// --- DATA E LÓGICA DO MACROCICLO ---
const MACRO_START_DATE = new Date('2026-07-13T00:00:00');
const TOTAL_WEEKS = 9;

const workoutLibrary = {
    1: { 
        1: { title: "Flexão (Volume) + Corrida Base", desc: "Membros Superiores: 4 séries fazendo o máximo de flexões possíveis em 45 segundos. Descanso exato de 60 segundos entre as séries.\nCorrida: Trote leve contínuo por 20 minutos." },
        2: { title: "Corrida Intervalada (Tiros)", desc: "Pista: 6 tiros de 400 metros. \nRitmo exigido: 5 minutos e 0 segundos a 5 minutos e 10 segundos por km (fechar cada 400m entre 2:00 e 2:04). \nDescanso: 1 minuto e 30 segundos de caminhada após cada tiro." },
        3: { title: "Resistência de Core (Abdominal)", desc: "Circuito de 10 minutos contínuos:\nA cada 1 minuto cravado no relógio, inicie e faça 40 segundos de abdominal remador. Descanse os 20 segundos restantes do minuto. Repita até dar 10 min.\nFinalização: 3 séries de 1 minuto de prancha isométrica." },
        4: { title: "Corrida de Sustentação", desc: "Corrida contínua por 25 minutos. \nRitmo exigido: 5 minutos e 20 segundos por km. O objetivo é não parar e manter a constância respiratória." },
        5: { title: "Reforço Muscular (Opcional)", desc: "Apenas musculatura local: \n3 séries do máximo de flexões que conseguir fazer direto. \n3 séries do máximo de abdominais remador direto.\nDescanso de 2 minutos entre séries." },
        6: { title: "Recuperação Ativa", desc: "Alongamento completo do corpo, mobilidade de quadril e tornozelo. Caminhada leve de 15 minutos." },
        0: { title: "Descanso Total", desc: "Sem atividade física. Prioridade no estudo e no sono de 8 horas." }
    },
    2: { 
        1: { title: "Flexão com Sobrecarga", desc: "Membros Superiores: Colocar anilha de 5kg ou 10kg nas costas. Fazer 3 séries de 10 repetições lentas e controladas.\nCorrida: Trote leve contínuo por 15 minutos para soltar a perna." },
        2: { title: "Corrida Intervalada Intensa", desc: "Pista: 8 tiros de 400 metros. \nRitmo exigido: 4 minutos e 30 segundos por km (fechar cada 400m em 1:48). \nDescanso: 1 minuto e 30 segundos de caminhada leve. Foco na amplitude da passada." },
        3: { title: "Abdominal com Sobrecarga", desc: "Segurar anilha de 5kg no peito. Fazer 4 séries com duração de 1 minuto cada, tentando atingir o máximo de repetições possíveis dentro desse minuto.\nDescanso: 1 minuto entre séries." },
        4: { title: "Corrida em Limiar de Prova", desc: "Corrida contínua por 20 minutos. \nRitmo exigido: 4 minutos e 58 segundos por km (ritmo exato para bater os 2410m). Adaptação ao esforço do exame." },
        5: { title: "Circuito Rápido de Força", desc: "Fazer sem intervalo entre os exercícios: \n15 Flexões logo seguidas de 20 Abdominais, logo seguidas de mais 15 Flexões.\nIsso é 1 série. Descanse 1 minuto e meio. Faça 4 séries no total." },
        6: { title: "Recuperação Ativa", desc: "Foco em soltura muscular. Caminhada leve." },
        0: { title: "Descanso Total", desc: "Sem atividade física. Foco absoluto." }
    },
    3: { 
        1: { title: "Flexão: Simulação de Prova", desc: "Marcar 1 minuto no cronômetro. Fazer o máximo de flexões como se fosse o dia do TAF.\nDescansar completamente por 3 minutos. \nRepetir a simulação de 1 minuto pela segunda vez." },
        2: { title: "Corrida: Simulação de Ritmo", desc: "Pista: 3 tiros longos de 800 metros.\nRitmo exigido: C cravar o ritmo exato da prova (Pace de 4:58/km). \nDescanso: 2 minutos parado entre os tiros." },
        3: { title: "Abdominal: Simulação de Prova", desc: "Marcar 1 minuto no cronômetro. Fazer o máximo de abdominais remador (bater cotovelo no joelho).\nDescansar completamente por 3 minutos.\nRepetir a simulação pela segunda vez." },
        4: { title: "Simulado Completo do TAF", desc: "Executar o teste real na ordem oficial: \n1º: Flexões de braço. \n2º: Abdominais em 1 minuto. \n3º: Corrida de 12 minutos. \nRespeitar os tempos de descanso oficiais entre provas." },
        5: { title: "Trote Regenerativo", desc: "Apenas 15 minutos de trote muito lento para eliminar ácido lático." },
        6: { title: "Descanso Preparatório", desc: "Preservação total de energia muscular." },
        0: { title: "Descanso Preparatório", desc: "Mente focada e descanso." }
    }
};

function getPhase(week) {
    if (week >= 1 && week <= 3) return 1;
    if (week >= 4 && week <= 7) return 2;
    if (week >= 8 && week <= 9) return 3;
    return null;
}

function getWorkoutInfo(date) {
    const targetDate = new Date(date.toISOString().slice(0,10) + 'T12:00:00');
    const start = new Date(MACRO_START_DATE.toISOString().slice(0,10) + 'T12:00:00');
    const diffTime = targetDate - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0 || diffDays >= TOTAL_WEEKS * 7) {
        return { title: "Fora do Macrociclo", desc: "Esta data não pertence às 9 semanas oficiais do treinamento." };
    }

    const week = Math.floor(diffDays / 7) + 1;
    const dayOfWeek = targetDate.getDay(); 
    const phase = getPhase(week);

    const workout = workoutLibrary[phase][dayOfWeek];
    return { week, phase, dayOfWeek, title: workout.title, desc: workout.desc };
}

function printWeek(week) {
    const phase = getPhase(week);
    const diasLabel = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    // 1. Cria o elemento temporário
    const container = document.createElement('div');
    
    // 2. Estilização rigorosa para não depender da tela do usuário
    container.style.position = 'absolute';
    container.style.left = '-9999px'; // Esconde da área visível
    container.style.top = '0';
    container.style.width = '800px';  // Trava a largura
    container.style.padding = '40px'; 
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#000000';
    container.style.fontFamily = 'Arial, sans-serif';

    let content = `<h1 style="text-align: center; color: #10b981; text-transform: uppercase; font-size: 24px; border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-bottom: 30px;">PLANEJAMENTO TAF - SEMANA ${week} (FASE ${phase})</h1>`;
    
    for(let d = 1; d <= 5; d++) {
        const workout = workoutLibrary[phase][d];
        content += `
            <div style="margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; page-break-inside: avoid;">
                <h3 style="margin: 0 0 8px 0; color: #0f172a; text-transform: uppercase; font-size: 18px;">${diasLabel[d]} - ${workout.title}</h3>
                <p style="margin: 0; color: #334155; font-size: 14px; white-space: pre-wrap; line-height: 1.6;">${workout.desc}</p>
            </div>
        `;
    }
    content += `<p style="text-align: center; font-size: 12px; font-weight: bold; color: #10b981; margin-top: 40px; text-transform: uppercase; page-break-inside: avoid;">O suor poupa sangue. Cumpra a rotina.</p>`;
    
    container.innerHTML = content;
    
    // 3. ANEXA ao corpo da página (obrigatório para renderização correta)
    document.body.appendChild(container);

    // 4. Configura o formato A4
    const opt = {
        margin:       10, 
        filename:     `TAF_Semana_${week}.pdf`,
        image:        { type: 'jpeg', quality: 1.0 },
        html2canvas:  { 
            scale: 2, 
            useCORS: true, 
            windowWidth: 800 // Força o canvas a respeitar os 800px
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // 5. Gera o PDF e DESTRÓI o container temporário ao finalizar
    html2pdf().set(opt).from(container).save().then(() => {
        document.body.removeChild(container);
    });
}

// --- ESTADO DA APLICAÇÃO ---
let appState = {
    theme: 'dark',
    students: [],
    absenceReasons: {
        "SV": { label: "Serviço", color: "bg-blue-500" },
        "MIS": { label: "Missão", color: "bg-indigo-500" },
        "MED": { label: "Dispensado Médico", color: "bg-amber-500" },
        "FER": { label: "Férias", color: "bg-teal-500" },
        "SEM": { label: "Sem Justificativa", color: "bg-red-500" },
        "ORD": { label: "Ordem Superior", color: "bg-slate-500" }
    }
};

let tempStudentIdForAbsence = null;

function loadState() {
    const saved = localStorage.getItem('taf_manager_v3');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            appState.theme = parsed.theme || 'dark';
            appState.students = parsed.students || [];
            if (parsed.absenceReasons) appState.absenceReasons = parsed.absenceReasons;
        } catch(e) { console.error(e); }
    }
    
    if (!appState.absenceReasons["FER"]) appState.absenceReasons["FER"] = { label: "Férias", color: "bg-teal-500" };
    if (appState.absenceReasons["OUT"]) {
        delete appState.absenceReasons["OUT"];
        if (!appState.absenceReasons["ORD"]) appState.absenceReasons["ORD"] = { label: "Ordem Superior", color: "bg-slate-500" };
    }
    if (appState.absenceReasons["LES"]) delete appState.absenceReasons["LES"];
}

function saveState() {
    localStorage.setItem('taf_manager_v3', JSON.stringify(appState));
}

function downloadBackup() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `backup_taf_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(dlAnchorElem);
    dlAnchorElem.click();
    document.body.removeChild(dlAnchorElem);
}

function importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if(imported && imported.students) {
                appState = imported;
                saveState();
                applyTheme();
                renderStudents();
                alert("Backup importado com sucesso!");
            }
        } catch(err) {
            alert("Erro ao ler o arquivo de backup.");
        }
    };
    reader.readAsText(file);
}

// --- NAVEGAÇÃO ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');

    document.querySelectorAll('button[id^="btn-"]').forEach(btn => {
        btn.classList.remove('bg-emerald-600', 'text-white');
        btn.classList.add('bg-[var(--bg-card)]', 'text-[var(--text-primary)]');
    });

    const activeBtn = document.getElementById(`btn-${tabId}`);
    activeBtn.classList.remove('bg-[var(--bg-card)]', 'text-[var(--text-primary)]');
    activeBtn.classList.add('bg-emerald-600', 'text-white');
}

// --- ABA 1: TREINO DO DIA ---
function setToday() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    
    document.getElementById('date-picker').value = dateStr;
    const attendancePicker = document.getElementById('attendance-date-picker');
    if(attendancePicker) attendancePicker.value = dateStr;
    
    renderDailyWorkout();
}

function renderDailyWorkout() {
    const dateStr = document.getElementById('date-picker').value;
    if (!dateStr) return;

    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, month - 1, day);
    const info = getWorkoutInfo(date);
    const display = document.getElementById('workout-display');
    
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const nomeDia = diasSemana[date.getDay()];

    if (!info.week) {
        display.innerHTML = `
            <div class="text-center py-10 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-[var(--border-color)]">
                <p class="text-[var(--text-secondary)] font-bold">${info.title}</p>
                <p class="text-xs text-slate-500 mt-2">${info.desc}</p>
            </div>`;
        return;
    }

    const formattedDesc = info.desc.replace(/\n/g, '<br><br>');

    display.innerHTML = `
        <div class="flex flex-col gap-2 mb-4">
            <span class="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-1 rounded uppercase w-max">Fase ${info.phase} • Semana ${info.week}</span>
            <h3 class="text-xl md:text-2xl font-black uppercase text-[var(--text-primary)]">${info.title}</h3>
            <p class="text-[10px] md:text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider">${nomeDia}, ${day}/${month}/${year}</p>
        </div>
        <div class="bg-slate-100 dark:bg-slate-800/50 p-4 md:p-5 rounded-lg border border-[var(--border-color)]">
            <h4 class="text-xs font-bold uppercase mb-3 text-emerald-600 dark:text-emerald-500">Protocolo de Execução</h4>
            <p class="text-sm text-slate-800 dark:text-slate-300 leading-relaxed font-medium">${formattedDesc}</p>
        </div>
    `;
}

// --- ABA 2: MACROCICLO ---
function renderMacrocycle() {
    const accordion = document.getElementById('macro-accordion');
    accordion.innerHTML = '';
    const diasLabel = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    for (let w = 1; w <= TOTAL_WEEKS; w++) {
        const phase = getPhase(w);
        let phaseColor = phase === 1 ? 'text-emerald-600 dark:text-emerald-400' : (phase === 2 ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400');
        
        const weekContainer = document.createElement('div');
        weekContainer.className = "bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-[var(--border-color)] overflow-hidden";
        
        let daysHTML = `<div class="grid grid-cols-1 divide-y divide-[var(--border-color)] border-t border-[var(--border-color)]">`;
        for(let d = 1; d <= 5; d++) {
            const workout = workoutLibrary[phase][d];
            daysHTML += `
                <div class="p-3 flex flex-col sm:flex-row gap-2 sm:gap-4 hover:bg-slate-200/50 dark:hover:bg-slate-700/30 transition-colors">
                    <div class="w-12 shrink-0 font-bold text-xs text-[var(--text-secondary)] uppercase mt-0.5">${diasLabel[d]}</div>
                    <div>
                        <div class="font-bold text-xs text-[var(--text-primary)] uppercase">${workout.title}</div>
                        <div class="text-[10px] text-slate-600 dark:text-slate-400 mt-1">${workout.desc.replace(/\n/g, ' ')}</div>
                    </div>
                </div>
            `;
        }
        daysHTML += `</div>`;

        weekContainer.innerHTML = `
            <div class="p-4 bg-slate-200 dark:bg-slate-800 flex justify-between items-center cursor-pointer" onclick="this.nextElementSibling.classList.toggle('hidden')">
                <div class="flex items-center gap-3">
                    <div class="font-black uppercase text-sm text-[var(--text-primary)]">Semana ${w}</div>
                    <div class="text-[10px] font-bold ${phaseColor} uppercase border border-current px-2 py-0.5 rounded">Fase ${phase}</div>
                </div>
                <button onclick="event.stopPropagation(); printWeek(${w})" class="text-[9px] md:text-[10px] bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-[var(--text-primary)] px-2 py-1.5 rounded font-bold uppercase transition-all shadow-sm">🖨️ Imprimir</button>
            </div>
            <div class="${w === 1 ? '' : 'hidden'}">
                ${daysHTML}
            </div>
        `;
        accordion.appendChild(weekContainer);
    }
}

// --- ABA 3: CONTROLE DE TROPA E FALTAS ---
function getSelectedDate() {
    const attendancePicker = document.getElementById('attendance-date-picker');
    if (attendancePicker && attendancePicker.value) return attendancePicker.value;
    return document.getElementById('date-picker').value || new Date().toISOString().split('T')[0];
}

function addStudent(e) {
    e.preventDefault();
    const nameInput = document.getElementById('student-name');
    const name = nameInput.value.trim();
    if (!name) return;

    appState.students.push({ id: Date.now().toString(), name: name, totalClasses: 0, attendedClasses: 0, logs: [] });
    nameInput.value = '';
    saveState();
    renderStudents();
}

function markPresence(id) {
    const student = appState.students.find(s => s.id === id);
    if (!student) return;

    const date = getSelectedDate();
    if (student.logs.some(l => l.date === date)) {
        if(!confirm("Já existe um registro para este militar na data selecionada. Deseja registrar novamente (contabilizará +1)?")) return;
    }

    student.totalClasses += 1;
    student.attendedClasses += 1;
    student.logs.push({ date: date, present: true, reason: null });
    
    saveState();
    renderStudents();
}

function openAbsenceModal(id) {
    const student = appState.students.find(s => s.id === id);
    if (!student) return;

    tempStudentIdForAbsence = id;
    const selectedDate = getSelectedDate();
    const [year, month, day] = selectedDate.split('-');
    
    document.getElementById('absence-student-name').textContent = `Militar: ${student.name} | Data: ${day}/${month}/${year}`;
    
    const container = document.getElementById('absence-reasons-container');
    container.innerHTML = '';
    
    Object.keys(appState.absenceReasons).forEach(key => {
        const btn = document.createElement('button');
        btn.className = `w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase transition-all hover:opacity-80 text-white ${appState.absenceReasons[key].color}`;
        btn.textContent = appState.absenceReasons[key].label;
        btn.onclick = () => confirmAbsence(key);
        container.appendChild(btn);
    });

    document.getElementById('modal-absence').classList.remove('hidden');
}

function closeAbsenceModal() {
    document.getElementById('modal-absence').classList.add('hidden');
    tempStudentIdForAbsence = null;
}

function confirmAbsence(reasonKey) {
    const student = appState.students.find(s => s.id === tempStudentIdForAbsence);
    if (!student) return;

    const date = getSelectedDate();
    if (student.logs.some(l => l.date === date)) {
        if(!confirm("Já existe registro nesta data. Substituir contabilizará +1 aula.")) return;
    }

    student.totalClasses += 1;
    student.logs.push({ date: date, present: false, reason: reasonKey });
    
    saveState();
    renderStudents();
    closeAbsenceModal();
}

function removeStudent(id) {
    if(confirm("Confirma exclusão permanente deste militar?")) {
        appState.students = appState.students.filter(s => s.id !== id);
        saveState();
        renderStudents();
    }
}

function renderStudents() {
    const list = document.getElementById('students-list');
    list.innerHTML = '';

    if (appState.students.length === 0) {
        list.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-xs text-[var(--text-secondary)]">Efetivo vazio. Insira militares.</td></tr>`;
        return;
    }

    appState.students.forEach(student => {
        const percentage = student.totalClasses === 0 ? 0 : Math.round((student.attendedClasses / student.totalClasses) * 100);
        
        let barColor = 'bg-emerald-500';
        if (percentage < 75 && student.totalClasses > 0) barColor = 'bg-amber-500';
        if (percentage < 50 && student.totalClasses > 0) barColor = 'bg-red-500';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="py-3 px-3 md:px-4 font-bold text-[10px] md:text-xs flex items-center gap-2">
                <button onclick="removeStudent('${student.id}')" class="text-slate-500 hover:text-red-500 font-black px-1" title="Remover">×</button>
                <span class="truncate max-w-[100px] sm:max-w-xs">${student.name}</span>
            </td>
            <td class="py-3 px-3 md:px-4 align-middle">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-[8px] font-bold text-[var(--text-secondary)] uppercase hidden sm:inline">Presença</span>
                    <span class="text-[9px] md:text-[10px] font-bold ${percentage < 75 ? 'text-amber-500' : 'text-emerald-500'}">${percentage}%</span>
                </div>
                <div class="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-300 dark:border-slate-700">
                    <div class="${barColor} h-1.5 rounded-full transition-all" style="width: ${percentage}%"></div>
                </div>
            </td>
            <td class="py-3 px-3 md:px-4 text-center font-mono text-[9px] md:text-[10px] text-[var(--text-secondary)]">
                ${student.attendedClasses}/${student.totalClasses}
            </td>
            <td class="py-3 px-3 md:px-4 text-center">
                <div class="flex justify-center gap-1 sm:gap-2">
                    <button onclick="markPresence('${student.id}')" class="bg-emerald-100 dark:bg-emerald-600/20 hover:bg-emerald-600 text-emerald-700 dark:text-emerald-400 hover:text-white border border-emerald-500/30 font-bold px-2 py-1.5 rounded text-[8px] md:text-[9px] uppercase transition-all">P</button>
                    <button onclick="openAbsenceModal('${student.id}')" class="bg-red-100 dark:bg-red-900/20 hover:bg-red-800 text-red-700 dark:text-red-400 hover:text-white border border-red-800/50 font-bold px-2 py-1.5 rounded text-[8px] md:text-[9px] uppercase transition-all">F</button>
                </div>
            </td>
            <td class="py-3 px-3 md:px-4 text-center">
                <button onclick="openHistoryModal('${student.id}')" class="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 px-2 py-1.5 rounded text-[8px] md:text-[9px] uppercase font-bold transition-all">Ver</button>
            </td>
        `;
        list.appendChild(tr);
    });
}

// --- HISTÓRICO E ESTATÍSTICAS ---
function openHistoryModal(id) {
    const student = appState.students.find(s => s.id === id);
    if (!student) return;

    document.getElementById('history-student-name').textContent = student.name;
    const faltas = student.totalClasses - student.attendedClasses;
    document.getElementById('history-stats-general').textContent = `${student.attendedClasses} Presenças | ${faltas} Faltas (Total: ${student.totalClasses})`;

    const breakdown = document.getElementById('history-breakdown');
    breakdown.innerHTML = '';

    if (faltas === 0) {
        breakdown.innerHTML = '<p class="text-[10px] text-emerald-500 text-center font-bold">Militar 100% assíduo.</p>';
    } else {
        const reasonCounts = {};
        student.logs.filter(l => !l.present).forEach(l => {
            reasonCounts[l.reason] = (reasonCounts[l.reason] || 0) + 1;
        });

        Object.keys(reasonCounts).forEach(key => {
            const count = reasonCounts[key];
            const pct = Math.round((count / faltas) * 100);
            const reasonInfo = appState.absenceReasons[key] || { label: 'Desconhecido', color: 'bg-slate-500' };
            
            breakdown.innerHTML += `
                <div class="flex flex-col gap-0.5">
                    <div class="flex justify-between text-[9px] font-bold uppercase">
                        <span class="text-slate-600 dark:text-slate-300">${reasonInfo.label}</span>
                        <span class="text-slate-800 dark:text-white">${count} faltas (${pct}%)</span>
                    </div>
                    <div class="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div class="${reasonInfo.color} h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
        });
    }

    const logContainer = document.getElementById('history-log');
    logContainer.innerHTML = '';
    const sortedLogs = [...student.logs].sort((a,b) => new Date(b.date) - new Date(a.date));
    
    if (sortedLogs.length === 0) {
        logContainer.innerHTML = '<p class="text-center text-[var(--text-secondary)]">Sem registros.</p>';
    } else {
        sortedLogs.forEach(log => {
            const parts = log.date.split('-');
            const dateFmt = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : log.date;
            if (log.present) {
                logContainer.innerHTML += `<div class="flex justify-between border-b border-slate-300 dark:border-slate-700/50 pb-1"><span class="text-emerald-600 dark:text-emerald-500 font-bold">PRESENÇA</span> <span>${dateFmt}</span></div>`;
            } else {
                const rInfo = appState.absenceReasons[log.reason] || { label: 'Desconhecido' };
                logContainer.innerHTML += `<div class="flex justify-between border-b border-slate-300 dark:border-slate-700/50 pb-1"><span class="text-red-500 dark:text-red-400 font-bold">FALTA: ${rInfo.label}</span> <span>${dateFmt}</span></div>`;
            }
        });
    }

    document.getElementById('modal-history').classList.remove('hidden');
}

function closeHistoryModal() {
    document.getElementById('modal-history').classList.add('hidden');
}

// --- CONFIGURAÇÃO DE MOTIVOS ---
function openSettingsModal() {
    renderSettingsCategories();
    document.getElementById('modal-settings').classList.remove('hidden');
}

function closeSettingsModal() {
    document.getElementById('modal-settings').classList.add('hidden');
}

function renderSettingsCategories() {
    const list = document.getElementById('settings-categories-list');
    list.innerHTML = '';
    Object.keys(appState.absenceReasons).forEach(key => {
        const item = appState.absenceReasons[key];
        list.innerHTML += `
            <div class="flex justify-between items-center bg-slate-100 dark:bg-slate-800/50 p-2 rounded border border-[var(--border-color)]">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full ${item.color}"></div>
                    <span class="text-xs font-bold uppercase text-[var(--text-primary)]">${item.label}</span>
                </div>
                <button onclick="removeCategory('${key}')" class="text-red-500 hover:text-red-600 dark:hover:text-red-400 text-[10px] font-black px-2 uppercase">Excluir</button>
            </div>
        `;
    });
}

function addCategory(e) {
    e.preventDefault();
    const input = document.getElementById('new-category-name');
    const name = input.value.trim();
    if(!name) return;

    const key = 'CAT_' + Date.now().toString(36).toUpperCase();
    const colors = ['bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    appState.absenceReasons[key] = { label: name, color: randomColor };
    input.value = '';
    saveState();
    renderSettingsCategories();
}

function removeCategory(key) {
    if (Object.keys(appState.absenceReasons).length <= 1) {
        alert("Mantenha ao menos 1 motivo registrado.");
        return;
    }
    if(confirm("Excluir este motivo de falta? Faltas antigas registradas com este motivo perderão a descrição exata.")) {
        delete appState.absenceReasons[key];
        saveState();
        renderSettingsCategories();
    }
}

// --- INICIALIZAÇÃO ---
window.onload = () => {
    loadState();
    applyTheme();
    setToday();
    renderMacrocycle();
    renderStudents();
};