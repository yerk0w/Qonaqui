import { useEffect, useState } from 'react';
import AnimatedPage from '../../components/AnimatedPage';
import { loyaltyService } from '../../services/loyaltyService';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const typeLabels = {
  EARN: 'Начисление',
  REDEEM: 'Списание',
};

const MyLoyalty = () => {
  const { user, isAuthenticated, isLoading: authLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [redeemDescription, setRedeemDescription] = useState('Использование баллов');
  const [processing, setProcessing] = useState(false);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await loyaltyService.history();
      setHistory(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
      } else {
        loadHistory();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated]);

  const handleRedeem = async (event) => {
    event.preventDefault();
    if (redeemPoints <= 0) return;
    setProcessing(true);
    try {
      await loyaltyService.redeem(redeemPoints, redeemDescription || 'Использование баллов');
      setRedeemPoints(0);
      loadHistory();
      refreshProfile();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-10">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Программа лояльности</h1>
            <p className="text-gray-600">
              Используйте баллы, накопленные за бронирования и услуги. Баллы начисляются автоматически при оплате.
            </p>
          </header>

          {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Баланс</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Текущий баланс</p>
                <p className="text-3xl font-bold text-blue-600">
                  {user?.loyaltyPoints ?? 0} баллов
                </p>
              </div>
              <form onSubmit={handleRedeem} className="flex flex-col md:flex-row gap-3">
                <input
                  type="number"
                  min={1}
                  max={user?.loyaltyPoints ?? 0}
                  value={redeemPoints}
                  onChange={(event) => setRedeemPoints(Number(event.target.value) || 0)}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Количество баллов"
                />
                <input
                  type="text"
                  value={redeemDescription}
                  onChange={(event) => setRedeemDescription(event.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Описание списания"
                />
                <button
                  type="submit"
                  disabled={processing || redeemPoints <= 0 || redeemPoints > (user?.loyaltyPoints ?? 0)}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-40"
                >
                  {processing ? 'Обработка...' : 'Списать'}
                </button>
              </form>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">История операций</h2>

            {loading || authLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                Операций пока нет.
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-100 rounded-lg px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {typeLabels[transaction.type] ?? transaction.type}
                      </p>
                      <p className="text-xs text-gray-500">{transaction.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-lg font-bold ${transaction.type === 'REDEEM' ? 'text-red-500' : 'text-emerald-600'}`}>
                        {transaction.type === 'REDEEM' ? '-' : '+'}{transaction.points}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default MyLoyalty;
