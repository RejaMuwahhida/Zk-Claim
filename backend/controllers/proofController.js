const { Web3 } = require("web3");
const dotenv = require("dotenv");
const { LitNodeClient } = require("@lit-protocol/lit-node-client");
const { LIT_NETWORK, LIT_RPC, LIT_ABILITY } = require("@lit-protocol/constants");
const {
  LitActionResource,
  createSiweMessage,
  generateAuthSig,
} = require("@lit-protocol/auth-helpers");
const ethers = require("ethers");

dotenv.config();

// Initialize Web3
const web3 = new Web3(process.env.RPC_URL);

// Load contract ABI and address
const contractABI = require("./contractABI.json");
const contractAddress = process.env.CONTRACT_ADDRESS;

// Create the contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Initialize Lit Protocol
const litNodeClient = new LitNodeClient({
  litNetwork: LIT_NETWORK.DatilDev,
  debug: false,
});

(async () => {
  await litNodeClient.connect();
})();

// Helper to format the proof
const formatProof = (proof, publicSignals) => ({
  pi_a: [proof.pi_a[0], proof.pi_a[1]],
  pi_b: [
    [proof.pi_b[0][0], proof.pi_b[0][1]],
    [proof.pi_b[1][0], proof.pi_b[1][1]],
  ],
  pi_c: [proof.pi_c[0], proof.pi_c[1]],
  publicSignals,
});

// Function to check eligibility
const checkEligibility = async (req, res) => {
  try {
    const { proof } = req.body;
    if (!proof) {
      return res.status(400).json({ success: false, message: "Proof is required." });
    }

    const formattedProof = formatProof(proof.proof, proof.publicSignals);
    const { pi_a, pi_b, pi_c, publicSignals } = formattedProof;

    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

    // Prepare transaction
    const tx = contract.methods.verifyProof(pi_a, pi_b, pi_c, publicSignals);
    const gasEstimate = await tx.estimateGas({ from: account.address });
    const txData = {
      from: account.address,
      to: contractAddress,
      data: tx.encodeABI(),
      gas: gasEstimate,
      gasPrice: await web3.eth.getGasPrice(),
    };

    // Sign and send transaction
    const signedTx = await web3.eth.accounts.signTransaction(txData, process.env.PRIVATE_KEY);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    if (receipt.status) {
      const isEligible = parseInt(publicSignals[0], 10) > 0; // Example eligibility condition
      const message = isEligible
        ? "Eligible for insurance claim"
        : "Not eligible for insurance claim";
      // Use Lit Protocol to sign session
      const sessionSignatures = await litNodeClient.getSessionSigs({
        chain: "ethereum",
        expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
        resourceAbilityRequests: [
          {
            resource: new LitActionResource("*"),
            ability: LIT_ABILITY.LitActionExecution,
          },
        ],
        authNeededCallback: async ({ uri, expiration, resourceAbilityRequests }) => {
          const provider = new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE);
          const wallet = new ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY, provider);
          const toSign = await createSiweMessage({
            uri,
            expiration,
            resources: resourceAbilityRequests,
            walletAddress: wallet.address,
            nonce: await litNodeClient.getLatestBlockhash(),
            litNodeClient,
          });

          return await generateAuthSig({
            signer: wallet,
            toSign,
          });
        },
      });

      // Execute Lit Action
      const litActionCode = `
        async function main() {
          const claimAmount = jsParams.claimAmount;
          const publicKey = jsParams.publicKey;
          console.log("Executing Lit Action...");
          return { publicKey, claimAmount };
        }
      `;

      const litActionResult = await litNodeClient.executeJs({
        sessionSigs: sessionSignatures,
        code: litActionCode,
        jsParams: {
          publicKey: "YourPublicKey", // Replace with actual public key or parameter
          claimAmount: 1000, // Replace with actual claim amount or parameter
        },
      });

      return res.status(200).json({
        success: true,
        message,
        sessionSignatures,
        publicSignals,
        litActionResult,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Proof verification failed",
      });
    }
  } catch (error) {
    console.error("Error verifying proof:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { checkEligibility };
