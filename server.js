import express from "express";

const app = express();
app.use(express.json());

// rota teste
app.get("/", (req, res) => {
  res.send("Bridge funcionando 🚀");
});

// webhook do github
app.post("/github-webhook", async (req, res) => {
  console.log("🔥 Push recebido do GitHub");

  try {
    const repo = req.body.repository.full_name;
    const commits = req.body.commits;

    console.log("Repo:", repo);
    console.log("Commits:", commits.length);

    // 👇 Aqui começa a mágica
    const resumo = commits.map(c => c.message).join("\n");

    const prompt = `
Atualize o app com base nessas mudanças:

${resumo}

Mantenha layout moderno e estilo aplicativo.
`;

    console.log("🧠 Prompt gerado:");
    console.log(prompt);

    // 👉 aqui futuramente envia pro Lovable

    res.send("Webhook processado");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Rodando na porta", PORT);
});
