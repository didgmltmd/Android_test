# Android Exam Companion

React + TypeScript + Tailwind CSS 기반 안드로이드 시험 대비 학습 앱입니다.

## 실행 방법

```bash
npm install
npm run dev
```

- 개발 서버 기본 주소: `http://localhost:5173`
- 빌드: `npm run build`
- 미리보기: `npm run preview`

## PDF 위치

PDF는 루트의 `data/` 폴더에 둡니다.

현재 프로젝트는 `vite.config.ts`에서 `publicDir: "data"`로 설정되어 있어 아래 파일들이 그대로 정적 자산으로 서빙됩니다.

- `data/1주차.pdf`
- `data/차2주-복사.pdf`
- `data/chap03 기본 위젯.pdf`
- `data/chap04 레이아웃(강의자료).pdf`
- `data/chap05 고급 위젯과 이벤트 처리하기.pdf`
- `data/chap06 액티비티와 인텐트.pdf`

파일명을 바꾸면 `src/data/pdfMeta.ts`, `src/data/questions.ts`도 함께 수정해야 합니다.

## OpenAI 연결 방법

1. 앱 상단의 `API Key 설정` 버튼을 누릅니다.
2. 본인 OpenAI API Key를 입력합니다.
3. 답안을 작성한 뒤 `AI에게 채점받기`를 누릅니다.

주의:

- 이 앱은 백엔드 없이 브라우저에서 직접 OpenAI API를 호출합니다.
- API Key는 브라우저 `localStorage`에 저장됩니다.
- 기본 모델은 `src/lib/openai.ts`의 `DEFAULT_MODEL` 상수로 지정되어 있습니다.

## 폴더 구조

```text
.
├─ data/
├─ src/
│  ├─ components/
│  │  ├─ ui/
│  │  ├─ ApiKeyBanner.tsx
│  │  ├─ ApiKeySettingsModal.tsx
│  │  ├─ AppHeader.tsx
│  │  ├─ AnswerEditor.tsx
│  │  ├─ ConfirmResetModal.tsx
│  │  ├─ EmptyState.tsx
│  │  ├─ FeedbackPanel.tsx
│  │  ├─ LoadingState.tsx
│  │  ├─ PdfViewerPanel.tsx
│  │  ├─ ProgressOverview.tsx
│  │  ├─ QuestionCard.tsx
│  │  ├─ QuestionCarousel.tsx
│  │  ├─ QuestionNavigator.tsx
│  │  └─ RelatedPdfInfo.tsx
│  ├─ data/
│  │  ├─ pdfMeta.ts
│  │  └─ questions.ts
│  ├─ hooks/
│  │  └─ useMediaQuery.ts
│  ├─ lib/
│  │  ├─ openai.ts
│  │  └─ pdf.ts
│  ├─ types/
│  │  └─ index.ts
│  ├─ utils/
│  │  ├─ cn.ts
│  │  └─ storage.ts
│  ├─ App.tsx
│  ├─ index.css
│  └─ main.tsx
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.ts
└─ vite.config.ts
```

## 컴포넌트 구조

- `AppHeader`: 진행률, 빠른 문제 이동, API Key 설정, 전체 초기화
- `QuestionNavigator`: 현재 문제 상태와 좌우 이동
- `QuestionCarousel`: 카드형 문제 표시
- `QuestionCard`: 문제 본문, 키워드, 상태 배지
- `RelatedPdfInfo`: 문제와 PDF 근거 연결 정보
- `AnswerEditor`: 답안 작성, 힌트, 모범답안 요약, 자동 저장 UX
- `FeedbackPanel`: 점수, 총평, 보완점, 누락 키워드, 재작성 답안
- `PdfViewerPanel`: PDF 렌더링, 확대/축소, 관련 페이지 이동
- `ProgressOverview`: 전체 작성/채점 현황
- `ApiKeySettingsModal`, `ConfirmResetModal`: 설정 및 파괴적 액션 보호
- `ui/*`: 반복되는 버튼, 카드, 배지, 모달 공통 스타일

## 설계 이유

- 상태관리는 React hooks만 사용해 복잡도를 낮췄습니다.
- 문제 데이터와 PDF 메타데이터를 분리해서 유지보수와 확장을 쉽게 했습니다.
- `localStorage` 저장 로직을 `src/utils/storage.ts`에 모아 UI 컴포넌트가 저장 구현 세부사항을 몰라도 되게 했습니다.
- PDF 뷰어를 데스크톱 사이드 패널, 모바일 모달로 나눠 학습 흐름을 유지했습니다.
- 공통 `Button`, `Card`, `Badge`, `Modal`로 토스 스타일 계열의 일관된 UI를 유지했습니다.
