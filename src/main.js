document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Скрипт для мобильного меню (Header)
  // ==========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const headerNav = document.querySelector('.header__nav');
  const navLinks = document.querySelectorAll('.nav__link');

  const toggleMenu = () => {
      headerNav.classList.toggle('is-open');

      const iconElement = menuToggle.querySelector('svg');
      if (headerNav.classList.contains('is-open')) {
          iconElement.setAttribute('data-lucide', 'x');
      } else {
          iconElement.setAttribute('data-lucide', 'menu');
      }
      lucide.createIcons();
  };

  menuToggle.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          if (window.innerWidth < 768) {
              setTimeout(() => {
                  if (headerNav.classList.contains('is-open')) {
                      toggleMenu();
                  }
              }, 200);
          }
      });
  });


  // ==========================================================================
  // 2. Скрипт для Cookie Pop-up (Этап 5)
  // ==========================================================================
  const cookiePopup = document.getElementById('cookiePopup');
  const acceptCookiesButton = document.getElementById('acceptCookies');
  const cookieAccepted = localStorage.getItem('vantacraft_cookies_accepted');

  const showCookiePopup = () => {
      if (!cookieAccepted) {
          cookiePopup.classList.remove('is-hidden');
      }
  }

  const hideCookiePopup = () => {
      cookiePopup.classList.add('is-hidden');
      localStorage.setItem('vantacraft_cookies_accepted', 'true');
  }

  showCookiePopup();
  acceptCookiesButton.addEventListener('click', hideCookiePopup);
});
// ==========================================================================
    // 3. JS Анимация Hero-секции (Code Flow Grid)
    // ==========================================================================
    const canvas = document.getElementById('codeGridCanvas');

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;
        const gridStep = 40; // Размер ячейки сетки
        const color = '#007AFF'; // var(--color-primary)

        let lines = [];

        // Инициализация сетки
        const initGrid = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
            lines = [];

            // Создаем вертикальные линии
            for (let x = 0; x < W; x += gridStep) {
                lines.push({ x: x, y: 0, type: 'vertical', speed: 0.5 + Math.random() });
            }
            // Создаем горизонтальные линии
            for (let y = 0; y < H; y += gridStep) {
                lines.push({ x: 0, y: y, type: 'horizontal', speed: 0.5 + Math.random() });
            }
        };

        const drawGrid = () => {
            // Очищаем фон
            ctx.clearRect(0, 0, W, H);

            // Цвет и стиль линий
            ctx.lineWidth = 1;

            lines.forEach(line => {
                // Анимация: линии пульсируют или меняют яркость
                const alpha = 0.1 + Math.sin(Date.now() * 0.001 * line.speed + line.x) * 0.1;
                ctx.strokeStyle = `rgba(0, 122, 255, ${alpha})`;

                ctx.beginPath();
                if (line.type === 'vertical') {
                    ctx.moveTo(line.x, 0);
                    ctx.lineTo(line.x, H);
                } else {
                    ctx.moveTo(0, line.y);
                    ctx.lineTo(W, line.y);
                }
                ctx.stroke();
            });
        };

        // Главный цикл анимации
        const animate = () => {
            requestAnimationFrame(animate);
            drawGrid();
        };

        // Запуск
        initGrid();
        animate();

        // Адаптивность
        window.addEventListener('resize', initGrid);
    }
    // ==========================================================================
    // 4. JS Логика Анимированных Счетчиков (Этап 3.2)
    // ==========================================================================
    const counterBlocks = document.querySelectorAll('.counter-block');
    const duration = 2000; // Длительность анимации в мс
    let countersAnimated = false;

    // Функция для анимации счетчика
    const animateCounter = (element) => {
        const target = +element.dataset.target;
        const suffix = element.dataset.suffix || '';
        const valueDisplay = element.querySelector('.counter-block__value');

        if (!valueDisplay) return;

        let startValue = 0;
        const startTime = performance.now();

        const updateCount = (timestamp) => {
            const progress = (timestamp - startTime) / duration;
            const current = Math.min(progress, 1) * target;

            valueDisplay.textContent = Math.floor(current) + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            }
        };

        requestAnimationFrame(updateCount);
    };

    // Функция для запуска счетчиков при появлении в области видимости
    const startCountersOnScroll = () => {
        if (countersAnimated) return;

        const achievementsSection = document.getElementById('achievements');
        if (!achievementsSection) return;

        const rect = achievementsSection.getBoundingClientRect();

        // Проверяем, находится ли верхняя граница секции выше или на уровне 80% от высоты окна
        if (rect.top <= window.innerHeight * 0.8) {
            counterBlocks.forEach(animateCounter);
            countersAnimated = true;
            window.removeEventListener('scroll', startCountersOnScroll);
        }
    };

    window.addEventListener('scroll', startCountersOnScroll);
    startCountersOnScroll(); // Проверка при загрузке страницы (если секция сразу видна)

    // Инициализация AOS (библиотека для анимации появления секций)
    AOS.init({
        duration: 1000,
        once: true, // Анимация только один раз
    });
    // ==========================================================================
    // 5. JS Логика Аккордеона (FAQ) (Этап 3.5)
    // ==========================================================================
    const accordionHeaders = document.querySelectorAll('.accordion__header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.accordion__item');
            const content = item.querySelector('.accordion__content');
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            // Закрыть все остальные
            accordionHeaders.forEach(h => {
                const otherItem = h.closest('.accordion__item');
                const otherContent = otherItem.querySelector('.accordion__content');

                if (otherItem !== item) {
                    h.setAttribute('aria-expanded', 'false');
                    otherContent.classList.remove('is-active');
                    otherContent.style.maxHeight = '0';
                }
            });

            // Открыть/Закрыть текущий
            if (!isExpanded) {
                header.setAttribute('aria-expanded', 'true');
                content.classList.add('is-active');
                // Устанавливаем высоту для анимации. scrollHeight дает фактическую высоту контента.
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = '0';
                // Удаляем класс is-active после завершения анимации (чтобы убрать лишние padding)
                content.addEventListener('transitionend', () => {
                    if (header.getAttribute('aria-expanded') === 'false') {
                        content.classList.remove('is-active');
                    }
                }, { once: true });
            }
        });
    });
// ==========================================================================
    // 7. JS Логика Формы Контактов и CAPTCHA (Этап 4)
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const captchaDisplay = document.getElementById('captchaDisplay');
    const captchaInput = document.getElementById('captchaInput');
    const captchaMessage = document.getElementById('captchaMessage');
    const submissionMessage = document.getElementById('submissionMessage');
    const policyAccept = document.getElementById('policyAccept');

    let correctAnswer = 0;

    /**
     * Генерирует простой математический пример (CAPTCHA).
     */
    function generateCaptcha() {
        const operator = Math.random() < 0.5 ? '+' : '-';
        let num1 = Math.floor(Math.random() * 15) + 5;
        let num2 = Math.floor(Math.random() * 10) + 1;

        if (operator === '-' && num1 < num2) {
            [num1, num2] = [num2, num1];
        }

        correctAnswer = operator === '+' ? num1 + num2 : num1 - num2;
        captchaDisplay.textContent = `${num1} ${operator} ${num2} = ?`;
        captchaMessage.textContent = '';
        captchaInput.value = '';
    }

    /**
     * Валидирует ответ CAPTCHA.
     * @returns {boolean} True, если ответ верный.
     */
    function validateCaptcha() {
        if (!captchaInput.value.trim()) {
            captchaMessage.textContent = 'Пожалуйста, решите пример.';
            captchaMessage.style.color = '#FF4545';
            return false;
        }

        const userAnswer = parseInt(captchaInput.value.trim());
        if (userAnswer === correctAnswer) {
            captchaMessage.textContent = 'Капча успешно пройдена!';
            captchaMessage.style.color = 'var(--color-primary)';
            return true;
        } else {
            captchaMessage.textContent = 'Неверный ответ. Попробуйте еще раз.';
            captchaMessage.style.color = '#FF4545';
            generateCaptcha();
            return false;
        }
    }

    // Инициализация CAPTCHA при загрузке страницы
    generateCaptcha();

    // Обработчик отправки формы
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        submissionMessage.style.display = 'none';

        const isCaptchaValid = validateCaptcha();
        const isPolicyAccepted = policyAccept.checked;

        if (isCaptchaValid && isPolicyAccepted) {

            // Имитация успешной отправки данных
            console.log('Form Submitted and Validated:', {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                phone: document.getElementById('contactPhone').value,
            });

            // Показываем сообщение об успехе ТОЛЬКО после успешной валидации
            submissionMessage.style.display = 'block';

            // Сброс формы и генерация новой капчи
            contactForm.reset();
            generateCaptcha();

            // Автоматически скрываем сообщение через 5 секунд
            setTimeout(() => {
                submissionMessage.style.display = 'none';
            }, 5000);

        } else if (!isPolicyAccepted) {
            alert('Пожалуйста, примите условия использования и политику конфиденциальности.');
            policyAccept.focus();
        }
    });