'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

const signupSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  displayName: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
});

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail || !forgotPasswordEmail.includes('@')) {
      toast({ title: 'Неверный email', variant: 'destructive' });
      return;
    }
    // Simulation
    toast({
      title: 'Ссылка отправлена',
      description: `Инструкции по восстановлению отправлены на ${forgotPasswordEmail}`,
      className: 'bg-black text-white',
    });
    setIsForgotPassword(false);
  };

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'test@example.com',
      password: 'password123',
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      displayName: '',
    },
  });

  const onLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
      await signIn(data.email, data.password);
      toast({
        title: 'Успешный вход',
        description: 'Добро пожаловать!',
      });
      router.push('/');
    } catch (error) {
      toast({
        title: 'Ошибка входа',
        description: error instanceof Error ? error.message : 'Неверный email или пароль',
        variant: 'destructive',
      });
    }
  };

  const onSignUp = async (data: z.infer<typeof signupSchema>) => {
    try {
      await signUp(data.email, data.password, data.displayName);
      toast({
        title: 'Регистрация успешна',
        description: 'Добро пожаловать!',
      });
      router.push('/');
    } catch (error) {
      toast({
        title: 'Ошибка регистрации',
        description: error instanceof Error ? error.message : 'Не удалось зарегистрироваться',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md overflow-hidden rounded-xl border-none shadow-2xl">
        {isForgotPassword ? (
          <div className="space-y-4 p-3 duration-500 animate-in fade-in zoom-in-95">
            <div className="space-y-2 text-center">
<<<<<<< HEAD
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                <Lock className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-tighter">Восстановление</h2>
              <p className="text-[10px] font-bold uppercase leading-relaxed tracking-widest text-slate-400">
=======
              <div className="bg-accent-primary/10 mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl">
                <Lock className="text-accent-primary h-8 w-8" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-tighter">Восстановление</h2>
              <p className="text-text-muted text-[10px] font-bold uppercase leading-relaxed tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Введите ваш email для получения ссылки <br /> восстановления доступа к платформе
              </p>
            </div>
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="space-y-2">
<<<<<<< HEAD
                <Label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Email адрес
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
=======
                <Label className="text-text-muted ml-1 text-[10px] font-black uppercase tracking-widest">
                  Email адрес
                </Label>
                <div className="relative">
                  <Mail className="text-text-muted absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
>>>>>>> recover/cabinet-wip-from-stash
                  <Input
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="name@company.ai"
<<<<<<< HEAD
                    className="h-10 rounded-2xl border-none bg-slate-50 pl-12 font-bold ring-indigo-500/20 focus:ring-2"
=======
                    className="bg-bg-surface2 ring-accent-primary/20 h-10 rounded-2xl border-none pl-12 font-bold focus:ring-2"
>>>>>>> recover/cabinet-wip-from-stash
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="h-10 w-full rounded-2xl bg-black text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95"
              >
                Отправить ссылку
              </Button>
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
<<<<<<< HEAD
                className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-600"
=======
                className="text-text-muted hover:text-text-secondary w-full py-2 text-[10px] font-black uppercase tracking-widest transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
              >
                Вернуться к входу
              </button>
            </form>
          </div>
        ) : (
          <>
            <CardHeader className="px-10 pb-4 pt-10">
<<<<<<< HEAD
              <CardTitle className="text-base font-black uppercase tracking-tighter text-slate-900">
                {isSignUp ? 'Регистрация' : 'Вход'}
              </CardTitle>
              <CardDescription className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
              <CardTitle className="text-text-primary text-base font-black uppercase tracking-tighter">
                {isSignUp ? 'Регистрация' : 'Вход'}
              </CardTitle>
              <CardDescription className="text-text-muted mt-2 text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                {isSignUp
                  ? 'Создайте аккаунт для начала работы в Intel OS'
                  : 'Войдите в свою учетную запись'}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-10 pb-10">
              {isSignUp ? (
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignUp)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
<<<<<<< HEAD
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400">
=======
                          <FormLabel className="text-text-muted text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                            Имя
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Иван Иванов"
<<<<<<< HEAD
                              className="h-12 rounded-xl border-none bg-slate-50 font-bold"
=======
                              className="bg-bg-surface2 h-12 rounded-xl border-none font-bold"
>>>>>>> recover/cabinet-wip-from-stash
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
<<<<<<< HEAD
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400">
=======
                          <FormLabel className="text-text-muted text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="email@example.com"
<<<<<<< HEAD
                              className="h-12 rounded-xl border-none bg-slate-50 font-bold"
=======
                              className="bg-bg-surface2 h-12 rounded-xl border-none font-bold"
>>>>>>> recover/cabinet-wip-from-stash
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
<<<<<<< HEAD
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400">
=======
                          <FormLabel className="text-text-muted text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                            Пароль
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
<<<<<<< HEAD
                              className="h-12 rounded-xl border-none bg-slate-50 font-bold"
=======
                              className="bg-bg-surface2 h-12 rounded-xl border-none font-bold"
>>>>>>> recover/cabinet-wip-from-stash
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="mt-4 h-10 w-full rounded-2xl bg-black text-xs font-black uppercase tracking-widest text-white shadow-xl"
                      disabled={signupForm.formState.isSubmitting}
                    >
                      {signupForm.formState.isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Зарегистрироваться
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
<<<<<<< HEAD
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400">
=======
                          <FormLabel className="text-text-muted text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="email@example.com"
<<<<<<< HEAD
                              className="h-12 rounded-xl border-none bg-slate-50 font-bold"
=======
                              className="bg-bg-surface2 h-12 rounded-xl border-none font-bold"
>>>>>>> recover/cabinet-wip-from-stash
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
<<<<<<< HEAD
                            <FormLabel className="text-[10px] font-black uppercase text-slate-400">
=======
                            <FormLabel className="text-text-muted text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                              Пароль
                            </FormLabel>
                            <button
                              type="button"
                              onClick={() => setIsForgotPassword(true)}
<<<<<<< HEAD
                              className="text-[9px] font-black uppercase tracking-widest text-indigo-500 transition-colors hover:text-indigo-600"
=======
                              className="text-accent-primary hover:text-accent-primary text-[9px] font-black uppercase tracking-widest transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              Забыли пароль?
                            </button>
                          </div>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
<<<<<<< HEAD
                              className="h-12 rounded-xl border-none bg-slate-50 font-bold"
=======
                              className="bg-bg-surface2 h-12 rounded-xl border-none font-bold"
>>>>>>> recover/cabinet-wip-from-stash
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="mt-4 h-10 w-full rounded-2xl bg-black text-xs font-black uppercase tracking-widest text-white shadow-xl"
                      disabled={loginForm.formState.isSubmitting}
                    >
                      {loginForm.formState.isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Войти
                    </Button>
                  </form>
                </Form>
              )}

<<<<<<< HEAD
              <div className="mt-8 border-t border-slate-50 pt-6 text-center text-sm">
                {isSignUp ? (
                  <p className="text-[11px] font-bold uppercase tracking-tight text-slate-400">
                    Уже есть аккаунт?{' '}
                    <button
                      onClick={() => setIsSignUp(false)}
                      className="ml-1 font-black text-indigo-600 hover:underline"
=======
              <div className="border-border-subtle mt-8 border-t pt-6 text-center text-sm">
                {isSignUp ? (
                  <p className="text-text-muted text-[11px] font-bold uppercase tracking-tight">
                    Уже есть аккаунт?{' '}
                    <button
                      onClick={() => setIsSignUp(false)}
                      className="text-accent-primary ml-1 font-black hover:underline"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      Войти
                    </button>
                  </p>
                ) : (
<<<<<<< HEAD
                  <p className="text-[11px] font-bold uppercase tracking-tight text-slate-400">
                    Нет аккаунта?{' '}
                    <button
                      onClick={() => setIsSignUp(true)}
                      className="ml-1 font-black text-indigo-600 hover:underline"
=======
                  <p className="text-text-muted text-[11px] font-bold uppercase tracking-tight">
                    Нет аккаунта?{' '}
                    <button
                      onClick={() => setIsSignUp(true)}
                      className="text-accent-primary ml-1 font-black hover:underline"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      Зарегистрироваться
                    </button>
                  </p>
                )}
              </div>

              <div className="mt-4 text-center">
                <Link
                  href="/"
<<<<<<< HEAD
                  className="text-[9px] font-black uppercase tracking-widest text-slate-300 transition-colors hover:text-slate-500"
=======
                  className="text-text-muted hover:text-text-secondary text-[9px] font-black uppercase tracking-widest transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  Вернуться на главную
                </Link>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
