// Check if MetaMask is unlocked (specific to MetaMask, not generic Web3 wallets)
async function isWalletUnlocked() {
  if (!window.ethereum || !window.ethereum._metamask) return false;
  try {
    return await window.ethereum._metamask.isUnlocked();
  } catch (error) {
    console.error("Error checking unlock status:", error);
    return false;
  }
}

// Connect wallet and fetch HTT balance
async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask is not installed. Please install it to use this dApp.");
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    // Show wallet address
    const walletAddressEl = document.getElementById("walletAddress");
    if (walletAddressEl) {
      walletAddressEl.textContent = `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    // Show wallet section
    const walletSection = document.getElementById("walletSection");
    if (walletSection) {
      walletSection.classList.remove("hidden");
    }

    // Get HTT balance
    const httTokenAddress = "0xYourHTTTokenAddress"; // Replace this with real contract address
    const httABI = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)"
    ];

    const contract = new ethers.Contract(httTokenAddress, httABI, provider);
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    const formatted = ethers.utils.formatUnits(balance, decimals);

    const httBalanceEl = document.getElementById("httBalance");
    if (httBalanceEl) {
      httBalanceEl.textContent = formatted;
    }

  } catch (error) {
    console.error("Connection failed:", error);
    alert("Connection failed. Make sure MetaMask is unlocked and authorized.");
  }
}

// Initialize wallet connection logic on page load
window.addEventListener("DOMContentLoaded", async () => {
  // Auto-connect only if wallet is already unlocked
  const unlocked = await isWalletUnlocked();
  if (unlocked) {
    connectWallet();
  }

  // Bind connect buttons
  const connectBtn1 = document.getElementById("connectWallet");
  const connectBtn2 = document.getElementById("heroConnectWallet");

  if (connectBtn1) connectBtn1.addEventListener("click", connectWallet);
  if (connectBtn2) connectBtn2.addEventListener("click", connectWallet);
});
