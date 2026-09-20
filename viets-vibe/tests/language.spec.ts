import { test, expect } from "@playwright/test";

test("English covers pages and dynamic controls without changing stored outfit values", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`${page.url()}: ${e.message}`));
  await page.goto("/");
  await page.locator(".language-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  for (const path of [
    "/heritage",
    "/heritage/ao-dai",
    "/heritage/tu-than",
    "/about",
    "/privacy",
    "/credits",
  ]) {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("main")).not.toContainText("Nguồn tư liệu");
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(
      /(chưa|trang phục|được|nguồn gốc|phối đồ|thế nào|Mô hình)/,
    );
  }
  await page.goto("/mix-match?extras=");
  await page.getByRole("button", { name: "3D View", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Conical hat", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".avatar-stage")).toHaveAttribute(
    "data-ready",
    "true",
  );
  const beforeHat = await page
    .locator("canvas")
    .evaluate((c) => (c as HTMLCanvasElement).toDataURL());
  await page.getByRole("button", { name: "Conical hat", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Conical hat", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() =>
      page
        .locator("canvas")
        .evaluate((c) => (c as HTMLCanvasElement).toDataURL()),
    )
    .not.toBe(beforeHat);
  await page
    .locator(".avatar-stage")
    .screenshot({ path: "test-results/conical-hat.png" });
  await page.screenshot({
    path: "test-results/studio-english.png",
    fullPage: true,
  });
  await page
    .getByLabel("Where are you going?")
    .selectOption({ label: "Yearbook shoot" });
  await expect(page.getByLabel("Where are you going?")).toHaveValue(
    "Chụp kỷ yếu",
  );
  await page
    .getByRole("button", { name: "View basic suggestion", exact: true })
    .click();
  await expect(page.locator(".styling-tips")).not.toContainText("Lấy");
  await expect(page.locator(".styling-tips")).not.toContainText("Điểm xuyết");
  await page
    .getByRole("button", { name: "Model & layers", exact: true })
    .click();
  await page
    .getByLabel("Presentation", { exact: true })
    .selectOption("masculine");
  await page.getByRole("button", { name: "185 cm", exact: true }).click();
  await expect(page.locator(".height-control output")).toHaveText("185 cm");
  await page.locator(".language-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.getByLabel("Dáng trình bày")).toHaveValue("masculine");
  await page.getByRole("button", { name: "Trang phục", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Nón lá", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Lưu vào lookbook", exact: true })
    .click();
  await page.goto("/lookbook");
  await page.getByRole("link", { name: "Phối tiếp" }).click();
  await expect(
    page.getByRole("button", { name: "Nón lá", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(errors).toEqual([]);
});

test("Gemini gets the selected language and its outfit applies in English", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("viets-vibe-language", "en"),
  );
  await page.goto("/mix-match");
  await page.route("**/api/style", (route) => {
    expect(route.request().postDataJSON().language).toBe("en");
    return route.fulfill({
      json: {
        suggestion: {
          tên_trang_phục: "Cream silk with a conical hat",
          nguồn_gốc: "A modern interpretation of Ao dai.",
          nhận_xét: "A softer palette suits this occasion.",
          lý_do: "Cream and deep green balance the backdrop.",
          gợi_ý_phối: ["Use a conical hat as the focal accessory."],
          cảnh_báo_văn_hóa: "Check the venue dress code.",
          bản_phối: {
            garment: "ao-dai",
            color: "Kem lụa",
            accessories: ["Nón lá"],
            layers: {
              inner: "#eee2c9",
              bottom: "#425848",
              accent: "#b99857",
              shoes: "#3f342e",
              bottomType: "trousers",
              footwear: "flats",
              collar: true,
              fabric: "silk",
            },
          },
        },
      },
    });
  });
  await page
    .getByRole("button", { name: "Remix with Gemini", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Silk cream", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("button", { name: "Conical hat", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("heading", { name: "Cream silk with a conical hat" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Revert to previous styling", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Jade", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});
