// NAVBAR TOGGLE (Mobile)
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("open");
    navMenu.classList.toggle("open");
  });

  // Fecha o menu ao clicar em um link (mobile)
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
// Só roda na página que tem o Supabase carregado e a vitrine
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
        <p class="preco-destaque">${precoFormatado}</p>
      `;
      vitrine.appendChild(div);
    });
  }

  carregarCatalogo();
}
