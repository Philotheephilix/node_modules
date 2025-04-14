import { NextRequest, NextResponse } from 'next/server';
import { 
    getUserIdentifier, 
    SelfBackendVerifier,
    hashEndpointWithScope
} from '@selfxyz/core';
import { ethers, Log } from 'ethers';
import { abi } from '../../content/abi';

export async function POST(request: NextRequest) {
    
        // Parse the request body
        const body = await request.json();
        
        // Extract proof and publicSignals from request body
        const { proof, publicSignals } = body;

        if (!proof || !publicSignals) {
            return NextResponse.json(
                { message: 'Proof and publicSignals are required' },
                { status: 400 }
            );
        }
        
        // Calculate the scope value - should match the one in your contract deployment
        const endpointUrl = "https://af8d-111-235-226-130.ngrok-free.app";
        const scopeName = "stockroot"; 
        
        // Calculate the hash of the scope that's used in the contract
        const scopeHash = hashEndpointWithScope(endpointUrl, scopeName);
        console.log("Calculated scope hash:", scopeHash);
        
        // Contract address - UPDATED to newly deployed GitIgnore contract
        const contractAddress = "0x52be89EC2709960CDDc19DE9E9F80C4Bd8c351c7";

        // IMPORTANT FIX: Extract the actual Ethereum address from publicSignals
        const userAddress = await getUserIdentifier(publicSignals, "hex");
        console.log("User address:", userAddress);

        
        // Connect to Celo network - using Alfajores testnet
        const provider = new ethers.JsonRpcProvider("https://alfajores-forno.celo-testnet.org");
        
        // Use environment variable for private key
        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey) {
            throw new Error("PRIVATE_KEY environment variable is not set");
        }
        const signer = new ethers.Wallet(privateKey, provider);
        const contract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Starting two-step verification process");
        
        // Step 1: Verify Self proof
        console.log("Step 1: Verifying Self proof");
        console.log("Proof:", proof);
        console.log("Public signals:", publicSignals);
        
        const tx1 = await contract.verifySelfProof(
            {
                a: proof.a,
                b: [
                    [proof.b[0][1], proof.b[0][0]],
                    [proof.b[1][1], proof.b[1][0]]
                ],
                c: proof.c,
                pubSignals: publicSignals,
            }
        );
        console.log("Step 1 transaction sent:", tx1.hash);
        const receipt1 = await tx1.wait();
        console.log("Step 1 transaction confirmed:", receipt1);
        return NextResponse.json({ 
            status:"success", 
            result: true,
            credentialSubject: {},
        },{status:200});
        
    
}