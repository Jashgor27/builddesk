


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."document_versions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "document_id" "uuid" NOT NULL,
    "version_number" integer NOT NULL,
    "file_name" "text",
    "storage_path" "text",
    "file_size" bigint,
    "mime_type" "text",
    "change_description" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "document_versions_number_check" CHECK (("version_number" >= 1))
);


ALTER TABLE "public"."document_versions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "file_name" "text",
    "document_type" "text" DEFAULT 'other'::"text" NOT NULL,
    "description" "text",
    "storage_path" "text",
    "current_version" integer DEFAULT 1 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "documents_type_check" CHECK (("document_type" = ANY (ARRAY['drawing'::"text", 'invoice'::"text", 'report'::"text", 'estimate'::"text", 'other'::"text"]))),
    CONSTRAINT "documents_version_check" CHECK (("current_version" >= 1))
);


ALTER TABLE "public"."documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."expenses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "category" "text" NOT NULL,
    "description" "text" NOT NULL,
    "amount" numeric(14,2) NOT NULL,
    "expense_date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "supplier" "text",
    "quantity" numeric(14,3),
    "unit" "text",
    "notes" "text",
    "document_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "expenses_amount_check" CHECK (("amount" >= (0)::numeric)),
    CONSTRAINT "expenses_quantity_check" CHECK ((("quantity" IS NULL) OR ("quantity" >= (0)::numeric)))
);


ALTER TABLE "public"."expenses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."form_fields" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "form_id" "uuid" NOT NULL,
    "field_key" "text" NOT NULL,
    "field_label" "text" NOT NULL,
    "field_value" "text",
    "master_field_id" "uuid",
    "confidence" numeric(5,4),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "form_fields_confidence_check" CHECK ((("confidence" IS NULL) OR (("confidence" >= (0)::numeric) AND ("confidence" <= (1)::numeric))))
);


ALTER TABLE "public"."form_fields" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."form_sync_results" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sync_run_id" "uuid" NOT NULL,
    "form_id" "uuid" NOT NULL,
    "form_field_id" "uuid",
    "master_field_id" "uuid",
    "old_value" "text",
    "new_value" "text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "error_message" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "form_sync_results_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'updated'::"text", 'needs_review'::"text", 'skipped'::"text", 'failed'::"text"])))
);


ALTER TABLE "public"."form_sync_results" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."form_sync_runs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "triggered_by" "uuid",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "form_sync_runs_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'processing'::"text", 'completed'::"text", 'partial'::"text", 'failed'::"text"])))
);


ALTER TABLE "public"."form_sync_runs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."forms" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "file_name" "text",
    "form_type" "text",
    "status" "text" DEFAULT 'ready'::"text" NOT NULL,
    "storage_path" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "forms_status_check" CHECK (("status" = ANY (ARRAY['processing'::"text", 'ready'::"text", 'needs_review'::"text", 'synced'::"text", 'error'::"text"])))
);


ALTER TABLE "public"."forms" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."materials" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "category" "text",
    "planned_quantity" numeric(14,3) DEFAULT 0 NOT NULL,
    "purchased_quantity" numeric(14,3) DEFAULT 0 NOT NULL,
    "used_quantity" numeric(14,3) DEFAULT 0 NOT NULL,
    "unit" "text" NOT NULL,
    "estimated_unit_cost" numeric(14,2),
    "actual_unit_cost" numeric(14,2),
    "supplier" "text",
    "purchase_date" "date",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "materials_actual_cost_check" CHECK ((("actual_unit_cost" IS NULL) OR ("actual_unit_cost" >= (0)::numeric))),
    CONSTRAINT "materials_estimated_cost_check" CHECK ((("estimated_unit_cost" IS NULL) OR ("estimated_unit_cost" >= (0)::numeric))),
    CONSTRAINT "materials_planned_quantity_check" CHECK (("planned_quantity" >= (0)::numeric)),
    CONSTRAINT "materials_purchased_quantity_check" CHECK (("purchased_quantity" >= (0)::numeric)),
    CONSTRAINT "materials_used_quantity_check" CHECK (("used_quantity" >= (0)::numeric))
);


ALTER TABLE "public"."materials" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text" NOT NULL,
    "email" "text",
    "phone" "text",
    "company" "text",
    "role" "text",
    "location" "text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_master_fields" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "field_key" "text" NOT NULL,
    "field_label" "text" NOT NULL,
    "field_value" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."project_master_fields" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "owner_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "location" "text",
    "description" "text",
    "budget" numeric(14,2) DEFAULT 0 NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "start_date" "date",
    "expected_end_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "projects_budget_check" CHECK (("budget" >= (0)::numeric)),
    CONSTRAINT "projects_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'completed'::"text", 'on_hold'::"text", 'archived'::"text"])))
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


ALTER TABLE ONLY "public"."document_versions"
    ADD CONSTRAINT "document_versions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."document_versions"
    ADD CONSTRAINT "document_versions_unique" UNIQUE ("document_id", "version_number");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "expenses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."form_fields"
    ADD CONSTRAINT "form_fields_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."form_sync_results"
    ADD CONSTRAINT "form_sync_results_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."form_sync_runs"
    ADD CONSTRAINT "form_sync_runs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."forms"
    ADD CONSTRAINT "forms_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."materials"
    ADD CONSTRAINT "materials_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_master_fields"
    ADD CONSTRAINT "project_master_fields_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_master_fields"
    ADD CONSTRAINT "project_master_fields_unique" UNIQUE ("project_id", "field_key");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



CREATE INDEX "document_versions_created_at_idx" ON "public"."document_versions" USING "btree" ("created_at");



CREATE INDEX "document_versions_document_idx" ON "public"."document_versions" USING "btree" ("document_id");



CREATE INDEX "documents_project_idx" ON "public"."documents" USING "btree" ("project_id");



CREATE INDEX "documents_type_idx" ON "public"."documents" USING "btree" ("document_type");



CREATE INDEX "expenses_category_idx" ON "public"."expenses" USING "btree" ("category");



CREATE INDEX "expenses_date_idx" ON "public"."expenses" USING "btree" ("expense_date");



CREATE INDEX "expenses_project_idx" ON "public"."expenses" USING "btree" ("project_id");



CREATE INDEX "form_fields_form_idx" ON "public"."form_fields" USING "btree" ("form_id");



CREATE INDEX "form_fields_master_field_idx" ON "public"."form_fields" USING "btree" ("master_field_id");



CREATE INDEX "form_sync_results_form_idx" ON "public"."form_sync_results" USING "btree" ("form_id");



CREATE INDEX "form_sync_results_run_idx" ON "public"."form_sync_results" USING "btree" ("sync_run_id");



CREATE INDEX "form_sync_runs_project_idx" ON "public"."form_sync_runs" USING "btree" ("project_id");



CREATE INDEX "forms_project_idx" ON "public"."forms" USING "btree" ("project_id");



CREATE INDEX "forms_status_idx" ON "public"."forms" USING "btree" ("status");



CREATE INDEX "materials_category_idx" ON "public"."materials" USING "btree" ("category");



CREATE INDEX "materials_name_idx" ON "public"."materials" USING "btree" ("name");



CREATE INDEX "materials_project_idx" ON "public"."materials" USING "btree" ("project_id");



CREATE INDEX "project_master_fields_project_idx" ON "public"."project_master_fields" USING "btree" ("project_id");



CREATE INDEX "projects_owner_id_idx" ON "public"."projects" USING "btree" ("owner_id");



CREATE INDEX "projects_status_idx" ON "public"."projects" USING "btree" ("status");



CREATE OR REPLACE TRIGGER "documents_updated_at" BEFORE UPDATE ON "public"."documents" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "expenses_updated_at" BEFORE UPDATE ON "public"."expenses" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "form_fields_updated_at" BEFORE UPDATE ON "public"."form_fields" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "forms_updated_at" BEFORE UPDATE ON "public"."forms" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "materials_updated_at" BEFORE UPDATE ON "public"."materials" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "project_master_fields_updated_at" BEFORE UPDATE ON "public"."project_master_fields" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "projects_updated_at" BEFORE UPDATE ON "public"."projects" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."document_versions"
    ADD CONSTRAINT "document_versions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."document_versions"
    ADD CONSTRAINT "document_versions_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "expenses_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."form_fields"
    ADD CONSTRAINT "form_fields_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."form_fields"
    ADD CONSTRAINT "form_fields_master_field_id_fkey" FOREIGN KEY ("master_field_id") REFERENCES "public"."project_master_fields"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."form_sync_results"
    ADD CONSTRAINT "form_sync_results_form_field_id_fkey" FOREIGN KEY ("form_field_id") REFERENCES "public"."form_fields"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."form_sync_results"
    ADD CONSTRAINT "form_sync_results_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."form_sync_results"
    ADD CONSTRAINT "form_sync_results_master_field_id_fkey" FOREIGN KEY ("master_field_id") REFERENCES "public"."project_master_fields"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."form_sync_results"
    ADD CONSTRAINT "form_sync_results_sync_run_id_fkey" FOREIGN KEY ("sync_run_id") REFERENCES "public"."form_sync_runs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."form_sync_runs"
    ADD CONSTRAINT "form_sync_runs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."form_sync_runs"
    ADD CONSTRAINT "form_sync_runs_triggered_by_fkey" FOREIGN KEY ("triggered_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."forms"
    ADD CONSTRAINT "forms_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."materials"
    ADD CONSTRAINT "materials_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_master_fields"
    ADD CONSTRAINT "project_master_fields_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE "public"."document_versions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."expenses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."form_fields" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."form_sync_results" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."form_sync_runs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."materials" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."project_master_fields" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."document_versions" TO "anon";
GRANT ALL ON TABLE "public"."document_versions" TO "authenticated";
GRANT ALL ON TABLE "public"."document_versions" TO "service_role";



GRANT ALL ON TABLE "public"."documents" TO "anon";
GRANT ALL ON TABLE "public"."documents" TO "authenticated";
GRANT ALL ON TABLE "public"."documents" TO "service_role";



GRANT ALL ON TABLE "public"."expenses" TO "anon";
GRANT ALL ON TABLE "public"."expenses" TO "authenticated";
GRANT ALL ON TABLE "public"."expenses" TO "service_role";



GRANT ALL ON TABLE "public"."form_fields" TO "anon";
GRANT ALL ON TABLE "public"."form_fields" TO "authenticated";
GRANT ALL ON TABLE "public"."form_fields" TO "service_role";



GRANT ALL ON TABLE "public"."form_sync_results" TO "anon";
GRANT ALL ON TABLE "public"."form_sync_results" TO "authenticated";
GRANT ALL ON TABLE "public"."form_sync_results" TO "service_role";



GRANT ALL ON TABLE "public"."form_sync_runs" TO "anon";
GRANT ALL ON TABLE "public"."form_sync_runs" TO "authenticated";
GRANT ALL ON TABLE "public"."form_sync_runs" TO "service_role";



GRANT ALL ON TABLE "public"."forms" TO "anon";
GRANT ALL ON TABLE "public"."forms" TO "authenticated";
GRANT ALL ON TABLE "public"."forms" TO "service_role";



GRANT ALL ON TABLE "public"."materials" TO "anon";
GRANT ALL ON TABLE "public"."materials" TO "authenticated";
GRANT ALL ON TABLE "public"."materials" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."project_master_fields" TO "anon";
GRANT ALL ON TABLE "public"."project_master_fields" TO "authenticated";
GRANT ALL ON TABLE "public"."project_master_fields" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































