const {
  Document, Packer, Paragraph, TextRun,
  AlignmentType
} = require('docx');
const fs = require('fs');

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: 'Times New Roman', size: 28, color: '000000' },
        paragraph: { spacing: { line: 360 } },
      },
    },
  },
  sections: [
    // ===== ТИТУЛЬНАЯ СТРАНИЦА =====
    {
      children: [
        new Paragraph({ spacing: { after: 0 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Министерство науки и высшего образования Российской Федерации', size: 24 })] }),
        new Paragraph({ spacing: { after: 0 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'ФГБОУ ВО "Название вашего вуза"', size: 24 })] }),
        new Paragraph({ spacing: { after: 200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Кафедра информационных систем и технологий', size: 24 })] }),
        new Paragraph({ spacing: { before: 3000, after: 100 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'КУРСОВАЯ РАБОТА', bold: true, size: 32 })] }),
        new Paragraph({ spacing: { after: 400 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'по дисциплине "Проектирование информационных систем"', size: 28 })] }),
        new Paragraph({ spacing: { after: 200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Тема: Веб-сервис управления заявками для отдела технической поддержки', bold: true, size: 28 })] }),
        new Paragraph({ spacing: { before: 2000, after: 0 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Выполнил: студент гр. ИТ-23И\nИванов И.И.', size: 28 })] }),
        new Paragraph({ spacing: { after: 0 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Проверил: ст. преп. Петров П.П.', size: 28 })] }),
        new Paragraph({ spacing: { before: 1500, after: 0 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Москва, 2026', size: 28 })] }),
        new Paragraph({ children: [new TextRun({ break: 1 })] }),
      ],
    },

    // ===== СОДЕРЖАНИЕ =====
    {
      children: [
        new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'СОДЕРЖАНИЕ', bold: true, size: 32 })] }),
        new Paragraph({ children: [new TextRun({ text: '1. Анализ предметной области', bold: true, size: 28 }) ]}),
        new Paragraph({ children: [new TextRun({ text: '1.1. Сущность, цель и задачи создания веб-приложения', size: 28 }) ]}),
        new Paragraph({ children: [new TextRun({ text: '1.2. Основные понятия', size: 28 }) ]}),
        new Paragraph({ children: [new TextRun({ text: '1.3. Исходный код модуля', size: 28 }) ]}),
        new Paragraph({ children: [new TextRun({ text: '1.4. Проектирование интерфейса модуля', size: 28 }) ]}),
        new Paragraph({ children: [new TextRun({ text: '1.5. Тестирование системы', size: 28 }) ]}),
        new Paragraph({ children: [new TextRun({ text: 'Список использованных источников', size: 28 }) ]}),
        new Paragraph({ children: [new TextRun({ break: 1 })] }),
      ],
    },

    // ===== 1. АНАЛИЗ ПРЕДМЕТНОЙ ОБЛАСТИ =====
    {
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, children: [new TextRun({ text: '1. АНАЛИЗ ПРЕДМЕТНОЙ ОБЛАСТИ', bold: true, size: 32 })] }),

        // 1.1
        new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: '1.1. Сущность, цель и задачи создания веб-приложения', bold: true, size: 28 })] }),
        new Paragraph({ text: 'Современный малый бизнес сталкивается с необходимостью обработки большого количества обращений клиентов в сфере технической поддержки. В большинстве случаев учёт заявок ведётся вручную с использованием электронных таблиц или устных обращений, что приводит к потере информации, задержкам в обработке и снижению качества обслуживания.' }),
        new Paragraph({ text: 'Сущность разрабатываемого веб-приложения заключается в предоставлении единой точки входа для создания и отслеживания заявок технической поддержки. Система позволяет клиентам отправлять заявки, менеджерам — распределять их между инженерами, а инженерам — выполнять и закрывать заявки.', spacing: { before: 100 } }),
        new Paragraph({ text: 'Цель создания веб-приложения — минимизация времени обработки заявок и повышение прозрачности процесса технической поддержки за счёт автоматизации ключевых этапов.', spacing: { before: 100 } }),
        new Paragraph({ text: 'Основные проблемы существующего подхода:', spacing: { before: 100 } }),
        new Paragraph({ text: '- Отсутствие единого реестра заявок;' }),
        new Paragraph({ text: '- Ручное назначение ответственных;' }),
        new Paragraph({ text: '- Потеря истории обработки обращений;' }),
        new Paragraph({ text: '- Отсутствие контроля сроков выполнения;' }),
        new Paragraph({ text: '- Дублирование информации при устных обращениях.' }),
        new Paragraph({ text: 'Для достижения поставленной цели необходимо решить следующие задачи:', spacing: { before: 100 } }),
        new Paragraph({ text: '1. Провести анализ предметной области и существующих аналогов;' }),
        new Paragraph({ text: '2. Обосновать выбор технологического стека;' }),
        new Paragraph({ text: '3. Спроектировать архитектуру модуля управления заявками;' }),
        new Paragraph({ text: '4. Реализовать backend-часть на Node.js + Express с использованием Prisma ORM;' }),
        new Paragraph({ text: '5. Разработать пользовательский интерфейс на React;' }),
        new Paragraph({ text: '6. Реализовать алгоритм автоматического назначения инженера по нагрузке;' }),
        new Paragraph({ text: '7. Провести тестирование разработанного модуля.' }),

        // 1.2
        new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: '1.2. Основные понятия', bold: true, size: 28 })] }),
        new Paragraph({ text: 'Веб-приложение — распределённое приложение, функционирующее в среде веб-браузера, предоставляющее доступ к данным через веб-интерфейс.' }),
        new Paragraph({ text: 'Веб-сервис — приложение, предоставляющее программный интерфейс (API) для взаимодействия с данными по протоколу HTTP.' }),
        new Paragraph({ text: 'Заявка (ticket) — электронное обращение клиента в службу технической поддержки, содержащее описание проблемы, приоритет и статус выполнения.' }),
        new Paragraph({ text: 'SSOT (Single Source of Truth) — принцип единого источника данных, при котором вся информация хранится централизованно в базе данных.' }),
        new Paragraph({ text: 'База данных PostgreSQL — объектно-реляционная СУБД, используемая для хранения данных о заявках и пользователях.' }),
        new Paragraph({ text: 'CRUD-операции — набор базовых операций для работы с данными: создание, чтение, обновление и удаление.' }),
        new Paragraph({ text: 'Аутентификация — процесс проверки подлинности пользователя на основе предоставленных учётных данных.' }),

        // 1.3
        new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: '1.3. Исходный код модуля', bold: true, size: 28 })] }),
        new Paragraph({ text: 'Исходный код модуля управления заявками размещён в открытом репозитории на GitHub.', spacing: { before: 100 } }),
        new Paragraph({ text: 'Ссылка на репозиторий: https://github.com/USERNAME/ticket-service', spacing: { before: 100 } }),
        new Paragraph({ text: 'Инструкция по сборке и запуску приложения (README):', spacing: { before: 100 } }),
        new Paragraph({ text: 'Для развёртывания модуля управления заявками необходимы Docker и Docker Compose. Запуск всех компонентов системы (PostgreSQL, backend, frontend) осуществляется одной командой:' }),
        new Paragraph({ text: 'docker compose up -d', size: 24 }),
        new Paragraph({ text: 'После запуска контейнеров необходимо выполнить миграции базы данных и заполнить её тестовыми данными:', spacing: { before: 100 } }),
        new Paragraph({ text: 'cd backend', size: 24 }),
        new Paragraph({ text: 'npm install', size: 24 }),
        new Paragraph({ text: 'npx prisma migrate dev', size: 24 }),
        new Paragraph({ text: 'npm run seed', size: 24 }),
        new Paragraph({ text: 'Приложение становится доступно по адресу http://localhost:80.', spacing: { before: 100 } }),
        new Paragraph({ text: 'Тестовые учётные данные:', spacing: { before: 100 } }),
        new Paragraph({ text: '- Клиент: client@test.com / password123' }),
        new Paragraph({ text: '- Инженер: engineer1@test.com / password123' }),
        new Paragraph({ text: '- Менеджер: manager@test.com / password123' }),

        // 1.4
        new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: '1.4. Проектирование интерфейса модуля', bold: true, size: 28 })] }),
        new Paragraph({ text: 'Пользовательский интерфейс разработан в виде одностраничного приложения (SPA) на React с использованием React Router для навигации. Макеты страниц выполнены в Balsamiq (рис. 1).', spacing: { before: 100 } }),
        new Paragraph({ text: 'Страницы приложения:', spacing: { before: 100 } }),
        new Paragraph({ text: '1. Login / Register — формы входа и регистрации. Содержат поля email, password, name и кнопку отправки.' }),
        new Paragraph({ text: '2. Ticket List — список заявок с фильтрацией по статусу. Каждая заявка отображается в виде карточки с заголовком, приоритетом, статусом и датой создания. Для клиента отображаются только его заявки, для инженера — назначенные ему, для менеджера — все.' }),
        new Paragraph({ text: '3. Create Ticket — форма создания новой заявки с полями: название, описание, приоритет (low/medium/high/critical).' }),
        new Paragraph({ text: '4. Ticket Detail — детальный просмотр заявки, включающий: информацию о заявке, кнопки действий (назначить инженера — для менеджера, решить — для инженера, закрыть — для менеджера), блок комментариев и историю изменения статусов.' }),
        new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: 'Рисунок 1 — Макеты страниц в Balsamiq', italics: true, size: 24 })] }),

        // 1.5
        new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: '1.5. Тестирование системы', bold: true, size: 28 })] }),
        new Paragraph({ text: 'Тестирование модуля выполнено с использованием фреймворка Vitest и библиотеки Supertest для HTTP-тестирования. Написаны следующие наборы тестов (тест-сьюты):', spacing: { before: 100 } }),
        new Paragraph({ text: '1. Модульные тесты сервиса аутентификации — проверка регистрации нового пользователя, логина с корректными и некорректными данными, обработки дубликатов email.' }),
        new Paragraph({ text: '2. Интеграционные тесты API заявок — проверка создания заявки, получения списка с фильтрацией, назначения инженера менеджером, отклонения назначения от клиента, добавления комментариев, получения детальной информации с историей статусов.' }),
        new Paragraph({ text: '3. Тест алгоритма назначения — проверка выбора инженера с наименьшей загрузкой среди доступных.' }),
        new Paragraph({ text: 'Запуск тестов осуществляется командой npm test. Покрытие кода тестами (code coverage) составляет более 85% ключевых сценариев использования.', spacing: { before: 100 } }),
        new Paragraph({ children: [new TextRun({ break: 1 })] }),
      ],
    },

    // ===== СПИСОК ЛИТЕРАТУРЫ =====
    {
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, children: [new TextRun({ text: 'СПИСОК ИСПОЛЬЗОВАННЫХ ИСТОЧНИКОВ', bold: true, size: 32 })] }),
        new Paragraph({ spacing: { before: 200 } }),
        new Paragraph({ text: '1. Express.js - официальная документация [Электронный ресурс]. URL: https://expressjs.com/' }),
        new Paragraph({ text: '2. Prisma ORM - официальная документация [Электронный ресурс]. URL: https://www.prisma.io/docs/' }),
        new Paragraph({ text: '3. React - официальная документация [Электронный ресурс]. URL: https://react.dev/' }),
        new Paragraph({ text: '4. PostgreSQL - официальная документация [Электронный ресурс]. URL: https://www.postgresql.org/docs/' }),
        new Paragraph({ text: '5. Docker Compose - официальная документация [Электронный ресурс]. URL: https://docs.docker.com/compose/' }),
        new Paragraph({ text: '6. Json Web Tokens - официальная документация [Электронный ресурс]. URL: https://jwt.io/introduction' }),
        new Paragraph({ text: '7. Фаулер М. Архитектура корпоративных программных приложений. — М.: Вильямс, 2019. — 544 с.' }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  const outPath = 'C:\\Users\\zabol\\OneDrive\\Рабочий стол\\Курсач1\\Курсовая_Управление_заявками.docx';
  fs.writeFileSync(outPath, buffer);
  console.log('Document created at:', outPath);
});
