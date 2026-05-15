// Preencher os dropdowns com as peças do banco
document.addEventListener('DOMContentLoaded', () => {
    // Filtra e popula
    populateSelect('cpu', pecas.filter(p => p.tipo === 'cpu'));
    populateSelect('mobo', pecas.filter(p => p.tipo === 'mobo'));
    populateSelect('gpu', pecas.filter(p => p.tipo === 'gpu'));
    populateSelect('ram', pecas.filter(p => p.tipo === 'ram'));
    populateSelect('psu', pecas.filter(p => p.tipo === 'psu'));
    populateSelect('case', pecas.filter(p => p.tipo === 'case'));

    // Menu lateral
    const toggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const close = document.getElementById('close-sidebar');

    toggle.addEventListener('click', () => sidebar.classList.add('active'));
    close.addEventListener('click', () => sidebar.classList.remove('active'));

    // Verificar compatibilidade
    document.getElementById('check-btn').addEventListener('click', verificarCompatibilidade);
});

function populateSelect(id, items) {
    const select = document.getElementById(id);
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.nome;
        select.appendChild(option);
    });
}

function verificarCompatibilidade() {
    const cpuId = document.getElementById('cpu').value;
    const moboId = document.getElementById('mobo').value;
    const gpuId = document.getElementById('gpu').value;
    const ramId = document.getElementById('ram').value;
    const psuId = document.getElementById('psu').value;
    const caseId = document.getElementById('case').value;

    if (!cpuId || !moboId || !gpuId || !ramId || !psuId || !caseId) {
        alert('Por favor, selecione todas as peças.');
        return;
    }

    const cpu = pecas.find(p => p.id == cpuId);
    const mobo = pecas.find(p => p.id == moboId);
    const gpu = pecas.find(p => p.id == gpuId);
    const ram = pecas.find(p => p.id == ramId);
    const psu = pecas.find(p => p.id == psuId);
    const caseItem = pecas.find(p => p.id == caseId);

    let messages = [];
    let compatível = true;

    // Soquete
    if (cpu.soquete !== mobo.soquete) {
        messages.push(`❌ Soquete incompatível: a CPU usa ${cpu.soquete}, mas a placa-mãe é ${mobo.soquete}.`);
        compatível = false;
    } else {
        messages.push(`✅ Soquete compatível (${cpu.soquete}).`);
    }

    // Geração da CPU e chipset (simplificado)
    if (mobo.chipset && cpu.geracao) {
        if (!cpu.chipsetsCompativeis.includes(mobo.chipset)) {
            messages.push(`❌ O chipset ${mobo.chipset} pode não suportar essa geração de CPU sem atualização de BIOS. Verifique.`);
            compatível = false;
        } else {
            messages.push(`✅ Chipset ${mobo.chipset} compatível com a CPU.`);
        }
    }

   // RAM (usa 'tipoRam')
if (cpu.tipoRam !== ram.tipoRam || mobo.tipoRam !== ram.tipoRam) {
    messages.push(`❌ Tipo de RAM incompatível: requer ${cpu.tipoRam}, mas a memória selecionada é ${ram.tipoRam}.`);
    compatível = false;
} else {
    messages.push(`✅ Tipo de RAM compatível (${ram.tipoRam}).`);
}

    // Fonte (TDP total com folga de 20%)
    const tdpTotal = cpu.tdp + gpu.tdp + 150; // margem para outros componentes
    const psuNeeded = Math.ceil(tdpTotal * 1.2);
    if (psu.potencia < psuNeeded) {
        messages.push(`❌ Fonte insuficiente: necessário ~${psuNeeded}W (recomendado ${psuNeeded}W), mas a fonte escolhida é de ${psu.potencia}W.`);
        compatível = false;
    } else {
        messages.push(`✅ Fonte de ${psu.potencia}W suficiente (consumo estimado ${psuNeeded}W).`);
    }

    // Gabinete x placa-mãe (formato)
    const formatos = {
        'ATX': ['ATX', 'E-ATX'],
        'Micro-ATX': ['Micro-ATX', 'ATX'],
        'Mini-ITX': ['Mini-ITX', 'Micro-ATX', 'ATX']
    };
    if (caseItem.suportaFormato && mobo.formato) {
        if (caseItem.suportaFormato.includes(mobo.formato)) {
            messages.push(`✅ Gabinete suporta placas-mãe ${mobo.formato}.`);
        } else {
            messages.push(`❌ O gabinete não suporta placas-mãe ${mobo.formato}.`);
            compatível = false;
        }
    } else {
        messages.push(`⚠️ Verifique manualmente se o gabinete suporta o formato da placa-mãe.`);
    }

    const resultBox = document.getElementById('result');
    resultBox.innerHTML = messages.join('\n');
    resultBox.style.borderLeft = compatível ? '4px solid #22c55e' : '4px solid #ef4444';
}