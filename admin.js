const firebaseConfig = {
  apiKey: "AIzaSyAJojCBMMgblk6_SwidxIe-VT2Ffo-SAbk",
    authDomain: "pilot-fitness.firebaseapp.com",
    projectId: "pilot-fitness",
    storageBucket: "pilot-fitness.firebasestorage.app",
    messagingSenderId: "638178270952",
    appId: "1:638178270952:web:1cec6cdb7f0b751a2e735d"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);

// Затем уже остальной ваш код:
const db = firebase.firestore();
const auth = firebase.auth();
// Инициализация переменных
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

// Проверка авторизации при загрузке страницы
auth.onAuthStateChanged(user => {
  if (user) {
    // Пользователь авторизован
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    
    // Загружаем данные
    loadPromotions();
    loadTrainers();
    loadMessages();
  } else {
    // Пользователь не авторизован
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
  }
});

// Замените объявление функции на:
window.login = function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => console.log("Успешный вход!"))
    .catch(error => alert("Ошибка: " + error.message));
}

// Функция выхода
function logout() {
  auth.signOut();
}

// Навигация по разделам
document.querySelectorAll('.sidebar-menu a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Удаляем активный класс у всех ссылок
    document.querySelectorAll('.sidebar-menu a').forEach(item => {
      item.classList.remove('active');
    });
    
    // Добавляем активный класс к текущей ссылке
    this.classList.add('active');
    
    // Скрываем все разделы
    document.querySelectorAll('.content > div').forEach(section => {
      section.classList.add('hidden');
    });
    
    // Показываем выбранный раздел
    const sectionId = this.getAttribute('data-section') + '-section';
    document.getElementById(sectionId).classList.remove('hidden');
  });
});

// ========== Управление акциями ==========

// Показать форму добавления акции
function showAddPromotionForm() {
  document.getElementById('add-promotion-form').classList.remove('hidden');
}

// Скрыть форму добавления акции
function hideAddPromotionForm() {
  document.getElementById('add-promotion-form').classList.add('hidden');
  document.getElementById('promo-title').value = '';
  document.getElementById('promo-desc').value = '';
  document.getElementById('promo-image').value = '';
  document.getElementById('promo-active').checked = false;
}

// Добавление акции
async function addPromotion() {
  const title = document.getElementById('promo-title').value;
  const description = document.getElementById('promo-desc').value;
  const isActive = document.getElementById('promo-active').checked;
  const imageFile = document.getElementById('promo-image').files[0];
  
  if (!title || !description) {
    alert('Пожалуйста, заполните все обязательные поля');
    return;
  }
  
  try {
    let imageUrl = '';
    
    // Если загружено изображение
    if (imageFile) {
      // Загружаем файл в Storage
      const storageRef = storage.ref('promotions/' + imageFile.name);
      await storageRef.put(imageFile);
      imageUrl = await storageRef.getDownloadURL();
    }
    
    // Добавляем данные в Firestore
    await db.collection('promotions').add({
      title: title,
      description: description,
      imageUrl: imageUrl,
      isActive: isActive,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    alert('Акция успешно добавлена!');
    hideAddPromotionForm();
    loadPromotions();
  } catch (error) {
    alert('Ошибка при добавлении акции: ' + error.message);
  }
}

// Загрузка списка акций
function loadPromotions() {
  const promotionsList = document.getElementById('promotions-list');
  promotionsList.innerHTML = '<p>Загрузка...</p>';
  
  db.collection('promotions').orderBy('createdAt', 'desc').get()
    .then(snapshot => {
      if (snapshot.empty) {
        promotionsList.innerHTML = '<p>Акции не найдены</p>';
        return;
      }
      
      promotionsList.innerHTML = '';
      
      snapshot.forEach(doc => {
        const promo = doc.data();
        const promoId = doc.id;
        
        const promoCard = document.createElement('div');
        promoCard.className = 'item-card';
        promoCard.innerHTML = `
          <div class="item-actions">
            <button class="action-btn edit" onclick="editPromotion('${promoId}')"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete" onclick="deletePromotion('${promoId}')"><i class="fas fa-trash"></i></button>
          </div>
          ${promo.imageUrl ? `<img src="${promo.imageUrl}" alt="${promo.title}">` : ''}
          <h3>${promo.title}</h3>
          <p>${promo.description}</p>
          <p><strong>Статус:</strong> ${promo.isActive ? 'Активна' : 'Неактивна'}</p>
        `;
        
        promotionsList.appendChild(promoCard);
      });
    })
    .catch(error => {
      promotionsList.innerHTML = '<p>Ошибка при загрузке акций</p>';
      console.error('Ошибка загрузки акций:', error);
    });
}

// Удаление акции
function deletePromotion(promoId) {
  if (confirm('Вы уверены, что хотите удалить эту акцию?')) {
    db.collection('promotions').doc(promoId).delete()
      .then(() => {
        alert('Акция удалена');
        loadPromotions();
      })
      .catch(error => {
        alert('Ошибка при удалении акции: ' + error.message);
      });
  }
}

// Редактирование акции (упрощённая версия)
function editPromotion(promoId) {
  // Здесь можно реализовать форму редактирования
  alert('Редактирование акции с ID: ' + promoId);
}

// ========== Управление тренерами ==========

// Показать форму добавления тренера
function showAddTrainerForm() {
  document.getElementById('add-trainer-form').classList.remove('hidden');
}

// Скрыть форму добавления тренера
function hideAddTrainerForm() {
  document.getElementById('add-trainer-form').classList.add('hidden');
  document.getElementById('trainer-name').value = '';
  document.getElementById('trainer-position').value = '';
  document.getElementById('trainer-specialization').value = '';
  document.getElementById('trainer-experience').value = '';
  document.getElementById('trainer-photo').value = '';
}

// Добавление тренера
async function addTrainer() {
  const name = document.getElementById('trainer-name').value;
  const position = document.getElementById('trainer-position').value;
  const specialization = document.getElementById('trainer-specialization').value.split(',').map(item => item.trim());
  const experience = document.getElementById('trainer-experience').value;
  const photoFile = document.getElementById('trainer-photo').files[0];
  
  if (!name || !position || !experience) {
    alert('Пожалуйста, заполните все обязательные поля');
    return;
  }
  
  try {
    let photoUrl = '';
    
    // Если загружено фото
    if (photoFile) {
      // Загружаем файл в Storage
      const storageRef = storage.ref('trainers/' + photoFile.name);
      await storageRef.put(photoFile);
      photoUrl = await storageRef.getDownloadURL();
    }
    
    // Добавляем данные в Firestore
    await db.collection('trainers').add({
      name: name,
      position: position,
      specialization: specialization,
      experience: experience,
      photoUrl: photoUrl,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    alert('Тренер успешно добавлен!');
    hideAddTrainerForm();
    loadTrainers();
  } catch (error) {
    alert('Ошибка при добавлении тренера: ' + error.message);
  }
}

// Загрузка списка тренеров
function loadTrainers() {
  const trainersList = document.getElementById('trainers-list');
  trainersList.innerHTML = '<p>Загрузка...</p>';
  
  db.collection('trainers').orderBy('createdAt', 'desc').get()
    .then(snapshot => {
      if (snapshot.empty) {
        trainersList.innerHTML = '<p>Тренеры не найдены</p>';
        return;
      }
      
      trainersList.innerHTML = '';
      
      snapshot.forEach(doc => {
        const trainer = doc.data();
        const trainerId = doc.id;
        
        const trainerCard = document.createElement('div');
        trainerCard.className = 'item-card';
        trainerCard.innerHTML = `
          <div class="item-actions">
            <button class="action-btn edit" onclick="editTrainer('${trainerId}')"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete" onclick="deleteTrainer('${trainerId}')"><i class="fas fa-trash"></i></button>
          </div>
          ${trainer.photoUrl ? `<img src="${trainer.photoUrl}" alt="${trainer.name}" style="max-height: 200px;">` : ''}
          <h3>${trainer.name}</h3>
          <p><strong>Должность:</strong> ${trainer.position}</p>
          <p><strong>Опыт:</strong> ${trainer.experience}</p>
          <p><strong>Специализация:</strong> ${trainer.specialization.join(', ')}</p>
        `;
        
        trainersList.appendChild(trainerCard);
      });
    })
    .catch(error => {
      trainersList.innerHTML = '<p>Ошибка при загрузке тренеров</p>';
      console.error('Ошибка загрузки тренеров:', error);
    });
}

// Удаление тренера
function deleteTrainer(trainerId) {
  if (confirm('Вы уверены, что хотите удалить этого тренера?')) {
    db.collection('trainers').doc(trainerId).delete()
      .then(() => {
        alert('Тренер удалён');
        loadTrainers();
      })
      .catch(error => {
        alert('Ошибка при удалении тренера: ' + error.message);
      });
  }
}

// Редактирование тренера (упрощённая версия)
function editTrainer(trainerId) {
  // Здесь можно реализовать форму редактирования
  alert('Редактирование тренера с ID: ' + trainerId);
}

// ========== Управление сообщениями ==========

// Загрузка сообщений
function loadMessages() {
  const messagesList = document.getElementById('messages-list');
  messagesList.innerHTML = '<p>Загрузка...</p>';
  
  db.collection('messages').orderBy('createdAt', 'desc').get()
    .then(snapshot => {
      if (snapshot.empty) {
        messagesList.innerHTML = '<p>Сообщений нет</p>';
        return;
      }
      
      messagesList.innerHTML = '';
      
      snapshot.forEach(doc => {
        const message = doc.data();
        const messageId = doc.id;
        
        const messageCard = document.createElement('div');
        messageCard.className = 'item-card';
        messageCard.innerHTML = `
          <div class="item-actions">
            <button class="action-btn delete" onclick="deleteMessage('${messageId}')"><i class="fas fa-trash"></i></button>
          </div>
          <p><strong>Имя:</strong> ${message.name}</p>
          <p><strong>Телефон:</strong> ${message.phone}</p>
          <p><strong>Дата:</strong> ${new Date(message.createdAt?.toDate()).toLocaleString()}</p>
        `;
        
        messagesList.appendChild(messageCard);
      });
    })
    .catch(error => {
      messagesList.innerHTML = '<p>Ошибка при загрузке сообщений</p>';
      console.error('Ошибка загрузки сообщений:', error);
    });
}

// Удаление сообщения
function deleteMessage(messageId) {
  if (confirm('Вы уверены, что хотите удалить это сообщение?')) {
    db.collection('messages').doc(messageId).delete()
      .then(() => {
        alert('Сообщение удалено');
        loadMessages();
      })
      .catch(error => {
        alert('Ошибка при удалении сообщения: ' + error.message);
      });
  }
}

// ========== Настройки сайта ==========

// Сохранение настроек
function saveSettings() {
  const title = document.getElementById('site-title').value;
  const description = document.getElementById('site-description').value;
  
  // Здесь можно добавить сохранение в Firestore
  alert('Настройки сохранены (функция сохранения в БД будет реализована позже)');
}