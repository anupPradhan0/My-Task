CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) DEFAULT 'Untitled' NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
UPDATE "tasks" AS t
SET "sort_order" = s.rn
FROM (
	SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS rn
	FROM tasks
) AS s
WHERE t.id = s.id;