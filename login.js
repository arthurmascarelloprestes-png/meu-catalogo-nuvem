const supabaseUrl = "https://xavhufelbyafunjefnae.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhhdmh1ZmVsYnlhZnVuamVmbmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjIzNjYsImV4cCI6MjA4OTgzODM2Nn0.yC5Ody7QRtuyGWIu_xDozjvM5CRXK_zVumQUnnqQfOc";
const banco = window.supabase.createClient(supabaseUrl, supabaseKey);

// Função para verificar se o usuário já está logado
async function verificarSessao() {
  // Busca os dados do usuário atual no Supabase
  const {
    data: { user },
  } = await banco.auth.getUser();

  // Se o usuário existir (não for nulo), redireciona para a admin
  if (user) {
    window.location.href = "admin.html";
  }
}

// Executa a função assim que o script for carregado
verificarSessao();

async function fazerLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("mensagem");
  const btn = document.getElementById("btn-entrar");

  btn.innerText = "Verificando...";
  btn.disabled = true;

  const { data, error } = await banco.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    msg.innerText = "Acesso Negado: " + error.message;
    msg.style.color = "red";
    btn.innerText = "Entrar no Painel";
    btn.disabled = false;
  } else {
    msg.innerText = "Acesso concedido! Carregando painel...";
    msg.style.color = "green";
    setTimeout(() => {
      window.location.href = "admin.html";
    }, 1000);
  }
}

function mostrarSenha() {
  let inputSenha = document.getElementById("password");
  let btnOlho = document.getElementById("btn-olho");

  if (inputSenha.type === "password") {
    inputSenha.type = "text";
    btnOlho.innerText = "🙈";
  } else {
    inputSenha.type = "password";
    btnOlho.innerText = "👁️";
  }
}

// --- ADICIONE ESTA PARTE AQUI EMBAIXO ---

// Detectar a tecla Enter no campo de senha
document
  .getElementById("password")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Evita que o formulário recarregue a página
      fazerLogin(); // Chama a sua função de login
    }
  });
