// Сохраняем данные в localStorage при переходе между шагами
document.addEventListener('DOMContentLoaded', function() {
  // Шаг 1 → Шаг 2
  const personalForm = document.getElementById('personal-data-form');
  if (personalForm) {
    personalForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      Object.fromEntries(formData).forEach((value, key) => {
        localStorage.setItem(key, value);
      });
      window.location.href = 'step2.html';
    });
  }

  // Шаг 2 → Шаг 3
  const planButtons = document.querySelectorAll('.select-plan');
  planButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const planCard = this.closest('.plan-card');
      localStorage.setItem('plan', planCard.dataset.plan);
      localStorage.setItem('price', planCard.querySelector('.price').textContent);
      window.location.href = 'step3.html';
    });
  });

  // Шаг 3: Подставляем сохранённые данные
  if (document.getElementById('selected-plan')) {
    document.getElementById('selected-plan').textContent = 
      localStorage.getItem('plan') || 'Не выбран';
    document.getElementById('plan-price').textContent = 
      localStorage.getItem('price') || '0 ₽';
  }

  // Отправка данных на сервер (заглушка)
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      const allData = {
        ...Object.fromEntries(formData),
        ...Object.fromEntries(localStorage)
      };
      
      console.log('Данные для отправки:', allData);
      alert('Абонемент оформлен! Данные: ' + JSON.stringify(allData, null, 2));
      
      // Здесь будет fetch-запрос к вашему API
      // fetch('/api/subscribe', { method: 'POST', body: JSON.stringify(allData) })
    });
  }
});