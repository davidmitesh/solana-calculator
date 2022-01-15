const assert = require('assert');
const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

//We will be using mocha to write our tests
describe('calculator-solana', () => {
  const provider = anchor.Provider.local();
  anchor.setProvider(provider);

  const calculator = anchor.web3.Keypair.generate();
  const program = anchor.workspace.CalculatorSolana;

  it('Creates a calculator', async () => {
    await program.rpc.create("Calculator by Mitesh", {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [calculator]
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.greeting === "Calculator by Mitesh");
    _calculator = calculator;

  });

  it("Adds two numbers", async function() {
    const calculator = _calculator;
    
    await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(5)));
    assert.ok(account.greeting === "Calculator by Mitesh");

  });

  it('Multiplies two numbers', async function() {

    const calculator = _calculator;

    await program.rpc.multiply(new anchor.BN(2),new anchor.BN(2),{
      accounts:{
        calculator : calculator.publicKey,
      },
    });
    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(4)));
    assert.ok(account.greeting === "Calculator by Mitesh");

  })

  it('Subtracts two numbers', async function() {
    const calculator = _calculator;

    await program.rpc.subtract(new anchor.BN(2),new anchor.BN(2),{
      accounts:{
        calculator : calculator.publicKey,
      },
    });
    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(0)));
    assert.ok(account.greeting === "Calculator by Mitesh");
  });

  it('Divides two numbers', async function() {
    const calculator = _calculator;

    await program.rpc.divide(new anchor.BN(2),new anchor.BN(3),{
      accounts:{
        calculator : calculator.publicKey,
      },
    });
    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(0)));
    assert.ok(account.remainder.eq(new anchor.BN(2)));
    assert.ok(account.greeting === "Calculator by Mitesh");
  });
});