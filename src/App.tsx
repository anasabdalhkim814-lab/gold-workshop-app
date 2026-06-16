import { useState } from 'react';
import { StoreContext } from './store/StoreContext';
import { useStore } from './store/useStore';
import { Page } from './store/types';
import Navigation from './components/Navigation';
import PrayerBubble from './components/PrayerBubble';
import HomePage from './pages/HomePage';
import NewJobPage from './pages/NewJobPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import DailyPage from './pages/DailyPage';
import ExpensesPage from './pages/ExpensesPage';
import TrustsPage from './pages/TrustsPage';
import VaultPage from './pages/VaultPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const store = useStore();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageData, setPageData] = useState<Record<string, string>>({});

  const navigate = (page: Page, data?: Record<string, string>) => {
    setCurrentPage(page);
    if (data) setPageData(data);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={navigate} />;
      case 'newJob': return <NewJobPage />;
      case 'customers': return <CustomersPage onNavigate={navigate} />;
      case 'customerDetail': return <CustomerDetailPage customerId={pageData.customerId || ''} onNavigate={navigate} />;
      case 'daily': return <DailyPage />;
      case 'expenses': return <ExpensesPage />;
      case 'trusts': return <TrustsPage />;
      case 'vault': return <VaultPage />;
      case 'reports': return <ReportsPage />;
      case 'settings': return <SettingsPage />;
      default: return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <StoreContext.Provider value={store}>
      <div className="min-h-screen bg-stone-50 font-tajawal">
        <Navigation currentPage={currentPage} onNavigate={navigate} />
        <main className="max-w-lg mx-auto px-4 py-4">
          {renderPage()}
        </main>
        <PrayerBubble />
      </div>
    </StoreContext.Provider>
  );
}

export default App;
