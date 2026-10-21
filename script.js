// Elementos do DOM
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const btnNovaFrase = document.getElementById('btn-nova-frase');
const btnCopiar = document.getElementById('btn-copiar');
const btnWhats = document.getElementById('btn-whats');
const card = document.getElementById('quote-card');

// Lista de cores de fundo para alternar a cada nova frase
const gradientes = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
    'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)'
];

// Função principal que consome a API
async function buscarFrase() {
    try {
        card.classList.add('loading');
        quoteText.innerText = 'Buscando inspiração... ⏳';
        
        // Requisição para a API de conselhos/frases
        const resposta = await fetch('https://api.adviceslip.com/advice');
        if (!resposta.ok) throw new Error('Erro ao buscar frase');
        
        const dados = await resposta.json();
        const fraseIngles = dados.slip.advice;

        // Traduzindo a frase usando uma API pública gratuita de tradução
        const resTraducao = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(fraseIngles)}&langpair=en|pt-BR`
        );
        const dadosTraducao = await resTraducao.json();
        const frasePT = dadosTraducao.responseData.translatedText;

        // Exibe no HTML
        quoteText.innerText = `"${frasePT}"`;
        quoteAuthor.innerText = `- Sabedoria do Dia #${dados.slip.id}`;

        // Mudar o fundo aleatoriamente
        const corAleatoria = gradientes[Math.floor(Math.random() * gradientes.length)];
        document.body.style.background = corAleatoria;

    } catch (erro) {
        quoteText.innerText = '"A persistência é o caminho do êxito."';
        quoteAuthor.innerText = '- Charles Chaplin (Modo Offline)';
    } finally {
        card.classList.remove('loading');
    }
}

// Função para copiar para a área de transferência
btnCopiar.addEventListener('click', () => {
    const textoParaCopiar = `${quoteText.innerText} ${quoteAuthor.innerText}`;
    navigator.clipboard.writeText(textoParaCopiar).then(() => {
        alert('📋 Frase copiada para a área de transferência!');
    });
});

// Função para compartilhar via WhatsApp
btnWhats.addEventListener('click', () => {
    const mensagem = encodeURIComponent(`Olha essa frase: ${quoteText.innerText} ${quoteAuthor.innerText}`);
    window.open(`https://api.whatsapp.com/send?text=${mensagem}`, '_blank');
});

// Evento do botão
btnNovaFrase.addEventListener('click', buscarFrase);

// Carregar uma frase assim que abrir a página
buscarFrase();