function formatarMoeda(valor) {
    if (!valor || isNaN(valor)) return "";
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function setLoja(texto) {
    const inputLoja = document.getElementById('loja');
    if (texto.includes('|')) {
        const partes = texto.split('|');
        inputLoja.value = partes.join('');
        update();
        inputLoja.focus();
        const posicaoCursor = partes[0].length;
        inputLoja.setSelectionRange(posicaoCursor, posicaoCursor);
    } else {
        inputLoja.value = texto;
        update();
    }
}

// NOVA FUNÇÃO: Salva tudo no cache
function salvarEstado() {
    const estado = {
        produto: document.getElementById('produto').value,
        comentarioProd: document.getElementById('comentarioProd').value,
        cupom: document.getElementById('cupom').value,
        precoDe: document.getElementById('precoDe').value,
        precoPor: document.getElementById('precoPor').value,
        qtdParcelas: document.getElementById('qtdParcelas').value,
        freteGratis: document.getElementById('freteGratis').checked,
        link: document.getElementById('link').value,
        loja: document.getElementById('loja').value
    };
    localStorage.setItem('memoriaVitilho', JSON.stringify(estado));
}

// NOVA FUNÇÃO: Carrega tudo do cache
function carregarEstado() {
    const memoria = localStorage.getItem('memoriaVitilho');
    if (memoria) {
        const estado = JSON.parse(memoria);
        document.getElementById('produto').value = estado.produto || '';
        document.getElementById('comentarioProd').value = estado.comentarioProd || '';
        document.getElementById('cupom').value = estado.cupom || '';
        document.getElementById('precoDe').value = estado.precoDe || '';
        document.getElementById('precoPor').value = estado.precoPor || '';
        document.getElementById('qtdParcelas').value = estado.qtdParcelas || '';
        // Se for nulo, marca como true por padrão
        document.getElementById('freteGratis').checked = estado.freteGratis !== false; 
        document.getElementById('link').value = estado.link || '';
        document.getElementById('loja').value = estado.loja || '';
    }
}

function update() {
    const getValRaw = (id) => {
        let val = document.getElementById(id).value;
        if (!val) return 0;
        let cleanVal = val.replace(/\./g, '').replace(',', '.');
        return parseFloat(cleanVal) || 0;
    };
    
    const p = (id) => document.getElementById(id).value;
    const temFrete = document.getElementById('freteGratis').checked;
    
    let numDe = getValRaw('precoDe');
    let numPor = getValRaw('precoPor');
    let qtdParc = parseInt(p('qtdParcelas'));
    let descCalculado = "";

    if (numDe > 0 && numPor > 0) {
        let calculo = Math.round(((numDe - numPor) / numDe) * 100);
        descCalculado = (calculo > 0) ? `-${calculo}%` : `0%`;
    }

    const precoDeFormatado = formatarMoeda(numDe);
    const precoPorFormatado = formatarMoeda(numPor);

    let postagem = `✅ ${p('produto')}\n`;
    if(p('comentarioProd')) postagem += `> ${p('comentarioProd')}\n\n`;
    else postagem += `\n`;

    if(p('cupom')) postagem += `🏷️ Cupom: *${p('cupom').toUpperCase()}*\n`;
    
    if(precoDeFormatado) postagem += `💰 De: ~R$ ${precoDeFormatado}~\n`;
    
    if(precoPorFormatado) {
        let tagDesc = descCalculado ? ` \`${descCalculado}\`` : "";
        postagem += `🔥 Por: *R$ ${precoPorFormatado}*${tagDesc}\n`;
    }
    
    if(qtdParc > 1 && numPor > 0) {
        let valorParcela = numPor / qtdParc;
        postagem += `💳 Parcelamento: *${qtdParc}x de R$ ${formatarMoeda(valorParcela)} SEM JUROS*\n`;
    }
    
    if(temFrete) postagem += `🚚 Frete Grátis\n`;
    if(p('link')) postagem += `\n🔗 ${p('link')}\n`;
    if(p('loja')) postagem += `> ${p('loja')}`;

    document.getElementById('result').innerText = postagem;
    
    // CHAMA O SALVAMENTO TODA VEZ QUE ALGO É DIGITADO
    salvarEstado();
}

function copyToClipboard() {
    const text = document.getElementById('result').innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.btn-copy');
        btn.innerText = "✅ Copiado!";
        setTimeout(() => { btn.innerText = "Copiar Postagem"; }, 2000);
    });
}

function clearFields() {
    document.querySelectorAll('input[type="text"], input[type="number"]').forEach(i => i.value = '');
    document.getElementById('freteGratis').checked = true;
    
    // LIMPA A MEMÓRIA TAMBÉM
    localStorage.removeItem('memoriaVitilho');
    
    update();
    document.getElementById('produto').focus();
}

window.onload = () => {
    carregarEstado(); // Puxa os dados antes de montar a tela
    update();
    document.getElementById('produto').focus();
};
