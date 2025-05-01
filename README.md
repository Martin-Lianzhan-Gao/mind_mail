# 🙋‍♂️ What is it?

This is an Email Web Client project for **solving my pain points** while using other email clients.

## 👆 Technology stacks used for this project

This project is mainly developing by [T3 stack](https://create.t3.gg/), involves:

- [TypeScript](https://www.typescriptlang.org/): Main programming language
- [Next.js](https://nextjs.org): As front-end stack
- [Prisma](https://prisma.io): As **PostgreSQL** ORM
- [Tailwind CSS](https://tailwindcss.com): Styles
- [tRPC](https://trpc.io): Back-end **Type Security** APIs

### 🗂️ Third-party integration:

- **Neon.tech**: Serverless database deployment
- **Clerk**: User authenticat
- **Aurinko**: Email CRUD
- **Google Gemini**: AI API

## 🔑 Key features & Aims

- **Complete** email sending, receiving, editing, and management functions with **smart AI assisstant**.
- **Efficient** email _synchronization_ and a seamless _email composition_ experience. 
- **Intuitive and user-friendly** UI.

## **Deployment and Demo**

This project is currently deployed on [Vercel](https://vercel.com).

🔗 **Live Demo:**  
Experience the latest version by visiting: [https://mind-mail.vercel.app](https://mind-mail.vercel.app)

⚠️ **Important Notes:**

- The demo is intended for testing purposes only and may contain bugs or incomplete features.
- If you encounter any issues, please help us improve by reporting them via email to [gaolianzhan@gmail.com](mailto:gaolianzhan@gmail.com).

🔐 **Authentication & Data Handling:**

- For security and privacy reasons, each new user will receive a temporary access token upon registration.
- This token grants access to email synchronization and related operations.
- The token will expire after 4 days. Once expired:
  - Automatic email synchronization will stop.
  - All user-related data will be permanently deleted from our systems.



