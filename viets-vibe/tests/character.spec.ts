import { test, expect } from "@playwright/test";

test("2D is the default, supports six outfits, and exports the active composition", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/mix-match?extras=");
  const stage = page.locator(".character-art-stage");
  await expect(
    page.getByRole("button", { name: "2D View", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".avatar-renderer canvas")).toHaveCount(0);
  await expect(stage).toHaveAttribute("data-ready", "true");
  for (const [id, name] of [
    ["ao-dai", "Áo dài"],
    ["ao-tac", "Áo tấc"],
    ["nhat-binh", "Nhật Bình"],
    ["ngu-than", "Áo ngũ thân"],
    ["tu-than", "Áo tứ thân"],
    ["ba-ba", "Áo bà ba"],
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(stage).toHaveAttribute("data-garment", id);
    await expect(stage).toHaveAttribute("data-ready", "true");
    await stage.screenshot({ path: `test-results/character-2d-${id}.png` });
  }
  await page.getByRole("button", { name: "Áo dài", exact: true }).click();
  for (const name of [
    "Khăn vấn",
    "Nón lá",
    "Ngọc trai",
    "Túi cói",
    "Quạt giấy",
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(stage).toHaveAttribute("data-extras", new RegExp(name));
  }
  await expect(stage.locator('[data-layer^="accessory-"]')).toHaveCount(5);
  await page.getByRole("button", { name: "Nón lá", exact: true }).click();
  await expect(stage.locator('[data-layer^="accessory-"]')).toHaveCount(4);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Tải ảnh 2D", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("viets-vibe-ao-dai-2d.png");
  await page
    .getByRole("button", { name: "Lưu vào lookbook", exact: true })
    .click();
  await page.goto("/lookbook");
  await expect(page.locator(".saved-image img")).toHaveAttribute(
    "src",
    /^data:image\/jpeg;base64,/,
  );
  await page.getByRole("link", { name: "Phối tiếp" }).click();
  await expect(stage).toHaveAttribute("data-ready", "true");
  await expect(stage).toHaveAttribute("data-extras", /Túi cói/);
  expect(errors).toEqual([]);
});

test("both renderers share choices and 2D remains usable without WebGL", async ({
  page,
}) => {
  await page.goto(
    "/mix-match?garment=nhat-binh&color=Kem%20lụa&extras=Nón%20lá",
  );
  await page
    .getByRole("button", { name: "Người mẫu & lớp", exact: true })
    .click();
  await page.getByLabel("Dáng trình bày").selectOption("masculine");
  await page.getByLabel("Chất liệu bề mặt").selectOption("brocade");
  await page.getByLabel("Màu quần / váy").fill("#623856");
  await page.getByRole("button", { name: "3D View", exact: true }).click();
  await expect(page.locator(".avatar-stage")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await expect(page.locator(".avatar-stage")).toHaveAttribute(
    "data-garment",
    "nhat-binh",
  );
  await expect(page.locator(".avatar-stage")).toHaveAttribute(
    "data-presentation",
    "masculine",
  );
  await expect(page.locator(".avatar-stage")).toHaveAttribute(
    "data-fabric",
    "brocade",
  );
  await page.getByRole("button", { name: "2D View", exact: true }).click();
  await expect(page.locator(".character-art-stage")).toHaveAttribute(
    "data-presentation",
    "masculine",
  );
  await expect(page.getByLabel("Màu quần / váy")).toHaveValue("#623856");
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .locator(".character-viewer")
    .screenshot({ path: "test-results/character-2d-mobile.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.addInitScript(() => {
    const get = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      ...args: Parameters<typeof get>
    ) {
      if (String(args[0]).includes("webgl")) return null;
      return get.apply(this, args);
    } as typeof get;
  });
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Tải ảnh 2D", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "3D View", exact: true }).click();
  await expect(page.locator(".canvas-fallback")).toBeVisible();
  await page.getByRole("button", { name: "2D View", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Tải ảnh 2D", exact: true }),
  ).toBeEnabled();
});

test("2D backdrop failures cannot export a misleading scene", async ({
  page,
}) => {
  await page.route("**/images/hanoi-ho-guom-illustration.png", (route) =>
    route.abort(),
  );
  await page.goto("/mix-match?backdrop=ho-guom");
  await expect(
    page.getByRole("button", { name: "Tải ảnh 2D", exact: true }),
  ).toBeDisabled();
  await expect(page.locator(".character-2d [role=status]")).toContainText(
    "Chưa tải được phông",
  );
  await page.getByRole("button", { name: "Phòng thử", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Tải ảnh 2D", exact: true }),
  ).toBeEnabled();
});
