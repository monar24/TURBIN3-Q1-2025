import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor"
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "./Turbin3-wallet.json"

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection("https://api.devnet.solana.com");

// Github account
const github = Buffer.from("monar24", "utf8");
console.log(`github: ${github}`)


const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed" });
// Create our program
const program: Program<Turbin3Prereq> = new Program(IDL, provider);

// Create the PDA for our enrollment account
const enrollment_seeds = [Buffer.from("prereq"), keypair.publicKey.toBuffer()];
const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(enrollment_seeds, program.programId);
console.log("Enrollment Key:", enrollment_key.toBase58());

// Execute our enrollment transaction
(async () => {

    console.log(`Keypair: ${keypair.publicKey}`)
    
    try {
        const txhash = await program.methods
            .complete(github)
            .accountsPartial({
                signer: keypair.publicKey,
                prereq: enrollment_key,
            })
            .signers([
                keypair
            ]).rpc();
        console.log(`Success! Check out your TX here:
    https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch (e) {

        console.error(`Oops, something went wrong: ${e}`)
    }


})();