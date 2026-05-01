const { test, expect } = require('@playwright/test');

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://mad-422160846610.github.io/itb-mockup-3d/');
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/ITB - Inspecciones Técnicas de Buques/);
  });

  test('should navigate to services section', async ({ page }) => {
    await page.click('text=Servicios');
    await expect(page).toHaveURL(/#servicios/);
    
    const servicesSection = page.locator('#servicios');
    await expect(servicesSection).toBeVisible();
  });

  test('should navigate to fleet section', async ({ page }) => {
    await page.click('text=Flota');
    await expect(page).toHaveURL(/#flota/);
    
    const fleetSection = page.locator('#flota');
    await expect(fleetSection).toBeVisible();
  });

  test('should navigate to differentials section', async ({ page }) => {
    await page.click('text=Diferenciales');
    await expect(page).toHaveURL(/#diferenciales/);
    
    const diffSection = page.locator('#diferenciales');
    await expect(diffSection).toBeVisible();
  });

  test('should navigate to about section', async ({ page }) => {
    await page.click('text=Nosotros');
    await expect(page).toHaveURL(/#about/);
    
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeVisible();
  });

  test('should navigate to contact section', async ({ page }) => {
    await page.click('text=Contacto');
    await expect(page).toHaveURL(/#contacto/);
    
    const contactSection = page.locator('#contacto');
    await expect(contactSection).toBeVisible();
  });

  test('should have working smooth scroll', async ({ page }) => {
    const contactLink = page.locator('a[href="#contacto"]').first();
    await contactLink.click();
    
    // Wait for scroll to complete
    await page.waitForTimeout(1000);
    
    const contactSection = page.locator('#contacto');
    await expect(contactSection).toBeInViewport();
  });

  test('should toggle mobile menu', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    const mobileMenuBtn = page.locator('#mobile-menu-btn');
    await expect(mobileMenuBtn).toBeVisible();
    
    await mobileMenuBtn.click();
    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).toHaveClass(/active/);
    
    await mobileMenuBtn.click();
    await expect(mobileMenu).not.toHaveClass(/active/);
  });
});
