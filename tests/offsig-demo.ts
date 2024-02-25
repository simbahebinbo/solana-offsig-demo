import assert from 'assert'
import { createHash } from 'crypto'
import * as ed from '@noble/ed25519'
import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
// @ts-ignore
import { OffsigDemo } from '../target/types/offsig_demo';

describe('offsig-demo', () => {

    let provider = anchor.AnchorProvider.env()
    // Configure the client to use the local cluster.
    anchor.setProvider(provider);

    const program = anchor.workspace.OffsigDemo as Program<OffsigDemo>;

    let privateKey: Uint8Array;
    let groupKey: Uint8Array;
    let myAccount: anchor.web3.Keypair;

    before(async () => {
        privateKey = ed.utils.randomPrivateKey();
        groupKey = await ed.getPublicKey(privateKey);
    })

    it('Is initialized!', async () => {
        myAccount = anchor.web3.Keypair.generate()
        const tx = await program.methods.initialize(Array.from(groupKey))
            .accounts({
                myAccount: myAccount.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([myAccount])
            .rpc();
        console.log("Your transaction signature", tx);

        const myAccountAccount = await program.account.myAccount.fetch(myAccount.publicKey);
        const storedGroupKey = Buffer.from(myAccountAccount.groupKey)
        assert.ok(storedGroupKey.equals(groupKey))
    });

    it('Is verified in frontend!', async () => {
        const message = Uint8Array.from([0xab, 0xbc, 0xcd, 0xde]);

        const msgHash = createHash("SHA256").update(message).digest()
        const signature = await ed.sign(msgHash, privateKey);
        const isValid = await ed.verify(signature, msgHash, groupKey);
        assert.ok(isValid == true)
    });

    it('Is verified on chain', async () => {
        const message = Uint8Array.from([0xab, 0xbc, 0xcd, 0xde]);

        const msgHash = createHash("SHA256")
            .update(message)
            .digest()
        const signature = await ed.sign(msgHash, privateKey);
        const verifyInstruction = anchor.web3.Ed25519Program.createInstructionWithPublicKey({
            publicKey: groupKey,
            message: msgHash,
            signature: signature
        })
        const programInstruction = await program.methods.verify(Buffer.from(message))
            .accounts({
                myAccount: myAccount.publicKey,
                instructionAcc: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY
            })
            .instruction()

        const txn = new anchor.web3.Transaction()
        txn.add(verifyInstruction, programInstruction)
        const tx = await provider.sendAndConfirm(txn)
        console.log('transaction signature:', tx);
    })
});

