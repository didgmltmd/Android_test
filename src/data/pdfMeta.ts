import type { PdfMeta } from "../types";

export const pdfMetaMap: Record<string, PdfMeta> = {
  "1주차.pdf": {
    label: "1주차 - 안드로이드 소개",
    topics: [
      "모바일 운영체제",
      "안드로이드 특징",
      "리눅스 커널",
      "자바/코틀린",
      "센서",
      "SQLite",
    ],
  },
  "차2주-복사.pdf": {
    label: "2주차 - 애플리케이션 기본 구조",
    topics: [
      "컴포넌트",
      "액티비티",
      "서비스",
      "방송 수신자",
      "인텐트",
      "생명주기",
    ],
  },
  "chap03 기본 위젯.pdf": {
    label: "3주차 - 기본 위젯",
    topics: [
      "View",
      "ViewGroup",
      "위젯 계층도",
      "android:id",
      "Button",
      "EditText",
      "TextView",
    ],
  },
  "chap04 레이아웃(강의자료).pdf": {
    label: "4주차 - 레이아웃",
    topics: [
      "레이아웃 종류",
      "LinearLayout",
      "TableLayout",
      "GridLayout",
      "RelativeLayout",
      "ConstraintLayout",
    ],
  },
  "chap05 고급 위젯과 이벤트 처리하기.pdf": {
    label: "5주차 - 고급 위젯과 이벤트",
    topics: ["이벤트 처리", "리스너", "어댑터 뷰", "토스트"],
  },
  "chap06 액티비티와 인텐트.pdf": {
    label: "6주차 - 액티비티와 인텐트 심화",
    topics: ["인텐트", "액티비티 전환", "생명주기", "super 호출"],
  },
};
