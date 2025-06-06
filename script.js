/**
 * =============================================
 * ОСНОВНОЙ JavaScript ФАЙЛ ДЛЯ ФИТНЕС-САЙТА
 * СЛАЙДЕР С АВТОПЕРЕКЛЮЧЕНИЕМ И РУЧНЫМ УПРАВЛЕНИЕМ
 * =============================================
 */

// Ждем полной загрузки DOM перед выполнением скриптов
document.addEventListener('DOMContentLoaded', function() {
  
  /**
   * 1. НАСТРОЙКА СЛАЙДЕРА
   */
  
  // Получаем все элементы слайдов
  const slides = document.querySelectorAll('.slide');
  // Получаем кнопки управления
  const prevBtn = document.querySelector('.slider-arrow_prev');
  const nextBtn = document.querySelector('.slider-arrow_next');
  // Текущий активный слайд
  let currentSlide = 0;
  // Общее количество слайдов
  const totalSlides = slides.length;
  // Таймер для автоматического переключения
  let sliderInterval;

  /**
   * 2. ФУНКЦИЯ ДЛЯ ПОКАЗА КОНКРЕТНОГО СЛАЙДА
   * @param {number} n - индекс слайда для показа
   */
  function showSlide(n) {
    // Скрываем все слайды
    slides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // Корректируем индекс (для циклического переключения)
    currentSlide = (n + totalSlides) % totalSlides;
    
    // Показываем текущий слайд
    slides[currentSlide].classList.add('active');

    // Обновляем активную точку
    if (document.querySelector('.slider-dots')) {
      document.querySelectorAll('.slider-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }
  }

  /**
   * 3. ФУНКЦИЯ ДЛЯ ПЕРЕКЛЮЧЕНИЯ НА СЛЕДУЮЩИЙ СЛАЙД
   */
  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  /**
   * 4. ФУНКЦИЯ ДЛЯ ЗАПУСКА АВТОМАТИЧЕСКОГО ПЕРЕКЛЮЧЕНИЯ
   */
  function startSlideShow() {
    // Очищаем предыдущий интервал (если был)
    clearInterval(sliderInterval);
    // Устанавливаем новый интервал (5 секунд)
    sliderInterval = setInterval(nextSlide, 5000);
  }

  /**
   * 5. ИНИЦИАЛИЗАЦИЯ СЛАЙДЕРА
   */
  function initSlider() {
    // Показываем первый слайд
    showSlide(currentSlide);
    
    // Создаем контейнер для точек
    const dotsContainer = document.querySelector('.slider-dots');
    
    // Добавляем точки для каждого слайда
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = 'slider-dot';
      if (index === currentSlide) dot.classList.add('active');
      
      dot.addEventListener('click', () => {
        clearInterval(sliderInterval);
        showSlide(index);
        startSlideShow();
      });
      
      dotsContainer.appendChild(dot);
    });

    // Обработчики событий для кнопок
    nextBtn.addEventListener('click', function() {
      clearInterval(sliderInterval);
      nextSlide();
      startSlideShow();
    });
    
    prevBtn.addEventListener('click', function() {
      clearInterval(sliderInterval);
      showSlide(currentSlide - 1);
      startSlideShow();
    });

    // Запускаем автоматическое переключение
    startSlideShow();
    
    // Пауза при наведении
    const slider = document.querySelector('.slider');
    slider.addEventListener('mouseenter', function() {
      clearInterval(sliderInterval);
    });
    
    slider.addEventListener('mouseleave', startSlideShow);
  }

  // Запускаем слайдер (если он есть на странице)
  if (slides.length > 0) {
    initSlider();
  }

  /**
   * 8. ДОПОЛНИТЕЛЬНЫЕ СКРИПТЫ САЙТА
   */
  
  // Плавный переход для кнопки "Купить абонемент"
  document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      document.body.style.opacity = '0.7';
      setTimeout(() => {
        window.location.href = this.href;
      }, 300);
    });
  });

  /**
   * 9. ПЛАВНЫЙ СКРОЛЛ ДЛЯ ЯКОРНЫХ ССЫЛОК
   */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
