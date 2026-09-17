const form = document.querySelector('#signup-form');
const summary = document.querySelector('#summary');
const formError = document.querySelector('#form-error');
const editButton = document.querySelector('#edit-button');

const fieldIds = [
  'login',
  'email',
  'password',
  'password-confirmation',
  'last-name',
  'first-name',
  'address',
  'phone',
  'birth-date'
];

const labels = {
  login: 'Le login',
  email: "L'email",
  password: 'Le mot de passe',
  'password-confirmation': 'La confirmation du mot de passe',
  'last-name': 'Le nom',
  'first-name': 'Le prénom',
  address: "L'adresse",
  phone: 'Le téléphone',
  'birth-date': 'La date de naissance'
};

function getField(id) {
  return document.querySelector(`#${id}`);
}

function setFieldError(id, message) {
  const field = getField(id);
  const error = document.querySelector(`#${id}-error`);
  field.setAttribute('aria-invalid', 'true');
  error.textContent = message;
}

function clearErrors() {
  formError.hidden = true;
  formError.textContent = '';
  fieldIds.forEach((id) => {
    getField(id).removeAttribute('aria-invalid');
    document.querySelector(`#${id}-error`).textContent = '';
  });
}

function validateForm() {
  const errors = [];
  const values = {};

  fieldIds.forEach((id) => {
    const field = getField(id);
    values[id] = field.value.trim();
    if (!values[id]) {
      const message = `${labels[id]} ${id === 'address' || id === 'birth-date' ? 'est requise.' : 'est requis.'}`;
      setFieldError(id, message);
      errors.push(message);
    }
  });

  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    const message = "L'email n'est pas valide.";
    setFieldError('email', message);
    errors.push(message);
  }

  if (values.password && values['password-confirmation'] && values.password !== values['password-confirmation']) {
    const message = 'Les mots de passe ne correspondent pas.';
    setFieldError('password-confirmation', message);
    errors.push(message);
  }

  if (values['birth-date']) {
    const selectedDate = new Date(`${values['birth-date']}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
      const message = 'La date de naissance ne peut pas être dans le futur.';
      setFieldError('birth-date', message);
      errors.push(message);
    }
  }

  if (errors.length > 0) {
    formError.textContent = 'Veuillez corriger les erreurs signalées avant de continuer.';
    formError.hidden = false;
    const firstInvalidField = document.querySelector('[aria-invalid="true"]');
    firstInvalidField.focus();
    return null;
  }

  return values;
}

function fillSummary(values) {
  const summaryFields = {
    login: values.login,
    email: values.email,
    'last-name': values['last-name'],
    'first-name': values['first-name'],
    address: values.address,
    phone: values.phone,
    'birth-date': new Date(`${values['birth-date']}T00:00:00`).toLocaleDateString('fr-FR')
  };

  Object.entries(summaryFields).forEach(([id, value]) => {
    document.querySelector(`#summary-${id}`).textContent = value;
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors();
  const values = validateForm();

  if (!values) {
    return;
  }

  fillSummary(values);
  form.hidden = true;
  summary.hidden = false;
  summary.querySelector('#edit-button').focus();
});

editButton.addEventListener('click', () => {
  summary.hidden = true;
  form.hidden = false;
  getField('login').focus();
});
