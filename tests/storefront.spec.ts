import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { products } from "../src/data/catalogue";

test("shop a sample garment through checkout", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  expect(await page.request.get("/collections/bridal/__next.collections.$d$slug.__PAGE__.txt")).toBeOK();
  await page.goto("/");
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Collections", exact: true }).click();
  } else {
    await page.getByRole("link", { name: "Explore the collection", exact: true }).click();
  }
  await page.getByRole("link", { name: "Bridal Couture", exact: true }).click();
  await page.getByRole("button", { name: "Quick view of Garnet Zardozi Lehenga" }).click();
  await page.getByRole("link", { name: "View garment" }).click();
  await page.getByRole("button", { name: "On Model" }).click();
  await expect(page.getByAltText("A model in an illustrative garnet bridal lehenga")).toBeVisible();
  await page.getByRole("button", { name: "Enlarge image" }).click();
  await expect(page.getByRole("dialog", { name: "Garment image" })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Save Garnet Zardozi Lehenga" }).first().click();
  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.getByRole("button", { name: "Add to bag" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Open shopping bag, 1 item" }).click();
  await page.getByRole("button", { name: /Increase quantity/ }).click();
  await expect(page.getByRole("dialog").getByText("₹57,000").last()).toBeVisible();
  await page.getByRole("link", { name: "View shopping bag" }).click();
  await expect(page).toHaveURL(/\/cart\/$/);
  await page.reload();
  await expect(page.getByText("₹57,000").last()).toBeVisible();
  await page.getByRole("link", { name: "Demo checkout" }).click();
  await page.getByRole("button", { name: "Complete demo order" }).click();
  await expect(page.getByText("Enter a valid six-digit Indian PIN code.")).toBeVisible();
  await page.getByLabel("Full name").fill("Demo Guest");
  await page.getByRole("button", { name: "Sign in to save this receipt to your account" }).click();
  const login = page.getByRole("dialog", { name: "Customer sign-in" });
  await login.getByRole("button", { name: "Use sample credentials" }).click();
  await login.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(login).toBeHidden();
  await expect(page.getByLabel("Full name")).toHaveValue("Demo Guest");
  await page.getByLabel("Email", { exact: true }).fill("guest@example.test");
  await page.getByLabel("Street address").fill("1 Sample Street");
  await page.getByLabel("City", { exact: true }).fill("Visakhapatnam");
  await page.getByLabel("State", { exact: true }).fill("Andhra Pradesh");
  await page.getByLabel("PIN code").fill("530002");
  await page.getByRole("button", { name: "Complete demo order" }).click();
  await expect(page.getByRole("heading", { name: "Demo order complete" })).toBeVisible();
  await page.getByRole("link", { name: "View demo receipt" }).click();
  await expect(page.getByRole("heading", { name: "Demo order history" })).toBeVisible();
  await expect(page.locator("summary").filter({ hasText: /DEMO-.*₹57,000/ })).toBeVisible();
  await page.goto("/wishlist/");
  await expect(page.getByRole("heading", { name: "Garnet Zardozi Lehenga" })).toBeVisible();
  await page.goto("/account/");
  await page.getByRole("button", { name: "Sign out of demo" }).click();
  await page.getByRole("button", { name: "Boutique owner", exact: true }).click();
  await page.getByRole("button", { name: "Use sample credentials" }).click();
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/$/);
  await page.getByRole("combobox", { name: "Order source" }).selectOption("This browser");
  const register = page.getByRole("region", { name: "Owner order register" });
  await expect(register.getByText("₹57,000")).toBeVisible();
  expect(errors).toEqual([]);
});

test("filters, consultation and AI concept journeys", async ({ page }) => {
  await page.goto("/search/");
  await page.getByRole("searchbox").fill("silk");
  await expect(page.getByRole("heading", { name: "Olive Silk Anarkali" })).toBeVisible();
  await page.getByText("Filters", { exact: true }).click();
  await page.getByRole("combobox", { name: "Occasion", exact: true }).selectOption("Wedding");
  await expect(page.getByRole("heading", { name: "No sample styles found" })).toBeVisible();
  await page.getByRole("link", { name: "Search by image" }).click();
  await page.getByRole("button", { name: "Custom design sketch" }).click();
  await page.getByRole("button", { name: "View sample results" }).click();
  await page.getByRole("link", { name: "Request a custom design" }).click();
  await page.getByLabel("Name", { exact: true }).fill("Demo Guest");
  await page.getByLabel("Email or phone").fill("demo@example.test");
  await page.getByRole("button", { name: "Submit demo enquiry" }).click();
  await expect(page.getByRole("heading", { name: "Demo enquiry received" })).toBeVisible();
  const id = (await page.getByText(/^ENQ-.*Bespoke design/).textContent())!.split(" · ")[0];
  await page.goto("/admin/");
  await page.getByRole("button", { name: "Use sample credentials" }).click();
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByRole("combobox", { name: "Enquiry source" }).selectOption("This browser");
  const enquiry = page.locator(".enquiry-entry").filter({ hasText: id });
  await enquiry.locator("summary").click();
  await enquiry.getByRole("combobox", { name: "Enquiry stage" }).selectOption("Contacted");
  await enquiry.getByLabel("Follow-up date").fill("2026-11-30");
  await enquiry.getByRole("button", { name: "Save enquiry" }).click();
  await expect(enquiry.locator("summary")).toContainText("Contacted · Follow-up 2026-11-30");
  expect(await page.evaluate(() => localStorage.getItem("attraqtive-demo-enquiries"))).not.toContain("demo@example.test");
  await page.reload();
  await expect(enquiry.locator("summary")).toContainText("Contacted · Follow-up 2026-11-30");
  await page.goto("/contact/");
  await page.getByRole("button", { name: "Preview WhatsApp enquiry" }).click();
  await expect(page.getByRole("dialog").getByText("The boutique’s WhatsApp number is awaiting confirmation.")).toBeVisible();
  await page.goto("/virtual-atelier/");
  await expect(page.locator('input[type="file"]')).toHaveCount(0);
  await expect(page.getByRole("button", { name: "View sample comparison" })).toBeDisabled();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "View sample comparison" }).click();
  await expect(page.getByRole("slider")).toBeVisible();
  await expect(page.getByRole("region", { name: "Illustrative comparison" }).getByAltText("Garnet lehenga displayed on a dress form")).toBeVisible();
  await expect(page.getByRole("region", { name: "Illustrative comparison" }).getByAltText("A model in an illustrative garnet bridal lehenga")).toBeVisible();
  await page.getByRole("button", { name: "Clear comparison" }).click();
  await expect(page.getByRole("slider")).toHaveCount(0);
  await page.goto("/virtual-atelier/?garment=olive-silk-anarkali");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "View sample comparison" }).click();
  const comparison = page.getByRole("region", { name: "Illustrative comparison" });
  await expect(comparison.getByAltText("Olive silk anarkali displayed on a dress form")).toBeVisible();
  await expect(comparison.getByAltText("A model wearing olive silk occasionwear")).toBeVisible();
});

test("every product offers three distinct gallery views with loadable images", async ({ page }) => {
  const views = [
    { role: "product", label: "Product View" },
    { role: "model", label: "On Model" },
    { role: "detail", label: "Details" },
  ] as const;
  for (const product of products) {
    await page.goto("/products/" + product.slug + "/");
    const gallery = page.getByRole("region", { name: "Product gallery" });
    const sources = new Set<string | null>();
    for (const { role, label } of views) {
      const media = product.media.find(image => image.role === role);
      if (!media) throw new Error(product.title + " is missing " + label);
      const view = gallery.getByRole("button", { name: label, exact: true });
      await view.click();
      await expect(view).toHaveAttribute("aria-pressed", "true");
      const photo = gallery.getByRole("img", { name: media.alt, exact: true });
      await expect(photo).toBeVisible();
      await expect.poll(() => photo.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      sources.add(await photo.getAttribute("src"));
    }
    expect(sources.size, product.title).toBe(3);
  }
});

test("browse and zoom model shots, then move a saved variant into the bag", async ({ page }) => {
  await page.goto("/products/garnet-zardozi-lehenga/");
  await page.getByRole("button", { name: "On Model" }).click();
  const photographs = page.getByRole("group", { name: /Garment photographs/ });
  await photographs.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("button", { name: "View image 2" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Enlarge image" }).click();
  const dialog = page.getByRole("dialog", { name: "Garment image" });
  await expect(dialog.getByAltText("Alternate illustrative garnet lehenga styling in a sandstone arch")).toBeVisible();
  const zoom = dialog.getByRole("button", { name: "2× zoom" });
  await zoom.click();
  await expect(zoom).toHaveAttribute("aria-pressed", "true");
  const viewer = dialog.getByRole("region", { name: "Garment photograph" });
  expect(await viewer.evaluate(frame => frame.scrollWidth / frame.clientWidth)).toBeGreaterThanOrEqual(1.9);
  await zoom.click();
  await expect(zoom).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Enlarge image" })).toBeFocused();

  await page.getByRole("button", { name: "Save Garnet Zardozi Lehenga", exact: true }).click();
  await page.goto("/wishlist/");
  await page.getByRole("link", { name: /Move to bag.*Garnet/ }).click();
  await page.getByRole("button", { name: "Move to bag", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Select an available size" })).toBeVisible();
  await page.getByRole("button", { name: "L", exact: true }).click();
  await page.getByRole("button", { name: "Move to bag", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Moved from your wishlist" })).toBeVisible();
  await page.goto("/wishlist/");
  await expect(page.getByRole("heading", { name: "Nothing saved yet" })).toBeVisible();
  await page.goto("/cart/");
  await expect(page.getByText("Garnet · L · ₹28,500 each")).toBeVisible();
  await page.getByRole("button", { name: "Save for later" }).click();
  await expect(page.getByRole("heading", { name: "Your bag is empty" })).toBeVisible();
  await page.goto("/wishlist/");
  await expect(page.getByRole("link", { name: /Move to bag.*Garnet/ })).toBeVisible();
});

test("guest checkout consumes stock and owner payment, fulfilment and restock actions stay separate", async ({ page }) => {
  const garment = "/products/garnet-zardozi-lehenga/";
  await page.goto(garment);
  await page.getByRole("button", { name: "XL", exact: true }).click();
  await page.getByRole("button", { name: "Add to bag" }).click();
  await page.getByRole("button", { name: "Open shopping bag, 1 item" }).click();
  await page.getByRole("link", { name: "Demo checkout" }).click();
  await expect(page.getByRole("heading", { name: "Guest checkout" })).toBeVisible();
  await page.getByLabel("Full name").fill("Sample guest");
  await page.getByLabel("Email", { exact: true }).fill("guest@example.test");
  await page.getByRole("combobox", { name: "Delivery method" }).selectOption("boutique");
  await page.getByRole("button", { name: "Complete demo order" }).click();
  await expect(page.getByRole("heading", { name: "Demo order complete" })).toBeVisible();
  await expect(page.getByRole("link", { name: "View demo receipt" })).toHaveCount(0);
  await page.goto(garment);
  await expect(page.getByRole("button", { name: "XL", exact: true })).toBeDisabled();

  await page.goto("/admin/");
  await page.getByRole("button", { name: "Use sample credentials" }).click();
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByRole("combobox", { name: "Order source" }).selectOption("This browser");
  const variant = page.getByRole("region", { name: "Variant demand and stock" }).getByRole("row").filter({ hasText: "AL-GAR-XL" });
  await expect(variant.getByRole("cell").last()).toHaveText("0");
  const order = page.getByRole("region", { name: "Owner order register" }).getByRole("row").filter({ hasText: "Demo guest" });
  await order.locator("summary").click();
  await order.getByRole("button", { name: "Mark ready for pickup" }).click();
  await expect(order.getByText("Ready for pickup", { exact: true })).toBeVisible();
  await expect(order.getByText("Paid", { exact: true })).toBeVisible();
  await order.getByRole("button", { name: "Simulate full refund" }).click();
  await expect(order.getByText("Refunded", { exact: true })).toBeVisible();
  await expect(order.getByText("Cancelled", { exact: true })).toBeVisible();
  await expect(variant.getByRole("cell").last()).toHaveText("0");
  await order.getByRole("button", { name: "Return units to stock" }).click();
  await expect(variant.getByRole("cell").last()).toHaveText("1");
  await page.goto(garment);
  await expect(page.getByRole("button", { name: "XL", exact: true })).toBeEnabled();
});

test("demo roles route to separate account views and owner reports can be filtered and exported", async ({ page }) => {
  await page.goto("/");
  const signInLink = page.getByRole("navigation", { name: "Shop navigation" }).getByRole("link", { name: "Sign in" });
  await expect(signInLink).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await signInLink.click();
  await page.getByRole("button", { name: "Use sample credentials" }).click();
  await page.getByLabel("Demo access code").fill("incorrect");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Use the sample credentials" })).toBeVisible();
  await page.getByRole("button", { name: "Use sample credentials" }).click();
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Demo Customer" })).toBeVisible();
  await page.goto("/admin/");
  await expect(page.getByRole("heading", { name: "Sales overview" })).toHaveCount(0);
  await page.getByRole("button", { name: "Use sample credentials" }).click();
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Sales overview" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Style demand" })).toBeVisible();
  await page.getByRole("combobox", { name: "Period" }).selectOption("90");
  await page.getByRole("combobox", { name: "Collection category" }).selectOption("menswear");
  const demand = page.getByRole("region", { name: "Style demand report" });
  await expect(demand.getByRole("link", { name: "Ivory Embroidered Sherwani" })).toBeVisible();
  await expect(demand.getByRole("link", { name: "Garnet Zardozi Lehenga" })).toHaveCount(0);
  await page.getByRole("combobox", { name: "Rank by" }).selectOption("views");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  expect((await download).suggestedFilename()).toBe("attraqtive-demo-orders-90d.csv");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  const findings = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  expect(findings.violations).toEqual([]);
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Sales overview" })).toHaveCount(0);
});

test("homepage accessibility and responsive boundaries", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  const findings = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  expect(findings.violations).toEqual([]);
});
