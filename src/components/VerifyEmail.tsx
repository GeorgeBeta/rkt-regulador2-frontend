import React, { useState } from 'react';
import { apiService } from '../services/api';

interface VerifyEmailProps {
  email: string;
  onVerified?: () => void;
  onBackToRegister?: () => void;
}

export default function VerifyEmail({ email, onVerified, onBackToRegister }: VerifyEmailProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.verifyEmail(email, code);
      if (result.success && onVerified) {
        onVerified();
      }
    } catch (err) {
      setError('Código inválido o expirado');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setResendMessage('');
    try {
      const result = await apiService.resendVerificationCode(email);
      if (result.success) {
        setResendMessage('Código reenviado correctamente');
      }
    } catch (err) {
      setResendMessage('Error al reenviar el código');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Verificar Email</h2>
        <p className="verify-text">
          Hemos enviado un código de verificación de 6 dígitos a:
          <strong> {email}</strong>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="code">Código de Verificación:</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="verification-code"
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          {resendMessage && <div className={resendMessage.includes('Error') ? 'error' : 'success'}>{resendMessage}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Verificando...' : 'Verificar Código'}
          </button>
        </form>
        <div className="auth-links">
          <button onClick={handleResendCode} disabled={resending} className="link-btn">
            {resending ? 'Reenviando...' : 'Reenviar código'}
          </button>
          <button onClick={onBackToRegister} className="link-btn">
            ← Volver al registro
          </button>
        </div>
      </div>
    </div>
  );
}