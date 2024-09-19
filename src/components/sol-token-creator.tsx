import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Menu, LogOut, AlertTriangle } from "lucide-react";
import { defaultFormData, FormData } from "@/lib/types";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import useMintToken from "@/hooks/mint_token";
import { toast } from "react-toastify";
import { areFieldsValid } from "@/hooks/helper";
import { LoadingComponentComponent } from "./loading-component";
import { TokenExplorerModalComponent } from "./token-explorer-modal";

const SolanaTokenCreator = () => {
  const wallet = useWallet();

  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [image, setImage] = useState<string>("");
  const [isModelOpen, setIsModelOpen] = useState(false);
  const isWalletConnected = wallet.connected;
  const [mintPublicKey, setMintPublicKey] = useState("");
  const { createToken, loading } = useMintToken(formData);

  const handleSumbit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (areFieldsValid(formData)) {
      try {
        const result = await createToken();
        if (result) {
          const { mintPublicKey, success } = result;
          if (success) {
            setMintPublicKey(mintPublicKey);
            setIsModelOpen(true);
          } else {
            toast.error("Can't create Token");
          }
        }
      } catch (error) {
        return toast.error("Something went wrong", {
          position: "bottom-right",
        });
        console.log(error);
      }
    } else {
      return toast.error("Fill all the required fileds", {
        position: "bottom-right",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleDisconnect = () => {
    setFormData(defaultFormData);
    setImage("");
    wallet.disconnect();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const MAX_SIZE = 1 * 1024 * 1024;

    if (file) {
      if (file.size > MAX_SIZE) {
        console.log("file is greate than 1mb");

        return toast.error("File is more than 1MB", {
          position: "bottom-right",
        });
      }
      formData.image = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSwitch = (id: keyof FormData, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      {loading ? (
        <LoadingComponentComponent isLoading={loading} isDevnet={true} />
      ) : (
        <>
          {" "}
          <header className="bg-gray-800 shadow-md rounded-lg mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center mb-4 sm:mb-0">
                <Menu className="h-6 w-6 text-blue-400 mr-2" />
                <h1 className="text-xl font-bold text-blue-200">
                  Solana Token Creator
                </h1>
              </div>
              {isWalletConnected ? (
                <Button
                  onClick={handleDisconnect}
                  className="flex items-center bg-red-500 hover:bg-red-600 text-white transition-all duration-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect
                </Button>
              ) : (
                <WalletMultiButton
                  style={{
                    backgroundColor: "#3b82f6", // Green when connected, blue otherwise
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    transition: "background-color 300ms ease",
                  }}
                />
              )}
            </div>
          </header>
          <div className="bg-yellow-500 text-black px-4 py-2 rounded-md text-center font-semibold mb-4 flex items-center justify-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            This app is for use on Solana Devnet only
          </div>
          <main className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl blur-xl opacity-20 animate-pulse"></div>
              <Card className="relative border-0 overflow-hidden rounded-xl bg-gray-800">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl"></div>
                <div className="relative bg-gray-800 m-[1px] rounded-xl">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-blue-200 mb-2">
                      Create Your Solana Token
                    </CardTitle>
                    <p className="text-center text-gray-400 mb-6">
                      Easily create your own Solana SPL Token in just a few
                      steps.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium text-gray-300"
                        >
                          Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter token name"
                          className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="symbol"
                          className="text-sm font-medium text-gray-300"
                        >
                          Symbol<span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="Symbol"
                          name="Symbol"
                          value={formData.Symbol}
                          placeholder="Enter token symbol"
                          className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="decimals"
                          className="text-sm font-medium text-gray-300"
                        >
                          Decimals<span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="decimal"
                          name="decimal"
                          type="number"
                          value={formData.decimal}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="supply"
                          className="text-sm font-medium text-gray-300"
                        >
                          Initial Supply<span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="supply"
                          value={formData.supply}
                          onChange={handleInputChange}
                          type="number"
                          placeholder="Enter initial supply"
                          className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="image"
                          className="text-sm font-medium text-gray-300"
                        >
                          Image<span className="text-red-500">*</span>
                        </Label>
                        <div className="relative h-48 bg-gray-700 border border-gray-600 rounded-md overflow-hidden group transition-all duration-300 hover:border-blue-500">
                          {image ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <img
                                src={image}
                                alt="Token"
                                className="max-w-full max-h-full object-contain"
                                style={{ width: "100px", height: "100px" }}
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                              <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                              <span className="mt-2 text-sm text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                                Upload Image
                              </span>
                            </div>
                          )}
                          <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/image"
                            onChange={handleImageUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-400">
                          Most meme coin use a squared 1000x1000 logo
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium text-gray-300"
                        >
                          Description<span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Describe your token"
                          value={formData.description}
                          className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500 transition-all duration-300 h-48"
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="social-links"
                            checked={formData.addSocials}
                            onCheckedChange={(value) =>
                              handleSwitch("addSocials", value)
                            }
                            className="data-[state=checked]:bg-blue-500"
                          />
                          <Label
                            htmlFor="social-links"
                            className="text-sm text-gray-300"
                          >
                            Add Social Links
                            {formData.addSocials}
                          </Label>
                        </div>
                      </div>
                      {formData.addSocials && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          <Input
                            placeholder="Website"
                            id="website"
                            name="website"
                            className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                            value={formData.website}
                            onChange={handleInputChange}
                          />
                          <Input
                            placeholder="Twitter"
                            className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                            id="twitter"
                            name="twitter"
                            value={formData.twitter}
                            onChange={handleInputChange}
                          />
                          <Input
                            placeholder="Telegram"
                            className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                            name="telegram"
                            id="telegram"
                            value={formData.telegram}
                            onChange={handleInputChange}
                          />
                          <Input
                            placeholder="Discord"
                            className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                            name="discord"
                            id="discord"
                            value={formData.discord}
                            onChange={handleInputChange}
                          />
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-200">
                        Revoke Authorities
                      </h3>
                      <p className="text-sm text-gray-400">
                        Solana Tokens have 3 authorities: Freeze, Mint, and
                        Update. Revoke them to attract more investors.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col justify-between p-4 bg-gray-700 rounded-lg">
                          <div>
                            <h4 className="text-sm font-medium text-gray-300">
                              Revoke Update (Immutable)
                            </h4>
                            <p className="text-xs text-gray-400">
                              Update Authority allows token metadata updates
                            </p>
                          </div>
                          <Switch
                            id="revode-update"
                            checked={formData.revokeUpdate}
                            onCheckedChange={(value) =>
                              handleSwitch("revokeUpdate", value)
                            }
                            className="data-[state=checked]:bg-blue-500 mt-2"
                          />
                        </div>
                        <div className="flex flex-col justify-between p-4 bg-gray-700 rounded-lg">
                          <div>
                            <h4 className="text-sm font-medium text-gray-300">
                              Revoke Freeze
                            </h4>
                            <p className="text-xs text-gray-400">
                              Freeze Authority allows freezing token accounts
                            </p>
                          </div>
                          <Switch
                            id="revoke-freeze"
                            checked={formData.revokeFreeze}
                            onCheckedChange={(value) =>
                              handleSwitch("revokeFreeze", value)
                            }
                            className="data-[state=checked]:bg-blue-500 mt-2"
                          />
                        </div>
                        <div className="flex flex-col justify-between p-4 bg-gray-700 rounded-lg">
                          <div>
                            <h4 className="text-sm font-medium text-gray-300">
                              Revoke Mint
                            </h4>
                            <p className="text-xs text-gray-400">
                              Mint Authority allows minting more supply
                            </p>
                          </div>
                          <Switch
                            checked={formData.revokeMint}
                            onCheckedChange={(value) =>
                              handleSwitch("revokeMint", value)
                            }
                            className="data-[state=checked]:bg-blue-500 mt-2"
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105"
                      onClick={handleSumbit}
                      disabled={!wallet.connected}
                    >
                      Create Token
                    </Button>
                    <p className="text-center text-sm text-gray-400">
                      Total Fees: 0.10 SOL(Estimated)
                    </p>
                  </CardContent>
                </div>
              </Card>
            </div>
          </main>
          {isModelOpen && (
            <TokenExplorerModalComponent
              isOpen={isModelOpen}
              onClose={() => setIsModelOpen(!isModelOpen)}
              tokenName={formData.name}
              tokenSymbol={formData.Symbol}
              tokenAddress={mintPublicKey}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SolanaTokenCreator;
