console.log("🚀 Tentando clicar em botão visível...");

const botoes = page.locator("button");

for (let i = 0; i < await botoes.count(); i++) {
  const botao = botoes.nth(i);

  const isVisible = await botao.isVisible().catch(() => false);

  if (isVisible) {
    console.log("🎯 Tentando botão visível index:", i);

    await botao.scrollIntoViewIfNeeded();
    await botao.click({ force: true });

    console.log("✅ Clique realizado!");
    break;
  }
}
