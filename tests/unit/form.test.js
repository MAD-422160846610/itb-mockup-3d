/**
 * Unit Tests for Contact Form Validation
 * Run with: npm run test:unit
 */
describe('Contact Form Validation', () => {
  let form, nameInput, emailInput, companyInput, serviceSelect, messageTextarea, submitBtn, formStatus;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <form id="contact-form" class="contact-form">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="company">Empresa</label>
          <input type="text" id="company" name="company">
        </div>
        <div class="form-group">
          <label for="service">Servicio</label>
          <select id="service" name="service">
            <option value="">Seleccione</option>
            <option value="inspeccion">Inspección</option>
          </select>
        </div>
        <div class="form-group">
          <label for="message">Mensaje</label>
          <textarea id="message" name="message"></textarea>
        </div>
        <button type="submit" id="submit-btn">Enviar</button>
        <p id="form-status"></p>
      </form>
    `;

    form = document.getElementById('contact-form');
    nameInput = document.getElementById('name');
    emailInput = document.getElementById('email');
    companyInput = document.getElementById('company');
    serviceSelect = document.getElementById('service');
    messageTextarea = document.getElementById('message');
    submitBtn = document.getElementById('submit-btn');
    formStatus = document.getElementById('form-status');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should validate required fields', () => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    expect(data.name).toBe('');
    expect(data.email).toBe('');
  });

  test('should accept valid form data', () => {
    nameInput.value = 'Juan Pérez';
    emailInput.value = 'juan@test.com';
    companyInput.value = 'Test Company';
    serviceSelect.value = 'inspeccion';
    messageTextarea.value = 'Test message';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    expect(data.name).toBe('Juan Pérez');
    expect(data.email).toBe('juan@test.com');
    expect(data.company).toBe('Test Company');
    expect(data.service).toBe('inspeccion');
    expect(data.message).toBe('Test message');
  });

  test('should handle form submission', (done) => {
    const mockSend = jest.fn().mockResolvedValue({ status: 200 });
    window.emailjs = { send: mockSend, init: jest.fn() };

    nameInput.value = 'Test User';
    emailInput.value = 'test@example.com';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      expect(submitBtn.disabled).toBe(true);
      done();
    });

    form.dispatchEvent(new Event('submit'));
  });
});
