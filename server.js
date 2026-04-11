import express from "express";

const app = express();

// Middleware pra ler JSON (OBRIGATÓRIO)
app.use(express.json());

// Rota de teste (abre no navegador)
app.get("/", (req, res) => {
  res.send("Servidor rodando 🚀");
});

// Webhook do GitHub
app.post("/github-webhook", async (req, res) => {
  console.log("🔥 Push recebido do GitHub!");

  try {
    const repo = req.body.repository?.full_name;
    const commits = req.body.commits || [];

    console.log("📦 Repo:", repo);
    console.log("📨 Quantidade de commits:", commits.length);

    // Monta resumo dos commits
    const resumo = commits.map(c => `- ${c.message}`).join("\n");

    const prompt = `
Atualize o app com base nessas mudanças:

${resumo}

Mantenha design moderno, estilo aplicativo, organizado e funcional.
`;

    console.log("🧠 Prompt gerado:");
    console.log(prompt);

    // 👉 FUTURO: enviar pro Lovable aqui

    res.status(200).send("Webhook recebido com sucesso 🚀");

  } catch (error) {
    console.error("❌ Erro:", error);
    res.status(500).send("Erro no servidor");
  }
});

// Porta dinâmica do Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
