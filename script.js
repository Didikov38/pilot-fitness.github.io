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
  let slideInterval;

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

    // =========================================
    // ОБНОВЛЕНИЕ: Обновляем активную точку (МОЙ ДОБАВЛЕННЫЙ КОД)
    // =========================================
    document.querySelectorAll('.slider-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
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
    clearInterval(slideInterval);
    // Устанавливаем новый интервал (5 секунд)
    slideInterval = setInterval(nextSlide, 5000);
  }

  /**
   * 5. ИНИЦИАЛИЗАЦИЯ СЛАЙДЕРА
   */
  function initSlider() {
    // Показываем первый слайд
    showSlide(currentSlide);
    
    // =========================================
    // ОБНОВЛЕНИЕ: Создаем точки-индикаторы (МОЙ ДОБАВЛЕННЫЙ КОД)
    // =========================================
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots';
    document.querySelector('.slider').appendChild(dotsContainer);

    // Добавляем точки для каждого слайда
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = 'slider-dot';
      if (index === currentSlide) dot.classList.add('active');
      
      // Переключение по клику на точку
      dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(index);
        startSlideShow();
      });
      
      dotsContainer.appendChild(dot);
    });

    // Запускаем автоматическое переключение
    startSlideShow();
    
    /**
     * 6. ОБРАБОТЧИКИ СОБЫТИЙ ДЛЯ КНОПОК УПРАВЛЕНИЯ
     */
    
    // Кнопка "следующий слайд"
    nextBtn.addEventListener('click', function() {
      // Останавливаем авто-переключение
      clearInterval(slideInterval);
      // Переключаем слайд
      nextSlide();
      // Перезапускаем таймер
      startSlideShow();
    });
    
    // Кнопка "предыдущий слайд"
    prevBtn.addEventListener('click', function() {
      clearInterval(slideInterval);
      showSlide(currentSlide - 1);
      startSlideShow();
    });
    
    /**
     * 7. ПАУЗА ПРИ НАВЕДЕНИИ МЫШИ НА СЛАЙДЕР
     */
    const slider = document.querySelector('.slider');
    
    // При наведении мыши останавливаем авто-переключение
    slider.addEventListener('mouseenter', function() {
      clearInterval(slideInterval);
    });
    
    // При уходе мыши возобновляем авто-переключение
    slider.addEventListener('mouseleave', startSlideShow);
  }

  // Запускаем слайдер (если он есть на странице)
  if (slides.length > 0) {
    initSlider();
  }

  /**
   * 8. ДОПОЛНИТЕЛЬНЫЕ СКРИПТЫ САЙТА
   */
  
 // Добавьте вместо этого (опционально, для плавного перехода):
document.querySelectorAll('.buy-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    document.body.style.opacity = '0.7'; // Эффект затухания
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
