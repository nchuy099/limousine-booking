module.exports = {
    // ... other config
    theme: {
        extend: {
            keyframes: {
                'modal-show': {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' }
                },
                bounce: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' }
                }
            },
            animation: {
                'modal-show': 'modal-show 0.2s ease-out',
                bounce: 'bounce 1s infinite'
            }
        }
    }
} 