import { chromium } from "playwright";
import { execSync } from "child_process";

let instalado = false;

export async function enviarParaLovable(prompt) {
  console.log("🤖 Iniciando bot Lovable...");

  // instala chromium 1x
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

    // espera interface carregar
    await page.waitForTimeout(6000);

    console.log("🎯 Procurando editor...");
    const editor = page.locator(".tiptap.ProseMirror").first();
    await editor.click();

    console.log("⌨️ Digitando prompt...");
    await page.keyboard.type(prompt, { delay: 5 });

    await page.waitForTimeout(2000);

    console.log("🚀 Tentando enviar...");

    // 🔥 TENTATIVA 1 — botão dentro do editor
    try {
      const botao = page.locator(".tiptap").locator("button").last();

      await botao.scrollIntoViewIfNeeded();
      await botao.click({ force: true });

      console.log("✅ Clique realizado!");
    } catch (err) {
      console.log("⚠️ Botão não funcionou, tentando ENTER...");
      
      // 🔥 TENTATIVA 2 — ENTER
      await page.keyboard.press("Enter");
      console.log("✅ Enviado com ENTER!");
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
