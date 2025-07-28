# Copilot Instructions for nestjs-hr-screener

## Project Overview

- This is a modular NestJS (Node.js/TypeScript) backend for HR screening, using Mongoose for MongoDB integration.
- Major modules: `users`, `jobs`, `shortlisted-candidate`, and `auth`. Each module follows a clear structure: `controller/`, `services/`, `repositories/`, `entitities/`, and `dto/`.
- Data flow: Controllers handle HTTP, delegate to Services, which use Repositories for DB access. Entities define Mongoose schemas. DTOs are used for validation and typing.

## Key Patterns & Conventions

- **Module Structure:** Each feature (e.g., jobs, users) is a self-contained module with its own controller, service, repository, entity, and DTOs. Example: `src/jobs/`.
- **DTOs:** All input validation and typing is handled via DTOs in `controller/dto/` using `class-validator` decorators.
- **Repositories:** Abstract all Mongoose operations. Services should not access Mongoose models directly.
- **Soft Delete:** For entities like candidates, soft delete is implemented by setting an `isDeleted` flag. Hard delete is only allowed if already soft-deleted.
- **Pagination:** Use `PaginationQueryDto` for paginated endpoints.

## Developer Workflows

- **Install:** `npm install`
- **Run (dev):** `npm run start`
- **Run (watch):** `npm run start:dev`
- **Test:** `npm run test` (unit), `npm run test:e2e` (end-to-end)
- **Lint:** `npm run lint`
- **Build:** `npm run build`

## Integration & External Dependencies

- **Database:** MongoDB via Mongoose. Schemas in `entitities/`.
- **Email:** See `src/common/mails/mailer/` for email service integration.
- **Auth:** JWT-based, with guards and decorators in `src/auth/common/`.

## Examples

- **CRUD pattern:** See `src/jobs/controller/job.controller.ts`, `src/jobs/services/job.service.ts`, `src/jobs/repositories/job.repository.ts`.
- **Soft delete logic:** See `src/shortlisted-candidate/services/shortlisted-candidates.service.ts`.
- **DTO usage:** See `src/jobs/controller/dto/create-job.dto.ts`.

## Project-Specific Tips

- Always use DTOs for input validation.
- Add new modules by mirroring the folder structure of existing modules.
- Use repositories for all DB access, not services directly.
- For new features, follow the modular pattern: create controller, service, repository, entity, and DTOs.

---

If you add new conventions, update this file to keep AI agents productive.
