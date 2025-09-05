import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const EchoService = new Echo({
    broadcaster: 'reverb',
    Pusher,
    wsHost: 'localhost',
    wsPort: 8080,
    key: "",//a definir puxando da api
    id: "",
    forceTLS: false,
    enabledTransports: ['ws'],
});

export default EchoService;