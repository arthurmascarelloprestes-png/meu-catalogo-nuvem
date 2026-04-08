// 1. CONFIGURAÇÃO DO BANCO (Mesmas chaves da Fase 1)
const supabaseUrl = "https://xavhufelbyafunjefnae.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhhdmh1ZmVsYnlhZnVuamVmbmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjIzNjYsImV4cCI6MjA4OTgzODM2Nn0.yC5Ody7QRtuyGWIu_xDozjvM5CRXK_zVumQUnnqQfOc";

const banco = window.supabase.createClient(supabaseUrl, supabaseKey);

async function verificarAcesso() {
  // Pergunta ao Supabase: Tem alguém logado?
  const {
    data: { user },
  } = await banco.auth.getUser();

  if (!user) {
    alert("Área restrita! Faça login primeiro.");
    window.location.href = "login.html"; // Expulsa o invasor
  } else {
    // Se estiver logado, mostra quem é
    document.getElementById("nome-usuario").innerText = user.email;
  }
}
verificarAcesso();

// 2. FUNÇÃO DE CADASTRO
async function cadastrarProduto() {
  // Captura os valores digitados no HTML
  let nomeProduto = document.getElementById("input-nome").value.trim();
  let precoProduto = document.getElementById("input-preco").value;
  let categoriaProduto = document
    .getElementById("input-categoria")
    .value.trim();
  let imagemProduto = document.getElementById("input-imagem").value.trim();
  let aviso = document.getElementById("mensagem-aviso");

  // Validação de segurança básica
  if (nomeProduto === "" || precoProduto === "") {
    aviso.innerText = "⚠️ Preencha todos os campos obrigatórios!";
    aviso.className = "aviso-erro";
    return;
  }

  aviso.innerText = "☁️ Salvando na nuvem...";
  aviso.className = "aviso-info";

  // Envia o comando INSERT para a tabela 'produtos' no Supabase
  let { error } = await banco.from("produtos").insert([
    {
      nome: nomeProduto,
      preco: precoProduto,
      categoria: categoriaProduto,
      img: imagemProduto,
    },
  ]);

  // Verifica se deu erro ou se foi sucesso
  if (error) {
    aviso.innerText = "❌ Erro ao salvar: " + error.message;
    aviso.className = "aviso-erro";
  } else {
    aviso.innerText = "✅ Produto cadastrado com sucesso!";
    aviso.className = "aviso-sucesso";

    // Limpa as caixas de texto para o próximo cadastro
    document.getElementById("input-nome").value = "";
    document.getElementById("input-categoria").value = "";
    document.getElementById("input-preco").value = "";
    document.getElementById("input-imagem").value = "";

    // Recarrega a lista de produtos
    carregarListaProdutos();
  }
}

// 3. FUNÇÃO PARA LISTAR PRODUTOS CADASTRADOS
async function carregarListaProdutos() {
  let { data: produtos, error } = await banco
    .from("produtos")
    .select("*")
    .order("id", { ascending: false });

  let lista = document.getElementById("lista-produtos");
  let contagem = document.getElementById("contagem-produtos");

  if (error) {
    lista.innerHTML = '<p class="aviso-erro">Erro ao carregar produtos.</p>';
    return;
  }

  contagem.innerText = produtos.length + " produto(s) no banco";

  if (produtos.length === 0) {
    lista.innerHTML =
      '<p class="lista-vazia">Nenhum produto cadastrado ainda.</p>';
    return;
  }

  lista.innerHTML = "";

  produtos.forEach((item) => {
    let precoFormatado = Number(item.preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    let div = document.createElement("div");
    div.className = "lista-item";
    div.innerHTML = `
      <div class="lista-item-info">
        <img src="${item.img}" alt="${item.nome}" onerror="this.src='https://via.placeholder.com/50x50?text=?'" />
        <div>
          <strong>${item.nome}</strong>
          <span>${precoFormatado}</span>
        </div>
      </div>
      <button class="btn-deletar" onclick="deletarProduto(${item.id})" title="Remover produto">🗑️</button>
    `;
    lista.appendChild(div);
  });
}

// 4. FUNÇÃO PARA DELETAR UM PRODUTO
async function deletarProduto(id) {
  if (!confirm("Tem certeza que deseja remover este produto?")) return;

  let { error } = await banco.from("produtos").delete().eq("id", id);

  if (error) {
    alert("Erro ao deletar: " + error.message);
  } else {
    carregarListaProdutos();
  }
}

async function sairDoSistema() {
  await banco.auth.signOut();
  window.location.href = "index.html"; // Manda de volta para a vitrine pública
}

// Carrega a lista ao abrir a página
carregarListaProdutos();
