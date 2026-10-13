import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("desktop loads local assets, has no overflow, and opens meaningful service details", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Built for",
  );
  await expect(page.locator(".hero-story")).toHaveClass(/is-animated/);
  await page.screenshot({ path: "artifacts/desktop-hero.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    await page
      .locator(".story-photo-main")
      .evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
      ),
  ).toBe(true);
  await page
    .getByRole("link", { name: "Explore Services", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Explore Mechanical Services", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText(
    "Service availability is being confirmed",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Explore all care areas" }).click();
  await expect(
    page.getByRole("button", { name: "Electrical & AC Services" }),
  ).toBeVisible();
  expect(await page.locator("#all-care-areas button").count()).toBe(6);
  await page.screenshot({ path: "artifacts/desktop-services.png" });
  expect(errors).toEqual([]);
});

test("five scroll chapters reverse deterministically and release normal page scrolling", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".hero-story")).toHaveClass(/is-animated/);
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
  });
  for (const index of [0, 1, 2, 3, 4, 3, 2, 1, 0]) {
    await page.evaluate(
      (index) =>
        window.scrollTo(0, window.innerHeight * 4 * (index * 0.2 + 0.1)),
      index,
    );
    await expect(page.locator(".chapter-number")).toHaveText(`0${index + 1}`);
    await expect(page.locator(".story-copy").nth(index)).toHaveAttribute(
      "aria-hidden",
      "false",
    );
    await expect(page.locator(".story-copy").nth(index)).toHaveCSS(
      "opacity",
      "1",
    );
    if (index === 4)
      await page.screenshot({ path: "artifacts/desktop-final-chapter.png" });
  }
  await page.locator("#services").scrollIntoViewIfNeeded();
  await expect(page.locator("#services")).toBeInViewport();
  // scrollIntoViewIfNeeded may centre the shorter section; the prior scene must be above the fixed header.
  expect(
    await page
      .locator(".story-stage")
      .evaluate((el) => el.getBoundingClientRect().bottom),
  ).toBeLessThanOrEqual(82);
  expect(
    await page
      .locator(".story-stage")
      .evaluate((el) => getComputedStyle(el).position),
  ).not.toBe("fixed");
});

test("enquiry validates accessibly, rejects past dates, and prepares without false delivery", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Review your enquiry" }).click();
  await expect(page.locator("#name")).toBeFocused();
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(4);
  await page.getByLabel("Your name").fill("Test Visitor");
  await page.getByLabel("Mobile number").fill("+91 90000 00000");
  await page.getByLabel("Car make / model").fill("Hyundai Creta");
  await page.getByLabel("Service required").selectOption("general");
  expect(await page.locator("#service option").count()).toBe(2);
  await page.getByLabel("Preferred date").fill("2020-01-01");
  await page.getByRole("button", { name: "Review your enquiry" }).click();
  await expect(page.locator("#date-error")).toHaveText(
    "Choose today or a future date.",
  );
  await page.getByLabel("Preferred date").fill("");
  await page
    .getByLabel("Anything else")
    .fill("Please help me understand what care is suitable.");
  await page.getByRole("button", { name: "Review your enquiry" }).click();
  await expect(
    page.getByText("Prepared. Not sent.", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".enquiry-result")).toBeFocused();
  await expect(page.locator(".enquiry-result pre")).toContainText(
    "Hyundai Creta",
  );
  await expect(
    page.locator(
      'a[href^="https://wa.me"], a[href^="tel:"], a[href^="mailto:"]',
    ),
  ).toHaveCount(0);
  await page.getByLabel("Car make / model").fill("Updated car");
  await expect(page.locator(".enquiry-result")).toHaveCount(0);
});

test("360px mobile navigation, dialogs, form and static hero are usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.screenshot({ path: "artifacts/mobile-hero.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Services", exact: true })
    .click();
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await page
    .getByRole("button", { name: "Explore Mechanical Services", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close service details" }).click();
  await page
    .getByRole("link", { name: "Enquire About a Service", exact: true })
    .first()
    .click();
  await expect(page.getByLabel("Your name")).toBeInViewport();
  await page.getByRole("button", { name: "Review your enquiry" }).click();
  await expect(page.locator("#name-error")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "artifacts/mobile-contact.png" });
});

test("reduced motion gives a complete static experience and keyboard FAQ access", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".first-story")).toBeVisible();
  const faq = page.locator("summary").first();
  await faq.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  await page.screenshot({
    path: "artifacts/reduced-motion-full.png",
    fullPage: true,
  });
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    accessibility.violations.map((v) => ({
      id: v.id,
      description: v.description,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  ).toEqual([]);
});

test("image failure preserves content, navigation, service detail and form", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/images/**", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator(".story-photo-main.image-fallback")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page
    .getByRole("link", { name: "Explore Services", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Explore Mechanical Services", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Mechanical Services");
  await page.getByRole("button", { name: "Close service details" }).click();
  await page.getByRole("button", { name: "Review your enquiry" }).click();
  await expect(page.locator("#name")).toBeFocused();
  await page.screenshot({ path: "artifacts/asset-failure.png" });
});

test("low memory devices and resized desktop use the static fallback cleanly", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "deviceMemory", { get: () => 2 }),
  );
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".first-story")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
