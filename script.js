function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getValRaw(id) {
    const el = document.getElementById(id);
    if (!el || !el.value) return 0;
    return parseFloat(el.value.replace(/\./g, '').replace(',', '.')) || 0;
}

function setLoja(nomeLoja) {
    document.getElementById('loja').value = nomeLoja;
    update();
}

function update() {
    const produto = document.getElementById('produto').value.trim();
    const cupom = document.getElementById('cupom').value.trim();
    const comentario = document.getElementById('comentarioProd').value.trim();
    const numDe = getValRaw('precoDe');
    const numPor = getValRaw('precoPor');
    const qtdParcelas = parseInt(document.getElementById('qtdParcelas').value) || 0;
    const freteGratis = document.getElementById('freteGratis').checked;
    const link = document.getElementById('link').value.trim();
    const loja = document.getElementById('loja').value.trim();

    let linhas = [];

    if ( comentario ) {
        linhas.push(`💬 *${comentario}*`);
        linhas.push('');
    }

    if (produto) {
        const lojaTexto = loja ? ` _(${loja})_` : '';
        linhas.push(`📦 *${produto}*${lojaTexto}`);
        linhas.push('');
    }

    if (numDe > 0 && numDe > numPor) {
        let descontoStr = '';
        if (numPor > 0) {
            const desc = Math.round(((numDe - numPor) / numDe) * 100);
            descontoStr = ` (${desc}% OFF)`;
        }
        linhas.push(`❌ ~De R$ ${formatarMoeda(numDe)}~${descontoStr}`);
    }

    if (numPor > 0) {
        linhas.push(`🔥 *Por R$ ${formatarMoeda(numPor)}*`);
        if (qtdParcelas > 1) {
            const valorParcela = numPor / qtdParcelas;
            linhas.push(`💳 _ou em até ${qtdParcelas}x de R$ ${formatarMoeda(valorParcela)} sem juros_`);
        }
    }

    if (cupom) {
        linhas.push('');
        linhas.push(`🎟️ Cupom: *${cupom.toUpperCase()}*`);
    }

    if (freteGratis) {
        linhas.push(`🚚 *Frete Grátis*`);
    }

    if (link) {
        linhas.push('');
        linhas.push(`🛒 *Compre aqui:* ${link}`);
    }

    document.getElementById('result').innerText = linhas.join('\n');
}

function clearFields() {
    document.getElementById('produto').value = '';
    document.getElementById('cupom').value = '';
    document.getElementById('comentarioProd').value = '';
    document.getElementById('precoDe').value = '';
    document.getElementById('precoPor').value = '';
    document.getElementById('qtdParcelas').value = '';
    document.getElementById('freteGratis').checked = true;
    document.getElementById('link').value = '';
    document.getElementById('loja').value = '';
    update();
    document.getElementById('produto').focus();
}

function copyToClipboard() {
    const texto = document.getElementById('result').innerText;
    if (!texto) return;

    navigator.clipboard.writeText(texto).then(() => {
        const btn = document.getElementById('btnCopy');
        const originalText = btn.innerText;
        btn.innerText = '✅ Copiado!';
        setTimeout(() => {
            btn.innerText = originalText;
        }, 2000);
    });
}

// Permite clicar em qualquer lugar da caixinha cinza para marcar/desmarcar o Frete Grátis
document.querySelector('.checkbox-group').addEventListener('click', function(e) {
    if (e.target.tagName !== 'INPUT') {
        const cb = document.getElementById('freteGratis');
        cb.checked = !cb.checked;
        update();
    }
});

// Inicializa o preview vazio ao abrir a página
update();
