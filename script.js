// =========================================
// 1. БУРГЕР-МЕНЮ
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
});

// =========================================
// 2. КНОПКА "НАВЕРХ"
// =========================================
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// =========================================
// 3. УВЕДОМЛЕНИЯ
// =========================================
const toast = document.getElementById('toastMessage');
function showToast(title, desc) {
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastDesc').textContent = desc;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// =========================================
// 4. АВТОРИЗАЦИЯ
// =========================================
const authModal = document.getElementById('authModal');
const modalTitle = document.getElementById('modalTitle');
const modalSubmitBtn = document.getElementById('modalSubmitBtn');
const switchAuthText = document.getElementById('switchAuthText');
const realNameField = document.getElementById('realName');
let isLoginMode = true;

function openModal(mode) {
    authModal.classList.add('active');
    if (mode === 'login') {
        isLoginMode = true;
        modalTitle.textContent = 'Вход';
        modalSubmitBtn.textContent = 'Войти';
        realNameField.style.display = 'none';
        switchAuthText.innerHTML = 'Нет аккаунта? <span onclick="switchModal(\'register\')">Зарегистрироваться</span>';
    } else {
        isLoginMode = false;
        modalTitle.textContent = 'Регистрация';
        modalSubmitBtn.textContent = 'Создать аккаунт';
        realNameField.style.display = 'block';
        switchAuthText.innerHTML = 'Уже есть аккаунт? <span onclick="switchModal(\'login\')">Войти</span>';
    }
}

function closeModal() {
    authModal.classList.remove('active');
    document.getElementById('authForm').reset();
}
function switchModal(mode) { openModal(mode); }

const authForm = document.getElementById('authForm');
const guestView = document.getElementById('guestView');
const userView = document.getElementById('userView');
const headerName = document.getElementById('headerName');
const headerAvatar = document.getElementById('headerAvatar');
const displayLogin = document.getElementById('displayLogin');

window.onload = () => {
    const currentUser = localStorage.getItem('HollowCore_login');
    if (currentUser) { showUserView(); }
};

authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const latinRegex = /^[A-Za-z0-9]+$/;
    if (!latinRegex.test(username)) {
        showToast('Ошибка', 'Логин должен содержать только английские буквы и цифры.');
        return;
    }

    if (isLoginMode) {
        const savedLogin = localStorage.getItem('HollowCore_login');
        const savedPass = localStorage.getItem('HollowCore_pass');
        if (username === savedLogin && password === savedPass) {
            showUserView();
            closeModal();
            showToast('Успех', 'Вы вошли в систему.');
        } else {
            showToast('Ошибка', 'Неверный логин или пароль.');
        }
    } else {
        const realName = realNameField.value.trim();
        if (!realName) { showToast('Ошибка', 'Введите имя.'); return; }
        if (localStorage.getItem('HollowCore_login')) {
            showToast('Ошибка', 'Пользователь уже существует.');
            return;
        }
        localStorage.setItem('HollowCore_login', username);
        localStorage.setItem('HollowCore_name', realName);
        localStorage.setItem('HollowCore_pass', password);
        if (!localStorage.getItem('HollowCore_avatar')) {
            localStorage.setItem('HollowCore_avatar', 'https://via.placeholder.com/40');
        }
        showUserView();
        closeModal();
        showToast('Успех', 'Аккаунт создан!');
    }
});

function showUserView() {
    guestView.style.display = 'none';
    userView.style.display = 'flex';
    const savedName = localStorage.getItem('HollowCore_name');
    const savedLogin = localStorage.getItem('HollowCore_login');
    headerName.textContent = savedName || 'Пользователь';
    displayLogin.textContent = 'Логин: ' + (savedLogin || 'login');
    const savedAvatar = localStorage.getItem('HollowCore_avatar');
    if (savedAvatar) { headerAvatar.src = savedAvatar; }
}

// =========================================
// 5. СМЕНА ИМЕНИ И УДАЛЕНИЕ
// =========================================
const changeNameModal = document.getElementById('changeNameModal');
const changeNameForm = document.getElementById('changeNameForm');

function openChangeNameModal() {
    document.getElementById('profileDropdown').classList.remove('active');
    changeNameModal.classList.add('active');
    document.getElementById('newNameInput').value = localStorage.getItem('HollowCore_name') || '';
}
function closeChangeNameModal() { changeNameModal.classList.remove('active'); }

changeNameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = document.getElementById('newNameInput').value.trim();
    if (newName) {
        localStorage.setItem('HollowCore_name', newName);
        headerName.textContent = newName;
        closeChangeNameModal();
        showToast('Успех', 'Имя изменено!');
    }
});

const deleteModal = document.getElementById('deleteModal');
function openDeleteModal() {
    document.getElementById('profileDropdown').classList.remove('active');
    deleteModal.classList.add('active');
}
function closeDeleteModal() { deleteModal.classList.remove('active'); }
function confirmDelete() {
    localStorage.clear();
    userView.style.display = 'none';
    guestView.style.display = 'flex';
    closeDeleteModal();
    showToast('Удалено', 'Ваш аккаунт удален.');
}

// =========================================
// 6. ПРОФИЛЬ И АВАТАРКА
// =========================================
function toggleProfileMenu() { document.getElementById('profileDropdown').classList.toggle('active'); }
document.addEventListener('click', (e) => {
    const wrapper = document.querySelector('.profile-wrapper');
    if (wrapper && !wrapper.contains(e.target)) {
        document.getElementById('profileDropdown').classList.remove('active');
    }
});
function logout() {
    localStorage.removeItem('HollowCore_login');
    localStorage.removeItem('HollowCore_pass');
    userView.style.display = 'none';
    guestView.style.display = 'flex';
    showToast('Выход', 'Вы вышли из аккаунта.');
}
function uploadAvatar() { document.getElementById('avatarInput').click(); }
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Image = e.target.result;
            localStorage.setItem('HollowCore_avatar', base64Image);
            headerAvatar.src = base64Image;
            showToast('Успех', 'Аватарка обновлена!');
        };
        reader.readAsDataURL(file);
    }
}

// =========================================
// 7. ИИ-АССИСТЕНТ (ЛОКАЛЬНЫЙ, БЕСПЛАТНЫЙ)
// =========================================
const aiChatWindow = document.getElementById('aiChatWindow');
const aiChatLog = document.getElementById('aiChatLog');
const aiInput = document.getElementById('aiInput');

function toggleAiChat() {
    aiChatWindow.classList.toggle('active');
    if (aiChatWindow.classList.contains('active')) { aiInput.focus(); }
}
function handleAiEnter(event) {
    if (event.key === 'Enter') { sendAiMessage(); }
}
function askFaq(type) {
    if (type === 'price') { aiInput.value = 'Сколько стоит лендинг?'; } 
    else { aiInput.value = 'Какие сроки разработки?'; }
    sendAiMessage();
}
function clearAiChat() {
    aiChatLog.innerHTML = `<div class="message ai-message">Чат очищен. Привет! Я ИИ-помощник студии HollowCore. Чем могу помочь?</div>`;
}
function typeWriter(element, text, speed, log) {
    let i = 0;
    element.innerHTML = ""; 
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            log.scrollTop = log.scrollHeight; 
            setTimeout(type, speed);
        }
    }
    type();
}

function sendAiMessage() {
    const text = aiInput.value.trim();
    if (!text) return;

    aiChatLog.innerHTML += `<div class="message user-message">${text}</div>`;
    aiInput.value = '';
    aiChatLog.scrollTop = aiChatLog.scrollHeight;

    const loadingId = "loading-" + Date.now();
    aiChatLog.innerHTML += `<div class="message ai-message" id="${loadingId}">...</div>`;
    aiChatLog.scrollTop = aiChatLog.scrollHeight;

    setTimeout(() => {
        document.getElementById(loadingId).remove();
        let answer = "";
        const lowerText = text.toLowerCase();

        if (lowerText.match(/как дела|как ты/)) answer = "У меня всё отлично! Работаю 24/7. А у тебя как?";
        else if (lowerText.match(/привет|здравствуй/)) answer = "Привет-привет! 👋 Чем могу помочь?";
        else if (lowerText.match(/кто ты|как тебя/)) answer = "Я — HollowCore AI. Помогаю клиентам с выбором сайтов.";
        else if (lowerText.match(/стои|цена|сколько/)) answer = "Точная стоимость зависит от задачи и всегда обсуждается по договору. Ориентироваться можно на цену около 4000 рублей.";
        else if (lowerText.match(/срок|когда/)) answer = "Обычно разработка лендинга занимает от 3 до 7 дней.";
        else if (lowerText.match(/контакт|связ/)) answer = "Telegram: @HollowCore21, Почта: deccore88@gmail.com";
        else if (lowerText.match(/пока|до свидания/)) answer = "До встречи! Хорошего дня! 😊";
        else if (lowerText.match(/спасибо/)) answer = "Всегда пожалуйста! 😉";
        else answer = "Хм, интересная мысль. Я пока не могу ответить на это. Оставьте заявку в форме ниже!";

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message';
        aiChatLog.appendChild(messageDiv); 
        typeWriter(messageDiv, answer, 20, aiChatLog);
    }, 800);
}

// =========================================
// 8. ОТПРАВКА ФОРМЫ
// =========================================
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const btn = contactForm.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Отправка...';
    btn.disabled = true;

    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    try {
        const response = await fetch('http://localhost:8000', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showToast('Успех', 'Заявка отправлена!');
            contactForm.reset();
        } else {
            showToast('Ошибка', 'Ошибка отправки.');
        }
    } catch (error) {
        showToast('Ошибка', 'Сервер не отвечает.');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
});