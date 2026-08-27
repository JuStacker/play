# play

## 요구사항

- Node.js: `.nvmrc` 참고 (`nvm use`)
- 패키지 매니저: pnpm

## 설치

```bash
pnpm install
```

## 스크립트

```bash
pnpm start              # ts-node src/main.ts 실행
pnpm start:local        # NODE_ENV=local 로 start 실행
pnpm build              # tsc 빌드 (dist/ 생성)
pnpm log                # ts-node src/showLog.ts 실행
pnpm init-log-v2        # ts-node src/analyze.ts 실행
pnpm init-time-slot     # ts-node src/initTimeSlotByLog.ts 실행
pnpm analyze-for-v2     # ts-node src/analyzeForV2.ts 실행
pnpm init:local         # NODE_ENV=local 로 init-time-slot, analyze-for-v2 순차 실행
pnpm analyze:local      # NODE_ENV=local 로 analyze-for-v2 실행
pnpm cron               # NODE_ENV=local 로 dist/cron/cron10.js 실행 (build 후 사용)
```

## 포맷 / 린트

```bash
pnpm format             # biome format --write . (코드 포맷 적용)
pnpm lint               # biome check . (포맷/import 정렬/린트 검사)
```
