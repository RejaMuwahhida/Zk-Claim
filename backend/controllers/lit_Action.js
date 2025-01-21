const getUserWalletAddress = async () => {
  if (window.tezosWallet) { // If you have wallet interaction via Tezos or a specific wallet provider
    const address = await window.tezosWallet.getAddress();
    console.log("Wallet address fetched:", address);
    return address;
  }
  throw new Error("Wallet not connected");
};

const go = async () => {
  try {
    const userWalletAddress = await getUserWalletAddress();
    const toSign = new TextEncoder().encode("InsuranceClaimRequest");

    const sigShare = await Lit.Actions.signEcdsa({
      toSign,
      publicKey: userWalletAddress, // Dynamically pass the user wallet address here
      sigName: "insurance_claim_signature",
    });

    console.log("Signature response:", sigShare);
  } catch (error) {
    console.error("Error during signing:", error);
  }
};

go();




docker run -d`
  -p 8000:3000`
  -e NODE_ADDRESS=""`
  -e PRIVATE_KEY="0x86f63BA9E3Ba2D6eb3276a010d75AAF1077fa49d"`
  akave/akavelink:latest