
  (function () {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  })();

  const closeBtn = document.getElementById('navbarCloseBtn');
  const collapseEl = document.getElementById('navbarToggleContent');
  const bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });

  closeBtn.addEventListener('click', () => {
    bsCollapse.hide();
  });


  