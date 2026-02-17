import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function AdminPage() {
  const [adminSecret, setAdminSecret] = useState(localStorage.getItem('adminSecret') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processingMemo, setProcessingMemo] = useState(null);

  // Token management state
  const [activeTab, setActiveTab] = useState('payments');
  const [tokens, setTokens] = useState([]);
  const [tokenSearch, setTokenSearch] = useState('');
  const [tokenFilter, setTokenFilter] = useState('all');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenDetails, setTokenDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Check authentication on mount
  useEffect(() => {
    if (adminSecret) {
      verifyAuth();
    }
  }, []);

  // Reload dashboard when tab changes
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboard();
    }
  }, [activeTab]);

  const verifyAuth = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`${API_BASE_URL}/api/admin/stats`, {
        headers: { 'x-admin-secret': adminSecret }
      });

      if (response.data) {
        setIsAuthenticated(true);
        localStorage.setItem('adminSecret', adminSecret);
        loadDashboard();
      }
    } catch (err) {
      setError('Invalid admin secret');
      setIsAuthenticated(false);
      localStorage.removeItem('adminSecret');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);

      if (activeTab === 'payments') {
        // Load stats and pending payments
        const [statsRes, paymentsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/admin/stats`, {
            headers: { 'x-admin-secret': adminSecret }
          }),
          axios.get(`${API_BASE_URL}/api/admin/payments/pending`, {
            headers: { 'x-admin-secret': adminSecret }
          })
        ]);

        setStats(statsRes.data);
        setPayments(paymentsRes.data.payments);
      } else {
        // Load stats and tokens
        const [statsRes, tokensRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/admin/stats`, {
            headers: { 'x-admin-secret': adminSecret }
          }),
          axios.get(`${API_BASE_URL}/api/admin/tokens`, {
            headers: { 'x-admin-secret': adminSecret }
          })
        ]);

        setStats(statsRes.data);
        setTokens(tokensRes.data.tokens);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    verifyAuth();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminSecret('');
    localStorage.removeItem('adminSecret');
    setPayments([]);
    setStats(null);
  };

  const handleApprove = async (memo) => {
    if (!window.confirm(`Approve payment ${memo}? This will generate a credit token and send it to the user's email.`)) {
      return;
    }

    try {
      setProcessingMemo(memo);
      setError('');
      setSuccess('');

      const response = await axios.post(
        `${API_BASE_URL}/api/admin/verify-payment`,
        { memo },
        { headers: { 'x-admin-secret': adminSecret } }
      );

      setSuccess(`✓ Payment approved! Token: ${response.data.token.token} (Email sent: ${response.data.emailSent ? 'Yes' : 'No'})`);

      // Reload dashboard
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve payment');
    } finally {
      setProcessingMemo(null);
    }
  };

  const handleReject = async (memo) => {
    const reason = window.prompt('Reason for rejection (will be sent to user):');
    if (!reason) return;

    try {
      setProcessingMemo(memo);
      setError('');
      setSuccess('');

      await axios.post(
        `${API_BASE_URL}/api/admin/reject-payment`,
        { memo, reason },
        { headers: { 'x-admin-secret': adminSecret } }
      );

      setSuccess(`✓ Payment ${memo} rejected`);

      // Reload dashboard
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject payment');
    } finally {
      setProcessingMemo(null);
    }
  };

  // Token filtering and pagination helpers
  const getFilteredTokens = () => {
    let filtered = tokens;

    // Apply search filter
    if (tokenSearch) {
      const search = tokenSearch.toLowerCase();
      filtered = filtered.filter(t =>
        t.token.toLowerCase().includes(search) ||
        t.email.toLowerCase().includes(search) ||
        (t.deviceId && t.deviceId.toLowerCase().includes(search))
      );
    }

    // Apply status filter
    switch (tokenFilter) {
      case 'active':
        filtered = filtered.filter(t => t.active);
        break;
      case 'inactive':
        filtered = filtered.filter(t => !t.active);
        break;
      case 'low':
        filtered = filtered.filter(t => t.remainingCredits < 10 && t.remainingCredits > 0);
        break;
    }

    return filtered;
  };

  const getPaginatedTokens = () => {
    const filtered = getFilteredTokens();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(getFilteredTokens().length / itemsPerPage);

  // Token action handlers
  const handleViewDetails = async (tokenStr) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/admin/token/${tokenStr}`, {
        headers: { 'x-admin-secret': adminSecret }
      });
      setTokenDetails(response.data);
      setShowTokenModal(true);
    } catch (err) {
      setError('Failed to load token details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCredits = async (tokenStr) => {
    const credits = window.prompt('How many credits to add?');
    if (!credits || isNaN(credits)) return;

    try {
      setLoading(true);
      await axios.post(
        `${API_BASE_URL}/api/admin/add-credits`,
        { token: tokenStr, credits: parseInt(credits) },
        { headers: { 'x-admin-secret': adminSecret } }
      );
      setSuccess(`✓ Added ${credits} credits to ${tokenStr}`);
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add credits');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (token) => {
    const endpoint = token.active ? 'deactivate-token' : 'reactivate-token';
    const action = token.active ? 'deactivate' : 'reactivate';

    if (!window.confirm(`${action} token ${token.token}?`)) return;

    try {
      setLoading(true);
      await axios.post(
        `${API_BASE_URL}/api/admin/${endpoint}`,
        { token: token.token },
        { headers: { 'x-admin-secret': adminSecret } }
      );
      setSuccess(`✓ Token ${action}d successfully`);
      await loadDashboard();
    } catch (err) {
      setError(`Failed to ${action} token`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDevice = async (tokenStr) => {
    if (!window.confirm(`Reset device binding for ${tokenStr}? User will need to reactivate.`)) return;

    try {
      setLoading(true);
      await axios.post(
        `${API_BASE_URL}/api/admin/reset-device`,
        { token: tokenStr },
        { headers: { 'x-admin-secret': adminSecret } }
      );
      setSuccess('✓ Device binding reset');
      await loadDashboard();
    } catch (err) {
      setError('Failed to reset device');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToken = (tokenStr) => {
    navigator.clipboard.writeText(tokenStr);
    setSuccess('✓ Token copied to clipboard');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleGenerateToken = async () => {
    const email = window.prompt('Enter email address:');
    if (!email) return;

    const credits = window.prompt('Enter number of credits:', '50');
    if (!credits || isNaN(credits)) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/generate-token`,
        { email, credits: parseInt(credits) },
        { headers: { 'x-admin-secret': adminSecret } }
      );
      setSuccess(`✓ Token generated: ${response.data.token} (Email sent: ${response.data.emailSent ? 'Yes' : 'No'})`);
      await loadDashboard();
    } catch (err) {
      setError('Failed to generate token');
    } finally {
      setLoading(false);
    }
  };

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-dark-light border border-accent/30 rounded-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent/10 border-2 border-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-admin-line text-3xl text-accent"></i>
            </div>
            <h1 className="font-heading text-3xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-sm">
              Enter your admin secret to continue
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-card text-sm">
              <i className="ri-error-warning-line mr-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Secret Key
              </label>
              <input
                type="password"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                required
                placeholder="Enter admin secret"
                className="w-full bg-dark-lighter border border-gray-700 text-white px-4 py-3 rounded-card focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-dark font-bold py-3 rounded-card hover:bg-accent-light transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-gray-400 hover:text-accent transition-colors"
            >
              <i className="ri-arrow-left-line mr-1"></i>
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-dark py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">Manage payments and credit tokens</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={loadDashboard}
              disabled={loading}
              className="bg-dark-light border border-gray-700 text-white px-4 py-2 rounded-card hover:border-accent transition-all disabled:opacity-50"
            >
              <i className="ri-refresh-line mr-2"></i>
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-card hover:bg-red-900/30 transition-all"
            >
              <i className="ri-logout-box-line mr-2"></i>
              Logout
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-card">
            <i className="ri-error-warning-line mr-2"></i>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-900/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-card">
            <i className="ri-check-line mr-2"></i>
            {success}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          <button
            onClick={() => {
              setActiveTab('payments');
              setCurrentPage(1);
            }}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'payments'
                ? 'text-accent border-b-2 border-accent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <i className="ri-file-list-line mr-2"></i>
            Payments ({stats?.payments?.pending || 0})
          </button>
          <button
            onClick={() => {
              setActiveTab('tokens');
              setCurrentPage(1);
            }}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'tokens'
                ? 'text-accent border-b-2 border-accent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <i className="ri-key-line mr-2"></i>
            Tokens ({stats?.tokens?.active || 0})
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-light border border-gray-800 rounded-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Pending Payments</p>
                <i className="ri-time-line text-yellow-500 text-xl"></i>
              </div>
              <p className="font-heading text-3xl font-bold text-white">
                {stats?.payments?.pending || 0}
              </p>
            </div>

            <div className="bg-dark-light border border-gray-800 rounded-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Verified Payments</p>
                <i className="ri-check-line text-green-500 text-xl"></i>
              </div>
              <p className="font-heading text-3xl font-bold text-white">
                {stats?.payments?.verified || 0}
              </p>
            </div>

            <div className="bg-dark-light border border-gray-800 rounded-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Active Tokens</p>
                <i className="ri-key-line text-accent text-xl"></i>
              </div>
              <p className="font-heading text-3xl font-bold text-white">
                {stats?.tokens?.active || 0}
              </p>
            </div>

            <div className="bg-dark-light border border-gray-800 rounded-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Revenue (USDT)</p>
                <i className="ri-money-dollar-circle-line text-green-500 text-xl"></i>
              </div>
              <p className="font-heading text-3xl font-bold text-white">
                ${(stats?.revenue?.totalUSDT || 0).toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Pending Payments Table */}
        {activeTab === 'payments' && (
        <div className="bg-dark-light border border-gray-800 rounded-card overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <i className="ri-file-list-line text-accent"></i>
              Pending Payments ({payments.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <i className="ri-loader-4-line text-4xl text-accent animate-spin"></i>
              <p className="text-gray-400 mt-4">Loading payments...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="p-12 text-center">
              <i className="ri-inbox-line text-4xl text-gray-600 mb-4"></i>
              <p className="text-gray-400">No pending payments</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Memo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {payments.map((payment) => (
                    <tr key={payment.memo} className="hover:bg-dark transition-colors">
                      <td className="px-6 py-4">
                        <code className="text-accent text-sm font-mono">{payment.memo}</code>
                      </td>
                      <td className="px-6 py-4 text-white text-sm">
                        {payment.email}
                      </td>
                      <td className="px-6 py-4 text-white text-sm">
                        {payment.credits}
                      </td>
                      <td className="px-6 py-4 text-white text-sm">
                        ${payment.amount} USDT
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(payment.memo)}
                            disabled={processingMemo === payment.memo}
                            className="bg-green-900/20 border border-green-500/50 text-green-400 px-4 py-2 rounded-card hover:bg-green-900/30 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingMemo === payment.memo ? (
                              <>
                                <i className="ri-loader-4-line animate-spin mr-1"></i>
                                Processing...
                              </>
                            ) : (
                              <>
                                <i className="ri-check-line mr-1"></i>
                                Approve
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleReject(payment.memo)}
                            disabled={processingMemo === payment.memo}
                            className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-card hover:bg-red-900/30 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <i className="ri-close-line mr-1"></i>
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}

        {/* Tokens Table */}
        {activeTab === 'tokens' && (
        <>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by token, email, or device..."
                value={tokenSearch}
                onChange={(e) => setTokenSearch(e.target.value)}
                className="w-full bg-dark-light border border-gray-700 text-white px-4 py-2 rounded-card focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <select
              value={tokenFilter}
              onChange={(e) => setTokenFilter(e.target.value)}
              className="bg-dark-light border border-gray-700 text-white px-4 py-2 rounded-card focus:outline-none focus:border-accent transition-colors"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="low">Low Credits (&lt;10)</option>
            </select>
          </div>

          {/* Tokens Table */}
          <div className="bg-dark-light border border-gray-800 rounded-card overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                <i className="ri-key-line text-accent"></i>
                Credit Tokens ({getFilteredTokens().length})
              </h2>
              <button
                onClick={handleGenerateToken}
                className="bg-accent/10 border border-accent text-accent px-4 py-2 rounded-card hover:bg-accent/20 transition-all text-sm font-semibold"
              >
                <i className="ri-add-line mr-1"></i>
                Generate Token
              </button>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <i className="ri-loader-4-line text-4xl text-accent animate-spin"></i>
                <p className="text-gray-400 mt-4">Loading tokens...</p>
              </div>
            ) : getFilteredTokens().length === 0 ? (
              <div className="p-12 text-center">
                <i className="ri-inbox-line text-4xl text-gray-600 mb-4"></i>
                <p className="text-gray-400">No tokens found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-dark border-b border-gray-800">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Token
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Credits
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Device
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Last Used
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {getPaginatedTokens().map((token) => (
                        <tr key={token.token} className="hover:bg-dark transition-colors">
                          <td className="px-6 py-4">
                            <code className="text-accent text-sm font-mono cursor-pointer hover:text-accent-light" onClick={() => handleCopyToken(token.token)}>
                              {token.token}
                            </code>
                          </td>
                          <td className="px-6 py-4 text-white text-sm">
                            {token.email}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-white text-sm">
                                {token.remainingCredits} / {token.totalCredits}
                              </span>
                              <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    token.remainingCredits / token.totalCredits > 0.5
                                      ? 'bg-accent'
                                      : token.remainingCredits / token.totalCredits > 0.2
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                  }`}
                                  style={{ width: `${(token.remainingCredits / token.totalCredits) * 100}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                              token.active
                                ? 'bg-green-900/20 border border-green-500/50 text-green-400'
                                : 'bg-red-900/20 border border-red-500/50 text-red-400'
                            }`}>
                              {token.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">
                            {token.deviceId ? (
                              <span className="flex items-center gap-1">
                                <i className="ri-device-line text-accent"></i>
                                Bound
                              </span>
                            ) : (
                              <span className="text-gray-600">Unbound</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">
                            {token.lastUsedAt
                              ? new Date(token.lastUsedAt).toLocaleDateString()
                              : 'Never'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewDetails(token.token)}
                                className="text-gray-400 hover:text-accent p-2 rounded-card hover:bg-dark transition-all"
                                title="View Details"
                              >
                                <i className="ri-eye-line text-lg"></i>
                              </button>
                              <button
                                onClick={() => handleAddCredits(token.token)}
                                className="text-gray-400 hover:text-green-400 p-2 rounded-card hover:bg-dark transition-all"
                                title="Add Credits"
                              >
                                <i className="ri-add-circle-line text-lg"></i>
                              </button>
                              <button
                                onClick={() => handleToggleActive(token)}
                                className={`p-2 rounded-card hover:bg-dark transition-all ${
                                  token.active ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-green-400'
                                }`}
                                title={token.active ? 'Deactivate' : 'Reactivate'}
                              >
                                <i className={token.active ? 'ri-close-circle-line text-lg' : 'ri-check-circle-line text-lg'}></i>
                              </button>
                              {token.deviceId && (
                                <button
                                  onClick={() => handleResetDevice(token.token)}
                                  className="text-gray-400 hover:text-yellow-400 p-2 rounded-card hover:bg-dark transition-all"
                                  title="Reset Device"
                                >
                                  <i className="ri-refresh-line text-lg"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-6 border-t border-gray-800 flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, getFilteredTokens().length)} of {getFilteredTokens().length} tokens
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="bg-dark-light border border-gray-700 text-white px-4 py-2 rounded-card hover:border-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="ri-arrow-left-s-line"></i>
                      </button>
                      <span className="bg-dark-light border border-gray-700 text-white px-4 py-2 rounded-card">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="bg-dark-light border border-gray-700 text-white px-4 py-2 rounded-card hover:border-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="ri-arrow-right-s-line"></i>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
        )}

        {/* Token Details Modal */}
        {showTokenModal && tokenDetails && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-light border border-gray-800 rounded-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-dark-light">
                <h2 className="font-heading text-2xl font-bold text-white">
                  Token Details
                </h2>
                <button
                  onClick={() => setShowTokenModal(false)}
                  className="text-gray-400 hover:text-white p-2 rounded-card hover:bg-dark transition-all"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              {/* Token Info */}
              <div className="p-6 space-y-6">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-dark border border-gray-800 rounded-card p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Token</p>
                    <p className="text-white font-mono text-sm break-all">{tokenDetails.token.token}</p>
                  </div>
                  <div className="bg-dark border border-gray-800 rounded-card p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                    <p className="text-white text-sm">{tokenDetails.token.email}</p>
                  </div>
                  <div className="bg-dark border border-gray-800 rounded-card p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Credits</p>
                    <p className="text-white text-sm">{tokenDetails.token.totalCredits}</p>
                  </div>
                  <div className="bg-dark border border-gray-800 rounded-card p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Remaining Credits</p>
                    <p className="text-white text-sm">{tokenDetails.token.remainingCredits}</p>
                  </div>
                  <div className="bg-dark border border-gray-800 rounded-card p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</p>
                    <p className={`text-sm ${tokenDetails.token.active ? 'text-green-400' : 'text-red-400'}`}>
                      {tokenDetails.token.active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className="bg-dark border border-gray-800 rounded-card p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Device</p>
                    <p className="text-white font-mono text-sm break-all">
                      {tokenDetails.token.deviceId || 'Not bound'}
                    </p>
                  </div>
                  <div className="bg-dark border border-gray-800 rounded-card p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Created</p>
                    <p className="text-white text-sm">
                      {new Date(tokenDetails.token.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-dark border border-gray-800 rounded-card p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Last Used</p>
                    <p className="text-white text-sm">
                      {tokenDetails.token.lastUsedAt
                        ? new Date(tokenDetails.token.lastUsedAt).toLocaleString()
                        : 'Never'}
                    </p>
                  </div>
                </div>

                {/* Usage History */}
                <div>
                  <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <i className="ri-history-line text-accent"></i>
                    Recent Usage History
                  </h3>
                  {tokenDetails.recentUsage.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No usage recorded yet</p>
                  ) : (
                    <div className="bg-dark border border-gray-800 rounded-card overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-dark-light border-b border-gray-800">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                              Timestamp
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                              Action
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                              Credits After
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {tokenDetails.recentUsage.map((log, idx) => (
                            <tr key={idx} className="hover:bg-dark-light transition-colors">
                              <td className="px-4 py-3 text-sm text-gray-400">
                                {new Date(log.timestamp).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-sm text-white">
                                {log.action}
                              </td>
                              <td className="px-4 py-3 text-sm text-white">
                                {log.remainingCredits}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer - Quick Actions */}
              <div className="p-6 border-t border-gray-800 flex gap-3 justify-end">
                <button
                  onClick={() => {
                    handleAddCredits(tokenDetails.token.token);
                    setShowTokenModal(false);
                  }}
                  className="bg-green-900/20 border border-green-500/50 text-green-400 px-4 py-2 rounded-card hover:bg-green-900/30 transition-all"
                >
                  <i className="ri-add-circle-line mr-2"></i>
                  Add Credits
                </button>
                <button
                  onClick={() => {
                    handleToggleActive(tokenDetails.token);
                    setShowTokenModal(false);
                  }}
                  className={`px-4 py-2 rounded-card transition-all ${
                    tokenDetails.token.active
                      ? 'bg-red-900/20 border border-red-500/50 text-red-400 hover:bg-red-900/30'
                      : 'bg-green-900/20 border border-green-500/50 text-green-400 hover:bg-green-900/30'
                  }`}
                >
                  {tokenDetails.token.active ? 'Deactivate' : 'Reactivate'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
