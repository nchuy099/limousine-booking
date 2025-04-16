const generateTicketNumber = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ticketNumber = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        ticketNumber += characters[randomIndex];
    }
    return ticketNumber;
};

module.exports = { generateTicketNumber };
