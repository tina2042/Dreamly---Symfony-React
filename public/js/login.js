document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#login-form');
    const messages = document.querySelector('.messages')

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });

            const data = await response.json()
            console.log(data)
            localStorage.setItem('jwt', data.token)
            localStorage.setItem('email', email)

            if (!response.ok) {
                alert('Login failed. Please try again.');
                console.log(data.message)
                messages.innerHTML = `<p>${data.message}</p>`
                throw new Error('Login failed');
            }

            // Handle successful login
            console.log('Login successful');
            window.location.href = '/home';

        } catch (error) {
            // Handle login error
            console.error('Login failed:', error);
        }
    });
});