CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"mobile" varchar,
	"currency" varchar DEFAULT 'INR' NOT NULL,
	"month_start_date" integer DEFAULT 1 NOT NULL,
	"week_start_day" varchar DEFAULT 'monday' NOT NULL,
	"refer_code" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
