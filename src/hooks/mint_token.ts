import { uploadJson } from "@/hooks/helper";
import { FormData } from "@/lib/types";
import {
  AuthorityType,
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  createSetAuthorityInstruction,
  ExtensionType,
  getAssociatedTokenAddressSync,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react";
import { toast } from "react-toastify";

const useMintToken = (formData: FormData) => {
  const [loading, setLoading] = useState(false);

  const { connection } = useConnection();
  const wallet = useWallet();

  async function createToken() {
    const loadingToastid = toast.loading("Launing Token", {
      position: "bottom-right",
    });
    const mintKeypair = Keypair.generate();
    try {
      setLoading(true);
      if (formData) {
        try {
          const URL = await uploadJson(formData);
          if (URL) {
            formData.URL = URL;
          }
        } catch (error) {
          toast.update(loadingToastid, {
            type: "error",
            render: "faild to Upload MetaData",
            isLoading: false,
            autoClose: 3000,
            position: "bottom-right",
          });
          throw new Error("upload failed");
        }
      }
      const metadata: TokenMetadata = {
        mint: mintKeypair.publicKey,
        name: formData.name,
        symbol: formData.Symbol,
        uri: formData.URL,
        additionalMetadata: [],
      };
      const mintLen = getMintLen([ExtensionType.MetadataPointer]);
      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
      const lamports = await connection.getMinimumBalanceForRentExemption(
        mintLen + metadataLen,
      );

      if (wallet.publicKey) {
        toast.update(loadingToastid, {
          type: "info",
          render: "Making Mint",
          isLoading: true,
          position: "bottom-right",
          autoClose: false,
        });
        const createMintTranscation = new Transaction().add(
          SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: mintKeypair.publicKey,
            space: mintLen,
            lamports,
            programId: TOKEN_2022_PROGRAM_ID,
          }),

          createInitializeMetadataPointerInstruction(
            mintKeypair.publicKey,
            wallet.publicKey,
            mintKeypair.publicKey,
            TOKEN_2022_PROGRAM_ID,
          ),
          createInitializeMintInstruction(
            mintKeypair.publicKey,
            formData.decimal,
            wallet.publicKey,
            formData.revokeFreeze ? null : wallet.publicKey,
            TOKEN_2022_PROGRAM_ID,
          ),
          createInitializeInstruction({
            programId: TOKEN_2022_PROGRAM_ID,
            mint: mintKeypair.publicKey,
            metadata: mintKeypair.publicKey,
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
            mintAuthority: wallet.publicKey,
            updateAuthority: wallet.publicKey,
          }),
        );

        toast.update(loadingToastid, {
          type: "info",
          render: "Creating Token Amount",
          position: "bottom-right",
          isLoading: false,
          autoClose: false,
        });
        const associatedToken = getAssociatedTokenAddressSync(
          mintKeypair.publicKey,
          wallet.publicKey,
          false,
          TOKEN_2022_PROGRAM_ID,
        );
        const transaction2 = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            associatedToken,
            wallet.publicKey,
            mintKeypair.publicKey,
            TOKEN_2022_PROGRAM_ID,
          ),
        );
        createMintTranscation.add(transaction2);

        toast.update(loadingToastid, {
          type: "info",
          render: "Minting Token",
          isLoading: true,
          autoClose: false,
          position: "bottom-right",
        });
        const transaction3 = new Transaction().add(
          createMintToInstruction(
            mintKeypair.publicKey,
            associatedToken,
            wallet.publicKey,
            formData.supply * Math.pow(10, formData.decimal),
            [],
            TOKEN_2022_PROGRAM_ID,
          ),
        );
        createMintTranscation.add(transaction3);
        toast.update(loadingToastid, {
          render: "Revoking any Authorites",
          type: "info",
          autoClose: false,
          isLoading: true,
        });
        if (formData.revokeMint) {
          const transaction4 = new Transaction().add(
            createSetAuthorityInstruction(
              mintKeypair.publicKey,
              wallet.publicKey,
              AuthorityType.MintTokens,
              null,
              [],
              TOKEN_2022_PROGRAM_ID,
            ),
          );
          createMintTranscation.add(transaction4);
        }

        //TODO: roveko the token update authority
        // if (formData.revokeUpdate) {
        //   const transaction5 = new Transaction().add();
        //   const latestBlock = await connection.getLatestBlockhash();
        //   transaction5.feePayer = wallet.publicKey;
        //   transaction5.recentBlockhash = latestBlock.blockhash;
        //   await wallet.sendTransaction(transaction5, connection);
        // }

        createMintTranscation.feePayer = wallet.publicKey;
        createMintTranscation.recentBlockhash = (
          await connection.getLatestBlockhash()
        ).blockhash;
        createMintTranscation.partialSign(mintKeypair);

        await wallet.sendTransaction(createMintTranscation, connection);
        toast.update(loadingToastid, {
          type: "success",
          render: "Token Lauched Successfully",
          isLoading: false,
          autoClose: 3000,
          position: "bottom-right",
        });
      }
    } catch (error) {
      toast.update(loadingToastid, {
        render: "Error while Minting the Coin",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return;
    } finally {
      setLoading(false);
    }
    return { mintPublicKey: mintKeypair.publicKey.toBase58(), success: true };
  }
  return { createToken, loading };
};

export default useMintToken;
