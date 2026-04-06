import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const { user, loading, error, successMessage, signUp, signIn, signOut } = useAuth();
  
  const [showAuthPage, setShowAuthPage] = useState(false);

  if (loading) {
    return <p style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", marginTop: "100px" }}>Checking session...</p>;
  }

  if (user && showAuthPage) {
  return <DashboardPage user={user} onSignOut={signOut} onSignInClick={() => setShowAuthPage(true)} />;
}

  if (!user && showAuthPage) {
    return (
      <div className="container">
        <button className="btn-outline" onClick={() => setShowAuthPage(false)} style={{ marginBottom: "20px" }}>
          &larr; Back to Dashboard
        </button>
        <AuthPage
          onSignUp={signUp}
          onSignIn={signIn}
          error={error}
          successMessage={successMessage}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <DashboardPage 
      user={user} 
      onSignOut={signOut} 
      onSignInClick={() => setShowAuthPage(true)} 
    />
  );
}
