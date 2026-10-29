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

    let blocos = [];

    // 1. Bloco do Produto (e comentário, se preenchido)
    let blocoTopo = [];
    if (produto) {
        blocoTopo.push(`✅ ${produto}`);
    }
    if (comentario) {
        blocoTopo.push(`💬 _${comentario}_`);
    }
    if (blocoTopo.length > 0) {
        blocos.push(blocoTopo.join('\n'));
    }

    // 2. Bloco de Valores, Cupom e Frete
    let blocoMeio = [];
    if (cupom) {
        blocoMeio.push(`🏷️ Cupom: *${cupom.toUpperCase()}*`);
    }
    if (numDe > 0) {
        blocoMeio.push(`💰 De: R$ ${formatarMoeda(numDe)}`);
    }
    if (numPor > 0) {
        let tagDesconto = '';
        if (numDe > numPor) {
            const desc = Math.round(((numDe - numPor) / numDe) * 100);
            tagDesconto = ` \`-${desc}%\``;
        }
        blocoMeio.push(`🔥 Por: *R$ ${formatarMoeda(numPor)}*${tagDesconto}`);

        if (qtdParcelas > 1) {
            const valorParcela = numPor / qtdParcelas;
            blocoMeio.push(`💳 Até ${qtdParcelas}x de R$ ${formatarMoeda(valorParcela)} sem juros`);
        }
    }
    if (freteGratis) {
        blocoMeio.push(`🚚 Frete Grátis`);
    }
    if (blocoMeio.length > 0) {
        blocos.push(blocoMeio.join('\n'));
    }

    // 3. Bloco de Link e Loja
    let blocoRodape = [];
    if (link) {
        blocoRodape.push(`🔗 ${link}`);
    }
    if (loja) {
        blocoRodape.push(`> ${loja}`);
    }
    if (blocoRodape.length > 0) {
        blocos.push(blocoRodape.join('\n'));
    }

    // Junta os blocos separando com uma linha em branco exata
    document.getElementById('result').innerText = blocos.join('\n\n');
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

// Inicializa o preview ao abrir a página
update();
