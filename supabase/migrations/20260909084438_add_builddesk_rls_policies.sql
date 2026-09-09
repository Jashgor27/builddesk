-- ============================================================
-- BuildDesk Row Level Security Policies
-- ============================================================

-- ------------------------------------------------------------
-- PROFILES
-- ------------------------------------------------------------

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());


-- ------------------------------------------------------------
-- PROJECTS
-- ------------------------------------------------------------

CREATE POLICY "Users can view their own projects"
ON public.projects
FOR SELECT
TO authenticated
USING (owner_id = auth.uid());

CREATE POLICY "Users can create their own projects"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own projects"
ON public.projects
FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can delete their own projects"
ON public.projects
FOR DELETE
TO authenticated
USING (owner_id = auth.uid());


-- ------------------------------------------------------------
-- PROJECT MASTER FIELDS
-- ------------------------------------------------------------

CREATE POLICY "Users can view master fields for their projects"
ON public.project_master_fields
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = project_master_fields.project_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can create master fields for their projects"
ON public.project_master_fields
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = project_master_fields.project_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can update master fields for their projects"
ON public.project_master_fields
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = project_master_fields.project_id
          AND p.owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = project_master_fields.project_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can delete master fields for their projects"
ON public.project_master_fields
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = project_master_fields.project_id
          AND p.owner_id = auth.uid()
    )
);


-- ------------------------------------------------------------
-- FORMS
-- ------------------------------------------------------------

CREATE POLICY "Users can view forms for their projects"
ON public.forms
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = forms.project_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can create forms for their projects"
ON public.forms
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = forms.project_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can update forms for their projects"
ON public.forms
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = forms.project_id
          AND p.owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = forms.project_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can delete forms for their projects"
ON public.forms
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = forms.project_id
          AND p.owner_id = auth.uid()
    )
);


-- ------------------------------------------------------------
-- FORM FIELDS
-- ------------------------------------------------------------

CREATE POLICY "Users can view fields for their forms"
ON public.form_fields
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.forms f
        JOIN public.projects p ON p.id = f.project_id
        WHERE f.id = form_fields.form_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can create fields for their forms"
ON public.form_fields
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.forms f
        JOIN public.projects p ON p.id = f.project_id
        WHERE f.id = form_fields.form_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can update fields for their forms"
ON public.form_fields
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.forms f
        JOIN public.projects p ON p.id = f.project_id
        WHERE f.id = form_fields.form_id
          AND p.owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.forms f
        JOIN public.projects p ON p.id = f.project_id
        WHERE f.id = form_fields.form_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can delete fields for their forms"
ON public.form_fields
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.forms f
        JOIN public.projects p ON p.id = f.project_id
        WHERE f.id = form_fields.form_id
          AND p.owner_id = auth.uid()
    )
);


-- ------------------------------------------------------------
-- FORM SYNC RUNS
-- ------------------------------------------------------------

CREATE POLICY "Users can view sync runs for their projects"
ON public.form_sync_runs
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = form_sync_runs.project_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can create sync runs for their projects"
ON public.form_sync_runs
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = form_sync_runs.project_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can update sync runs for their projects"
ON public.form_sync_runs
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = form_sync_runs.project_id
          AND p.owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = form_sync_runs.project_id
          AND p.owner_id = auth.uid()
    )
);


-- ------------------------------------------------------------
-- FORM SYNC RESULTS
-- ------------------------------------------------------------

CREATE POLICY "Users can view sync results for their projects"
ON public.form_sync_results
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.form_sync_runs r
        JOIN public.projects p ON p.id = r.project_id
        WHERE r.id = form_sync_results.sync_run_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can create sync results for their projects"
ON public.form_sync_results
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.form_sync_runs r
        JOIN public.projects p ON p.id = r.project_id
        WHERE r.id = form_sync_results.sync_run_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can update sync results for their projects"
ON public.form_sync_results
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.form_sync_runs r
        JOIN public.projects p ON p.id = r.project_id
        WHERE r.id = form_sync_results.sync_run_id
          AND p.owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.form_sync_runs r
        JOIN public.projects p ON p.id = r.project_id
        WHERE r.id = form_sync_results.sync_run_id
          AND p.owner_id = auth.uid()
    )
);


-- ------------------------------------------------------------
-- EXPENSES
-- ------------------------------------------------------------

CREATE POLICY "Users can view expenses for their projects"
ON public.expenses
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = expenses.project_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can create expenses for their projects"
ON public.expenses
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = expenses.project_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can update expenses for their projects"
ON public.expenses
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = expenses.project_id
          AND p.owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = expenses.project_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can delete expenses for their projects"
ON public.expenses
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = expenses.project_id
          AND p.owner_id = auth.uid()
    )
);


-- ------------------------------------------------------------
-- MATERIALS
-- ------------------------------------------------------------

CREATE POLICY "Users can view materials for their projects"
ON public.materials
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = materials.project_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can create materials for their projects"
ON public.materials
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = materials.project_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can update materials for their projects"
ON public.materials
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = materials.project_id
          AND p.owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = materials.project_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can delete materials for their projects"
ON public.materials
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = materials.project_id
          AND p.owner_id = auth.uid()
    )
);


-- ------------------------------------------------------------
-- DOCUMENTS
-- ------------------------------------------------------------

CREATE POLICY "Users can view documents for their projects"
ON public.documents
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = documents.project_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can create documents for their projects"
ON public.documents
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = documents.project_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can update documents for their projects"
ON public.documents
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = documents.project_id
          AND p.owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = documents.project_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can delete documents for their projects"
ON public.documents
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = documents.project_id
          AND p.owner_id = auth.uid()
    )
);


-- ------------------------------------------------------------
-- DOCUMENT VERSIONS
-- ------------------------------------------------------------

CREATE POLICY "Users can view document versions for their projects"
ON public.document_versions
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.documents d
        JOIN public.projects p ON p.id = d.project_id
        WHERE d.id = document_versions.document_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can create document versions for their projects"
ON public.document_versions
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.documents d
        JOIN public.projects p ON p.id = d.project_id
        WHERE d.id = document_versions.document_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can update document versions for their projects"
ON public.document_versions
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.documents d
        JOIN public.projects p ON p.id = d.project_id
        WHERE d.id = document_versions.document_id
          AND p.owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.documents d
        JOIN public.projects p ON p.id = d.project_id
        WHERE d.id = document_versions.document_id
          AND p.owner_id = auth.uid()
    )
);

CREATE POLICY "Users can delete document versions for their projects"
ON public.document_versions
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.documents d
        JOIN public.projects p ON p.id = d.project_id
        WHERE d.id = document_versions.document_id
          AND p.owner_id = auth.uid()
    )
);