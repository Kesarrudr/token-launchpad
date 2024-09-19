"use client";

import { X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TokenExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
}

export function TokenExplorerModalComponent({
  isOpen,
  onClose,
  tokenAddress,
  tokenName,
  tokenSymbol,
}: TokenExplorerModalProps) {
  if (!isOpen) return null;

  const explorerUrl = `https://explorer.solana.com/address/${tokenAddress}?cluster=devnet`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-gray-800 text-gray-100 border-gray-700">
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold text-blue-400">
            Token Created Successfully
          </CardTitle>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Your token{" "}
            <span className="font-semibold text-blue-300">
              {tokenName} ({tokenSymbol})
            </span>{" "}
            has been successfully created on the Solana blockchain.
          </p>
          <div className="bg-gray-700 p-3 rounded-md">
            <p className="text-sm text-gray-300 mb-1">Token Address:</p>
            <p className="font-mono text-sm break-all">{tokenAddress}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 flex items-center justify-center"
            onClick={() => window.open(explorerUrl, "_blank")}
          >
            <ExternalLink size={18} className="mr-2" />
            View on Solana Explorer
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

