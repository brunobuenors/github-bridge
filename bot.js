import { chromium } from "playwright";
import { execSync } from "child_process";

let instalado = false;

export async function enviarParaLovable(prompt) {
  console.log("🤖 Iniciando bot Lovable...");

  if (!instalado) {
    try {
      console.log("📦 Instalando Chromium...");
      execSync("npx playwright install chromium", { stdio: "inherit" });
      console.log("✅ Chromium pronto!");
      instalado = true;
    } catch (err) {
      console.log("❌ Erro ao instalar Chromium:");
      console.error(err);
      return;
    }
  }

  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
    });

    const page = await context.newPage();

    console.log("🌐 Abrindo Lovable...");

    await page.goto("https://lovable.dev", {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    console.log("✅ Página carregada!");

    await page.waitForTimeout(6000);

    console.log("🎯 Procurando editor...");

    const editor = page.locator(".tiptap.ProseMirror").first();
    await editor.click();

    console.log("⌨️ Digitando prompt...");
    await page.keyboard.type(prompt, { delay: 5 });

    console.log("🚀 Procurando botão...");

    // 🔥 NOVA LÓGICA MELHORADA
    const botoes = page.locator("button");

    for (let i = 0; i < await botoes.count(); i++) {
      const botao = botoes.nth(i);
      const texto = await botao.innerText().catch(() => "");

      if (/generate|run|create/i.test(texto)) {
        console.log("🎯 Botão encontrado:", texto);

        await botao.scrollIntoViewIfNeeded();
        await botao.click({ force: true });

        console.log("✅ Prompt enviado!");
        break;
      }
    }

    await page.waitForTimeout(8000);

  } catch (err) {
    console.log("❌ Erro no bot:");
    console.error(err.message || err);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
