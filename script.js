
function sanitizeInput(value) {
  return value.replace(/[<>]/g, '');
}

document.getElementById('yr').textContent = new Date().getFullYear();

var burger  = document.getElementById('burger');
var mainNav = document.getElementById('main-nav');

if (!burger || !mainNav) {
  console.warn('Burger ou nav introuvable');
} else {
  burger.addEventListener('click', function () {
    burger.classList.toggle('open');
    mainNav.classList.toggle('open');
  });

  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      burger.classList.remove('open');
      mainNav.classList.remove('open');
    });
  });
}


var dropdownItem = document.getElementById('nav-services');
var dropdownMenu = document.getElementById('nav-services-menu');
var closeTimer   = null;

if (dropdownItem && dropdownMenu) {

  function openDropdown() {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    dropdownItem.classList.add('open');
  }

  function scheduleClose() {
    closeTimer = setTimeout(function () {
      dropdownItem.classList.remove('open');
    }, 800);
  }

  dropdownItem.addEventListener('mouseenter', openDropdown);
  dropdownItem.addEventListener('mouseleave', scheduleClose);
  dropdownMenu.addEventListener('mouseenter', openDropdown);
  dropdownMenu.addEventListener('mouseleave', scheduleClose);

  dropdownMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      dropdownItem.classList.remove('open');
    });
  });
}

var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(function (el) {
  revealObserver.observe(el);
});

var lastClick = 0;

var btnReserver = document.getElementById('btn-reserver');

if (!btnReserver) {
  console.warn('Bouton reserver introuvable');
} else {

  btnReserver.addEventListener('click', function () {

    var now = Date.now();
    if (now - lastClick < 5000) {
      alert('Veuillez patienter quelques secondes avant de renvoyer.');
      return;
    }
    lastClick = now;

    var nomRaw   = document.getElementById('res-nom').value.trim();
    var telRaw   = document.getElementById('res-tel').value.trim();
    var service  = document.getElementById('res-service').value;
    var date     = document.getElementById('res-date').value;
    var heure    = document.getElementById('res-heure').value;
    var feedback = document.getElementById('form-feedback');

    var nom = sanitizeInput(nomRaw);
    var tel = sanitizeInput(telRaw);

    if (!nom || !tel || !service || !date || !heure) {
      alert('Merci de remplir tous les champs avant de confirmer.');
      return;
    }

    if (nom.length < 2) {
      alert('Veuillez entrer un nom valide (minimum 2 caracteres).');
      return;
    }

    var telNettoye = tel.replace(/[\s\-\.\+]/g, '');
    if (!/^[0-9]{8,15}$/.test(telNettoye)) {
      alert('Numero de telephone invalide. Entrez entre 8 et 15 chiffres.');
      return;
    }

    var today  = new Date();
    today.setHours(0, 0, 0, 0);
    var chosen = new Date(date);
    if (chosen < today) {
      alert('La date choisie est deja passee. Veuillez choisir une date future.');
      return;
    }

    var parts  = date.split('-');
    var dateFr = parts[2] + '/' + parts[1] + '/' + parts[0];

    var lignes = [
      'Bonjour New Land Barber House,',
      '',
      'Je souhaite prendre rendez-vous.',
      'Voici mes informations :',
      '',
      'Nom complet  : ' + nom,
      'Telephone    : ' + tel,
      'Prestation   : ' + service,
      'Date         : ' + dateFr,
      'Heure        : ' + heure,
      '',
      'Merci de confirmer ma reservation.',
      '',
      '-- sylvanusmorales@gmail.com'
    ];

    var messageEncode = encodeURIComponent(lignes.join('\n'));

    window.open('https://wa.me/2290159012334 ?text=' + messageEncode, '_blank');

    if (feedback) { feedback.style.display = 'block'; }

    document.getElementById('res-nom').value     = '';
    document.getElementById('res-tel').value     = '';
    document.getElementById('res-service').value = '';
    document.getElementById('res-date').value    = '';
    document.getElementById('res-heure').value   = '';

    setTimeout(function () {
      if (feedback) { feedback.style.display = 'none'; }
    }, 6000);
  });
}