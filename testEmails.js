const phaseonePass = require('./emails/phaseonePass');
const phaseTwoPass = require('./emails/phasetwoPass');
const maxdrawdownBreach = require('./emails/maxdrawdownBreach');
const dailydrawdownBreach = require('./emails/dailydrawdownBreach');
const mt4AccountCredentials = require('./emails/mt4AccountCredentials');
const paymentEmail = require('./emails/paymentEmail');
const AlertEmail = require('./emails/tradeEmail');

// Sample test data
const testData = {
    email: "marginfundingnet@gmail.com",
    accountName: "Lennard",
    initialDeposit: "1000",
    serverNumber: "Server1",
    serverName: "Demo Server",
    password: "TestPassword123",
    phase: "Phase 1",
    amount: "10000",
    currency: "USD",
    tradeDetails: {
        symbol: "EURUSD",
        type: "BUY",
        lotSize: "0.1",
        openPrice: "1.1234",
        currentPrice: "1.1256",
        profit: "22",
        time: new Date().toISOString()
    }
};

async function testAllEmails() {
    try {
        console.log("Testing Phase One Pass Email...");
        await paymentEmail(
            testData.email,
            testData.accountName,
            testData.initialDeposit,
            testData.serverNumber,
            testData.password,
            testData.serverName
        );

        console.log("\nAll email tests completed successfully!");
    } catch (error) {
        console.error("Error testing emails:", error);
    }
}

// Run the test
testAllEmails(); 