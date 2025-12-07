import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";
import { isRateLimited, recordLoginAttempt, getRemainingAttempts } from "@/utils/rateLimiter";
import logo from "@/assets/logo.png";

const signupSchema = z.object({
  email: z.string().email("Email inválido").max(255),
  fullName: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(100),
  phone: z.string().min(10, "Celular deve ter no mínimo 10 dígitos").max(15),
  cpf: z.string().length(11, "CPF deve ter 11 dígitos"),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido").max(255),
  cpfLast6: z.string().length(6, "Digite os primeiros 6 dígitos do CPF"),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [cpfLast6, setCpfLast6] = useState("");
  const [loading, setLoading] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState({ limited: false, remainingTime: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const checkRateLimit = () => {
      setRateLimitInfo(isRateLimited());
    };
    checkRateLimit();
    const interval = setInterval(checkRateLimit, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const rateCheck = isRateLimited();
      if (rateCheck.limited) {
        toast.error(`Muitas tentativas. Aguarde ${rateCheck.remainingTime} minutos.`);
        setRateLimitInfo(rateCheck);
        return;
      }
    }
    
    setLoading(true);

    try {
      if (isLogin) {
        loginSchema.parse({ email, cpfLast6 });

        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: cpfLast6,
        });

        if (error) {
          recordLoginAttempt(false);
          const remaining = getRemainingAttempts();
          if (error.message.includes("Invalid login credentials")) {
            toast.error(`Email ou CPF incorretos. ${remaining} tentativas restantes.`);
          } else {
            toast.error(error.message);
          }
          setRateLimitInfo(isRateLimited());
          return;
        }

        recordLoginAttempt(true);
        toast.success("Login realizado com sucesso!");
        navigate("/");
      } else {
        signupSchema.parse({ email, fullName, phone, cpf });

        const password = cpf.slice(0, 6);
        const redirectUrl = `${window.location.origin}/`;

        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName.trim(),
              phone: phone.trim(),
              cpf: cpf.trim(),
            },
          },
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            toast.error("Este email já está cadastrado");
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success("Cadastro realizado! Use os primeiros 6 dígitos do CPF para fazer login.");
        setIsLogin(true);
        setCpfLast6(password);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Ocorreu um erro. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 border-border/50 shadow-lg">
        <div className="mb-8 text-center">
          <img src={logo} alt="JoIA Logo" className="w-20 h-20 object-contain mx-auto mb-4" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            JoIA: Sua Plataforma Inteligente
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? "Faça login na sua conta" : "Crie sua conta"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Seu nome"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Celular</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  required
                  maxLength={15}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF (apenas números)</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="00000000000"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
                  required
                  maxLength={11}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={255}
            />
          </div>

          {isLogin && (
            <div className="space-y-2">
              <Label htmlFor="cpfLast6">Primeiros 6 dígitos do CPF</Label>
              <Input
                id="cpfLast6"
                type="password"
                placeholder="000000"
                value={cpfLast6}
                onChange={(e) => setCpfLast6(e.target.value.replace(/\D/g, ""))}
                required
                maxLength={6}
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading || (isLogin && rateLimitInfo.limited)}>
            {loading ? "Carregando..." : rateLimitInfo.limited && isLogin ? `Bloqueado (${rateLimitInfo.remainingTime}min)` : isLogin ? "Entrar" : "Cadastrar"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
          >
          {isLogin
              ? "Primeiro acesso? Cadastre-se"
              : "Já tem uma conta? Faça login"}
          </button>
        </div>
      </Card>
    </div>
  );
}
