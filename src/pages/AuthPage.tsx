import AuthForm from "../components/AuthForm";

type AuthPageProps = {
  onSignUp: (email: string, password: string) => Promise<boolean>;
  onSignIn: (email: string, password: string) => Promise<boolean>;
  error: string;
  successMessage: string;
  loading: boolean;
};

export default function AuthPage({
  onSignUp,
  onSignIn,
  error,
  successMessage,
  loading,
}: AuthPageProps) {
  return (
    <div style={{ textAlign: "center", paddingTop: "2rem" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Welcome Back</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
        Log in or sign up to manage your recipes.
      </p>
      <div style={{ textAlign: "left" }}>
        <AuthForm
          onSignUp={onSignUp}
          onSignIn={onSignIn}
          error={error}
          successMessage={successMessage}
          loading={loading}
        />
      </div>
    </div>
  );
}