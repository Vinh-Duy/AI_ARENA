import { test, expect, type Page } from "@playwright/test";

test("Hanoi backdrops export and persist with an applicable AI outfit", async ({
  page,
}) => {
  await page.goto("/mix-match?garment=ao-dai");
  await page.getByRole("button", { name: "3D View", exact: true }).click();
  await expect(page.locator(".avatar-stage")).toHaveAttribute(
    "data-ready",
    "true",
  );
  const studioImage = await page
    .locator(".avatar-renderer canvas")
    .evaluate((c) => (c as HTMLCanvasElement).toDataURL());
  for (const [id, label] of [
    ["ho-guom", "Hồ Gươm"],
    ["long-bien", "Cầu Long Biên"],
    ["van-mieu", "Văn Miếu"],
  ]) {
    await page.getByRole("button", { name: label, exact: true }).click();
    await expect(page.locator(".avatar-stage")).toHaveAttribute(
      "data-backdrop",
      id,
    );
    await expect(page.locator(".avatar-stage")).toHaveAttribute(
      "data-background-ready",
      "true",
    );
  }
  await expect
    .poll(() =>
      page
        .locator(".avatar-renderer canvas")
        .evaluate((c) => (c as HTMLCanvasElement).toDataURL()),
    )
    .not.toBe(studioImage);
  await page
    .getByLabel("Bạn muốn stylist giúp gì?")
    .fill("Phối nhẹ nhàng để chụp kỷ yếu, ít phụ kiện.");
  await page.route("**/api/style", async (route) => {
    const body = route.request().postDataJSON();
    expect(body.backdrop).toBe("van-mieu");
    expect(body.goal).toContain("kỷ yếu");
    expect(body.layers.bottomType).toBe("trousers");
    expect(body.layers).not.toHaveProperty("skin");
    await route.fulfill({
      json: {
        suggestion: {
          tên_trang_phục: "Áo dài kem bên Văn Miếu",
          nguồn_gốc: "Tư liệu thử nghiệm",
          gợi_ý_phối: ["Áo kem phối quần trầm, một chiếc quạt làm điểm nhấn."],
          cảnh_báo_văn_hóa: "Giữ cổ áo và cách mặc phù hợp di tích.",
          nhận_xét: "Bản hiện tại có thể nhẹ nhàng hơn.",
          lý_do: "Màu kem tạo khoảng sáng trước nền gạch đỏ.",
          bản_phối: {
            garment: "ao-dai",
            color: "Kem lụa",
            accessories: ["Quạt giấy"],
            layers: {
              inner: "#f5ead6",
              bottom: "#53634c",
              accent: "#b6a577",
              shoes: "#49382d",
              bottomType: "trousers",
              footwear: "flats",
              collar: true,
              fabric: "brocade",
            },
          },
        },
      },
    });
  });
  await page.getByRole("button", { name: "Phối lại cùng Gemini" }).click();
  await expect(
    page.getByRole("region", { name: "Bản phối stylist đề xuất" }),
  ).toContainText("nền gạch đỏ");
  await expect(
    page.getByRole("button", { name: "Đã áp dụng bản phối AI", exact: true }),
  ).toBeDisabled();
  await expect(page.locator(".avatar-stage")).toHaveAttribute(
    "data-fabric",
    "brocade",
  );
  await expect(
    page.getByRole("button", { name: "Kem lụa", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Trở lại bản phối trước" }).click();
  await expect(page.locator(".avatar-stage")).toHaveAttribute(
    "data-fabric",
    "silk",
  );
  await expect(
    page.getByRole("button", { name: "Ngọc bích", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Áp dụng bản phối AI", exact: true })
    .click();
  await capture(page, "hanoi-stylist-desktop");
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: "Tải ảnh 3D" }).click();
  expect((await downloading).suggestedFilename()).toContain(".png");
  await page
    .getByRole("button", { name: "Lưu vào lookbook", exact: true })
    .click();
  await page.goto("/lookbook");
  await expect(page.locator(".saved-image img")).toHaveAttribute(
    "src",
    /^data:image\/jpeg/,
  );
  await page.getByRole("link", { name: "Phối tiếp" }).click();
  await page.getByRole("button", { name: "3D View", exact: true }).click();
  await expect(page.locator(".avatar-stage")).toHaveAttribute(
    "data-backdrop",
    "van-mieu",
  );
  await expect(page.locator(".avatar-stage")).toHaveAttribute(
    "data-background-ready",
    "true",
  );
  await expect(
    page.getByRole("button", { name: "Kem lụa", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.setViewportSize({ width: 390, height: 844 });
  await capture(page, "hanoi-stylist-mobile");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("broken backdrop and malformed AI plan fail without changing the outfit", async ({
  page,
}) => {
  await page.route("**/images/hanoi-ho-guom-illustration.png", (route) =>
    route.abort(),
  );
  await page.goto("/mix-match?backdrop=ho-guom");
  await page.getByRole("button", { name: "3D View", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "Chưa tải được phông ảnh",
  );
  await expect(page.getByRole("button", { name: "Tải ảnh 3D" })).toBeDisabled();
  await page.getByRole("button", { name: "Phòng thử", exact: true }).click();
  await expect(page.getByRole("button", { name: "Tải ảnh 3D" })).toBeEnabled();
  await page.route("**/api/style", (route) =>
    route.fulfill({
      json: {
        suggestion: {
          tên_trang_phục: "Bản sai",
          nguồn_gốc: "",
          cảnh_báo_văn_hóa: "",
          gợi_ý_phối: ["Mặc đẹp"],
          bản_phối: { garment: "unknown" },
        },
      },
    }),
  );
  await page.getByRole("button", { name: "Phối lại cùng Gemini" }).click();
  await expect(
    page.getByRole("button", { name: "Áp dụng bản phối AI", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Ngọc bích", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

async function capture(page: Page, name: string) {
  for (const image of await page.locator("main img").all()) {
    if (!(await image.isVisible())) continue;
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((el) => (el as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
  }
  await page.evaluate(async () => {
    window.scrollTo(0, 0);
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
  if (await page.locator(".avatar-stage").count())
    await expect(page.locator(".avatar-stage")).toHaveAttribute(
      "data-ready",
      "true",
    );
  await page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
}

test("page links open at the top while section links keep their target", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const expectTopToStay = async () => {
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    // Dev route loading may trigger another scroll after the first frame.
    const largestOffset = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          const start = performance.now();
          let largest = 0;
          const sample = () => {
            largest = Math.max(largest, Math.abs(window.scrollY));
            if (performance.now() - start >= 1500) resolve(largest);
            else requestAnimationFrame(sample);
          };
          requestAnimationFrame(sample);
        }),
    );
    expect(largestOffset).toBe(0);
  };
  await page.goto("/");
  await page.locator('a[href="#explore"]').click();
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(300);
  await page.locator(".garment-card").first().click();
  await expect(page).toHaveURL(/\/heritage\//);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.locator('.site-footer a[href="/about"]').click();
  await expect(page).toHaveURL(/\/about$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  for (const [label, path] of [
    ["Khám phá", "/heritage"],
    ["Phòng phối đồ", "/mix-match"],
    ["Lookbook của bạn", "/lookbook"],
  ]) {
    await page.evaluate(() =>
      window.scrollTo({ top: 600, behavior: "instant" }),
    );
    await page
      .getByRole("navigation", { name: "Điều hướng chính" })
      .getByRole("link", { name: label, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expectTopToStay();
    await page.evaluate(() =>
      window.scrollTo({ top: 600, behavior: "instant" }),
    );
    await page
      .getByRole("navigation", { name: "Điều hướng chính" })
      .getByRole("link", { name: label, exact: true })
      .click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.site-footer a[href="/privacy"]').click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expectTopToStay();
  await page.getByRole("button", { name: "Mở menu" }).click();
  await page
    .getByRole("navigation", { name: "Điều hướng di động" })
    .getByRole("link", { name: "Phòng phối đồ", exact: true })
    .click();
  await expect(page).toHaveURL(/\/mix-match$/);
  await expectTopToStay();
});

test("desktop collection filters, imagery and layout", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Nếp xưa.",
  );
  await page.locator("#explore").scrollIntoViewIfNeeded();
  await expect(page.locator(".garment-card")).toHaveCount(6);
  await page.getByRole("button", { name: "Miền Trung", exact: true }).click();
  await expect(page.locator(".garment-card")).toHaveCount(3);
  await page.getByRole("button", { name: /Tất cả/ }).click();
  await expect(page.locator(".garment-card")).toHaveCount(6);
  await page.locator(".closing").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(page, "home-desktop");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    await page
      .locator(".hero img")
      .evaluateAll((images) =>
        images.every((img) => (img as HTMLImageElement).naturalWidth > 0),
      ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("mobile menu and studio stay within viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await capture(page, "home-mobile");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Mở menu" }).click();
  await page
    .getByRole("navigation", { name: "Điều hướng di động" })
    .getByRole("link", { name: "Phòng phối đồ" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Hôm nay",
  );
  await page.getByRole("button", { name: "Xem gợi ý cơ bản" }).click();
  await expect(page.getByText("BẢN PHỐI THEO LỰA CHỌN")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await capture(page, "studio-mobile");
});

test("customization, local generation, save, reload and delete", async ({
  page,
}) => {
  await page.goto("/mix-match?garment=nhat-binh");
  await expect(
    page.getByRole("button", { name: "Nhật Bình", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Đỏ son", exact: true }).click();
  await page.getByLabel("Bạn sẽ đi đâu?").selectOption("Tết");
  await page.getByRole("button", { name: "Cá tính", exact: true }).click();
  await page.getByRole("button", { name: "Ngọc trai", exact: true }).click();
  await page.getByRole("button", { name: "Xem gợi ý cơ bản" }).click();
  await expect(page.locator(".styling-tips")).toContainText("đỏ son");
  await expect(page.locator(".styling-tips")).toContainText("ngọc trai");
  await expect(page.locator(".styling-tips")).toContainText("sneaker");
  await capture(page, "studio-desktop");
  await page.getByRole("button", { name: "Lưu vào lookbook" }).click();
  await expect(
    page.getByRole("button", { name: "Đã lưu bản phối" }),
  ).toBeDisabled();
  await page.getByRole("link", { name: "Mở lookbook của bạn" }).click();
  await expect(page.locator(".saved-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".saved-card")).toHaveCount(1);
  await page.getByText("Xem gợi ý đã lưu").click();
  await expect(page.locator(".saved-card")).toContainText("sneaker");
  await page.getByRole("link", { name: "Phối tiếp" }).click();
  await page.getByRole("button", { name: "3D View", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Đỏ son", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("button", { name: "Ngọc trai", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goto("/lookbook");
  await page.getByRole("button", { name: "Xóa bản phối Nhật Bình" }).click();
  await expect(page.getByText("Chương đầu còn để ngỏ.")).toBeVisible();
});

test("Gemini request uses selected preferences and recovers from unavailability", async ({
  page,
}) => {
  await page.goto("/mix-match?garment=ao-tac&color=Kem%20lụa");
  await page.getByRole("button", { name: "Xem gợi ý cơ bản" }).click();
  await page.route("**/api/style", async (route) => {
    const data = route.request().postDataJSON();
    expect(data.garment).toBe("Áo tấc");
    expect(data.color).toBe("Kem lụa");
    await route.fulfill({
      status: 503,
      json: { error: "Stylist Gemini chưa sẵn sàng." },
    });
  });
  await page.getByRole("button", { name: "Phối lại cùng Gemini" }).click();
  await expect(page.getByRole("status")).toContainText("chưa sẵn sàng");
  await expect(page.locator(".styling-tips li")).toHaveCount(4);
  await page.unroute("**/api/style");
  await page.route("**/api/style", (route) =>
    route.fulfill({
      json: {
        suggestion: {
          tên_trang_phục: "Áo tấc kem lụa",
          nguồn_gốc: "Tư liệu thử nghiệm",
          gợi_ý_phối: ["Phối quần màu ngà."],
          cảnh_báo_văn_hóa: "Lưu ý bối cảnh nghi lễ.",
        },
      },
    }),
  );
  await page.getByRole("button", { name: "Phối lại cùng Gemini" }).click();
  await expect(
    page.getByText("GỢI Ý TỪ GOOGLE GEMINI", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Áo tấc kem lụa" }),
  ).toBeVisible();
});

test("API rejects malformed body and unsupported uploads before Google", async ({
  request,
}) => {
  for (const data of [
    null,
    [],
    {},
    { occasion: "Tết", imageBase64: "abc", mimeType: "image/svg+xml" },
  ]) {
    const response = await request.post("/api/style", { data });
    expect([400, 415]).toContain(response.status());
  }
});

test("responsive breakpoints and normal-motion content", async ({ page }) => {
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(() =>
      Array.from(document.querySelectorAll("body *"))
        .filter(
          (el) =>
            !el.closest(".ticker") &&
            el.getBoundingClientRect().right > innerWidth,
        )
        .map((el) => ({
          tag: el.tagName,
          cls: el.className,
          right: el.getBoundingClientRect().right,
        }))
        .slice(0, 15),
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Viewport ${width}: ${JSON.stringify(overflow)}`,
    ).toBe(true);
    await page.goto("/mix-match");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator(".hero-copy")).toHaveCSS("opacity", "1");
  await page.locator(".studio-teaser").scrollIntoViewIfNeeded();
  await expect(page.locator(".studio-teaser-inner")).toHaveCSS("opacity", "1");
});

test("heritage search, region filters, detail and studio handoff", async ({
  page,
}) => {
  await page.goto("/heritage");
  await expect(page.locator(".heritage-tile")).toHaveCount(6);
  await page
    .getByRole("searchbox", { name: "Tìm trong thư viện" })
    .fill("ngu than");
  await expect(page.locator(".heritage-tile")).toHaveCount(1);
  await expect(page.locator(".heritage-tile")).toContainText("Áo ngũ thân");
  await page.getByRole("button", { name: "Miền Nam", exact: true }).click();
  await expect(page.getByText("Chưa tìm thấy nếp áo này.")).toBeVisible();
  await page.getByRole("button", { name: "Xem toàn bộ thư viện" }).click();
  await expect(page.locator(".heritage-tile")).toHaveCount(6);
  await capture(page, "heritage-desktop");
  await page.getByRole("button", { name: "Miền Bắc", exact: true }).click();
  await page.locator(".garment-card").click();
  await expect(page).toHaveURL(/heritage\/tu-than$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Áo tứ thân",
  );
  await expect(page.locator(".detail-features p")).toHaveCount(3);
  await expect(page.locator(".detail-respect a")).toHaveAttribute(
    "href",
    /diendan.org/,
  );
  await capture(page, "heritage-detail-desktop");
  await page.getByRole("link", { name: "Tết", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Áo tứ thân", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("Bạn sẽ đi đâu?")).toHaveValue("Tết");
  await page.getByRole("button", { name: "Xem gợi ý cơ bản" }).click();
  await expect(page.locator(".styling-tips")).toContainText("váy dài");
});

test("lookbook compare, backup round trip, invalid import and undo", async ({
  page,
}) => {
  for (const garment of ["tu-than", "ba-ba"]) {
    await page.goto(`/mix-match?garment=${garment}`);
    await page.getByRole("button", { name: "Xem gợi ý cơ bản" }).click();
    await page.getByRole("button", { name: "Lưu vào lookbook" }).click();
    await expect(
      page.getByRole("button", { name: "Đã lưu bản phối" }),
    ).toBeDisabled();
  }
  await page.goto("/lookbook");
  await expect(page.locator(".saved-card")).toHaveCount(2);
  await page.getByText("Đặt hai bản phối cạnh nhau").click();
  await expect(page.getByRole("table")).toContainText("Áo tứ thân");
  await expect(page.getByRole("table")).toContainText("Áo bà ba");
  await capture(page, "lookbook-desktop");
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: "Xuất bản sao" }).click();
  const download = await downloading;
  const filePath = await download.path();
  expect(filePath).toBeTruthy();
  await page.getByRole("button", { name: "Xóa bản phối Áo tứ thân" }).click();
  await expect(page.locator(".saved-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Hoàn tác" }).click();
  await expect(page.locator(".saved-card")).toHaveCount(2);
  await page.evaluate(() => localStorage.removeItem("viets-vibe-lookbook-v1"));
  await page.reload();
  await expect(page.locator(".saved-card")).toHaveCount(0);
  await page.getByLabel("Nhập file lookbook").setInputFiles(filePath!);
  await expect(page.locator(".saved-card")).toHaveCount(2);
  await expect(page.getByRole("status")).toContainText("Đã nhập 2");
  await page.getByLabel("Nhập file lookbook").setInputFiles(filePath!);
  await expect(page.getByRole("status")).toContainText("Đã nhập 0");
  await page.getByLabel("Nhập file lookbook").setInputFiles({
    name: "broken.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":1,"looks":[{"id":"broken"}]}'),
  });
  await expect(page.getByRole("status")).toContainText("không hợp lệ");
  await expect(page.locator(".saved-card")).toHaveCount(2);
});

test("new pages on mobile, all details and missing route", async ({
  page,
  request,
}) => {
  for (const slug of [
    "ao-dai",
    "ao-tac",
    "nhat-binh",
    "ngu-than",
    "tu-than",
    "ba-ba",
  ]) {
    expect((await request.get(`/heritage/${slug}`)).status()).toBe(200);
  }
  expect((await request.get("/heritage/khong-ton-tai")).status()).toBe(404);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/heritage",
    "/heritage/ngu-than",
    "/about",
    "/privacy",
    "/credits",
    "/lookbook",
  ]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBe(true);
  }
  await page.goto("/heritage");
  await capture(page, "heritage-mobile");
  await page.goto("/heritage/ngu-than");
  await capture(page, "heritage-detail-mobile");
});

test("upload validation and share link preserve choices without the photo", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/mix-match?garment=ba-ba");
  await page.getByLabel("Tải ảnh món đồ").setInputFiles({
    name: "bad.svg",
    mimeType: "image/svg+xml",
    buffer: Buffer.from("<svg/>"),
  });
  await expect(page.getByRole("status")).toContainText("Chọn ảnh JPG");
  await page
    .getByLabel("Tải ảnh món đồ")
    .setInputFiles("public/images/ao-tac.jpg");
  await expect(page.locator(".user-photo img")).toBeVisible();
  await page.getByRole("button", { name: "Chia sẻ", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Đã sao chép");
  const shared = await page.evaluate(() => navigator.clipboard.readText());
  expect(shared).toContain("garment=ba-ba");
  expect(shared).not.toContain("base64");
  await page.goto(shared);
  await expect(
    page.getByRole("button", { name: "Áo bà ba", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".user-photo")).toHaveCount(0);
});

test("3D avatar renders, reacts, rotates, exports and restores its lookbook", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/mix-match?garment=tu-than");
  await page.getByRole("button", { name: "3D View", exact: true }).click();
  const stage = page.locator(".avatar-stage");
  await expect(stage).toHaveAttribute("data-ready", "true");
  await expect(page.locator(".cultural-warning")).toContainText(
    "Bản phối cách tân",
  );
  const before = await page
    .locator(".avatar-renderer canvas")
    .evaluate((c) => (c as HTMLCanvasElement).toDataURL());
  await page
    .getByRole("button", { name: "Người mẫu & lớp", exact: true })
    .click();
  await page.getByLabel("Phom người", { exact: true }).selectOption("broad");
  await page.getByLabel("Dáng trình bày").selectOption("feminine");
  await page.getByRole("button", { name: "Sắc da 5", exact: true }).click();
  await page.getByLabel("Chiều cao minh họa", { exact: true }).fill("180");
  await page.getByLabel("Lớp thân dưới").selectOption("skirt");
  await page.getByLabel("Màu quần / váy").fill("#763158");
  await expect(stage).toHaveAttribute("data-build", "broad");
  await expect(stage).toHaveAttribute("data-skin", "#593b2c");
  await expect(page.locator(".cultural-warning")).toHaveCount(0);
  await expect
    .poll(() =>
      page
        .locator(".avatar-renderer canvas")
        .evaluate((c) => (c as HTMLCanvasElement).toDataURL()),
    )
    .not.toBe(before);
  const front = await page
    .locator(".avatar-renderer canvas")
    .evaluate((c) => (c as HTMLCanvasElement).toDataURL());
  await page.getByRole("button", { name: "Sau", exact: true }).click();
  await expect
    .poll(() =>
      page
        .locator(".avatar-renderer canvas")
        .evaluate((c) => (c as HTMLCanvasElement).toDataURL()),
    )
    .not.toBe(front);
  await page.getByRole("button", { name: "Trước", exact: true }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Tải ảnh 3D", exact: true }).click();
  expect((await download).suggestedFilename()).toBe(
    "viets-vibe-tu-than-3d.png",
  );
  await page
    .getByRole("button", { name: "Lưu vào lookbook", exact: true })
    .click();
  await page.goto("/lookbook");
  await expect(page.locator(".saved-image img")).toHaveAttribute(
    "src",
    /^data:image\/jpeg;base64,/,
  );
  await page.getByRole("link", { name: "Phối tiếp" }).click();
  await page.getByRole("button", { name: "3D View", exact: true }).click();
  await expect(stage).toHaveAttribute("data-ready", "true");
  await page
    .getByRole("button", { name: "Người mẫu & lớp", exact: true })
    .click();
  await expect(page.getByLabel("Phom người", { exact: true })).toHaveValue(
    "broad",
  );
  await expect(
    page.getByLabel("Chiều cao minh họa", { exact: true }),
  ).toHaveValue("180");
  await expect(page.getByLabel("Màu quần / váy")).toHaveValue("#763158");
  await capture(page, "avatar-custom-desktop");
  await page.getByRole("button", { name: "Trang phục", exact: true }).click();
  await page.getByRole("button", { name: "Nhật Bình", exact: true }).click();
  await page.getByLabel("Bạn sẽ đi đâu?").selectOption("Dự lễ trang trọng");
  await page
    .getByRole("button", { name: "Người mẫu & lớp", exact: true })
    .click();
  await page.getByLabel("Giữ chi tiết cổ áo").uncheck();
  await page.getByLabel("Giày", { exact: true }).selectOption("sneakers");
  await expect(page.locator(".live-culture")).toContainText("Đang giản lược");
  await expect(page.locator(".live-culture")).toContainText(
    "Kiểm tra quy định",
  );
  await page.getByLabel("Giữ chi tiết cổ áo").check();
  await expect(page.locator(".live-culture")).not.toContainText(
    "Đang giản lược",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await capture(page, "avatar-custom-mobile");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("unavailable WebGL keeps the studio usable without a fake 3D export", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      ...args: Parameters<typeof original>
    ) {
      if (String(args[0]).includes("webgl")) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto("/mix-match");
  await page.getByRole("button", { name: "3D View", exact: true }).click();
  await expect(page.locator(".canvas-fallback")).toContainText(
    "Thiết bị chưa mở được 3D",
  );
  await expect(
    page.getByRole("button", { name: "Tải ảnh 3D", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Xem gợi ý cơ bản" }).click();
  await expect(page.locator(".styling-tips li")).toHaveCount(4);
});

test("six 3D silhouettes render and malformed avatar links use safe defaults", async ({
  page,
}) => {
  await page.goto(
    "/mix-match?avatar=" + encodeURIComponent('{"build":"giant","skin":"bad"}'),
  );
  await page.getByRole("button", { name: "3D View", exact: true }).click();
  await expect(page.locator(".avatar-stage")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await expect(page.locator(".avatar-stage")).toHaveAttribute(
    "data-build",
    "regular",
  );
  for (const [id, name] of [
    ["ao-dai", "Áo dài"],
    ["ao-tac", "Áo tấc"],
    ["nhat-binh", "Nhật Bình"],
    ["ngu-than", "Áo ngũ thân"],
    ["tu-than", "Áo tứ thân"],
    ["ba-ba", "Áo bà ba"],
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(page.locator(".avatar-stage")).toHaveAttribute(
      "data-garment",
      id,
    );
    await page.getByRole("button", { name: "Trước", exact: true }).click();
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    await page
      .locator(".avatar-stage")
      .screenshot({ path: `test-results/model-${id}.png` });
    await page.getByRole("button", { name: "Sau", exact: true }).click();
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    await page
      .locator(".avatar-stage")
      .screenshot({ path: `test-results/model-${id}-back.png` });
  }
});
