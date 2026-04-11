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

    let arquivos = [];

    commits.forEach(commit => {
      if (commit.added) arquivos.push(...commit.added);
      if (commit.modified) arquivos.push(...commit.modified);
    });

    arquivos = [...new Set(arquivos)];

    console.log("📂 Arquivos:", arquivos);

    let conteudoArquivos = "";

    // 🔥 BUSCA O CONTEÚDO REAL DOS ARQUIVOS
    for (const file of arquivos) {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${repo}/contents/${file}`
        );

        const data = await response.json();

        if (data.content) {
          const decoded = Buffer.from(data.content, "base64").toString("utf-8");

          conteudoArquivos += `\n\n### ${file}\n${decoded}`;
        }
      } catch (err) {
        console.log("Erro ao buscar arquivo:", file);
      }
    }

    const prompt = `
Projeto: ${repo}

Aqui estão os arquivos atualizados:
${conteudoArquivos}

Atualize o app com base nesses códigos.
Mantenha design moderno e funcional.
`;

    console.log("🧠 PROMPT COMPLETO:");
    console.log(prompt);

    res.status(200).send("Webhook com código completo 🚀");

  } catch (error) {
    console.error(error);
    res.status(500).send("Erro");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Rodando na porta ${PORT}`);
});
