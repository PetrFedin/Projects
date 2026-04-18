'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  GraduationCap,
  Clock,
  Star,
  Users,
  Brain,
  TrendingUp,
  Search,
  ChevronRight,
  PlayCircle,
  Award,
  Filter,
  Lightbulb,
  Target,
  BarChart,
  Briefcase,
  FileText,
  Calendar as CalendarIcon,
  Video,
  ExternalLink,
  PlusCircle,
  HelpCircle,
  Download,
  Share2,
  Check,
  X as CloseIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { useUIState } from '@/providers/ui-state';
import {
  mockCourses,
  mockLearningPaths,
  mockArticles,
  mockAcademyEvents,
  mockAssessments,
} from '@/lib/education-data';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { glossary } from '@/lib/education-data';

function GlossaryText({ text }: { text: string }) {
  if (!text) return null;

  // Create a regex from glossary keys
  const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);
  const regex = new RegExp(`\\b(${terms.join('|')})\\b`, 'g');

  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const entry = glossary[part];
        if (entry) {
          return (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <span className="border-accent-primary/40 text-accent-primary hover:bg-accent-primary/10 cursor-help border-b border-dotted px-0.5 font-bold transition-colors">
                  {part}
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-text-primary border-text-primary/30 max-w-[280px] rounded-xl p-4 text-white shadow-2xl">
                <p className="text-accent-primary mb-1 text-[10px] font-bold uppercase tracking-widest">
                  {entry.term}
                </p>
                <p className="text-xs font-medium leading-relaxed">{entry.definition}</p>
              </TooltipContent>
            </Tooltip>
          );
        }
        return part;
      })}
    </>
  );
}

export default function AcademyPage() {
  const { viewRole, user } = useUIState();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeAssessment, setActiveAssessment] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [testScore, setTestScore] = useState(0);

  const { toast } = useToast();

  const categories = [
    'Все',
    'Экономика',
    'Дизайн',
    'Производство',
    'Аналитика',
    'Менеджмент',
    'Ритейл',
    'Право',
  ];

  const filteredCourses = useMemo(() => {
    return mockCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const categoryMap: Record<string, string> = {
        Все: 'All',
        Экономика: 'economics',
        Дизайн: 'design',
        Производство: 'production',
        Аналитика: 'analytics',
        Менеджмент: 'management',
        Ритейл: 'retail',
        Право: 'legal',
      };
      const targetCategory = categoryMap[activeCategory];
      const matchesCategory =
        activeCategory === 'Все' || course.category.toLowerCase() === targetCategory?.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const filteredArticles = useMemo(() => {
    return mockArticles.filter(
      (art) =>
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const recommendedCourses = useMemo(() => {
    return mockCourses
      .filter((c) => c.targetRoles.includes(viewRole) || c.isRecommended)
      .slice(0, 3);
  }, [viewRole]);

  const startTest = (assessment: any) => {
    setActiveAssessment(assessment);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const finishTest = () => {
    let correctCount = 0;
    activeAssessment.questions.forEach((q: any) => {
      if (answers[q.id] === q.correctAnswer) correctCount++;
    });
    const score = Math.round((correctCount / activeAssessment.questions.length) * 100);
    setTestScore(score);
    setIsResultOpen(true);
    setActiveAssessment(null);

    toast({
      title: score >= activeAssessment.passingScore ? 'Тест пройден!' : 'Тест не пройден',
      description: `Ваш результат: ${score}% (Минимум: ${activeAssessment.passingScore}%)`,
      variant: score >= activeAssessment.passingScore ? 'default' : 'destructive',
    });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#fafafa]">
        {/* Hero Section */}
        <div className="bg-text-primary relative overflow-hidden text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_50%_50%,#4f46e5_0%,transparent_50%)]" />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-6 sm:px-6">
            {/* Breadcrumb Navigation */}
            <div className="text-text-muted mb-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
              <ChevronRight className="h-2.5 w-2.5" />
              <span className="text-accent-primary">Academy</span>
            </div>
            <div className="max-w-3xl pb-10">
              <Badge className="bg-accent-primary hover:bg-accent-primary mb-6 border-none px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                Syntha Unified Academy
              </Badge>
              <h1 className="mb-6 text-xl font-semibold uppercase leading-none tracking-tight md:text-3xl">
                Интеллектуальный <br />
                <span className="text-accent-primary italic">Базис Знаний</span>
              </h1>
              <p className="text-text-muted mb-8 max-w-2xl text-base font-medium leading-relaxed">
                Единая экосистема обучения: от Wiki-статей и файлов до живых трансляций и глубокой
                аналитики кейсов. Доступно для всех ролей в рамках корпоративной подписки.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="text-text-primary hover:bg-bg-surface2 h-10 rounded-2xl bg-white px-8 text-[11px] font-bold uppercase tracking-widest"
                >
                  Начать обучение
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-10 rounded-2xl border-white/20 px-8 text-[11px] font-bold uppercase tracking-widest text-white hover:bg-white/10"
                >
                  Добавить контент
                </Button>
              </div>
            </div>
          </div>
          {/* Stats bar */}
          <div className="border-t border-white/10 bg-white/5 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-5xl flex-wrap gap-3 px-4 py-6 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="bg-accent-primary/20 flex h-10 w-10 items-center justify-center rounded-xl">
                  <Users className="text-accent-primary h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-black leading-none tracking-tight">12,400+</p>
                  <p className="text-text-muted mt-1 text-[10px] font-bold uppercase tracking-widest">
                    Студентов
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
                  <BookOpen className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xl font-black leading-none tracking-tight">450+</p>
                  <p className="text-text-muted mt-1 text-[10px] font-bold uppercase tracking-widest">
                    Кейсов и курсов
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
                  <Award className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xl font-black leading-none tracking-tight">98%</p>
                  <p className="text-text-muted mt-1 text-[10px] font-bold uppercase tracking-widest">
                    ROI обучения
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6">
          <Tabs defaultValue="courses" className="space-y-6">
            <div className="flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
              {/* cabinetSurface v1 */}
              <TabsList className={cn(cabinetSurface.tabsList, 'h-10 w-fit rounded-2xl')}>
                <TabsTrigger
                  value="courses"
                  className={cn(
                    cabinetSurface.tabsTrigger,
                    'data-[state=active]:button-glimmer data-[state=active]:button-professional hover:button-glimmer hover:button-professional rounded-xl px-6 text-[9px] font-bold uppercase tracking-widest transition-all hover:bg-black hover:text-white data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-xl'
                  )}
                >
                  Курсы и Программы
                </TabsTrigger>
                <TabsTrigger
                  value="wiki"
                  className={cn(
                    cabinetSurface.tabsTrigger,
                    'data-[state=active]:button-glimmer data-[state=active]:button-professional hover:button-glimmer hover:button-professional rounded-xl px-6 text-[9px] font-bold uppercase tracking-widest transition-all hover:bg-black hover:text-white data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-xl'
                  )}
                >
                  База Знаний (Wiki)
                </TabsTrigger>
                <TabsTrigger
                  value="tests"
                  className={cn(
                    cabinetSurface.tabsTrigger,
                    'data-[state=active]:button-glimmer data-[state=active]:button-professional hover:button-glimmer hover:button-professional rounded-xl px-6 text-[9px] font-bold uppercase tracking-widest transition-all hover:bg-black hover:text-white data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-xl'
                  )}
                >
                  Тесты и Аттестация
                </TabsTrigger>
                <TabsTrigger
                  value="live"
                  className={cn(
                    cabinetSurface.tabsTrigger,
                    'data-[state=active]:button-glimmer data-[state=active]:button-professional hover:button-glimmer hover:button-professional rounded-xl px-6 text-[9px] font-bold uppercase tracking-widest transition-all hover:bg-black hover:text-white data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-xl'
                  )}
                >
                  Live & Календарь
                </TabsTrigger>
                <TabsTrigger
                  value="team"
                  className={cn(
                    cabinetSurface.tabsTrigger,
                    'data-[state=active]:button-glimmer data-[state=active]:button-professional hover:button-glimmer hover:button-professional rounded-xl px-6 text-[9px] font-bold uppercase tracking-widest transition-all hover:bg-black hover:text-white data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-xl'
                  )}
                >
                  Обучение команды
                </TabsTrigger>
              </TabsList>

              <div className="group relative w-full md:w-80">
                <Search className="text-text-muted group-focus-within:text-accent-primary absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors" />
                <Input
                  placeholder="Поиск навыков и знаний..."
                  className="border-border-default focus:ring-accent-primary focus:border-accent-primary h-10 rounded-2xl pl-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <TabsContent value="courses" className="space-y-4 duration-500 animate-in fade-in">
              {/* Recommendations */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <Target className="text-accent-primary h-6 w-6" />
                  <h2 className="text-2xl font-black uppercase tracking-tight">
                    Рекомендовано для:{' '}
                    <span className="text-accent-primary italic">{viewRole.toUpperCase()}</span>
                  </h2>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {recommendedCourses.map((course) => (
                    <CourseCard key={course.id} course={course} featured />
                  ))}
                </div>
              </section>

              {/* All Courses with Filter */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="text-text-primary h-6 w-6" />
                    <h2 className="text-2xl font-black uppercase tracking-tight">Все программы</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                          'rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all',
                          activeCategory === cat
                            ? 'button-glimmer button-professional bg-black text-white shadow-xl'
                            : 'text-text-muted border-border-subtle hover:button-glimmer hover:button-professional border bg-white hover:bg-black hover:text-white'
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
                  <AnimatePresence mode="popLayout">
                    {filteredCourses.map((course) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={course.id}
                      >
                        <CourseCard course={course} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="wiki" className="space-y-6 duration-500 animate-in fade-in">
              <div className="grid gap-3 lg:grid-cols-12">
                {/* Categories Sidebar */}
                <div className="space-y-6 lg:col-span-3">
                  <Card className="rounded-xl border-none bg-white p-4 shadow-xl">
                    <h3 className="text-text-muted mb-6 text-xs font-bold uppercase italic tracking-widest">
                      Глоссарий терминов
                    </h3>
                    <div className="scrollbar-hide grid max-h-[400px] grid-cols-1 gap-2 overflow-y-auto pr-2">
                      {Object.entries(glossary).map(([abbr, info]) => (
                        <div
                          key={abbr}
                          className="bg-bg-surface2 border-border-subtle hover:border-accent-primary/30 group rounded-xl border p-3 transition-all"
                        >
                          <p className="text-accent-primary mb-1 text-[11px] font-black">{abbr}</p>
                          <p className="text-text-muted mb-2 text-[9px] font-bold uppercase leading-tight tracking-tighter">
                            {info.term}
                          </p>
                          <p className="text-text-secondary text-[10px] leading-snug">
                            {info.definition}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="bg-accent-primary relative overflow-hidden rounded-xl border-none p-4 text-white shadow-xl">
                    <HelpCircle className="absolute right-4 top-4 h-12 w-12 opacity-20" />
                    <h4 className="mb-2 text-xl font-black uppercase tracking-tight">
                      Нужна помощь?
                    </h4>
                    <p className="text-accent-primary/30 mb-6 text-sm font-medium uppercase leading-relaxed tracking-wider">
                      Наши аналитики помогут разобрать ваш кейс индивидуально.
                    </p>
                    <Button className="text-accent-primary hover:bg-accent-primary/10 h-12 w-full rounded-xl bg-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                      Запросить анализ
                    </Button>
                  </Card>
                </div>

                {/* Wiki Content */}
                <div className="space-y-4 lg:col-span-9">
                  <div className="grid gap-3 md:grid-cols-2">
                    {filteredArticles.map((article) => (
                      <Card
                        key={article.id}
                        className="group rounded-xl border-none bg-white shadow-xl transition-all duration-500 hover:shadow-2xl"
                      >
                        <CardHeader className="p-4 pb-4">
                          <div className="mb-4 flex items-center justify-between">
                            <Badge
                              variant="secondary"
                              className="bg-bg-surface2 text-text-secondary border-none px-2 py-0.5 text-[8px] font-black uppercase tracking-widest"
                            >
                              {article.category}
                            </Badge>
                            <span className="text-text-muted text-[9px] font-bold uppercase">
                              {format(new Date(article.updatedAt), 'd MMMM yyyy', { locale: ru })}
                            </span>
                          </div>
                          <CardTitle className="group-hover:text-accent-primary cursor-pointer text-xl font-black uppercase leading-none tracking-tight transition-colors md:text-2xl">
                            <GlossaryText text={article.title} />
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-text-secondary mb-6 text-sm font-medium leading-relaxed md:text-base">
                            <GlossaryText text={article.excerpt} />
                          </p>
                          <div className="mb-8 flex flex-wrap gap-2">
                            {article.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-accent-primary bg-accent-primary/10 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <div className="border-border-subtle flex items-center justify-between border-t pt-6">
                            <div className="flex items-center gap-3">
                              <div className="bg-bg-surface2 flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black uppercase">
                                {article.authorName.charAt(0)}
                              </div>
                              <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                                {article.authorName}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:text-accent-primary p-0 text-[9px] font-bold uppercase tracking-widest hover:bg-transparent"
                            >
                              Читать полностью <ExternalLink className="ml-2 h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tests" className="space-y-6 duration-500 animate-in fade-in">
              <div className="grid gap-3 md:grid-cols-3">
                {mockAssessments.map((assessment) => (
                  <Card
                    key={assessment.id}
                    className="group flex flex-col rounded-xl border-none bg-white p-3 shadow-xl transition-all duration-500 hover:shadow-2xl"
                  >
                    <div className="mb-8 flex items-start justify-between">
                      <div className="bg-bg-surface2 group-hover:bg-accent-primary/10 flex h-10 w-10 items-center justify-center rounded-2xl transition-colors">
                        <GraduationCap className="text-text-muted group-hover:text-accent-primary h-8 w-8 transition-colors" />
                      </div>
                      <Badge
                        variant="outline"
                        className="border-border-subtle text-[9px] font-bold uppercase tracking-widest"
                      >
                        {assessment.category}
                      </Badge>
                    </div>
                    <h3 className="mb-4 text-xl font-black uppercase leading-none tracking-tight">
                      <GlossaryText text={assessment.title} />
                    </h3>
                    <p className="text-text-secondary mb-5 flex-grow text-sm font-medium leading-relaxed md:text-base">
                      <GlossaryText text={assessment.description} />
                    </p>

                    <div className="mb-5 space-y-4">
                      <div className="text-text-muted flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span>Вопросов:</span>
                        <span className="text-text-primary">{assessment.questions.length}</span>
                      </div>
                      <div className="text-text-muted flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span>Проходной балл:</span>
                        <span className="text-accent-primary">{assessment.passingScore}%</span>
                      </div>
                      <div className="text-text-muted flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span>Время:</span>
                        <span className="text-text-primary">
                          {assessment.timeLimitMinutes || 'Без лимита'} мин.
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => startTest(assessment)}
                      className="bg-text-primary hover:bg-accent-primary h-10 w-full rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white transition-all"
                    >
                      Начать аттестацию
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="live" className="space-y-6 duration-500 animate-in fade-in">
              <div className="grid gap-3 lg:grid-cols-12">
                <div className="space-y-5 lg:col-span-8">
                  {/* Active/Next Broadcast */}
                  <Card className="bg-text-primary relative flex min-h-[400px] items-center overflow-hidden rounded-xl border-none p-4 text-white shadow-2xl">
                    <div className="absolute inset-0 opacity-40">
                      <Image
                        src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200"
                        alt="Live"
                        fill
                        className="object-cover"
                      />
                      <div className="from-text-primary via-text-primary/80 absolute inset-0 bg-gradient-to-r to-transparent" />
                    </div>
                    <div className="relative z-10 max-w-lg">
                      <Badge className="mb-6 flex w-fit animate-pulse items-center gap-2 border-none bg-red-600 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" /> Live Stream
                      </Badge>
                      <h2 className="mb-4 text-2xl font-black uppercase leading-none tracking-tight md:text-4xl">
                        SS26 Market Forecast: <br />
                        <span className="text-accent-primary italic">Live Analysis</span>
                      </h2>
                      <p className="text-text-muted mb-8 max-w-md text-sm font-medium leading-relaxed md:text-base">
                        Присоединяйтесь к ежегодному разбору прогнозов спроса. Анализ на основе
                        120M+ транзакций партнеров платформы.
                      </p>
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex items-center gap-3">
                          <CalendarIcon className="text-accent-primary h-5 w-5" />
                          <span className="text-xs font-bold uppercase tracking-widest">
                            Сегодня в 15:00
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="text-accent-primary h-5 w-5" />
                          <span className="text-xs font-bold uppercase tracking-widest">
                            1,240 Байеров онлайн
                          </span>
                        </div>
                      </div>
                      <Button className="text-text-primary hover:bg-bg-surface2 h-10 rounded-2xl bg-white px-10 text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-white/5">
                        <Video className="mr-2 h-4 w-4" /> Перейти к трансляции
                      </Button>
                    </div>
                  </Card>

                  {/* Upcoming Events */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-black uppercase tracking-tight">
                      Предстоящие события
                    </h3>
                    <div className="space-y-4">
                      {mockAcademyEvents.slice(1).map((event) => (
                        <Card
                          key={event.id}
                          className="hover:bg-bg-surface2 flex items-center justify-between rounded-xl border-none bg-white p-4 shadow-xl transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-accent-primary/10 text-accent-primary flex h-14 w-14 flex-col items-center justify-center rounded-2xl">
                              <span className="text-lg font-black leading-none">
                                {format(new Date(event.startTime), 'dd')}
                              </span>
                              <span className="mt-1 text-[11px] font-black uppercase">
                                {format(new Date(event.startTime), 'MMM')}
                              </span>
                            </div>
                            <div>
                              <div className="mb-1 flex items-center gap-3">
                                <Badge
                                  variant="outline"
                                  className="border-border-default text-text-muted text-[9px] font-bold uppercase tracking-widest"
                                >
                                  {event.type}
                                </Badge>
                                <span className="text-text-muted text-[11px] font-bold uppercase tracking-widest">
                                  {format(new Date(event.startTime), 'HH:mm')} -{' '}
                                  {format(new Date(event.endTime), 'HH:mm')}
                                </span>
                              </div>
                              <h4 className="group-hover:text-accent-primary text-base font-black uppercase leading-tight tracking-tight transition-colors md:text-lg">
                                {event.title}
                              </h4>
                              <p className="text-text-muted mt-1 text-[11px] font-bold uppercase tracking-widest">
                                Хост: {event.hostName}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="border-border-default h-12 rounded-xl px-6 text-[9px] font-bold uppercase tracking-widest"
                          >
                            В календарь
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4">
                  <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black uppercase tracking-tight">
                        Тренажеры и Задачи
                      </h3>
                      <Badge className="bg-accent-primary/10 text-accent-primary h-5 border-none px-2 text-[10px] font-black uppercase">
                        New
                      </Badge>
                    </div>
                    <div className="space-y-6">
                      {[
                        {
                          title: 'Расчет маржинальности SS25',
                          type: 'Экономика',
                          difficulty: 'Middle',
                          points: 150,
                        },
                        {
                          title: 'Оптимизация Tech-Pack для AI',
                          type: 'Производство',
                          difficulty: 'Senior',
                          points: 300,
                        },
                        {
                          title: 'Кейс: Логистика в условиях кризиса',
                          type: 'Менеджмент',
                          difficulty: 'Pro',
                          points: 500,
                        },
                      ].map((task, i) => (
                        <div
                          key={i}
                          className="border-border-subtle hover:border-accent-primary/30 hover:bg-bg-surface2 group cursor-pointer rounded-2xl border p-4 transition-all"
                        >
                          <div className="mb-3 flex items-start justify-between">
                            <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                              {task.type}
                            </span>
                            <Badge
                              variant="outline"
                              className="border-border-default h-5 px-2 text-[9px] font-black uppercase"
                            >
                              {task.difficulty}
                            </Badge>
                          </div>
                          <h5 className="text-text-primary group-hover:text-accent-primary mb-4 text-base font-black uppercase tracking-tight transition-colors">
                            {task.title}
                          </h5>
                          <div className="flex items-center justify-between">
                            <span className="text-accent-primary text-xs font-black">
                              +{task.points} SP
                            </span>
                            <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                              Начать →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button className="bg-text-primary hover:bg-accent-primary mt-4 h-12 w-full rounded-2xl text-[11px] font-bold uppercase tracking-widest text-white shadow-xl transition-all">
                      Все задачи и кейсы
                    </Button>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="team" className="duration-500 animate-in fade-in">
              <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl">
                <CardHeader className="border-border-subtle border-b p-6">
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <div>
                      <CardTitle className="mb-2 text-xl font-black uppercase tracking-tight md:text-2xl">
                        Планирование обучения
                      </CardTitle>
                      <CardDescription className="text-text-secondary text-sm font-medium">
                        Создайте системный план развития компетенций для каждого отдела.
                      </CardDescription>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="border-border-default hover:bg-bg-surface2 h-11 rounded-2xl px-8 text-[11px] font-bold uppercase tracking-widest shadow-sm"
                      >
                        <BarChart className="h-4.5 w-4.5 mr-2" /> Аналитика команды
                      </Button>
                      <Button className="bg-text-primary hover:bg-accent-primary h-11 rounded-2xl px-8 text-[11px] font-bold uppercase tracking-widest shadow-lg transition-all">
                        <PlusCircle className="h-4.5 w-4.5 mr-2" /> Назначить обучение
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-border-subtle divide-y">
                    {[
                      {
                        name: 'Дмитрий Соколов',
                        role: 'Менеджер закупок',
                        progress: 65,
                        course: 'B2B Fashion Economics',
                        status: 'In Progress',
                        nextDeadline: '12 Фев',
                      },
                      {
                        name: 'Анна Павлова',
                        role: 'Дизайнер',
                        progress: 100,
                        course: 'AI in Fashion Design',
                        status: 'Completed',
                        nextDeadline: '-',
                      },
                      {
                        name: 'Иван Сергеев',
                        role: 'Аналитик',
                        progress: 12,
                        course: 'Strategic Brand Building',
                        status: 'In Progress',
                        nextDeadline: '15 Фев',
                      },
                    ].map((member, i) => (
                      <div
                        key={i}
                        className="hover:bg-bg-surface2 flex flex-col items-center justify-between gap-3 p-3 transition-colors md:flex-row"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-bg-surface2 text-text-muted border-border-default relative flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner">
                            <Users className="h-7 w-7" />
                            <div
                              className={cn(
                                'absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white shadow-sm',
                                member.progress === 100 ? 'bg-emerald-500' : 'bg-accent-primary'
                              )}
                            />
                          </div>
                          <div>
                            <p className="text-text-primary text-base font-black uppercase leading-none tracking-tight">
                              {member.name}
                            </p>
                            <p className="text-text-muted mt-1.5 text-[11px] font-bold uppercase tracking-widest">
                              {member.role}
                            </p>
                          </div>
                        </div>
                        <div className="mx-12 max-w-md flex-1">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-text-muted text-[11px] font-bold uppercase tracking-widest">
                              {member.course}
                            </p>
                            <p className="text-accent-primary text-[11px] font-bold uppercase tracking-widest">
                              {member.progress}%
                            </p>
                          </div>
                          <div className="bg-bg-surface2 h-3 w-full overflow-hidden rounded-full">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all duration-1000',
                                member.progress === 100 ? 'bg-emerald-500' : 'bg-accent-primary'
                              )}
                              style={{ width: `${member.progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                          <div className="hidden xl:block">
                            <p className="text-text-muted mb-1 text-[9px] font-bold uppercase tracking-widest">
                              Дедлайн
                            </p>
                            <p className="text-xs font-black uppercase">{member.nextDeadline}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              className={cn(
                                'rounded-xl border-none px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest',
                                member.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                              )}
                            >
                              {member.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:border-border-subtle h-12 w-12 rounded-2xl border border-transparent hover:bg-white"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-bg-surface2 flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                      <CalendarIcon className="text-text-muted h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-text-primary text-base font-black uppercase leading-none tracking-tight">
                        Ближайшая аттестация отдела
                      </p>
                      <p className="text-text-muted mt-1.5 text-[11px] font-bold uppercase tracking-widest">
                        20 Февраля • 14:00 • Дизайн-студия
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="link"
                    className="text-accent-primary text-[10px] font-bold uppercase tracking-widest"
                  >
                    Перейти в календарь обучения →
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Assessment Modal */}
        <Dialog open={!!activeAssessment} onOpenChange={() => setActiveAssessment(null)}>
          <DialogContent className="rounded-xl p-4 sm:max-w-2xl">
            {activeAssessment && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-accent-primary mb-1 text-[10px] font-bold uppercase tracking-widest">
                      Аттестация: {activeAssessment.title}
                    </p>
                    <h3 className="text-base font-black uppercase tracking-tight">
                      Вопрос {currentQuestionIndex + 1} из {activeAssessment.questions.length}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-text-muted mb-1 text-[10px] font-bold uppercase tracking-widest">
                      Прогресс
                    </p>
                    <p className="text-sm font-black">
                      {Math.round(
                        ((currentQuestionIndex + 1) / activeAssessment.questions.length) * 100
                      )}
                      %
                    </p>
                  </div>
                </div>

                <Progress
                  value={((currentQuestionIndex + 1) / activeAssessment.questions.length) * 100}
                  className="h-2 rounded-full"
                />

                <div className="space-y-4">
                  <p className="text-sm font-black uppercase leading-tight tracking-tight">
                    {activeAssessment.questions[currentQuestionIndex].text}
                  </p>

                  <div className="space-y-3">
                    {activeAssessment.questions[currentQuestionIndex].options.map(
                      (option: string) => (
                        <button
                          key={option}
                          onClick={() =>
                            handleAnswer(
                              activeAssessment.questions[currentQuestionIndex].id,
                              option
                            )
                          }
                          className={cn(
                            'w-full rounded-2xl border-2 p-4 text-left text-xs font-bold uppercase tracking-tight transition-all',
                            answers[activeAssessment.questions[currentQuestionIndex].id] === option
                              ? 'border-accent-primary bg-accent-primary/10 text-accent-primary shadow-lg'
                              : 'border-border-subtle hover:border-border-default text-text-secondary'
                          )}
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button
                    variant="ghost"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                    className="text-[10px] font-bold uppercase tracking-widest"
                  >
                    Назад
                  </Button>
                  {currentQuestionIndex === activeAssessment.questions.length - 1 ? (
                    <Button
                      onClick={finishTest}
                      disabled={!answers[activeAssessment.questions[currentQuestionIndex].id]}
                      className="bg-accent-primary hover:bg-accent-primary h-12 rounded-2xl px-8 text-[10px] font-bold uppercase tracking-widest text-white"
                    >
                      Завершить тест
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      disabled={!answers[activeAssessment.questions[currentQuestionIndex].id]}
                      className="bg-text-primary h-12 rounded-2xl px-8 text-[10px] font-bold uppercase tracking-widest text-white"
                    >
                      Следующий вопрос
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Result Modal */}
        <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
          <DialogContent className="rounded-xl p-4 text-center sm:max-w-md">
            <div className="space-y-4">
              <div
                className={cn(
                  'mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-xl',
                  testScore >= 80 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                )}
              >
                {testScore >= 80 ? (
                  <Check className="h-12 w-12" />
                ) : (
                  <CloseIcon className="h-12 w-12" />
                )}
              </div>
              <div>
                <h3 className="mb-2 text-xs font-black uppercase tracking-tight">
                  {testScore >= 80 ? 'Поздравляем!' : 'Нужно подтянуть знания'}
                </h3>
                <p className="text-text-secondary font-medium">
                  {testScore >= 80
                    ? 'Вы успешно прошли аттестацию и подтвердили свои навыки.'
                    : 'К сожалению, вы не набрали достаточное количество баллов для сертификации.'}
                </p>
              </div>
              <div className="bg-bg-surface2 rounded-xl p-4">
                <p className="text-text-muted mb-2 text-[10px] font-bold uppercase tracking-widest">
                  Ваш результат
                </p>
                <p className="text-text-primary text-base font-black">{testScore}%</p>
              </div>
              <Button
                onClick={() => setIsResultOpen(false)}
                className="bg-text-primary h-10 w-full rounded-2xl text-[11px] font-bold uppercase tracking-widest"
              >
                {testScore >= 80 ? 'Получить сертификат' : 'Вернуться к курсу'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

function CourseCard({ course, featured }: { course: any; featured?: boolean }) {
  const categoryMap: Record<string, string> = {
    economics: 'Экономика',
    design: 'Дизайн',
    production: 'Производство',
    analytics: 'Аналитика',
    management: 'Менеджмент',
    retail: 'Ритейл',
    legal: 'Право',
  };

  return (
    <Card
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-xl border-none bg-white shadow-xl transition-all duration-500 hover:shadow-2xl',
        featured && 'ring-accent-primary/20 ring-2'
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="from-text-primary/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {course.isNew && (
            <Badge className="border-none bg-emerald-500 px-2 py-0.5 text-[8px] font-black uppercase text-white shadow-lg">
              НОВОЕ
            </Badge>
          )}
          {course.isRecommended && (
            <Badge className="bg-accent-primary border-none px-2 py-0.5 text-[8px] font-black uppercase text-white shadow-lg">
              РЕКОМЕНДОВАНО
            </Badge>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex translate-y-4 items-center justify-between opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            size="sm"
            className="text-text-primary hover:bg-bg-surface2 h-10 rounded-xl bg-white px-5 text-[9px] font-bold uppercase tracking-widest shadow-xl"
          >
            <PlayCircle className="fill-text-primary mr-2 h-4 w-4 text-white" /> Смотреть
          </Button>
          <div className="bg-text-primary/50 flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-white backdrop-blur-md">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-black">{course.rating}</span>
          </div>
        </div>
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="mb-4 flex items-center justify-between">
          <Badge
            variant="outline"
            className="border-border-subtle text-text-muted px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-widest"
          >
            {categoryMap[course.category] || course.category}
          </Badge>
          <div className="text-text-muted flex items-center text-[10px] font-bold uppercase tracking-widest">
            <Clock className="text-accent-primary mr-1.5 h-3.5 w-3.5" /> {course.duration}
          </div>
        </div>
        <CardTitle className="group-hover:text-accent-primary text-sm font-black uppercase leading-tight tracking-tight transition-colors">
          <GlossaryText text={course.title} />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-2">
        <p className="text-text-secondary mb-6 line-clamp-2 text-sm font-medium leading-relaxed">
          <GlossaryText text={course.description} />
        </p>
        <div className="border-border-subtle flex flex-col gap-3 border-t pt-6">
          <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
            В комплекте:
          </p>
          <div className="flex flex-wrap gap-2">
            {course.media?.map((m: any, i: number) => (
              <div
                key={i}
                className="bg-bg-surface2 border-border-subtle group/media flex items-center gap-2 rounded-xl border px-3 py-1.5"
              >
                {m.type === 'video' ? (
                  <Video className="text-accent-primary h-3 w-3" />
                ) : (
                  <FileText className="text-accent-primary h-3 w-3" />
                )}
                <span className="text-text-secondary text-[9px] font-bold uppercase tracking-tight">
                  {m.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-border-subtle mt-auto flex items-center justify-between border-t p-4 pt-0 pt-6">
        <div className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
          {course.provider}
        </div>
        <div className="text-text-primary bg-bg-surface2 border-border-subtle flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest">
          <Users className="text-accent-primary h-3.5 w-3.5" /> {course.studentsCount}
        </div>
      </CardFooter>
    </Card>
  );
}

function LearningPathCard({ path }: { path: any }) {
  return (
    <Card className="from-text-primary to-text-primary group overflow-hidden rounded-xl border-none bg-gradient-to-br text-white shadow-2xl">
      <div className="relative z-10 p-3">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
            <TrendingUp className="text-accent-primary h-8 w-8" />
          </div>
          <Badge className="bg-accent-primary/20 text-accent-primary border-accent-primary/30 border px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest">
            Траектория обучения
          </Badge>
        </div>
        <h3 className="mb-4 text-xs font-black uppercase tracking-tight">{path.title}</h3>
        <p className="text-text-muted mb-5 max-w-sm font-medium leading-relaxed">
          {path.description}
        </p>

        <div className="mb-6 space-y-6">
          {path.courses.map((courseId: string, i: number) => {
            const course = mockCourses.find((c) => c.id === courseId);
            return (
              <div key={courseId} className="group/item flex items-center gap-3">
                <div className="text-accent-primary group-hover/item:bg-accent-primary flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-black transition-all group-hover/item:text-white">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black uppercase tracking-tight text-white/90 transition-transform group-hover/item:translate-x-1">
                    {course?.title}
                  </p>
                  <p className="text-text-secondary text-[9px] font-bold uppercase tracking-widest">
                    {course?.duration}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
              <Award className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-text-secondary mb-1 text-[9px] font-bold uppercase leading-none tracking-widest">
                Результат
              </p>
              <p className="text-xs font-bold leading-none text-emerald-400">{path.outcome}</p>
            </div>
          </div>
          <Button className="text-text-primary hover:bg-bg-surface2 h-12 rounded-2xl bg-white px-6 text-[10px] font-bold uppercase tracking-widest">
            Начать путь
          </Button>
        </div>
      </div>
      <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5 transition-transform duration-1000 group-hover:scale-110">
        <GraduationCap className="h-64 w-64" />
      </div>
    </Card>
  );
}
