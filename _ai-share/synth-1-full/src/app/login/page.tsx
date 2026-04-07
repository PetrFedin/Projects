'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
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
      toast({ title: "Неверный email", variant: "destructive" });
      return;
    }
    // Simulation
    toast({
      title: "Ссылка отправлена",
      description: `Инструкции по восстановлению отправлены на ${forgotPasswordEmail}`,
      className: "bg-black text-white"
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md overflow-hidden border-none shadow-2xl rounded-xl">
        {isForgotPassword ? (
          <div className="p-3 space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="space-y-2 text-center">
              <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Lock className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-tighter">Восстановление</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                Введите ваш email для получения ссылки <br /> восстановления доступа к платформе
              </p>
            </div>
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email адрес</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input 
                    type="email" 
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="name@company.ai"
                    className="h-10 rounded-2xl bg-slate-50 border-none font-bold pl-12 focus:ring-2 ring-indigo-500/20"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-10 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-[1.02] active:scale-95">
                Отправить ссылку
              </Button>
              <button 
                type="button" 
                onClick={() => setIsForgotPassword(false)}
                className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors py-2"
              >
                Вернуться к входу
              </button>
            </form>
          </div>
        ) : (
          <>
            <CardHeader className="pt-10 px-10 pb-4">
              <CardTitle className="text-base font-black uppercase tracking-tighter text-slate-900">
                {isSignUp ? 'Регистрация' : 'Вход'}
              </CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                {isSignUp 
                  ? 'Создайте аккаунт для начала работы в Intel OS'
                  : 'Войдите в свою учетную запись'
                }
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
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400">Имя</FormLabel>
                          <FormControl>
                            <Input placeholder="Иван Иванов" className="rounded-xl h-12 bg-slate-50 border-none font-bold" {...field} />
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
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400">Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@example.com" className="rounded-xl h-12 bg-slate-50 border-none font-bold" {...field} />
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
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400">Пароль</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" className="rounded-xl h-12 bg-slate-50 border-none font-bold" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full h-10 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl mt-4" 
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
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400">Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@example.com" className="rounded-xl h-12 bg-slate-50 border-none font-bold" {...field} />
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
                            <FormLabel className="text-[10px] font-black uppercase text-slate-400">Пароль</FormLabel>
                            <button
                              type="button"
                              onClick={() => setIsForgotPassword(true)}
                              className="text-[9px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-600 transition-colors"
                            >
                              Забыли пароль?
                            </button>
                          </div>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" className="rounded-xl h-12 bg-slate-50 border-none font-bold" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full h-10 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl mt-4" 
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
              
              <div className="mt-8 text-center text-sm border-t border-slate-50 pt-6">
                {isSignUp ? (
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                    Уже есть аккаунт?{' '}
                    <button
                      onClick={() => setIsSignUp(false)}
                      className="text-indigo-600 font-black hover:underline ml-1"
                    >
                      Войти
                    </button>
                  </p>
                ) : (
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                    Нет аккаунта?{' '}
                    <button
                      onClick={() => setIsSignUp(true)}
                      className="text-indigo-600 font-black hover:underline ml-1"
                    >
                      Зарегистрироваться
                    </button>
                  </p>
                )}
              </div>

              <div className="mt-4 text-center">
                <Link href="/" className="text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-500 transition-colors">
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





