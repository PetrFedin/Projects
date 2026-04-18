'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
  X as CloseIcon
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { useUIState } from '@/providers/ui-state';
import { mockCourses, mockLearningPaths, mockArticles, mockAcademyEvents, mockAssessments } from '@/lib/education-data';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
                <span className="cursor-help border-b border-dotted border-accent-primary/40 text-accent-primary font-bold px-0.5 hover:bg-accent-primary/10 transition-colors">
                  {part}
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-[280px] p-4 rounded-xl bg-text-primary border-text-primary/30 text-white shadow-2xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent-primary mb-1">{entry.term}</p>
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

  const categories = ['Все', 'Экономика', 'Дизайн', 'Производство', 'Аналитика', 'Менеджмент', 'Ритейл', 'Право'];

  const filteredCourses = useMemo(() => {
    return mockCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const categoryMap: Record<string, string> = {
        'Все': 'All',
        'Экономика': 'economics',
        'Дизайн': 'design',
        'Производство': 'production',
        'Аналитика': 'analytics',
        'Менеджмент': 'management',
        'Ритейл': 'retail',
        'Право': 'legal'
      };
      const targetCategory = categoryMap[activeCategory];
      const matchesCategory = activeCategory === 'Все' || course.category.toLowerCase() === targetCategory?.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const filteredArticles = useMemo(() => {
    return mockArticles.filter(art => 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const recommendedCourses = useMemo(() => {
    return mockCourses.filter(c => c.targetRoles.includes(viewRole) || c.isRecommended).slice(0, 3);
  }, [viewRole]);

  const startTest = (assessment: any) => {
    setActiveAssessment(assessment);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
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
      title: score >= activeAssessment.passingScore ? "Тест пройден!" : "Тест не пройден",
      description: `Ваш результат: ${score}% (Минимум: ${activeAssessment.passingScore}%)`,
      variant: score >= activeAssessment.passingScore ? "default" : "destructive"
    });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <div className="bg-text-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#4f46e5_0%,transparent_50%)]" />
        </div>
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 pt-6 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="h-2.5 w-2.5" />
              <span className="text-accent-primary">Academy</span>
          </div>
          <div className="max-w-3xl pb-10">
            <Badge className="bg-accent-primary hover:bg-accent-primary text-white border-none mb-6 px-4 py-1 font-bold uppercase tracking-widest text-[10px]">
              Syntha Unified Academy
            </Badge>
            <h1 className="text-xl md:text-3xl font-semibold uppercase tracking-tight leading-none mb-6">
              Интеллектуальный <br />
              <span className="text-accent-primary italic">Базис Знаний</span>
            </h1>
            <p className="text-base text-text-muted font-medium leading-relaxed mb-8 max-w-2xl">
              Единая экосистема обучения: от Wiki-статей и файлов до живых трансляций и глубокой аналитики кейсов. 
              Доступно для всех ролей в рамках корпоративной подписки.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-white text-text-primary hover:bg-bg-surface2 rounded-2xl h-10 px-8 font-bold uppercase tracking-widest text-[11px]">
                Начать обучение
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white rounded-2xl h-10 px-8 font-bold uppercase tracking-widest text-[11px]">
                Добавить контент
              </Button>
            </div>
          </div>
        </div>
        {/* Stats bar */}
        <div className="bg-white/5 border-t border-white/10 backdrop-blur-md">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent-primary/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-accent-primary" />
              </div>
              <div>
                <p className="text-xl font-black leading-none tracking-tight">12,400+</p>
                <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest mt-1">Студентов</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xl font-black leading-none tracking-tight">450+</p>
                <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest mt-1">Кейсов и курсов</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Award className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xl font-black leading-none tracking-tight">98%</p>
                <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest mt-1">ROI обучения</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-4">
        <Tabs defaultValue="courses" className="space-y-6">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            {/* cabinetSurface v1 */}
            <TabsList className={cn(cabinetSurface.tabsList, 'h-10 w-fit rounded-2xl')}>
              <TabsTrigger value="courses" className={cn(cabinetSurface.tabsTrigger, 'rounded-xl px-6 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:button-glimmer data-[state=active]:button-professional hover:bg-black hover:text-white hover:button-glimmer hover:button-professional')}>
                Курсы и Программы
              </TabsTrigger>
              <TabsTrigger value="wiki" className={cn(cabinetSurface.tabsTrigger, 'rounded-xl px-6 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:button-glimmer data-[state=active]:button-professional hover:bg-black hover:text-white hover:button-glimmer hover:button-professional')}>
                База Знаний (Wiki)
              </TabsTrigger>
              <TabsTrigger value="tests" className={cn(cabinetSurface.tabsTrigger, 'rounded-xl px-6 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:button-glimmer data-[state=active]:button-professional hover:bg-black hover:text-white hover:button-glimmer hover:button-professional')}>
                Тесты и Аттестация
              </TabsTrigger>
              <TabsTrigger value="live" className={cn(cabinetSurface.tabsTrigger, 'rounded-xl px-6 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:button-glimmer data-[state=active]:button-professional hover:bg-black hover:text-white hover:button-glimmer hover:button-professional')}>
                Live & Календарь
              </TabsTrigger>
              <TabsTrigger value="team" className={cn(cabinetSurface.tabsTrigger, 'rounded-xl px-6 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:button-glimmer data-[state=active]:button-professional hover:bg-black hover:text-white hover:button-glimmer hover:button-professional')}>
                Обучение команды
              </TabsTrigger>
            </TabsList>

            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-accent-primary transition-colors" />
              <Input 
                placeholder="Поиск навыков и знаний..." 
                className="h-10 pl-12 rounded-2xl border-border-default focus:ring-accent-primary focus:border-accent-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="courses" className="space-y-4 animate-in fade-in duration-500">
            {/* Recommendations */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-accent-primary" />
                <h2 className="text-2xl font-black uppercase tracking-tight">Рекомендовано для: <span className="text-accent-primary italic">{viewRole.toUpperCase()}</span></h2>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                {recommendedCourses.map(course => (
                  <CourseCard key={course.id} course={course} featured />
                ))}
              </div>
            </section>

            {/* All Courses with Filter */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-text-primary" />
                  <h2 className="text-2xl font-black uppercase tracking-tight">Все программы</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                        activeCategory === cat 
                          ? "bg-black text-white shadow-xl button-glimmer button-professional" 
                          : "bg-white text-text-muted border border-border-subtle hover:bg-black hover:text-white hover:button-glimmer hover:button-professional"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                <AnimatePresence mode="popLayout">
                  {filteredCourses.map(course => (
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

          <TabsContent value="wiki" className="space-y-6 animate-in fade-in duration-500">
            <div className="grid lg:grid-cols-12 gap-3">
              {/* Categories Sidebar */}
              <div className="lg:col-span-3 space-y-6">
                <Card className="rounded-xl border-none shadow-xl bg-white p-4">
                  <h3 className="font-bold uppercase tracking-widest text-xs mb-6 text-text-muted italic">Глоссарий терминов</h3>
                  <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                    {Object.entries(glossary).map(([abbr, info]) => (
                      <div key={abbr} className="p-3 rounded-xl bg-bg-surface2 border border-border-subtle hover:border-accent-primary/30 transition-all group">
                        <p className="text-[11px] font-black text-accent-primary mb-1">{abbr}</p>
                        <p className="text-[9px] font-bold text-text-muted uppercase leading-tight mb-2 tracking-tighter">{info.term}</p>
                        <p className="text-[10px] text-text-secondary leading-snug">{info.definition}</p>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="rounded-xl border-none shadow-xl bg-accent-primary text-white p-4 relative overflow-hidden">
                  <HelpCircle className="absolute top-4 right-4 h-12 w-12 opacity-20" />
                  <h4 className="text-xl font-black uppercase tracking-tight mb-2">Нужна помощь?</h4>
                  <p className="text-sm font-medium text-accent-primary/30 mb-6 uppercase tracking-wider leading-relaxed">Наши аналитики помогут разобрать ваш кейс индивидуально.</p>
                  <Button className="w-full bg-white text-accent-primary hover:bg-accent-primary/10 rounded-xl font-black uppercase text-[10px] h-12 tracking-widest shadow-xl">
                    Запросить анализ
                  </Button>
                </Card>
              </div>

              {/* Wiki Content */}
              <div className="lg:col-span-9 space-y-4">
                <div className="grid md:grid-cols-2 gap-3">
                  {filteredArticles.map(article => (
                    <Card key={article.id} className="rounded-xl border-none shadow-xl bg-white hover:shadow-2xl transition-all duration-500 group">
                      <CardHeader className="p-4 pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="secondary" className="bg-bg-surface2 text-text-secondary border-none font-black uppercase text-[8px] tracking-widest px-2 py-0.5">{article.category}</Badge>
                          <span className="text-[9px] text-text-muted font-bold uppercase">{format(new Date(article.updatedAt), "d MMMM yyyy", { locale: ru })}</span>
                        </div>
                        <CardTitle className="text-xl md:text-2xl font-black uppercase tracking-tight leading-none group-hover:text-accent-primary transition-colors cursor-pointer">
                          <GlossaryText text={article.title} />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm md:text-base text-text-secondary font-medium leading-relaxed mb-6">
                          <GlossaryText text={article.excerpt} />
                        </p>
                        <div className="flex flex-wrap gap-2 mb-8">
                          {article.tags.map(tag => (
                            <span key={tag} className="text-[9px] font-black text-accent-primary bg-accent-primary/10 px-2.5 py-1 rounded-lg uppercase">#{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-border-subtle">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-bg-surface2 flex items-center justify-center text-[10px] font-black uppercase">{article.authorName.charAt(0)}</div>
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{article.authorName}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="font-bold uppercase tracking-widest text-[9px] hover:text-accent-primary hover:bg-transparent p-0">
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

          <TabsContent value="tests" className="space-y-6 animate-in fade-in duration-500">
            <div className="grid md:grid-cols-3 gap-3">
              {mockAssessments.map(assessment => (
                <Card key={assessment.id} className="rounded-xl border-none shadow-xl bg-white p-3 flex flex-col group hover:shadow-2xl transition-all duration-500">
                  <div className="flex justify-between items-start mb-8">
                    <div className="h-10 w-10 rounded-2xl bg-bg-surface2 flex items-center justify-center group-hover:bg-accent-primary/10 transition-colors">
                      <GraduationCap className="h-8 w-8 text-text-muted group-hover:text-accent-primary transition-colors" />
                    </div>
                    <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-border-subtle">
                      {assessment.category}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-4 leading-none">
                    <GlossaryText text={assessment.title} />
                  </h3>
                  <p className="text-sm md:text-base text-text-secondary font-medium mb-5 leading-relaxed flex-grow">
                    <GlossaryText text={assessment.description} />
                  </p>
                  
                  <div className="space-y-4 mb-5">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-text-muted">
                      <span>Вопросов:</span>
                      <span className="text-text-primary">{assessment.questions.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-text-muted">
                      <span>Проходной балл:</span>
                      <span className="text-accent-primary">{assessment.passingScore}%</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-text-muted">
                      <span>Время:</span>
                      <span className="text-text-primary">{assessment.timeLimitMinutes || 'Без лимита'} мин.</span>
                    </div>
                  </div>

                  <Button onClick={() => startTest(assessment)} className="w-full h-10 rounded-2xl bg-text-primary text-white font-bold uppercase tracking-widest text-[10px] hover:bg-accent-primary transition-all">
                    Начать аттестацию
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="live" className="space-y-6 animate-in fade-in duration-500">
            <div className="grid lg:grid-cols-12 gap-3">
              <div className="lg:col-span-8 space-y-5">
                {/* Active/Next Broadcast */}
                <Card className="rounded-xl border-none shadow-2xl bg-text-primary text-white overflow-hidden relative min-h-[400px] flex items-center p-4">
                  <div className="absolute inset-0 opacity-40">
                    <Image src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200" alt="Live" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-text-primary via-text-primary/80 to-transparent" />
                  </div>
                  <div className="relative z-10 max-w-lg">
                    <Badge className="bg-red-600 text-white border-none mb-6 animate-pulse px-4 py-1 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 w-fit">
                      <div className="h-1.5 w-1.5 rounded-full bg-white" /> Live Stream
                    </Badge>
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-none mb-4">SS26 Market Forecast: <br /><span className="text-accent-primary italic">Live Analysis</span></h2>
                    <p className="text-sm md:text-base text-text-muted font-medium mb-8 leading-relaxed max-w-md">Присоединяйтесь к ежегодному разбору прогнозов спроса. Анализ на основе 120M+ транзакций партнеров платформы.</p>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="h-5 w-5 text-accent-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest">Сегодня в 15:00</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-accent-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest">1,240 Байеров онлайн</span>
                      </div>
                    </div>
                    <Button className="bg-white text-text-primary hover:bg-bg-surface2 rounded-2xl h-10 px-10 font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-white/5">
                      <Video className="mr-2 h-4 w-4" /> Перейти к трансляции
                    </Button>
                  </div>
                </Card>

                {/* Upcoming Events */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-black uppercase tracking-tight">Предстоящие события</h3>
                  <div className="space-y-4">
                    {mockAcademyEvents.slice(1).map(event => (
                      <Card key={event.id} className="rounded-xl border-none shadow-xl bg-white p-4 flex items-center justify-between hover:bg-bg-surface2 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center justify-center h-14 w-14 rounded-2xl bg-accent-primary/10 text-accent-primary">
                            <span className="text-lg font-black leading-none">{format(new Date(event.startTime), "dd")}</span>
                            <span className="text-[11px] font-black uppercase mt-1">{format(new Date(event.startTime), "MMM")}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-border-default text-text-muted">{event.type}</Badge>
                              <span className="text-[11px] text-text-muted font-bold uppercase tracking-widest">{format(new Date(event.startTime), "HH:mm")} - {format(new Date(event.endTime), "HH:mm")}</span>
                            </div>
                            <h4 className="text-base md:text-lg font-black uppercase tracking-tight group-hover:text-accent-primary transition-colors leading-tight">{event.title}</h4>
                            <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mt-1">Хост: {event.hostName}</p>
                          </div>
                        </div>
                        <Button variant="outline" className="rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-[9px] border-border-default">
                          В календарь
                        </Button>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4">
                <Card className="rounded-xl border-none shadow-2xl bg-white p-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black uppercase tracking-tight">Тренажеры и Задачи</h3>
                    <Badge className="bg-accent-primary/10 text-accent-primary border-none font-black uppercase text-[10px] px-2 h-5">New</Badge>
                  </div>
                  <div className="space-y-6">
                    {[
                      { title: 'Расчет маржинальности SS25', type: 'Экономика', difficulty: 'Middle', points: 150 },
                      { title: 'Оптимизация Tech-Pack для AI', type: 'Производство', difficulty: 'Senior', points: 300 },
                      { title: 'Кейс: Логистика в условиях кризиса', type: 'Менеджмент', difficulty: 'Pro', points: 500 }
                    ].map((task, i) => (
                      <div key={i} className="group p-4 rounded-2xl border border-border-subtle hover:border-accent-primary/30 hover:bg-bg-surface2 transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{task.type}</span>
                          <Badge variant="outline" className="text-[9px] font-black uppercase border-border-default h-5 px-2">{task.difficulty}</Badge>
                        </div>
                        <h5 className="text-base font-black uppercase tracking-tight text-text-primary group-hover:text-accent-primary transition-colors mb-4">{task.title}</h5>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-accent-primary">+{task.points} SP</span>
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Начать →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full h-12 rounded-2xl bg-text-primary text-white font-bold uppercase tracking-widest text-[11px] shadow-xl hover:bg-accent-primary transition-all mt-4">
                    Все задачи и кейсы
                  </Button>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="animate-in fade-in duration-500">
            <Card className="rounded-xl border-none shadow-2xl overflow-hidden bg-white">
              <CardHeader className="p-6 border-b border-border-subtle">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-black uppercase tracking-tight mb-2">Планирование обучения</CardTitle>
                    <CardDescription className="text-text-secondary text-sm font-medium">Создайте системный план развития компетенций для каждого отдела.</CardDescription>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="rounded-2xl h-11 px-8 border-border-default font-bold uppercase tracking-widest text-[11px] shadow-sm hover:bg-bg-surface2">
                      <BarChart className="mr-2 h-4.5 w-4.5" /> Аналитика команды
                    </Button>
                    <Button className="rounded-2xl h-11 px-8 bg-text-primary font-bold uppercase tracking-widest text-[11px] shadow-lg hover:bg-accent-primary transition-all">
                      <PlusCircle className="mr-2 h-4.5 w-4.5" /> Назначить обучение
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border-subtle">
                  {[
                    { name: 'Дмитрий Соколов', role: 'Менеджер закупок', progress: 65, course: 'B2B Fashion Economics', status: 'In Progress', nextDeadline: '12 Фев' },
                    { name: 'Анна Павлова', role: 'Дизайнер', progress: 100, course: 'AI in Fashion Design', status: 'Completed', nextDeadline: '-' },
                    { name: 'Иван Сергеев', role: 'Аналитик', progress: 12, course: 'Strategic Brand Building', status: 'In Progress', nextDeadline: '15 Фев' }
                  ].map((member, i) => (
                    <div key={i} className="p-3 flex flex-col md:flex-row items-center justify-between hover:bg-bg-surface2 transition-colors gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-bg-surface2 flex items-center justify-center text-text-muted relative border border-border-default shadow-inner">
                          <Users className="h-7 w-7" />
                          <div className={cn("absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white shadow-sm", member.progress === 100 ? "bg-emerald-500" : "bg-accent-primary")} />
                        </div>
                        <div>
                          <p className="text-base font-black text-text-primary uppercase tracking-tight leading-none">{member.name}</p>
                          <p className="text-[11px] text-text-muted font-bold uppercase tracking-widest mt-1.5">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex-1 max-w-md mx-12">
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">{member.course}</p>
                          <p className="text-[11px] font-bold uppercase tracking-widest text-accent-primary">{member.progress}%</p>
                        </div>
                        <div className="h-3 w-full bg-bg-surface2 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all duration-1000", member.progress === 100 ? "bg-emerald-500" : "bg-accent-primary")} style={{ width: `${member.progress}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <div className="hidden xl:block">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-1">Дедлайн</p>
                          <p className="text-xs font-black uppercase">{member.nextDeadline}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={cn(
                            "rounded-xl px-4 py-1.5 font-bold uppercase tracking-widest text-[9px] border-none",
                            member.status === 'Completed' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          )}>
                            {member.status}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-white border border-transparent hover:border-border-subtle">
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-4 bg-bg-surface2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <CalendarIcon className="h-6 w-6 text-text-muted" />
                  </div>
                  <div>
                    <p className="text-base font-black uppercase tracking-tight text-text-primary leading-none">Ближайшая аттестация отдела</p>
                    <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mt-1.5">20 Февраля • 14:00 • Дизайн-студия</p>
                  </div>
                </div>
                <Button variant="link" className="font-bold uppercase tracking-widest text-[10px] text-accent-primary">Перейти в календарь обучения →</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Assessment Modal */}
      <Dialog open={!!activeAssessment} onOpenChange={() => setActiveAssessment(null)}>
        <DialogContent className="sm:max-w-2xl rounded-xl p-4">
          {activeAssessment && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent-primary mb-1">Аттестация: {activeAssessment.title}</p>
                  <h3 className="text-base font-black uppercase tracking-tight">Вопрос {currentQuestionIndex + 1} из {activeAssessment.questions.length}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Прогресс</p>
                  <p className="text-sm font-black">{Math.round(((currentQuestionIndex + 1) / activeAssessment.questions.length) * 100)}%</p>
                </div>
              </div>
              
              <Progress value={((currentQuestionIndex + 1) / activeAssessment.questions.length) * 100} className="h-2 rounded-full" />

              <div className="space-y-4">
                <p className="text-sm font-black uppercase tracking-tight leading-tight">{activeAssessment.questions[currentQuestionIndex].text}</p>
                
                <div className="space-y-3">
                  {activeAssessment.questions[currentQuestionIndex].options.map((option: string) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(activeAssessment.questions[currentQuestionIndex].id, option)}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 text-left transition-all font-bold uppercase tracking-tight text-xs",
                        answers[activeAssessment.questions[currentQuestionIndex].id] === option 
                          ? "border-accent-primary bg-accent-primary/10 text-accent-primary shadow-lg" 
                          : "border-border-subtle hover:border-border-default text-text-secondary"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <Button 
                  variant="ghost" 
                  disabled={currentQuestionIndex === 0} 
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="font-bold uppercase tracking-widest text-[10px]"
                >
                  Назад
                </Button>
                {currentQuestionIndex === activeAssessment.questions.length - 1 ? (
                  <Button 
                    onClick={finishTest} 
                    disabled={!answers[activeAssessment.questions[currentQuestionIndex].id]}
                    className="bg-accent-primary hover:bg-accent-primary text-white rounded-2xl h-12 px-8 font-bold uppercase tracking-widest text-[10px]"
                  >
                    Завершить тест
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)} 
                    disabled={!answers[activeAssessment.questions[currentQuestionIndex].id]}
                    className="bg-text-primary text-white rounded-2xl h-12 px-8 font-bold uppercase tracking-widest text-[10px]"
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
        <DialogContent className="sm:max-w-md rounded-xl p-4 text-center">
          <div className="space-y-4">
            <div className={cn(
              "h-24 w-24 rounded-xl mx-auto flex items-center justify-center mb-6",
              testScore >= 80 ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
            )}>
              {testScore >= 80 ? <Check className="h-12 w-12" /> : <CloseIcon className="h-12 w-12" />}
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-tight mb-2">
                {testScore >= 80 ? "Поздравляем!" : "Нужно подтянуть знания"}
              </h3>
              <p className="text-text-secondary font-medium">
                {testScore >= 80 
                  ? "Вы успешно прошли аттестацию и подтвердили свои навыки." 
                  : "К сожалению, вы не набрали достаточное количество баллов для сертификации."}
              </p>
            </div>
            <div className="bg-bg-surface2 p-4 rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Ваш результат</p>
              <p className="text-base font-black text-text-primary">{testScore}%</p>
            </div>
            <Button onClick={() => setIsResultOpen(false)} className="w-full h-10 rounded-2xl bg-text-primary font-bold uppercase tracking-widest text-[11px]">
              {testScore >= 80 ? "Получить сертификат" : "Вернуться к курсу"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
}

function CourseCard({ course, featured }: { course: any, featured?: boolean }) {
  const categoryMap: Record<string, string> = {
    'economics': 'Экономика',
    'design': 'Дизайн',
    'production': 'Производство',
    'analytics': 'Аналитика',
    'management': 'Менеджмент',
    'retail': 'Ритейл',
    'legal': 'Право'
  };

  return (
    <Card className={cn(
      "group rounded-xl border-none shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full bg-white",
      featured && "ring-2 ring-accent-primary/20"
    )}>
      <div className="relative aspect-video overflow-hidden">
        <Image 
          src={course.thumbnail} 
          alt={course.title} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-text-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {course.isNew && <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black uppercase px-2 py-0.5 shadow-lg">НОВОЕ</Badge>}
          {course.isRecommended && <Badge className="bg-accent-primary text-white border-none text-[8px] font-black uppercase px-2 py-0.5 shadow-lg">РЕКОМЕНДОВАНО</Badge>}
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
          <Button size="sm" className="bg-white text-text-primary hover:bg-bg-surface2 rounded-xl font-bold uppercase tracking-widest text-[9px] h-10 px-5 shadow-xl">
            <PlayCircle className="mr-2 h-4 w-4 fill-text-primary text-white" /> Смотреть
          </Button>
          <div className="flex items-center gap-1.5 text-white bg-text-primary/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-black">{course.rating}</span>
          </div>
        </div>
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest border-border-subtle text-text-muted px-2.5 py-0.5">
            {categoryMap[course.category] || course.category}
          </Badge>
          <div className="flex items-center text-[10px] text-text-muted font-bold uppercase tracking-widest">
            <Clock className="h-3.5 w-3.5 mr-1.5 text-accent-primary" /> {course.duration}
          </div>
        </div>
        <CardTitle className="text-sm font-black leading-tight group-hover:text-accent-primary transition-colors uppercase tracking-tight">
          <GlossaryText text={course.title} />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        <p className="text-sm text-text-secondary font-medium line-clamp-2 mb-6 leading-relaxed">
          <GlossaryText text={course.description} />
        </p>
        <div className="flex flex-col gap-3 pt-6 border-t border-border-subtle">
          <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted">В комплекте:</p>
          <div className="flex flex-wrap gap-2">
            {course.media?.map((m: any, i: number) => (
              <div key={i} className="flex items-center gap-2 bg-bg-surface2 px-3 py-1.5 rounded-xl border border-border-subtle group/media">
                {m.type === 'video' ? <Video className="h-3 w-3 text-accent-primary" /> : <FileText className="h-3 w-3 text-accent-primary" />}
                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-tight">{m.title}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between border-t border-border-subtle pt-6">
        <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
          {course.provider}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-primary bg-bg-surface2 px-3 py-1.5 rounded-xl border border-border-subtle">
          <Users className="h-3.5 w-3.5 text-accent-primary" /> {course.studentsCount}
        </div>
      </CardFooter>
    </Card>
  );
}

function LearningPathCard({ path }: { path: any }) {
  return (
    <Card className="rounded-xl border-none shadow-2xl bg-gradient-to-br from-text-primary to-text-primary text-white overflow-hidden group">
      <div className="p-3 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
            <TrendingUp className="h-8 w-8 text-accent-primary" />
          </div>
          <Badge className="bg-accent-primary/20 text-accent-primary border border-accent-primary/30 px-4 py-1.5 font-bold uppercase tracking-widest text-[9px]">
            Траектория обучения
          </Badge>
        </div>
        <h3 className="text-xs font-black uppercase tracking-tight mb-4">{path.title}</h3>
        <p className="text-text-muted font-medium mb-5 leading-relaxed max-w-sm">{path.description}</p>
        
        <div className="space-y-6 mb-6">
          {path.courses.map((courseId: string, i: number) => {
            const course = mockCourses.find(c => c.id === courseId);
            return (
              <div key={courseId} className="flex items-center gap-3 group/item">
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-accent-primary group-hover/item:bg-accent-primary group-hover/item:text-white transition-all">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black uppercase tracking-tight text-white/90 group-hover/item:translate-x-1 transition-transform">{course?.title}</p>
                  <p className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">{course?.duration}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-8 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Award className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-text-secondary leading-none mb-1">Результат</p>
              <p className="text-xs font-bold text-emerald-400 leading-none">{path.outcome}</p>
            </div>
          </div>
          <Button className="bg-white text-text-primary hover:bg-bg-surface2 rounded-2xl h-12 px-6 font-bold uppercase tracking-widest text-[10px]">
            Начать путь
          </Button>
        </div>
      </div>
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
        <GraduationCap className="h-64 w-64" />
      </div>
    </Card>
  );
}
