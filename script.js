// --- NOVAS FUNÇÕES PARA IMAGEM ---

let imagemBase64 = ""; // Guarda a imagem carregada

function carregarImagemLocal(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagemBase64 = e.target.result;
            // Mostra um mini preview no painel esquerdo
            const previewImg = document.getElementById('previewImgLocal');
            previewImg.src = imagemBase64;
            previewImg.style.display = "block";
            
            // Joga no template do Story
            document.getElementById('st-img').src = imagemBase64;
        };
        reader.readAsDataURL(file);
    }
}

function gerarImagemStory() {
    const btn = document.getElementById('btnImg');
    
    if(!document.getElementById('produto').value) {
        alert("Preencha pelo menos o nome do produto!");
        return;
    }
    if(!imagemBase64) {
        alert("Faça o upload da IMAGEM DO PRODUTO (e não do fundo) no botão 'Escolher arquivo'!");
        return;
    }

    btn.innerText = "⏳ Gerando...";
    btn.style.pointerEvents = "none";

    // Preencher os dados no Molde do Story
    document.getElementById('st-title').innerText = document.getElementById('produto').value;
    document.getElementById('st-loja').innerText = document.getElementById('loja').value || "Loja Parceira";
    
    const getValRaw = (id) => parseFloat(document.getElementById(id).value.replace(/\./g, '').replace(',', '.')) || 0;
    let numDe = getValRaw('precoDe');
    let numPor = getValRaw('precoPor');
    let cupomText = document.getElementById('cupom').value;

    if(numDe > 0) {
        document.getElementById('st-de-container').style.display = "block";
        document.getElementById('st-de').innerText = "R$ " + formatarMoeda(numDe);
    } else {
        document.getElementById('st-de-container').style.display = "none";
    }

    if(numPor > 0) {
        document.getElementById('st-por').innerText = "R$ " + formatarMoeda(numPor);
    }

    if (numDe > 0 && numPor > 0) {
        let calculo = Math.round(((numDe - numPor) / numDe) * 100);
        document.getElementById('st-desc').innerText = `-${calculo}%`;
        document.getElementById('st-desc').style.display = "block";
    } else {
        document.getElementById('st-desc').style.display = "none";
    }

    if(cupomText) {
        document.getElementById('st-cupom-container').style.display = "block";
        document.getElementById('st-cupom').innerText = cupomText.toUpperCase();
    } else {
        document.getElementById('st-cupom-container').style.display = "none";
    }

    const storyElement = document.getElementById('story-export');
    
    // Gerar a imagem
    html2canvas(storyElement, {
        scale: 1, 
        useCORS: true,
        allowTaint: true, // Permite carregar a imagem de fundo local
        backgroundColor: null
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Story_${document.getElementById('produto').value.substring(0, 15).replace(/\s/g, '_')}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        btn.innerText = "✅ Imagem Baixada!";
        setTimeout(() => { 
            btn.innerText = "🖼️ Gerar Imagem"; 
            btn.style.pointerEvents = "auto";
        }, 3000);
    }).catch(err => {
        console.error("Erro:", err);
        alert("Erro! Se você abriu o index.html com 2 cliques, o navegador bloqueou o fundo por segurança. Use a extensão 'Live Server' do VS Code.");
        btn.innerText = "🖼️ Gerar Imagem"; 
        btn.style.pointerEvents = "auto";
    });
}
