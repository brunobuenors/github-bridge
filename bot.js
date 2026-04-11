let rodando = false;

app.get("/test-bot", async (req, res) => {
  if (rodando) {
    return res.send("Bot já está rodando...");
  }

  rodando = true;

  const prompt = "Teste automático do bot 🚀";

  console.log("🧪 Testando bot manualmente...");

  try {
    await enviarParaLovable(prompt);
  } catch (err) {
    console.log("Erro:", err);
  }

  rodando = false;

  res.send("Bot executado!");
});
