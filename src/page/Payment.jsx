import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { formatNaira, formatUSDT } from '../utils/currency';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const credits = searchParams.get('credits') || '50';
  const usdtPrice = searchParams.get('usdtPrice') || '70';
  const nairaPrice = searchParams.get('nairaPrice') || '100000';

  const [paymentMethod, setPaymentMethod] = useState('usdt'); // 'usdt' or 'naira'
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState('Loading...');
  const [bankDetails, setBankDetails] = useState({
    bank: 'Access Bank',
    accountNumber: '0040525434',
    accountName: 'Umune kingsley'
  });

  // Generate unique reference code based on payment method
  const generateReference = (method) => {
    const timestamp = Date.now().toString().slice(-10);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const prefix = method === 'naira' ? 'NGN' : 'USDT';
    return `TA-${prefix}-${timestamp}-${random}`;
  };

  const [uniqueMemo, setUniqueMemo] = useState(generateReference(paymentMethod));

  // Regenerate memo when payment method changes
  useEffect(() => {
    setUniqueMemo(generateReference(paymentMethod));
  }, [paymentMethod]);

  // Fetch payment info from backend
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/payment/info`)
      .then(response => {
        // Check if response has new dual currency format
        if (response.data.usdt && response.data.usdt.address) {
          setWalletAddress(response.data.usdt.address);
        } else if (response.data.wallet) {
          // Fallback for old format
          setWalletAddress(response.data.wallet);
        }

        // Update bank details if provided
        if (response.data.naira) {
          setBankDetails({
            bank: response.data.naira.bank || 'Access Bank',
            accountNumber: response.data.naira.accountNumber || '0040525434',
            accountName: response.data.naira.accountName || 'Umune kingsley'
          });
        }
      })
      .catch(err => {
        console.error('Error fetching payment info:', err);
        setWalletAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'); // Fallback
      });
  }, []);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'wallet') {
      setCopiedWallet(true);
      setTimeout(() => setCopiedWallet(false), 2000);
    } else if (type === 'memo') {
      setCopiedMemo(true);
      setTimeout(() => setCopiedMemo(false), 2000);
    } else if (type === 'bank') {
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const amount = paymentMethod === 'naira' ? nairaPrice : usdtPrice;
      const currency = paymentMethod === 'naira' ? 'NGN' : 'USDT';

      const response = await axios.post(`${API_BASE_URL}/api/payment/submit`, {
        memo: uniqueMemo,
        email: email.trim(),
        credits: credits,
        amount: amount,
        paymentMethod: paymentMethod,
        currency: currency
      });
      console.log('Payment submission response:', response.data);

      if (response.data.success) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to submit payment. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-2xl w-full bg-dark-light border border-accent/30 rounded-card p-6 sm:p-8 md:p-12 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent/10 border-2 border-accent rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <i className="ri-check-line text-3xl sm:text-4xl text-accent"></i>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl md:text-2xl font-bold text-white mb-3 sm:mb-4">
            Payment Confirmation Received!
          </h1>
          <p className="text-gray-400 text-xs sm:text-lg mb-4 sm:mb-6">
            Thank you for your submission. Once your payment is confirmed, you will receive an email at <span className="text-accent font-semibold break-all">{email}</span> with your credit token and activation instructions.
          </p>
          <div className="bg-dark border border-gray-800 rounded-card p-4 sm:p-6 mb-6 sm:mb-8">
            <p className="text-sm text-gray-500 mb-2">Your Transaction Reference:</p>
            <p className="font-heading text-accent text-sm sm:text-lg break-all">{uniqueMemo}</p>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8">
            Please keep this reference code for your records. Payment verification typically takes {paymentMethod === 'naira' ? '1-24 hours' : '10-30 minutes'}.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-accent text-dark font-semibold px-6 sm:px-8 py-3 rounded-card hover:bg-accent-light transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 cursor-pointer whitespace-nowrap text-sm sm:text-base"
          >
            <i className="ri-home-line"></i>
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <a href="/" className="inline-flex items-center gap-2 text-accent hover:text-accent-light transition-colors mb-3 cursor-pointer">
            <i className="ri-arrow-left-line text-sm"></i>
            <span className="text-xs">Back to Home</span>
          </a>
          <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
            Complete Your Payment
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            Follow the steps below to purchase your TypeAssist credits
          </p>
        </div>

        {/* Main Payment Card */}
        <div className="bg-dark-light border border-gray-800 rounded-card p-4 sm:p-5 mb-4 sm:mb-6">
          {/* Payment Method Selection */}
          <div className="mb-4 sm:mb-6">
            <h2 className="font-heading text-base sm:text-lg font-bold text-white mb-3">
              Select Payment Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('usdt')}
                className={`p-3 sm:p-4 rounded-card border-2 transition-all duration-300 cursor-pointer ${
                  paymentMethod === 'usdt'
                    ? 'border-accent bg-accent/10'
                    : 'border-gray-700 bg-dark hover:border-accent/50'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'usdt' ? 'border-accent' : 'border-gray-500'
                  }`}>
                    {paymentMethod === 'usdt' && (
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-heading text-sm sm:text-base font-bold text-white mb-0.5">
                      💰 USDT (Crypto)
                    </h3>
                    <p className="text-xs text-gray-400">
                      BSC Network • 5-30 mins
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('naira')}
                className={`p-3 sm:p-4 rounded-card border-2 transition-all duration-300 cursor-pointer ${
                  paymentMethod === 'naira'
                    ? 'border-accent bg-accent/10'
                    : 'border-gray-700 bg-dark hover:border-accent/50'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'naira' ? 'border-accent' : 'border-gray-500'
                  }`}>
                    {paymentMethod === 'naira' && (
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-heading text-sm sm:text-base font-bold text-white mb-0.5">
                      🏦 Naira (Bank Transfer)
                    </h3>
                    <p className="text-xs text-gray-400">
                      Nigerian Bank • 1-24 hours
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Package Info */}
          <div className="bg-dark border border-accent/20 rounded-card p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-500 mb-0.5">Selected Package</p>
                <p className="font-heading text-lg sm:text-xl font-bold text-white">{credits} Credits</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-xs text-gray-500 mb-0.5">Amount to Pay</p>
                <p className="font-heading text-xl sm:text-2xl font-bold text-accent">
                  {paymentMethod === 'naira' ? formatNaira(Number(nairaPrice)) : formatUSDT(Number(usdtPrice))}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="mb-4 sm:mb-6">
            <h2 className="font-heading text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2">
              <i className="ri-information-line text-accent text-sm"></i>
              Payment Instructions
            </h2>

            {/* USDT Instructions */}
            {paymentMethod === 'usdt' && (
              <div className="space-y-3 sm:space-y-4">
                {/* Step 1: Wallet Address */}
                <div className="bg-dark border border-gray-800 rounded-card p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-heading text-accent font-bold text-xs sm:text-sm">1</span>
                    </div>
                    <div className="flex-1 w-full">
                      <h3 className="font-heading text-sm sm:text-base font-semibold text-white mb-1.5">
                        Copy Wallet Address
                      </h3>
                      <p className="text-xs text-gray-400 mb-2 sm:mb-3">
                        Send USDT (BEP-20 / BSC Network) to this address:
                      </p>
                      <div className="bg-dark-lighter border border-gray-700 rounded-card p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                        <code className="text-accent text-xs sm:text-sm break-all font-mono">
                          {walletAddress}
                        </code>
                        <button
                          onClick={() => handleCopy(walletAddress, 'wallet')}
                          className="flex-shrink-0 bg-accent/10 border border-accent/30 text-accent px-4 py-2 rounded-card hover:bg-accent hover:text-dark transition-all duration-300 text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer flex items-center justify-center"
                        >
                          {copiedWallet ? (
                            <>
                              <i className="ri-check-line mr-1"></i>
                              Copied!
                            </>
                          ) : (
                            <>
                              <i className="ri-file-copy-line mr-1"></i>
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Memo */}
                <div className="bg-dark border border-gray-800 rounded-card p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-heading text-accent font-bold text-sm sm:text-base">2</span>
                    </div>
                    <div className="flex-1 w-full">
                      <h3 className="font-heading text-base sm:text-lg font-semibold text-white mb-2">
                        Copy Your Unique Reference
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                        <strong className="text-accent">Important:</strong> Include this reference in your transaction so we can identify your payment.
                      </p>
                      <div className="bg-dark-lighter border border-gray-700 rounded-card p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                        <code className="text-accent text-sm sm:text-lg font-mono font-bold break-all">
                          {uniqueMemo}
                        </code>
                        <button
                          onClick={() => handleCopy(uniqueMemo, 'memo')}
                          className="flex-shrink-0 bg-accent/10 border border-accent/30 text-accent px-4 py-2 rounded-card hover:bg-accent hover:text-dark transition-all duration-300 text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer flex items-center justify-center"
                        >
                          {copiedMemo ? (
                            <>
                              <i className="ri-check-line mr-1"></i>
                              Copied!
                            </>
                          ) : (
                            <>
                              <i className="ri-file-copy-line mr-1"></i>
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Send Payment */}
                <div className="bg-dark border border-gray-800 rounded-card p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-heading text-accent font-bold text-sm sm:text-base">3</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-base sm:text-lg font-semibold text-white mb-2">
                        Send Payment from Your Wallet
                      </h3>
                      <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                        <li className="flex items-start gap-2">
                          <i className="ri-arrow-right-s-line text-accent mt-0.5 flex-shrink-0"></i>
                          <span>Open your crypto wallet app (Trust Wallet, MetaMask, Binance, etc.)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="ri-arrow-right-s-line text-accent mt-0.5 flex-shrink-0"></i>
                          <span>Send exactly <strong className="text-white">{formatUSDT(Number(usdtPrice))}</strong> to the wallet address above</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="ri-arrow-right-s-line text-accent mt-0.5 flex-shrink-0"></i>
                          <span>Make sure to select <strong className="text-white">BEP-20 (BSC Network)</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="ri-arrow-right-s-line text-accent mt-0.5 flex-shrink-0"></i>
                          <span>Include the reference code in your transaction</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Step 4: Confirm */}
                <div className="bg-dark border border-gray-800 rounded-card p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-heading text-accent font-bold text-sm sm:text-base">4</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-base sm:text-lg font-semibold text-white mb-2">
                        Confirm Your Payment
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400">
                        After sending the payment, enter your email below and click "I Paid" to notify us.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Naira Instructions */}
            {paymentMethod === 'naira' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Step 1: Bank Details */}
                <div className="bg-dark border border-gray-800 rounded-card p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-heading text-accent font-bold text-sm sm:text-base">1</span>
                    </div>
                    <div className="flex-1 w-full">
                      <h3 className="font-heading text-base sm:text-lg font-semibold text-white mb-2">
                        Copy Bank Details
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                        Transfer to this bank account:
                      </p>
                      <div className="bg-dark-lighter border border-gray-700 rounded-card p-3 sm:p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Bank Name:</span>
                          <span className="text-white font-semibold">{bankDetails.bank}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Account Number:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-accent font-mono font-bold">{bankDetails.accountNumber}</span>
                            <button
                              onClick={() => handleCopy(bankDetails.accountNumber, 'bank')}
                              className="text-accent hover:text-accent-light transition-colors"
                            >
                              <i className={copiedBank ? "ri-check-line" : "ri-file-copy-line"}></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Account Name:</span>
                          <span className="text-white font-semibold">{bankDetails.accountName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Payment Reference */}
                <div className="bg-dark border border-gray-800 rounded-card p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-heading text-accent font-bold text-sm sm:text-base">2</span>
                    </div>
                    <div className="flex-1 w-full">
                      <h3 className="font-heading text-base sm:text-lg font-semibold text-white mb-2">
                        Copy Payment Reference
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                        <strong className="text-red-400">⚠️ IMPORTANT:</strong> Use this as your transfer narration/description so we can identify your payment.
                      </p>
                      <div className="bg-dark-lighter border border-gray-700 rounded-card p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                        <code className="text-accent text-sm sm:text-lg font-mono font-bold break-all">
                          {uniqueMemo}
                        </code>
                        <button
                          onClick={() => handleCopy(uniqueMemo, 'memo')}
                          className="flex-shrink-0 bg-accent/10 border border-accent/30 text-accent px-4 py-2 rounded-card hover:bg-accent hover:text-dark transition-all duration-300 text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer flex items-center justify-center"
                        >
                          {copiedMemo ? (
                            <>
                              <i className="ri-check-line mr-1"></i>
                              Copied!
                            </>
                          ) : (
                            <>
                              <i className="ri-file-copy-line mr-1"></i>
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Make Transfer */}
                <div className="bg-dark border border-gray-800 rounded-card p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-heading text-accent font-bold text-sm sm:text-base">3</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-base sm:text-lg font-semibold text-white mb-2">
                        Make Bank Transfer
                      </h3>
                      <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                        <li className="flex items-start gap-2">
                          <i className="ri-arrow-right-s-line text-accent mt-0.5 flex-shrink-0"></i>
                          <span>Open your banking app or visit your bank</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="ri-arrow-right-s-line text-accent mt-0.5 flex-shrink-0"></i>
                          <span>Transfer exactly <strong className="text-white">{formatNaira(Number(nairaPrice))}</strong> to the account above</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="ri-arrow-right-s-line text-accent mt-0.5 flex-shrink-0"></i>
                          <span><strong className="text-white">Paste the reference code</strong> in the narration/description field</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="ri-arrow-right-s-line text-accent mt-0.5 flex-shrink-0"></i>
                          <span>Complete the transfer</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Step 4: Confirm */}
                <div className="bg-dark border border-gray-800 rounded-card p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-heading text-accent font-bold text-sm sm:text-base">4</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-base sm:text-lg font-semibold text-white mb-2">
                        Confirm Your Payment
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400">
                        After making the transfer, enter your email below and click "I Paid" to notify us.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Email Form */}
          <form id="payment-confirmation-form" onSubmit={handleSubmit} className="bg-dark border border-accent/20 rounded-card p-4 sm:p-6">
            <h3 className="font-heading text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
              Enter Your Email Address
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
              We'll send your credit token and activation key to this email once payment is verified.
            </p>

            {error && (
              <div className="mb-4 bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-card text-sm">
                <i className="ri-error-warning-line mr-2"></i>
                {error}
              </div>
            )}

            <div className="mb-4 sm:mb-6">
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                placeholder="your.email@example.com"
                className="w-full bg-dark-lighter border border-gray-700 text-white px-3 sm:px-4 py-3 rounded-card focus:outline-none focus:border-accent transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-dark font-bold py-3 sm:py-4 rounded-card hover:bg-accent-light transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 text-base sm:text-lg whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line mr-2 animate-spin"></i>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="ri-check-double-line mr-2"></i>
                  I Paid - Confirm Submission
                </>
              )}
            </button>
          </form>

          {/* Trust Note */}
          <div className="mt-6 sm:mt-8 bg-dark border border-gray-800 rounded-card p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <i className="ri-shield-check-line text-xl sm:text-2xl text-accent flex-shrink-0"></i>
              <div>
                <h4 className="font-heading text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Secure Manual Verification</h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  Your payment is manually verified for security. Once confirmed, we will send your credit key directly to your email.
                  This process typically takes {paymentMethod === 'naira' ? '10-30 minutes' : '10-30 minutes'} during business hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-dark-light border border-gray-800 rounded-card p-4 sm:p-6 text-center">
          <p className="text-gray-400 text-xs sm:text-sm mb-2">
            Need help with your payment?
          </p>
          <a
            href="https://wa.me/2349126375037?text=Hello%2C%20I%20need%20support%20with%20my%20account."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-light transition-colors font-semibold text-xs sm:text-sm cursor-pointer"
          >
            <i className="ri-whatsapp-line"></i>
            Contact Support on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
