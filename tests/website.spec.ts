import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const HOLD_MIDPOINTS = [0.055, 0.2775, 0.5, 0.7225, 0.945];
const FOLD_STARTS = [0.11, 0.3325, 0.555, 0.7775];
const FOLD_DURATION = 0.1125;

async function scrollStoryTo(page: Page, progress: number) {
  await page.evaluate((progress) => {
    document.documentElement.style.scrollBehavior = "auto";
    const story = document.querySelector<HTMLElement>(".cinema-story")!;
    const stage = document.querySelector<HTMLElement>(".cinema-stage")!;
    const start = story.getBoundingClientRect().top + window.scrollY;
    const travel = stage.clientHeight * (innerWidth >= 1000 ? 4.5 : 2.6);
    window.scrollTo(0, start + travel * progress);
  }, progress);
  await expect
    .poll(async () =>
      Math.abs(
        Number(
          await page.locator(".cinema-story").getAttribute("data-progress"),
        ) - progress,
      ),
    )
    .toBeLessThan(0.002);
}

async function expectFullViewport(page: Page) {
  const dimensions = await page.locator(".cinema-stage").evaluate((stage) => {
    const rect = stage.getBoundingClientRect();
    const style = getComputedStyle(stage);
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      viewportWidth: innerWidth,
      viewportHeight: innerHeight,
      radius: parseFloat(style.borderRadius),
      pageWidth: document.documentElement.scrollWidth,
    };
  });
  expect(Math.abs(dimensions.x)).toBeLessThan(1);
  expect(Math.abs(dimensions.y)).toBeLessThan(1);
  expect(dimensions.width).toBeCloseTo(dimensions.viewportWidth, 0);
  expect(dimensions.height).toBeCloseTo(dimensions.viewportHeight, 0);
  expect(dimensions.radius).toBe(0);
  expect(dimensions.pageWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
}

async function foldState(page: Page, transition: number) {
  return page
    .locator(`.cinema-fold[data-transition="${transition}"]`)
    .evaluate((fold) => {
      const flap = fold.querySelector<HTMLElement>(".cinema-flap")!;
      const style = getComputedStyle(flap);
      const matrix = new DOMMatrixReadOnly(style.transform);
      const descendants = [fold, ...fold.querySelectorAll("*")];
      const blur = Math.max(
        0,
        ...descendants.map((element) =>
          Number(
            getComputedStyle(element).filter.match(/blur\(([\d.]+)px\)/)?.[1] ??
              0,
          ),
        ),
      );
      return {
        cosine: matrix.m11,
        sine: matrix.m13,
        blur,
        hinge: flap.offsetLeft + parseFloat(style.transformOrigin),
        stageWidth:
          document.querySelector<HTMLElement>(".cinema-stage")!.clientWidth,
        shadow: Number(
          getComputedStyle(fold.querySelector(".cinema-receiving-shadow")!)
            .opacity,
        ),
      };
    });
}

test("desktop loads local assets, has no overflow, and opens meaningful service details", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Built for",
  );
  await expect(page.locator("#home.cinema-story")).toHaveClass(/is-animated/);
  await expectFullViewport(page);
  await expect(page.locator(".cinema-skip")).toBeVisible();
  await expect(page.locator(".cinema-skip")).toHaveAttribute(
    "href",
    "#services",
  );
  await page.screenshot({ path: "artifacts/desktop-hero.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    await page
      .locator(".cinema-photo-main")
      .first()
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

test("five full-screen chapters stay sharp, reverse, and release normal scrolling", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".cinema-story")).toHaveClass(/is-animated/);
  for (const index of [0, 1, 2, 3, 4, 3, 2, 1, 0]) {
    await scrollStoryTo(page, HOLD_MIDPOINTS[index]);
    await expectFullViewport(page);
    await expect(page.locator(".cinema-chapter-number")).toHaveText(
      `0${index + 1}`,
    );
    const caption = page.locator(`.cinema-caption[data-scene="${index}"]`);
    await expect(caption).toHaveAttribute("aria-hidden", "false");
    await expect(caption).toHaveCSS("opacity", "1");
    expect(
      await page
        .locator(`.cinema-scene[data-scene="${index}"]`)
        .evaluate((scene) =>
          [scene, ...scene.querySelectorAll("*")].every((element) => {
            const filter = getComputedStyle(element).filter;
            return !filter.includes("blur") || /blur\(0px\)/.test(filter);
          }),
        ),
    ).toBe(true);
    await expect(page.locator(".site-header .nav-cta")).toBeInViewport();
    if (index === 4) {
      await expect(
        caption.getByRole("link", { name: "Book a Service" }),
      ).toHaveAttribute("href", "#contact");
      await page.screenshot({ path: "artifacts/desktop-final-chapter.png" });
      await caption.getByRole("link", { name: "Book a Service" }).click();
      await expect(page.getByLabel("Your name")).toBeInViewport();
    }
  }
  await page.locator(".cinema-skip").click();
  await expect(page.locator("#services")).toBeInViewport();
  await expect
    .poll(async () =>
      page
        .locator(".cinema-stage")
        .evaluate((el) => el.getBoundingClientRect().bottom),
    )
    .toBeLessThanOrEqual(82);
  expect(
    await page
      .locator(".cinema-stage")
      .evaluate((el) => getComputedStyle(el).position),
  ).not.toBe("fixed");
});

test("centre folds have aligned two-sided geometry, restrained blur, and deterministic reverse", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".cinema-story")).toHaveClass(/is-animated/);
  for (const transition of [0, 1, 2, 3]) {
    const halfway = FOLD_STARTS[transition] + FOLD_DURATION * 0.5;
    await scrollStoryTo(page, halfway);
    const fold = page.locator(`.cinema-fold[data-transition="${transition}"]`);
    await expect(fold).toBeVisible();
    const state = await foldState(page, transition);
    expect(Math.abs(state.cosine)).toBeLessThan(0.04);
    expect(Math.abs(state.sine)).toBeGreaterThan(0.99);
    expect(state.hinge).toBeCloseTo(state.stageWidth / 2, 0);
    expect(state.blur).toBeGreaterThan(0);
    expect(state.blur).toBeLessThanOrEqual(3);
    expect(state.shadow).toBeGreaterThan(0.05);
    await expect(fold.locator(".cinema-face-front")).toHaveCSS(
      "backface-visibility",
      "hidden",
    );
    await expect(fold.locator(".cinema-face-back")).toHaveCSS(
      "backface-visibility",
      "hidden",
    );
    await expect(page.locator(".site-header")).toHaveCSS("filter", "none");
    for (const caption of await page.locator(".cinema-caption").all()) {
      await expect(caption).toHaveCSS("filter", "none");
    }
    await scrollStoryTo(page, HOLD_MIDPOINTS[transition + 1]);
    await scrollStoryTo(page, halfway);
    const reversed = await foldState(page, transition);
    expect(reversed.cosine).toBeCloseTo(state.cosine, 2);
    expect(reversed.blur).toBeCloseTo(state.blur, 2);
    expect(reversed.shadow).toBeCloseTo(state.shadow, 2);
  }
  await scrollStoryTo(page, FOLD_STARTS[0] + FOLD_DURATION * 0.35);
  const stopped = await foldState(page, 0);
  await page.screenshot({ path: "artifacts/desktop-mid-fold.png" });
  // Deliberately allow time to pass to detect unintended autoplay or eased catch-up.
  await page.waitForTimeout(400);
  const afterHold = await foldState(page, 0);
  expect(afterHold.cosine).toBeCloseTo(stopped.cosine, 4);
  expect(afterHold.blur).toBeCloseTo(stopped.blur, 4);
  expect(afterHold.shadow).toBeCloseTo(stopped.shadow, 4);
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

test("360px mobile navigation, dialogs, form and full-screen animation are usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".cinema-story")).toHaveClass(/is-animated/);
  await expectFullViewport(page);
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

test("reduced motion gives sharp static chapters, no pin, and keyboard FAQ access", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".cinema-story")).not.toHaveClass(/is-animated/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expectFullViewport(page);
  await expect(
    page.locator(".cinema-static-chapters > .cinema-static-scene"),
  ).toHaveCount(4);
  for (const title of [
    "Precision in every service.",
    "Every detail. Refined.",
    "Care for every curve.",
    "Complete care. One destination.",
  ]) {
    await expect(
      page.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
  }
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
  await page.route("**/images/**", (route) => route.abort());
  await page.goto("/");
  await expect(
    page.locator(".cinema-photo-main.image-fallback").first(),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.screenshot({ path: "artifacts/asset-failure-hero.png" });
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
  await expect(page.locator(".cinema-story")).not.toHaveClass(/is-animated/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("portrait mobile and tablet keep full viewport coverage through folds and resizing", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".cinema-story")).toHaveClass(/is-animated/);
  for (const viewport of [
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await expect(page.locator(".cinema-story")).toHaveClass(/is-animated/);
    await scrollStoryTo(page, HOLD_MIDPOINTS[0]);
    await expectFullViewport(page);
    await scrollStoryTo(page, FOLD_STARTS[0] + FOLD_DURATION * 0.35);
    await expectFullViewport(page);
    await expect(page.locator(".cinema-skip")).toBeInViewport();
    await expect(page.locator(".site-header .nav-cta")).toBeInViewport();
    await page.screenshot({ path: `artifacts/fold-${viewport.width}.png` });
    await scrollStoryTo(page, HOLD_MIDPOINTS[4]);
    await expect(
      page.locator('.cinema-caption[data-scene="4"]'),
    ).toHaveAttribute("aria-hidden", "false");
    await expectFullViewport(page);
  }
});
