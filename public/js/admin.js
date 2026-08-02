//INICIALIZAÇÃO
let paginaAtual = 'dashboard';

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    }
    
    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active')
    }
    
    menuToggle?.addEventListener('click', () => {
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    })

    overlay.addEventListener("click", closeSidebar);
    
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });
    
    
});

document.addEventListener('DOMContentLoaded', async () => {


    const token = sessionStorage.getItem('token');
    const perfil = sessionStorage.getItem('perfil');

    if (!token || perfil !== 'admin') {
        window.location.href = '../index.html';
        return;
    }

    try {
        const dados = await api.verificarToken();
        document.getElementById('nomeUsuario').textContent = dados.nome || 'Admin';
        document.getElementById('avatarInicial').textContent = (dados.nome || 'A').charAt(0).toUpperCase();
        carregarDashboard();
        iniciarPollingNotificacoes();
    } catch (erro) {
        throw new Error("epha nao verificou bem")
        window.location.href = '../index.html';
    }
});

//NAVEGAÇÃO 
document.querySelector('.sidebar-nav').addEventListener('click', (e) => {
    e.preventDefault();
    const link = e.target.closest('a');
    if (!link || !link.dataset.page) return;

    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');

    const page = link.dataset.page;
    paginaAtual = page;
    switch (page) {
        case 'dashboard': carregarDashboard(); break;
        case 'jogos': carregarJogos(); break;
        case 'energia': carregarEnergia(); break;
        case 'aparelhos': carregarAparelhos(); break;
    }
    document.getElementById('pageTitle').textContent = link.textContent.trim();
});

//DASHBOARD
async function carregarDashboard() {
    try {
        const hoje = new Date().toISOString().split('T')[0];
        const [aparelhos, energia, jogosHoje, ganhoHoje, energiaRestante] = await Promise.all([
            api.getAparelhos(),
            api.getEnergiaConfig(),
            api.getJogos(hoje),
            api.getGanhoDia(hoje),
            api.getEnergiaRestante()
        ]);

        const arrayAparelhos = Array.isArray(aparelhos) ? aparelhos : (aparelhos.items || []);
        const EnergiaRestante = energia.total_disponivel_kwh;
        const arrayJogos = Array.isArray(jogosHoje) ? jogosHoje : (jogosHoje.items || []);

        const totalAparelhos = arrayAparelhos.length;
        const precisamManutencao = arrayAparelhos.filter(a => a.precisa_manutencao).length;
        const totalJogos = arrayJogos.reduce((s, j) => s + Number(j.quantidade), 0);
        const energiaClass = EnergiaRestante < 20 ? 'low' : EnergiaRestante < 50 ? 'mid' : 'good';

        

        document.getElementById("contentArea").innerHTML = `
            <div class="stats-grid" style="margin-bottom: 20px;">
                <div class="stat-card animate-fade-up">
                    <div class="card-icon icon-blue">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                            <line x1="8" y1="21" x2="16" y2="21"/>
                            <line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                    </div>
                    <div class="card-value">${totalAparelhos}</div>
                    <div class="card-label">Total de Aparelhos</div>
                </div>
                <div class="stat-card animate-fade-up delay-1">
                    <div class="card-icon ${precisamManutencao > 0 ? "icon-danger" : "icon-green"}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                    </svg>
                    </div>
                    <div class="card-value">${precisamManutencao}</div>
                    <div class="card-label">Precisam de Manutenção</div>
                </div>
                <div class="stat-card animate-fade-up delay-2">
                    <div class="card-icon icon-purple">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="1" x2="12" y2="3"/>
                        <line x1="12" y1="21" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        <line x1="12" y1="12" x2="12" y2="12.01"/>
                    </svg>
                    </div>
                    <div class="card-value">${totalJogos}</div>
                    <div class="card-label">Jogos Hoje</div>
                </div>
                <div class="stat-card animate-fade-up delay-3">
                    <div class="card-icon icon-green">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="1" x2="12" y2="3"/>
                        <line x1="12" y1="21" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        <line x1="12" y1="12" x2="12" y2="12.01"/>
                    </svg>
                    </div>
                    <div class="card-value">${ganhoHoje.toLocaleString("pt-BR")} MTS</div>
                    <div class="card-label">Ganho Hoje</div>
                </div>
            </div>

            <div class="energy-meter animate-fade-up delay-1">
                <div class="energy-circle ${energiaClass}" style="width:120px;height:120px;font-size:32px;">
                    ${EnergiaRestante}<small style="font-size:12px;display:block;">kWh</small>
                </div>
                <div class="card-label">Energia Restante Estimada</div>
                <div style="font-size:13px;color:var(--text-secondary);">Contador: ${energia.numero_contador || "N/A"}</div>
            </div>

            <div class="quick-report animate-fade-up delay-2">
                <h3><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                </svg> Reporte Rápido</h3>
                <div class="quick-form">
                    <div class="form-group-modal">
                        <label>Energia Restante (kWh)</label>
                        <input type="number" id="reportEnergia" value="${EnergiaRestante}">
                    </div>
                    <div class="form-group-modal">
                        <label>Aparelho com Problema</label>
                        <select id="reportAparelho">
                            <option value="">Nenhum</option>
                            ${arrayAparelhos.map((a) => `<option value="${a.id}">${a.nome}</option>`).join("")}
                        </select>
                    </div>
                    <div class="form-group-modal">
                        <label>Observação</label>
                        <input type="text" id="reportObs" placeholder="Descreva o problema...">
                    </div>
                    <button class="btn btn-primary" onclick="enviarReporte()"> Enviar Reporte</button>
                </div>
            </div>

            <div class="table-container animate-fade-up delay-3" style="margin-top:20px;">
                <div class="table-header"><h3><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg> Aparelhos com Manutenção Pendente</h3></div>
                <table>
                    <thead><tr><th>Nome</th><th>Status</th><th>Observação</th></tr></thead>
                    <tbody>
                        ${
                          arrayAparelhos
                            .filter((a) => a.precisa_manutencao)
                            .map(
                              (a) => `
                            <tr>
                                <td>${a.nome}</td>
                                <td><span class="status-badge status-danger">Urgente</span></td>
                                <td>${a.observacao || "—"}</td>
                            </tr>
                        `,
                            )
                            .join("") ||
                          '<tr><td colspan="3" style="color:var(--text-secondary);text-align:center;">Nenhum pendente  </td></tr>'
                        }
                    </tbody>
                </table>
            </div>
        `;
    } catch (erro) {
        showToast(erro.message, 'danger');
    }
}

async function enviarReporte() {
    const energiaKwh = parseInt(document.getElementById('reportEnergia')?.value) || 0;
    const aparelhoId = parseInt(document.getElementById('reportAparelho')?.value) || null;
    const observacao = document.getElementById('reportObs')?.value || '';

    try {
        if (aparelhoId) {
            const aparelhos = await api.getAparelhos();
            const aparelho = aparelhos.find(a => a.id === aparelhoId);
            if (aparelho) {
                await api.editarAparelho(aparelhoId, {
                    precisa_manutencao: true,
                    status: 'warning',
                    observacao: observacao || aparelho.observacao
                });
            }
        }
        if (energiaKwh) {
            await api.definirTotalDisponivel(energiaKwh);
        }

        showToast('Reporte enviado com sucesso!', 'success');
        carregarDashboard();
    } catch (erro) {
        showToast('Erro ao enviar reporte: ' + erro.message, 'danger');
    }
}

// JOGOS 
async function carregarJogos() {
    const hoje = new Date().toISOString().split('T')[0];
    try {
        const jogos = await api.getJogos(hoje);
        const arrayJogos = Array.isArray(jogos) ? jogos : (jogos.items || []);
        const totalJogos = arrayJogos.reduce((s, j) => s + j.quantidade, 0);
        const totalGanho = arrayJogos.reduce((s, j) => s + Number(j.total || j.quantidade * j.valor_por_jogo), 0);

        document.getElementById("contentArea").innerHTML = `
            <div class="stats-grid" style="margin-bottom:20px;">
                <div class="stat-card animate-fade-up">
                    <div class="card-icon icon-blue"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg></div>
                    <div class="card-value">${totalJogos}</div>
                    <div class="card-label">Jogos Hoje</div>
                </div>
                <div class="stat-card animate-fade-up delay-1">
                    <div class="card-icon icon-green"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="1" x2="12" y2="3"/>
                        <line x1="12" y1="21" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        <line x1="12" y1="12" x2="12" y2="12.01"/>
                    </svg>
                    </div>
                    <div class="card-value">${totalGanho.toLocaleString("pt-BR")} MTS</div>
                    <div class="card-label">Ganho Hoje</div>
                </div>
            </div>

            <div class="table-container animate-fade-up delay-2">
                <div class="table-header"><h3>&plus; Registrar Novo Jogo</h3></div>
                <div style="padding:16px;display:flex;gap:10px;flex-wrap:wrap;align-items:end;">
                    <div class="form-group-modal" style="flex:1;min-width:140px;">
                        <label>Nome do Jogo</label>
                        <input type="text" id="nomeJogo" placeholder="Ex: FIFA 24">
                    </div>
                    <div class="form-group-modal" style="flex:1;min-width:80px;">
                        <label>Quantidade</label>
                        <input type="number" id="quantidade" value="1" min="1">
                    </div>
                    <div class="form-group-modal" style="flex:1;min-width:100px;">
                        <label>Valor/Jogo (MTS)</label>
                        <input type="number" id="valorporjogo" value="50">
                    </div>
                    <button class="btn btn-primary" onclick="registrarJogo()">&plus; Adicionar</button>
                </div>
            </div>

            <div class="table-container animate-fade-up delay-3" style="margin-top:20px;">
                <div class="table-header"><h3><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                </svg> Jogos de Hoje (${hoje})</h3></div>
                <table>
                    <thead><tr><th>Jogo</th><th>Qtd</th><th>Valor</th><th>Total</th><th>Ações</th></tr></thead>
                    <tbody>
                        ${
                          arrayJogos
                            .map(
                              (j) => `
                            <tr>
                                <td>${j.jogo}</td>
                                <td>${j.quantidade}</td>
                                <td>${j.valor_por_jogo} MTS</td>
                                <td><strong>${(j.total || j.quantidade * j.valor_por_jogo).toLocaleString("pt-BR")} MTS</strong></td>
                                <td><button class="btn btn-danger btn-sm" onclick="deletarJogo(${j.id})"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                    <line x1="10" y1="11" x2="10" y2="17"/>
                                    <line x1="14" y1="11" x2="14" y2="17"/>
                                </svg></button></td>
                            </tr>
                        `,
                            )
                            .join("") ||
                          '<tr><td colspan="5" style="color:var(--text-secondary);text-align:center;">Nenhum jogo hoje</td></tr>'
                        }
                    </tbody>
                </table>
            </div>
        `;
    } catch (erro) {
        showToast(erro.message, 'danger');
    }
}

async function registrarJogo() {
    const nomeJogo = document.getElementById('nomeJogo')?.value.trim();
    const quantidade = parseInt(document.getElementById('quantidade')?.value) || 1;
    const valorporjogo = parseFloat(document.getElementById('valorporjogo')?.value) || 0;

    if (!nomeJogo || valorporjogo <= 0) {
        showToast('Preencha todos os campos', 'warning');
        return;
    }

    try {
        const hoje = new Date().toISOString().split('T')[0];
        await api.registrarJogo({ nomeJogo: nomeJogo, quantidade: quantidade, valorporjogo: valorporjogo, data: hoje });
        showToast('Jogo registrado!', 'success');
        carregarJogos();
    } catch (erro) {
        showToast(erro.message, 'danger');
    }
}

async function deletarJogo(id) {
    if (!confirm('Remover este registro?')) return;
    try {
        await api.deletarJogo(id);
        showToast('Registro removido', 'info');
        carregarJogos();
    } catch (erro) {
        showToast(erro.message, 'danger');
    }
}

//ENERGIA
async function ajustarValorEnergia() {

    const novoTotal = prompt("novo total em kwh:");

    if (novoTotal === null) return;
    
    const valor = parseFloat(novoTotal);
    if (isNaN(valor)) {
        showToast("Valor invalido", 'warning');
        return;
    }
    try {
        await api.definirTotalDisponivel(valor);
        showToast("Saldo de energia atualizado!", "sucess");
        carregarDashboard();
    } catch (erro) {
        showToast("Erro ao ajustar valor de energia" + erro.message, 'danger');
    }
}

async function carregarEnergia() {
    try {
        const [energia, recargas, restante] = await Promise.all([
            api.getEnergiaConfig(),
            api.getRecargas(),
            api.getEnergiaRestante()
        ]);


        if (restante === null) {
            showToast(restante)
        }

        const energiaClass =
          energia.total_disponivel_kwh < 20
            ? "low"
            : energia.total_disponivel_kwh < 50
              ? "mid"
              : "good";

        document.getElementById("contentArea").innerHTML = `
            <div class="stats-grid" style="margin-bottom:20px;">
                <div class="energy-meter animate-fade-up" style="grid-column:span 2;">
                    <div class="energy-circle ${energiaClass}" style="width:120px;height:120px;font-size:32px;">
                        ${energia.total_disponivel_kwh}<small style="font-size:12px;display:block;">kWh</small>
                    </div>
                    <div class="card-label">Energia Restante</div>
                    <div style="font-size:13px;color:var(--text-secondary);">Contador: ${energia?.numero_contador || "N/A"}</div>
                </div>
            </div>

            <div class="table-container animate-fade-up delay-2">
                <div class="table-header"><h3>📋 Histórico de Recargas</h3></div>
                <table>
                    <thead><tr><th>Data</th><th>kWh</th><th>Valor Pago</th></tr></thead>
                    <tbody>
                        ${
                          recargas
                            .slice(0, 10)
                            .map(
                              (r) => `
                            <tr>
                                <td>${r.data}</td>
                                <td>${r.valor_kwh} kWh</td>
                                <td>${r.valor_pago.toLocaleString("pt-BR")} MTS</td>
                            </tr>
                        `,
                            )
                            .join("") ||
                          '<tr><td colspan="3" style="color:var(--text-secondary);text-align:center;">Nenhuma recarga</td></tr>'
                        }
                    </tbody>
                </table>
            </div>
        `;
    } catch (erro) {
        showToast(erro.message, 'danger');
    }
}

// APARELHOS
async function carregarAparelhos() {
    try {
        const aparelhos = await api.getAparelhos();
        
        if (aparelhos.length === 0) {
            document.getElementById('contentArea').innerHTML = "Nenhum aparelho cadastrado";
        } else {
            document.getElementById("contentArea").innerHTML = `
            <div class="table-container animate-fade-up">
                <div class="table-header"><h3><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                </svg> Todos os Aparelhos</h3></div>
                <table>
                    <thead><tr><th>Nome</th><th>Tipo</th><th>Status</th><th>Manutenção</th><th>Uso (h)</th></tr></thead>
                    <tbody>
                        ${aparelhos
                          .map(
                            (a) => `
                            <tr>
                                <td><strong>${a.nome}</strong></td>
                                <td>${a.tipo}</td>
                                <td><span class="status-badge ${a.status === "ok" ? "status-ok" : a.status === "warning" ? "status-warning" : "status-danger"}">${a.status === "ok" ? "OK" : a.status === "warning" ? "Atenção" : "Crítico"}</span></td>
                                <td>${a.precisa_manutencao ? '<span class="status-badge status-danger">Sim</span>' : '<span class="status-badge status-ok">Não</span>'}</td>
                                <td>${a.uso_hoje || 0}h</td>
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
            `;
        }
    } catch (erro) {
        showToast(erro.message, 'danger');
    }
}

// NOTIFICAÇÕES
async function mostrarNotificacoes() {
    try {
        const notificacoes = await api.getNotificacoesNaoLidas();
        const modalContent = document.getElementById('modalContent');
        modalContent.innerHTML = `
            <h3><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg> Notificações</h3>
            <div style="max-height:350px;overflow-y:auto;">
                ${
                  notificacoes.length > 0
                    ? notificacoes
                        .map(
                          (n) => `
                    <div style="padding:10px;border-left:3px solid ${n.tipo === "danger" ? "var(--danger)" : n.tipo === "warning" ? "var(--warning)" : "var(--accent)"};margin-bottom:8px;background:rgba(255,255,255,0.02);border-radius:6px;">
                        <div style="font-size:12px;color:var(--text-secondary);">${new Date(n.data_criacao).toLocaleString("pt-BR")}</div>
                        <div style="font-size:13px;">${n.mensagem}</div>
                    </div>
                `,
                        )
                        .join("")
                    : '<p style="color:var(--text-secondary);">Nenhuma notificação.</p>'
                }
            </div>
            <div class="modal-actions">
                <button class="btn btn-outline" onclick="fecharModal()">Fechar</button>
                ${notificacoes.length > 0 ? '<button class="btn btn-primary" onclick="marcarLidas()"> Marcar como Lidas</button>' : ""}
            </div>
        `;
        document.getElementById('modalOverlay').classList.remove('hidden');
    } catch (erro) {
        showToast(erro.message, 'danger');
    }
}

async function marcarLidas() {
    try {
        await api.marcarNotificacoesLidas();
        fecharModal();
        atualizarBadge(0);
        showToast('Notificações marcadas como lidas', 'success');
    } catch (erro) {
        showToast(erro.message, 'danger');
    }
}

function fecharModal() {
    document.getElementById('modalOverlay').classList.add('hidden');
}

//UTILITÁRIOS 
function showToast(mensagem, tipo = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    const icones = { success: '✅', warning: '⚠️', danger: '🔴', info: 'ℹ️' };
    toast.innerHTML = `<span>${icones[tipo] || 'ℹ️'}</span> ${mensagem}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = '0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function atualizarBadge(count) {
    const badge = document.getElementById('notifBadge');
    if (count > 0) {
        badge.textContent = count;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

async function iniciarPollingNotificacoes() {
    setInterval(async () => {
        try {
            const contagem = await api.getContagemNotificacoes();
            atualizarBadge(contagem);
        } catch (erro) {
            return;
            // ignora erros de polling
        }
    }, 15000);
}

function logout() {
    sessionStorage.clear();
    window.location.href = '../index.html';
}

// Fechar modal ao clicar fora
document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalOverlay')) {
        fecharModal();
    }
});