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
    
    // Validação básica
    if(!document.getElementById('produto').value) {
        alert("Preencha pelo menos o nome do produto!");
        return;
    }
    if(!imagemBase64) {
        alert("Faça o upload da imagem do produto primeiro!");
        return;
    }

    btn.innerText = "⏳ Gerando...";
    btn.style.pointerEvents = "none";

    // 1. Preencher os dados no Molde do Story
    document.getElementById('st-title').innerText = document.getElementById('produto').value;
    document.getElementById('st-loja').innerText = document.getElementById('loja').value || "Loja Parceira";
    
    // Cálculos de preço para a imagem
    const getValRaw = (id) => parseFloat(document.getElementById(id).value.replace(/\./g, '').replace(',', '.')) || 0;
    let numDe = getValRaw('precoDe');
    let numPor = getValRaw('precoPor');
    let cupomText = document.getElementById('cupom').value;

    // Preço De
    if(numDe > 0) {
        document.getElementById('st-de-container').style.display = "block";
        document.getElementById('st-de').innerText = "R$ " + formatarMoeda(numDe);
    } else {
        document.getElementById('st-de-container').style.display = "none";
    }

    // Preço Por
    if(numPor > 0) {
        document.getElementById('st-por').innerText = "R$ " + formatarMoeda(numPor);
    }

    // Desconto %
    if (numDe > 0 && numPor > 0) {
        let calculo = Math.round(((numDe - numPor) / numDe) * 100);
        document.getElementById('st-desc').innerText = `-${calculo}%`;
        document.getElementById('st-desc').style.display = "block";
    } else {
        document.getElementById('st-desc').style.display = "none";
    }

    // Cupom
    if(cupomText) {
        document.getElementById('st-cupom-container').style.display = "block";
        document.getElementById('st-cupom').innerText = cupomText.toUpperCase();
    } else {
        document.getElementById('st-cupom-container').style.display = "none";
    }

    // 2. Usar o html2canvas para tirar o print da div invisível
    const storyElement = document.getElementById('story-export');
    
    html2canvas(storyElement, {
        scale: 1, // 1 para manter o 1080x1920 nativo
        useCORS: true,
        backgroundColor: null
    }).then(canvas => {
        // Criar link para baixar a imagem
        const link = document.createElement('a');
        link.download = `Story_${document.getElementById('produto').value.substring(0, 15).replace(/\s/g, '_')}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        // Resetar o botão
        btn.innerText = "✅ Imagem Baixada!";
        setTimeout(() => { 
            btn.innerText = "🖼️ Gerar Imagem"; 
            btn.style.pointerEvents = "auto";
        }, 3000);
    }).catch(err => {
        console.error("Erro ao gerar imagem:", err);
        alert("Ocorreu um erro ao gerar a imagem.");
        btn.innerText = "🖼️ Gerar Imagem"; 
        btn.style.pointerEvents = "auto";
    });
}
