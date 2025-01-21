pragma circom 2.0.0;

template PneumoniaProof() {
    // Inputs
    signal input did; // Unique Identifier (DID)
    signal input conditionCode; // Condition code for the patient's condition (represented as an integer)
    signal output hasPneumonia; // Boolean signal (1 for true, 0 for false)


    // Represent pneumonia code as an integer
    var pneumoniaCode = 1; // Assume 1 represents pneumonia

    // Signal to check if the condition code matches pneumonia code
    signal match;

    // Create an equation to check if the condition code equals pneumonia code
    match <-- (conditionCode == pneumoniaCode);

    // Set hasPneumonia signal based on the match
    hasPneumonia <== match; // Output whether the patient has pneumonia
}

// Main circuit
component main = PneumoniaProof();
docker run -d \
  -p 8000:3000 \
  -e NODE_ADDRESS="connect.akave.ai:5500" \
  -e PRIVATE_KEY="bcd08c122eeb53762f9a8e3564791644d0b5c6b5a831226dba373896679db581" \
  akave/akavelink:latest


docker run -d -p 8000:3000 -e NODE_ADDRESS="connect.akave.ai:5500" -e PRIVATE_KEY="0xbcd08c122eeb53762f9a8e3564791644d0b5c6b5a831226dba373896679db581" akave/akavelink:latest
