import { test, expect } from "@playwright/test";
import * as T from "three";
import { buildMannequin, disposeModel } from "../app/lib/mannequin";
import { defaultAvatar } from "../app/lib/avatar";

test("height changes stature without stretching the head or lifting the feet", () => {
  for (const presentation of ["feminine", "masculine"] as const) {
    const models = [150, 190].map((height) =>
      buildMannequin("ao-dai", "#426854", [], {
        ...defaultAvatar,
        height,
        presentation,
      }),
    );
    const headName =
      presentation === "feminine" ? "female-fixed-bun" : "male-fixed-side-part";
    const heads = models.map((model) =>
      new T.Box3()
        .setFromObject(model.getObjectByName(headName)!)
        .getSize(new T.Vector3()),
    );
    expect(heads[0].distanceTo(heads[1])).toBeLessThan(0.00001);
    const feet = models.map(
      (model) =>
        new T.Box3().setFromObject(model.getObjectByName("footwear")!).min.y,
    );
    expect(feet[0]).toBeCloseTo(feet[1], 5);
    const bodies = models.map(
      (model) => new T.Box3().setFromObject(model).getSize(new T.Vector3()).y,
    );
    expect(bodies[1] - bodies[0]).toBeGreaterThan(0.5);
    models.forEach(disposeModel);
  }
});

test("fixed male and female models, stature and fabric stay visible in the studio", async ({
  page,
}) => {
  await page.goto("/mix-match?garment=ao-dai&extras=");
  await page.getByRole("button", { name: "3D View", exact: true }).click();
  const stage = page.locator(".avatar-stage");
  await expect(stage).toHaveAttribute("data-ready", "true");
  await page
    .getByRole("button", { name: "Người mẫu & lớp", exact: true })
    .click();
  for (const presentation of ["feminine", "masculine"]) {
    await page.getByLabel("Dáng trình bày").selectOption(presentation);
    for (const height of [150, 190]) {
      await page
        .getByLabel("Chiều cao minh họa", { exact: true })
        .fill(String(height));
      await expect(stage).toHaveAttribute("data-height", String(height));
      await expect(stage).toHaveAttribute("data-presentation", presentation);
      await stage.screenshot({
        path: `test-results/mannequin-${presentation}-${height}.png`,
      });
    }
  }
  const original = await page
    .locator("canvas")
    .evaluate((c) => (c as HTMLCanvasElement).toDataURL());
  await page.getByLabel("Chất liệu bề mặt").selectOption("linen");
  await expect(stage).toHaveAttribute("data-fabric", "linen");
  await expect
    .poll(() =>
      page
        .locator("canvas")
        .evaluate((c) => (c as HTMLCanvasElement).toDataURL()),
    )
    .not.toBe(original);
  await page.getByLabel("Chất liệu bề mặt").selectOption("brocade");
  await expect(stage).toHaveAttribute("data-fabric", "brocade");
  await page
    .getByRole("button", { name: "Lưu vào lookbook", exact: true })
    .click();
  await page.goto("/lookbook");
  await page.getByRole("link", { name: "Phối tiếp" }).click();
  await page.getByRole("button", { name: "3D View", exact: true }).click();
  await expect(stage).toHaveAttribute("data-fabric", "brocade");
  await expect(stage).toHaveAttribute("data-presentation", "masculine");
});
