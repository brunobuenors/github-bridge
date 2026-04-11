import { chromium } from "playwright";

export async function enviarParaLovable(prompt) {
  console.log("🤖 Iniciando bot...");

  const browser = await chromium.launch({
    headless: false // 👈 importante pra funcionar melhor
  });

  const page = await browser.newPage();

  try {
    await page.goto("https://lovable.dev", {
      waitUntil: "domcontentloaded"
    });

    console.log("✅ Página carregada!");

    await page.waitForTimeout(4000);

    const editor = page.locator(".tiptap.ProseMirror").first();

    if (await editor.count() === 0) {
      console.log("❌ Editor não encontrado");
      return;
    }

    await editor.click();

    await page.keyboard.type(prompt, { delay: 10 });

    await page.keyboard.press("Enter");

    console.log("✅ Prompt enviado!");

  } catch (err) {
    console.log("❌ Erro:", err.message);
  }
}
