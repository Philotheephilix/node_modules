'use client';

import React, { useState, useEffect } from 'react';
import SelfQRcodeWrapper, { SelfApp, SelfAppBuilder } from '@selfxyz/qrcode';
import { ethers } from 'ethers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Leaf, ShieldCheck, User } from "lucide-react";
import { DashboardLayout } from "../../components/dashboard-layout";

function SelfVerification() {
    const [input, setInput] = useState('0xE6E4b6a802F2e0aeE5676f6010e0AF5C9CDd0a50');
    const [address, setAddress] = useState(input);
    const [ensName, setEnsName] = useState<string | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
    const [verificationMessage, setVerificationMessage] = useState('');

    useEffect(() => {
        if (ethers.isAddress(input)) {
            setAddress(input);
        }
    }, [input]);

    useEffect(() => {
        const resolveEns = async () => {
            try {
                const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/84842078b09946638c03157f83405213');
    
                if (input.toLowerCase().endsWith('.eth')) {
                    const resolvedAddress = await provider.resolveName(input);
                    if (resolvedAddress) {
                        setAddress(resolvedAddress);
                        setEnsName(input);
                    }
                } else if (ethers.isAddress(input)) {
                    const resolvedName = await provider.lookupAddress(input);
                    setEnsName(resolvedName);
                } else {
                    setEnsName(null);
                }
            } catch (error) {
                console.error('Error resolving ENS:', error);
                setEnsName(null);
            }
        };
    
        resolveEns();
    }, [input]);

    const selfApp = new SelfAppBuilder({
        appName: "StockRoot",
        scope: "stockroot",
        endpoint: "https://af8d-111-235-226-130.ngrok-free.app/api/verify",
        logo: "/banner.png",
        userId: address,
        userIdType: "hex",
        devMode: true,
    } as Partial<SelfApp>).build();

    const handleSuccess = async () => {
        setVerificationStatus('success');
        setVerificationMessage('Verification successful! Your identity has been verified.');
        console.log('Verification successful');
    };

    const handleError = (error: any) => {
        setVerificationStatus('error');
        setVerificationMessage(`Verification failed: ${error.message || 'Unknown error'}`);
        console.error('Verification error:', error);
    };

    return (
        <DashboardLayout userRole="consumer">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Identity Verification</h1>
                    <p className="text-muted-foreground">Verify your identity using Self Protocol</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Enter Your Wallet Address</CardTitle>
                            <CardDescription>Use your Ethereum address or ENS name</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="address">Wallet Address</Label>
                                    <Input
                                        id="address"
                                        placeholder="0x... or name.eth"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                    />
                                </div>
                                {ensName && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        <span>ENS: {ensName}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <ShieldCheck className="h-4 w-4" />
                                    <span>Address: {address.substring(0, 6)}...{address.substring(address.length - 4)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Scan QR Code</CardTitle>
                            <CardDescription>Use the Self app to scan this QR code and verify your identity</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center space-y-4">
                                {selfApp && (
                                    <div className="flex justify-center mb-6">
                                        <SelfQRcodeWrapper
                                            selfApp={selfApp}
                                            type='websocket'
                                            onSuccess={handleSuccess}
                                        />
                                    </div>
                                )}
                                
                                {verificationStatus === 'success' && (
                                    <div className="flex items-center gap-2 text-green-500">
                                        <ShieldCheck className="h-5 w-5" />
                                        <span>{verificationMessage}</span>
                                    </div>
                                )}
                                
                                {verificationStatus === 'error' && (
                                    <div className="flex items-center gap-2 text-red-500">
                                        <span>{verificationMessage}</span>
                                    </div>
                                )}
                                
                                {verificationStatus === 'idle' && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Leaf className="h-5 w-5" />
                                        <span>Ready to verify your identity</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>About Self Verification</CardTitle>
                        <CardDescription>Learn how identity verification works</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p>
                                Self Protocol allows you to verify your identity without revealing your personal information.
                                The verification process uses zero-knowledge proofs to confirm your identity while maintaining privacy.
                            </p>
                            <p>
                                After verification, you'll receive a credential that can be used to access various features
                                of the StockRoot platform, including product tracking and supply chain verification.
                            </p>
                            <div className="flex justify-end">
                                <Button variant="outline" asChild>
                                    <a href="https://self.id" target="_blank" rel="noopener noreferrer">
                                        Learn more about Self Protocol
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

export default SelfVerification;