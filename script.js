// Tenta carregar o carrinho salvo no navegador, ou começa um vazio []
let carrinho = JSON.parse(localStorage.getItem("meu_carrinho")) || [];

// --- CONTROLE DO CARRINHO LATERAL ---
// Função para abrir e fechar a barra lateral
window.toggleCarrinho = function () {
  const carrinhoLateral = document.getElementById("carrinho-lateral");
  const overlay = document.getElementById("carrinho-overlay");

  if (carrinhoLateral) {
    carrinhoLateral.classList.toggle("open");
  }
  if (overlay) {
    overlay.classList.toggle("open");
  }
};

// NAVBAR TOGGLE (Mobile)
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("open");
    navMenu.classList.toggle("open");
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("open");
      navMenu.classList.remove("open");
    });
  });
}

// FORMULÁRIO DE CONTATO
const formContato = document.getElementById("formContato");
if (formContato) {
  formContato.addEventListener("submit", (e) => {
    e.preventDefault();
    const feedback = document.getElementById("formMensagem");
    feedback.textContent =
      "✅ Mensagem enviada com sucesso! Retornaremos em breve.";
    feedback.className = "form-feedback sucesso";
    formContato.reset();
    setTimeout(() => {
      feedback.textContent = "";
      feedback.className = "form-feedback";
    }, 5000);
  });
}

// SUPABASE — CONFIGURAÇÃO DO BANCO DE DADOS
const vitrine = document.getElementById("vitrine");

if (vitrine && window.supabase) {
  const supabaseUrl = "https://xavhufelbyafunjefnae.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhhdmh1ZmVsYnlhZnVuamVmbmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjIzNjYsImV4cCI6MjA4OTgzODM2Nn0.yC5Ody7QRtuyGWIu_xDozjvM5CRXK_zVumQUnnqQfOc";
  const banco = window.supabase.createClient(supabaseUrl, supabaseKey);

  async function carregarCatalogo() {
    let { data: produtos, error } = await banco.from("produtos").select("*");

    if (error) {
      console.error("Erro ao buscar dados:", error);
      return;
    }

    vitrine.innerHTML = "";

    produtos.forEach((item) => {
      let precoFormatado = Number(item.preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      let div = document.createElement("div");
      div.className = "card-produto";
      div.innerHTML = `
            <img src="${item.img}" width="150">
            <h3>${item.nome}</h3>
            <p>${precoFormatado}</p>
            <button onclick="adicionarAoCarrinho('${item.nome}', ${item.preco})">
                Adicionar ao Carrinho
            </button>
        `;
      vitrine.appendChild(div);
    });
  }

  // 1. ADICIONAR ITEM
  window.adicionarAoCarrinho = function (nome, preco) {
    const item = { nome, preco };
    carrinho.push(item);
    atualizarCarrinho();
  };

  // 2. REMOVER ITEM ESPECÍFICO
  window.removerDoCarrinho = function (index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
  };

  // 3. ATUALIZAR A TELA, O CONTADOR E O LOCALSTORAGE
  function atualizarCarrinho() {
    const listaHtml = document.getElementById("lista-carrinho");
    const totalHtml = document.getElementById("valor-total");
    const cartCount = document.getElementById("cart-count"); // Pega o contador do ícone

    listaHtml.innerHTML = "";
    let somaTotal = 0;

    if (carrinho.length === 0) {
      listaHtml.innerHTML = "<p>Seu carrinho está vazio.</p>";
    } else {
      carrinho.forEach((item, index) => {
        somaTotal += item.preco;

        listaHtml.innerHTML += `
          <li>
            <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>
            <button class="btn-remover" onclick="removerDoCarrinho(${index})">❌</button>
          </li>
        `;
      });
    }

    totalHtml.innerText = somaTotal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    // Atualiza o numerozinho no ícone do carrinho
    if (cartCount) {
      cartCount.innerText = carrinho.length;
    }

    localStorage.setItem("meu_carrinho", JSON.stringify(carrinho));
  }

  // 4. LIMPAR TUDO
  window.esvaziarCarrinho = function () {
    if (confirm("Deseja realmente limpar seu carrinho?")) {
      carrinho = [];
      atualizarCarrinho();
    }
  };

  // Inicializa o sistema
  atualizarCarrinho();
  carregarCatalogo();
}
