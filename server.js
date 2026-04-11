import express from "express";
import fetch from "node-fetch";

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
    const branch = req.body.ref?.replace("refs/heads/", "");

    console.log("📦 Repo:", repo);
    console.log("🌿 Branch:", branch);

    let arquivos = [];

    commits.forEach(commit => {
      if (commit.added) arquivos.push(...commit.added);
      if (commit.modified) arquivos.push(...commit.modified);
    });

    arquivos = [...new Set(arquivos)];

    console.log("📂 Arquivos alterados:", arquivos);

    let conteudoArquivos = "";

    for (const file of arquivos) {
      try {
        console.log("🔍 Buscando arquivo:", file);

        const response = await fetch(
          `https://api.github.com/repos/${repo}/contents/${file}?ref=${branch}`,
          {
            headers: {
              "Authorization": `token ${process.env.GITHUB_TOKEN}`,
              "User-Agent": "github-bridge",
              "Accept": "application/vnd.github.v3+json"
            }
          }
        );

        const data = await response.json();

        if (data.content) {
          const decoded = Buffer.from(data.content, "base64").toString("utf-8");

          console.log(`✅ Conteúdo carregado: ${file}`);

          conteudoArquivos += `\n\n### ${file}\n${decoded}`;
        } else {
          console.log("⚠️ Sem conteúdo:", file);
          console.log(data);
        }

      } catch (err) {
        console.log("❌ Erro ao buscar:", file);
        console.error(err);
      }
    }

    const prompt = `
Projeto: ${repo}

Arquivos alterados:
${arquivos.join("\n")}

Conteúdo dos arquivos:
${conteudoArquivos}

Atualize o app com base nesses códigos.
Mantenha design moderno e funcional.
`;

    console.log("🧠 PROMPT COMPLETO:");
    console.log(prompt);

    res.status(200).send("Webhook processado 🚀");

  } catch (error) {
    console.error("❌ Erro geral:", error);
    res.status(500).send("Erro no servidor");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Rodando na porta ${PORT}`);
});
