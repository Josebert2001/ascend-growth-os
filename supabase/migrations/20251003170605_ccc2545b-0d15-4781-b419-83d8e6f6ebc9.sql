-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create visions table
CREATE TABLE public.visions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  color text DEFAULT 'from-purple-500 to-pink-500',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.visions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own visions"
  ON public.visions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own visions"
  ON public.visions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own visions"
  ON public.visions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own visions"
  ON public.visions FOR DELETE
  USING (auth.uid() = user_id);

-- Create paths table
CREATE TABLE public.paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vision_id uuid REFERENCES public.visions(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  status text DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed')),
  deadline date,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view paths for their visions"
  ON public.paths FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.visions
      WHERE visions.id = paths.vision_id
      AND visions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create paths for their visions"
  ON public.paths FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.visions
      WHERE visions.id = paths.vision_id
      AND visions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update paths for their visions"
  ON public.paths FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.visions
      WHERE visions.id = paths.vision_id
      AND visions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete paths for their visions"
  ON public.paths FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.visions
      WHERE visions.id = paths.vision_id
      AND visions.user_id = auth.uid()
    )
  );

-- Create habits table
CREATE TABLE public.habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  linked_vision_id uuid REFERENCES public.visions(id) ON DELETE SET NULL,
  linked_path_id uuid REFERENCES public.paths(id) ON DELETE SET NULL,
  frequency text DEFAULT 'Daily' NOT NULL,
  time_of_day text DEFAULT 'Morning' NOT NULL,
  streak integer DEFAULT 0 NOT NULL,
  longest_streak integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own habits"
  ON public.habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habits"
  ON public.habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
  ON public.habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
  ON public.habits FOR DELETE
  USING (auth.uid() = user_id);

-- Create habit_completions table
CREATE TABLE public.habit_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  date date DEFAULT CURRENT_DATE NOT NULL,
  completed boolean DEFAULT false NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(habit_id, date)
);

ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view completions for their habits"
  ON public.habit_completions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.habits
      WHERE habits.id = habit_completions.habit_id
      AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create completions for their habits"
  ON public.habit_completions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.habits
      WHERE habits.id = habit_completions.habit_id
      AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update completions for their habits"
  ON public.habit_completions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.habits
      WHERE habits.id = habit_completions.habit_id
      AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete completions for their habits"
  ON public.habit_completions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.habits
      WHERE habits.id = habit_completions.habit_id
      AND habits.user_id = auth.uid()
    )
  );

-- Create check_ins table
CREATE TABLE public.check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date DEFAULT CURRENT_DATE NOT NULL,
  energy integer CHECK (energy >= 1 AND energy <= 5) NOT NULL,
  mood text NOT NULL,
  gratitude text NOT NULL,
  challenge text,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, date)
);

ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own check-ins"
  ON public.check_ins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own check-ins"
  ON public.check_ins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own check-ins"
  ON public.check_ins FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own check-ins"
  ON public.check_ins FOR DELETE
  USING (auth.uid() = user_id);

-- Create insights table
CREATE TABLE public.insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text CHECK (type IN ('pattern', 'prediction', 'celebration', 'suggestion')) NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  dismissed boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own insights"
  ON public.insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own insights"
  ON public.insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights"
  ON public.insights FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own insights"
  ON public.insights FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add triggers for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.visions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.habits
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();