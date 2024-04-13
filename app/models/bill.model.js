module.exports = (sequelize, Sequelize) => {
    const bill = sequelize.define("bill_payments", {

        username: {
            type: Sequelize.STRING
        },
        product: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING
        },
        number: {
            type: Sequelize.STRING
        },
        transactionid: {
            type: Sequelize.STRING
        },
        timestamp: {
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.STRING
        },
        balance: {
            type: Sequelize.STRING
        },
        fbalance: {
            type: Sequelize.STRING
        },
        server_response:{
            type: Sequelize.STRING
        },
        token:{
            type: Sequelize.STRING
        },

    });
    // bill.hasMany(sequelize.models.deposits, { foreignKey: 'username', as: 'deposits' });

    return bill;
};
