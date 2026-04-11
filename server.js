import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor rodando 🚀");
});

app.post("/github-webhook", async (req, res) => {
  console.log("🔥 Push recebido do GitHub!");

  try {
    const repo = req.body.repository?.full_name;
    const commits = req.body.commits || [];

    console.log("📦 Repo:", repo);

    let arquivos = [];

    commits.forEach(commit => {
      if (commit.added) arquivos.push(...commit.added);
      if (commit.modified) arquivos.push(...commit.modified);
      if (commit.removed) arquivos.push(...commit.removed);
    });

    arquivos = [...new Set(arquivos)];

    console.log("📂 Arquivos alterados:", arquivos);

    // 🔥 GERANDO PROMPT MAIS INTELIGENTE
    const prompt = `
Projeto: ${repo}

Arquivos alterados:
${arquivos.join("\n")}

Mensagens dos commits:
${commits.map(c => "- " + c.message).join("\n")}

Atualize o aplicativo com base nessas alterações.
Mantenha design moderno, organizado e funcional.
`;

    console.log("🧠 Prompt gerado:");
    console.log(prompt);

    res.status(200).send("Webhook processado 🚀");

  } catch (error) {
    console.error("❌ Erro:", error);
    res.status(500).send("Erro no servidor");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Rodando na porta ${PORT}`);
});
