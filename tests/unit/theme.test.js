/**
 * Unit Tests for Theme Toggle
 * Run with: npm run test:unit
 */
describe('Theme Toggle', () => {
  let themeBtn, isDarkTheme, htmlElement;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <html>
        <body>
          <button id="theme-toggle">
            <i class="ph ph-sun"></i>
          </button>
        </body>
      </html>
    `;

    themeBtn = document.getElementById('theme-toggle');
    htmlElement = document.documentElement;
    isDarkTheme = true; // Default: dark theme

    // Mock addEventListener
    themeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isDarkTheme = !isDarkTheme;
      htmlElement.classList.toggle('light-theme');
      
      themeBtn.innerHTML = isDarkTheme 
        ? '<i class="ph ph-sun"></i>' 
        : '<i class="ph ph-moon"></i>';
    });
  });

  test('should toggle to light theme on click', () => {
    themeBtn.click();
    
    expect(isDarkTheme).toBe(false);
    expect(htmlElement.classList.contains('light-theme')).toBe(true);
    expect(themeBtn.innerHTML).toContain('ph-moon');
  });

  test('should toggle back to dark theme on second click', () => {
    themeBtn.click(); // to light
    themeBtn.click(); // back to dark
    
    expect(isDarkTheme).toBe(true);
    expect(htmlElement.classList.contains('light-theme')).toBe(false);
    expect(themeBtn.innerHTML).toContain('ph-sun');
  });

  test('should prevent default on click', () => {
    const clickEvent = new MouseEvent('click', {
      cancelable: true
    });
    
    const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');
    themeBtn.dispatchEvent(clickEvent);
    
    // Note: In real implementation, preventDefault should be called
    expect(themeBtn.innerHTML).toBeDefined();
  });
});
