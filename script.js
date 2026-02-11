/* ARQUIVO: script.js */

function formatarMoeda(valor) {
    if (!valor || isNaN(valor)) return "";
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Função Inteligente para preencher a loja e posicionar o cursor
function setLoja(texto) {
    const inputLoja = document.getElementById('loja');
    
    // Verifica se o texto tem o caractere curinga "|"
    if (texto.includes('|')) {
        const partes = texto.split('|');
        inputLoja.value = partes.join(''); // Remove o pipe para o texto final
        update();
        inputLoja.focus();
        
        // Define a posição do cursor exatamente onde estava o "|"
        const posicaoCursor = partes[0].length;
        inputLoja.setSelectionRange(posicaoCursor, posicaoCursor);
    } else {
        inputLoja.value = texto;
        update();
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
    
    if(precoDeFormatado) {
        postagem += `💰 De: ~R$ ${precoDeFormatado}~\n`;
    }
    
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
    document.querySelectorAll('input').forEach(i => i.value = '');
    document.getElementById('freteGratis').checked = true;
    update();
    document.getElementById('produto').focus();
}

window.onload = () => {
    update();
    document.getElementById('produto').focus();
};
