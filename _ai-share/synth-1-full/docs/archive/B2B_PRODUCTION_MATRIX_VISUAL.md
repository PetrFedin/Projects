# 🎨 B2B WORKSPACE: PRODUCTION MATRIX VISUAL STYLE
## Визуальное оформление в стиле производственной матрицы

**Дата**: 17.02.2026  
**Статус**: ✅ РЕАЛИЗОВАНО  
**Стиль**: Production Matrix Pattern  

---

## 🎯 ВИЗУАЛЬНЫЕ ИЗМЕНЕНИЯ

### **ДО** (Простой дизайн):
```
❌ Маленькие иконки (h-6 w-6)
❌ Простые карточки без градиентов
❌ Обычные кнопки
❌ Статичные табы
❌ Нет эффектов на hover
❌ Нет связей между элементами
```

### **ПОСЛЕ** (Production Matrix Style):
```
✅ Крупные иконки (h-8 w-8) с анимацией
✅ Градиентные карточки с pulse эффектом
✅ Градиентные кнопки по приоритету
✅ Динамичные табы с крупными иконками (h-8 w-8)
✅ Hover эффекты (scale, rotate, glow)
✅ SVG линии связей между элементами
```

---

## 🎨 КОМПОНЕНТЫ ДИЗАЙНА

### **1. ТАБЫ КАТЕГОРИЙ** (Production Style)

#### **Дизайн**:
```typescript
// Крупные иконки как в Production Matrix
<div className="h-16 w-16 rounded-2xl">
  <Icon className="h-8 w-8" />  {/* Было h-4 w-4 */}
  <Badge className="absolute -top-2 -right-2 h-8 w-8">
    {count}
  </Badge>
</div>

// Градиент для активного таба
className={
  isActive
    ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl scale-105"
    : "bg-white border-2 border-slate-200"
}

// Анимированная граница
{isActive && (
  <motion.div
    layoutId="activeTab"
    className="border-4 border-indigo-500"
  />
)}
```

#### **Эффекты**:
- ✅ Scale 105% для активного таба
- ✅ Градиент от slate-900 до slate-800
- ✅ Анимированная граница (layoutId)
- ✅ Показ описания при активации
- ✅ Крупный badge с количеством

---

### **2. КАРТОЧКИ ФУНКЦИЙ** (Production Style)

#### **Иконки** (Крупные + Анимация):
```typescript
// Было: h-12 w-12, иконка h-6 w-6
// Стало: h-16 w-16, иконка h-8 w-8

<div className="h-16 w-16 rounded-2xl group-hover:scale-110 group-hover:rotate-3">
  <ItemIcon className="h-8 w-8" />
  
  {/* Pulse эффект на hover */}
  {isHovered && (
    <motion.div
      className="absolute inset-0 bg-rose-400"
      animate={{ scale: 1.5, opacity: 0 }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  )}
</div>
```

#### **Gradient Background**:
```typescript
// Градиент появляется на hover
<div className="absolute inset-0 opacity-0 group-hover:opacity-100">
  {priority === 'critical' && "bg-gradient-to-br from-rose-50 to-pink-50"}
  {priority === 'high' && "bg-gradient-to-br from-amber-50 to-orange-50"}
  {priority === 'medium' && "bg-gradient-to-br from-blue-50 to-indigo-50"}
</div>
```

#### **Hover эффекты**:
```typescript
// Карточка
className="hover:shadow-2xl scale-105 z-20 ring-4 ring-indigo-200"

// Иконка
className="group-hover:scale-110 group-hover:rotate-3"

// Заголовок
className="group-hover:text-indigo-900"
```

---

### **3. КНОПКИ** (Gradient Buttons):

#### **По приоритету**:
```typescript
// Critical (Rose/Pink)
className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"

// High (Amber/Orange)
className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"

// Medium (Blue/Indigo)
className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"

// Иконка с анимацией
<ChevronRight className="group-hover:translate-x-1" />
```

---

### **4. ЛЕГЕНДА РОЛЕЙ** (Production Style)

#### **Header**:
```typescript
<CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
  <div className="h-14 w-14 rounded-2xl bg-white/10">
    <Users className="h-7 w-7 text-white" />
  </div>
</CardHeader>
```

#### **Карточки ролей**:
```typescript
// Hover эффекты
<motion.div whileHover={{ scale: 1.05 }}>
  <div className="h-12 w-12 group-hover:scale-110 group-hover:rotate-6">
    <Icon className="h-6 w-6" />
  </div>
</motion.div>

// Текущая роль
{isCurrentRole && (
  <motion.div
    className="border-2 border-indigo-500"
    animate={{ opacity: 1, scale: 1 }}
  />
)}
```

---

### **5. SVG СВЯЗИ** (Как в Production Matrix)

#### **Реализация**:
```typescript
// Эффект для отслеживания hover
useEffect(() => {
  if (!hoveredItem) return;
  
  const currentItem = filteredItems.find(i => i.id === hoveredItem);
  const relatedItems = filteredItems.filter(item => 
    item.roles.some(role => currentItem.roles.includes(role))
  );
  
  setConnections(relatedItems.map(...));
}, [hoveredItem]);

// SVG линии
<svg className="absolute inset-0 pointer-events-none z-10">
  {connections.map(conn => (
    <motion.line
      stroke="rgba(99, 102, 241, 0.3)"
      strokeWidth="2"
      strokeDasharray="5,5"
      animate={{ pathLength: 1, opacity: 1 }}
    />
  ))}
</svg>
```

---

## 🎨 COLOR PALETTE

### **Табы**:
```
Активный:     bg-gradient-to-br from-slate-900 to-slate-800
Неактивный:   bg-white border-2 border-slate-200
Hover:        hover:border-slate-300 hover:shadow-lg
Border:       border-4 border-indigo-500 (active)
```

### **Карточки по приоритету**:
```
Critical:
  Border:     border-rose-300 hover:border-rose-400
  Icon BG:    bg-gradient-to-br from-rose-100 to-rose-200
  Icon:       text-rose-600
  Hover BG:   bg-gradient-to-br from-rose-50 to-pink-50
  Button:     bg-gradient-to-r from-rose-600 to-pink-600

High:
  Border:     border-amber-300 hover:border-amber-400
  Icon BG:    bg-gradient-to-br from-amber-100 to-amber-200
  Icon:       text-amber-600
  Hover BG:   bg-gradient-to-br from-amber-50 to-orange-50
  Button:     bg-gradient-to-r from-amber-600 to-orange-600

Medium:
  Border:     border-blue-300 hover:border-blue-400
  Icon BG:    bg-gradient-to-br from-blue-100 to-blue-200
  Icon:       text-blue-600
  Hover BG:   bg-gradient-to-br from-blue-50 to-indigo-50
  Button:     bg-gradient-to-r from-blue-600 to-indigo-600
```

### **Легенда ролей**:
```
Header:       bg-gradient-to-r from-slate-900 to-slate-800
Current:      border-indigo-400 bg-gradient-to-br from-indigo-50 to-blue-50
                ring-2 ring-indigo-200
Others:       bg-white border-2 border-slate-200
```

---

## 🎬 АНИМАЦИИ

### **1. Табы**:
```typescript
// Активный таб
animate={{ scale: 1.05 }}

// Граница (layoutId)
<motion.div
  layoutId="activeTab"
  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
/>
```

### **2. Карточки**:
```typescript
// Появление
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ delay: index * 0.05, type: "spring" }}

// Hover
hover:shadow-2xl hover:scale-105
```

### **3. Иконки**:
```typescript
// Hover
group-hover:scale-110 group-hover:rotate-3

// Pulse эффект
<motion.div
  animate={{ scale: 1.5, opacity: 0 }}
  transition={{ duration: 1, repeat: Infinity }}
/>
```

### **4. Кнопки**:
```typescript
// Иконка
<ChevronRight className="group-hover:translate-x-1 transition-transform" />
```

### **5. SVG линии**:
```typescript
initial={{ pathLength: 0, opacity: 0 }}
animate={{ pathLength: 1, opacity: 1 }}
transition={{ duration: 0.3 }}
```

### **6. Роли**:
```typescript
// Hover
<motion.div whileHover={{ scale: 1.05 }} />

// Иконка
group-hover:scale-110 group-hover:rotate-6
```

---

## 📐 РАЗМЕРЫ

### **Иконки**:
```
Табы:         h-16 w-16 (контейнер), h-8 w-8 (иконка)
Карточки:     h-16 w-16 (контейнер), h-8 w-8 (иконка)
Роли:         h-12 w-12 (контейнер), h-6 w-6 (иконка)
Header роли:  h-14 w-14 (контейнер), h-7 w-7 (иконка)
```

### **Радиусы**:
```
Карточки:     rounded-3xl (24px)
Табы:         rounded-2xl (16px)
Иконки:       rounded-2xl (16px)
Кнопки:       rounded-xl (12px)
```

### **Тени**:
```
Default:      shadow-lg
Hover:        shadow-2xl
Active tab:   shadow-2xl
Роль (current): shadow-lg + ring-2
```

---

## 🔄 СРАВНЕНИЕ

### **Размеры иконок**:
```
ДО:     h-4 w-4  (табы)
        h-6 w-6  (карточки)
        h-5 w-5  (роли)

ПОСЛЕ:  h-8 w-8  (табы)       ← +100%
        h-8 w-8  (карточки)   ← +33%
        h-6 w-6  (роли)       ← +20%
```

### **Эффекты**:
```
ДО:     Простой hover (border change)
        Нет анимаций
        Статичные элементы

ПОСЛЕ:  Scale + Rotate на hover
        Framer Motion анимации
        Pulse эффекты
        SVG линии связей
        Градиентные фоны
```

---

## ✅ ЧЕКЛИСТ VISUAL FEATURES

- [x] Крупные иконки (h-8 w-8) в табах
- [x] Крупные иконки (h-8 w-8) в карточках
- [x] Градиентные фоны (активный таб)
- [x] Градиентные фоны (hover карточек)
- [x] Градиентные кнопки по приоритету
- [x] Scale + Rotate анимации
- [x] Pulse эффект на hover
- [x] SVG линии связей
- [x] Animated border (layoutId)
- [x] Gradient header (легенда ролей)
- [x] Current role highlight
- [x] Shadow elevation на hover
- [x] Transition animations
- [x] Badge с количеством

---

## 🎯 ИТОГ

**B2B Workspace** теперь визуально соответствует **Production Matrix**:

✅ **Крупные иконки** (как в производственной матрице)  
✅ **Градиенты** (для активных элементов и приоритетов)  
✅ **Анимации** (scale, rotate, pulse, translate)  
✅ **Hover эффекты** (shadow, glow, transform)  
✅ **SVG связи** (между связанными элементами)  
✅ **Динамичные табы** (с layoutId анимацией)  
✅ **Gradient buttons** (по цвету приоритета)  

### **Визуальная идентичность**:
🎨 **Production Matrix Style** - ДОСТИГНУТА ✨

---

**Дата**: 17.02.2026  
**Автор**: AI Assistant (Claude Sonnet 4.5)  
**Стиль**: Production Matrix Visual Pattern  
**Статус**: ✅ Complete
