-- Add missing fields to visions table
ALTER TABLE public.visions
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'target',
ADD COLUMN IF NOT EXISTS timeline TEXT DEFAULT '6-months',
ADD COLUMN IF NOT EXISTS why_it_matters TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS health_score INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;

-- Add missing fields to paths table
ALTER TABLE public.paths
ADD COLUMN IF NOT EXISTS depends_on_path_id UUID REFERENCES public.paths(id),
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Add missing fields to habits table
ALTER TABLE public.habits
ADD COLUMN IF NOT EXISTS tracking_type TEXT DEFAULT 'check-in',
ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS reminder_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS reminder_time TIME,
ADD COLUMN IF NOT EXISTS paused BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pause_reason TEXT,
ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'check';

-- Add missing fields to check_ins table
ALTER TABLE public.check_ins
ADD COLUMN IF NOT EXISTS voice_note_url TEXT;

-- Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  read_time INTEGER DEFAULT 5,
  key_takeaways TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons are viewable by everyone"
ON public.lessons FOR SELECT
USING (true);

-- Create user_lessons table for tracking completion
CREATE TABLE IF NOT EXISTS public.user_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.user_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lesson progress"
ON public.user_lessons FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lesson progress"
ON public.user_lessons FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create resources table
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  type TEXT DEFAULT 'article',
  notes TEXT,
  vision_id UUID REFERENCES public.visions(id) ON DELETE SET NULL,
  consumed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own resources"
ON public.resources FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
ON public.achievements FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own achievements"
ON public.achievements FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create ai_conversations table
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
ON public.ai_conversations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
ON public.ai_conversations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Insert pre-built lessons
INSERT INTO public.lessons (title, category, content, read_time, key_takeaways) VALUES
('Why Habits Fail (And How to Fix It)', 'Habit Science', 'Most people approach habit formation completely wrong. They rely on willpower and motivation, both of which are finite resources that deplete throughout the day. The truth is, habits fail because of poor design, not poor discipline.

**The Real Reasons Habits Fail:**

1. **Too Much, Too Soon** - Starting with 60-minute workouts when you haven''t exercised in years sets you up for failure. Your brain resists dramatic changes.

2. **No Environmental Support** - Trying to eat healthy while your kitchen is full of junk food is like trying to study in a nightclub.

3. **Vague Implementation** - "Exercise more" is not a habit. "Do 10 pushups after my morning coffee" is a habit.

4. **Wrong Timing** - Evening meditation sounds nice, but if you''re exhausted by 9 PM, it won''t stick.

**How to Fix It:**

- **Start Absurdly Small** - So small it feels too easy. One pushup. One page. Two minutes. Build confidence first.
- **Anchor to Existing Routines** - Attach new habits to things you already do automatically.
- **Design Your Environment** - Make good habits obvious and easy, bad habits invisible and hard.
- **Be Specific** - Define exactly when, where, and how you''ll do the habit.

Remember: You don''t need more discipline. You need better systems.', 7, ARRAY['Start with habits so small they feel too easy', 'Anchor new habits to existing routines', 'Design your environment to support your goals', 'Be specific about when, where, and how you''ll execute habits', 'Systems beat willpower every time']),

('The Science of Habit Loops', 'Habit Science', 'Every habit follows the same neurological pattern: the Habit Loop. Understanding this loop gives you the power to build new habits and break old ones.

**The Three Components:**

1. **Cue** - The trigger that initiates the behavior. This could be a time (7 AM), a location (kitchen), an emotion (stressed), or a preceding action (finishing coffee).

2. **Routine** - The behavior itself. This is the action you take in response to the cue.

3. **Reward** - The benefit you gain from the behavior. Your brain remembers this and strengthens the habit loop.

**How Your Brain Learns Habits:**

When you repeat a behavior in response to a cue and receive a reward, your brain creates a neural pathway. Each repetition strengthens this pathway until the behavior becomes automatic. This is why habits feel effortless once established - your brain has literally rewired itself.

**Practical Application:**

To build a new habit:
- Choose an obvious cue (after coffee)
- Make the routine easy (read one page)
- Ensure an immediate reward (mark it complete, feel accomplished)

To break a bad habit:
- Identify the cue (what triggers it?)
- Keep the cue and reward, but change the routine
- Example: Stressed (cue) → Walk outside (new routine) → Feel calmer (reward)

The key insight: You can''t eliminate cues or cravings, but you can redirect them.', 8, ARRAY['All habits follow the cue-routine-reward loop', 'Repetition creates neural pathways that make behaviors automatic', 'To build habits: make cues obvious, routines easy, rewards immediate', 'To break habits: keep the cue and reward, change the routine', 'You can''t eliminate cravings, but you can redirect them']),

('Atomic Habits: The 1% Rule', 'Habit Science', 'What if getting 1% better every day could transform your life? This is the premise of atomic habits - tiny changes that compound into remarkable results.

**The Math of Improvement:**

If you improve by just 1% each day, you''ll be 37 times better after one year. Conversely, if you decline by 1% daily, you''ll be nearly zero.

1.01^365 = 37.78
0.99^365 = 0.03

**Why Small Habits Matter:**

Most people overestimate what they can achieve in one month and underestimate what they can achieve in ten years. We want immediate results, but real change comes from the compound effect of small, consistent actions.

**The Plateau of Latent Potential:**

Habits often don''t seem to make a difference until you cross a critical threshold. Like ice melting - it doesn''t happen at 25°, 26°, 27°, 28°, 29°, 30°, or 31°F. Then at 32°F, a one-degree shift unleashes a huge change.

Your work is never wasted, even when you can''t see results yet. You''re just on the other side of the breakthrough.

**Implementation:**

- Focus on systems, not goals. Don''t aim to "read more books," build a system of reading 10 pages daily.
- Make habits tiny. Reading one page is better than reading zero books.
- Never break the chain twice. Missing once is an accident. Missing twice is the start of a new habit.
- Be patient. Trust the process. Compounding takes time.

Success is the product of daily habits, not once-in-a-lifetime transformations.', 6, ARRAY['1% improvement daily leads to 37x growth over a year', 'Small habits compound into remarkable results over time', 'Focus on systems, not goals', 'Results often lag behind effort - trust the process', 'Never miss twice - one miss is accident, two is a new pattern']),

('SMART Goals vs. Vision-Based Goals', 'Goal Setting', 'Traditional SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) work well for projects. But for personal transformation, they can be limiting.

**The Problem with SMART Goals:**

- They focus on the destination, not the journey
- They create pressure and rigidity
- They often lose meaning once achieved
- They don''t account for identity change

**Vision-Based Goals:**

Instead of "Lose 20 pounds by June," try: "Become someone who prioritizes health and feels energized daily."

**Key Differences:**

**SMART:** Run a marathon in 6 months
**Vision:** Become a runner who loves movement

**SMART:** Save $10,000 this year
**Vision:** Build financial security and peace of mind

**SMART:** Read 50 books this year
**Vision:** Cultivate a love of learning

**Why Vision Works:**

1. **Identity-Driven** - You focus on who you''re becoming, not just what you''re doing
2. **Intrinsically Motivating** - The vision itself is rewarding, not just the achievement
3. **Flexible** - Life changes, visions adapt
4. **Sustainable** - Behaviors that align with identity stick

**How to Create Vision-Based Goals:**

1. Ask: "Who do I want to become?"
2. Define what that person does daily
3. Create habits that embody that identity
4. Let metrics be feedback, not the goal

You don''t rise to the level of your goals. You fall to the level of your systems and identity.', 7, ARRAY['SMART goals focus on destination, visions focus on identity', 'Become someone, not just achieve something', 'Vision-based goals are more flexible and sustainable', 'Identity change drives lasting behavior change', 'Use metrics as feedback, not as the goal itself']),

('Introduction to Mindfulness', 'Mindfulness', 'Mindfulness isn''t about emptying your mind or achieving perfect calm. It''s about being present with whatever is happening right now, without judgment.

**What Mindfulness Really Is:**

Mindfulness is the practice of paying attention to the present moment with curiosity and acceptance. It''s noticing your thoughts, feelings, and sensations without trying to change them.

**What It''s Not:**

- Not about stopping thoughts
- Not about achieving a blank mind
- Not religious or spiritual (though it can be)
- Not complicated or requiring special equipment

**The Science:**

Research shows mindfulness:
- Reduces stress and anxiety
- Improves focus and concentration
- Enhances emotional regulation
- Increases self-awareness
- Boosts immune function

**How to Practice:**

**1-Minute Mindfulness:**
- Pause whatever you''re doing
- Take three deep breaths
- Notice five things you can see
- Notice what you can hear
- Notice how your body feels
- Return to what you were doing

**Daily Practice:**
- Morning: Notice your first thoughts before getting up
- Throughout day: Take mindful pauses between tasks
- Evening: Reflect on three moments you were fully present

**Common Challenges:**

"My mind won''t stop thinking!" - That''s normal. Mindfulness isn''t about stopping thoughts, it''s about noticing them without getting caught up.

"I don''t have time!" - You don''t need hours. Even 60 seconds of mindful breathing counts.

"Nothing happens!" - Benefits are cumulative. Trust the process.

Start small. Be consistent. Be patient with yourself.', 6, ARRAY['Mindfulness is present-moment awareness without judgment', 'You don''t need to stop thoughts, just notice them', 'Even 60 seconds of practice has benefits', 'Consistency matters more than duration', 'It''s a skill that improves with practice']),

('Overcoming Procrastination', 'Productivity', 'Procrastination isn''t about laziness. It''s about emotion regulation. We procrastinate to avoid uncomfortable feelings associated with a task.

**Why We Procrastinate:**

- **Fear of Failure** - "What if I''m not good enough?"
- **Perfectionism** - "If I can''t do it perfectly, why start?"
- **Overwhelm** - "This is too big, I don''t know where to begin"
- **Lack of Meaning** - "Why does this even matter?"

**The Procrastination Cycle:**

1. Task triggers negative emotion
2. We avoid task to feel better (short-term relief)
3. Avoidance creates guilt and anxiety
4. We feel worse, making the task even harder
5. Repeat

**Breaking the Cycle:**

**1. Name the Feeling**
"I''m avoiding this because I feel ___ (scared, overwhelmed, bored)."
Just naming it reduces its power.

**2. The 2-Minute Rule**
Commit to just 2 minutes. Usually, starting is the hardest part. Once you begin, momentum takes over.

**3. Make It Tiny**
Don''t "write the report." Just "open the document." Reduce resistance.

**4. Temptation Bundling**
Pair an unpleasant task with something you enjoy. Listen to your favorite podcast only while doing admin work.

**5. Implementation Intentions**
"After [trigger], I will [behavior] in [location]."
Example: "After I make my morning coffee, I will work on the project for 10 minutes at my desk."

**6. Self-Compassion**
Beating yourself up makes procrastination worse. Treat yourself like a friend.

Remember: Action creates motivation, not the other way around.', 8, ARRAY['Procrastination is about avoiding uncomfortable emotions', 'Name the feeling you''re avoiding to reduce its power', 'Start with just 2 minutes - momentum follows', 'Make tasks tiny to reduce resistance', 'Self-compassion reduces procrastination, self-criticism increases it']),

('The Power of Daily Reflection', 'Mindfulness', 'Five minutes of daily reflection can transform your personal growth journey. It turns experience into wisdom.

**Why Reflection Matters:**

Without reflection, we repeat patterns without learning from them. We stay busy but don''t grow. Reflection is how we extract lessons from our experiences and apply them moving forward.

**What to Reflect On:**

**Morning Reflection (2 minutes):**
- What''s my intention for today?
- What''s one thing I''m grateful for?
- What would make today feel successful?

**Evening Reflection (3 minutes):**
- What went well today?
- What challenged me?
- What did I learn about myself?
- What will I do differently tomorrow?

**The Gratitude Practice:**

Writing three things you''re grateful for daily rewires your brain to notice the positive. This isn''t toxic positivity - you can acknowledge challenges AND appreciate good things.

**The Learning Lens:**

Instead of "I failed at X," ask "What did X teach me?" Every experience contains data. Reflection helps you extract it.

**Building the Habit:**

- Link it to an existing routine (after dinner, before bed)
- Keep a journal by your bedside
- Use voice notes if writing feels hard
- Start with one question, not all of them

**What Good Reflection Looks Like:**

Not: "Today was fine."
Instead: "I noticed I have more energy in the mornings. I should schedule important work then. I felt anxious about the presentation but did it anyway - that''s growth."

Reflection turns experience into growth. Without it, you''re just collecting days.', 5, ARRAY['Reflection transforms experience into wisdom', 'Morning reflection sets intention, evening reflection extracts lessons', 'Gratitude rewires your brain toward positivity', 'Ask "What did this teach me?" instead of "I failed"', 'Consistency matters more than depth']),

('Building Sustainable Motivation', 'Psychology', 'Motivation is unreliable. Some days you feel fired up, others you don''t. The secret isn''t finding permanent motivation - it''s building systems that work even when motivation is low.

**The Motivation Myth:**

We think: Motivation → Action → Results

Reality: Action → Results → Motivation

**Types of Motivation:**

**Extrinsic:** External rewards (money, praise, recognition)
**Intrinsic:** Internal satisfaction (mastery, purpose, autonomy)

Intrinsic motivation is more sustainable, but both have their place.

**How to Build Sustainable Motivation:**

**1. Connect to Purpose**
Why does this matter to you? Not "should" but genuinely want?
Write your "why" and review it when motivation dips.

**2. Design for Low-Motivation Days**
Make the behavior so easy that even on your worst day, you can do it.
"On bad days, I just do 5 minutes" is better than "I need 60 or nothing."

**3. Track Progress**
Visual progress (streak counters, checkmarks, graphs) creates motivation.
Small wins compound.

**4. Create Accountability**
Tell someone about your goal.
Join a group.
Use commitment devices.

**5. Celebrate Small Wins**
Acknowledge progress, even tiny steps.
Your brain needs positive reinforcement.

**6. Rest Strategically**
Rest isn''t quitting. Burnout destroys motivation.
Schedule recovery like you schedule work.

**When Motivation is Low:**

- Lower the bar (do the minimum version)
- Connect to your why
- Remember: you don''t need to feel like it to start
- Trust the system you built

Discipline is doing it anyway. Systems make discipline easier.', 7, ARRAY['Action creates motivation, not the other way around', 'Intrinsic motivation (purpose, mastery, autonomy) is more sustainable', 'Design systems that work even on low-motivation days', 'Track and celebrate small wins', 'Rest is part of the system, not failure']),

('Growth Mindset Basics', 'Psychology', 'Your beliefs about your abilities shape your reality. A growth mindset is the belief that abilities can be developed through effort and learning.

**Fixed Mindset:**
"I''m not a math person."
"I''m just not creative."
"I''ve never been good at public speaking."

These beliefs become self-fulfilling prophecies. If you believe you can''t improve, you won''t try, so you won''t improve.

**Growth Mindset:**
"I haven''t mastered math yet."
"I can develop my creativity."
"Public speaking is a skill I can build."

**Why It Matters:**

People with growth mindsets:
- Embrace challenges (instead of avoiding them)
- Persist through obstacles (instead of giving up)
- Learn from criticism (instead of ignoring it)
- Find inspiration in others'' success (instead of feeling threatened)

**The Power of "Yet":**

"I can''t do this" → "I can''t do this YET"

That one word changes everything. It implies you''re on a journey, not at a dead end.

**How to Develop Growth Mindset:**

**1. Notice Your Self-Talk**
Catch fixed mindset thoughts and reframe them.

**2. View Challenges as Opportunities**
"This is hard" → "This is helping me grow"

**3. Focus on Process, Not Just Outcomes**
Celebrate effort, strategy, and learning, not just results.

**4. Learn from Setbacks**
"What can I learn from this?"
"What will I try differently?"

**5. Surround Yourself with Growth**
Read about people who overcame obstacles.
Join communities that value learning.

**Common Misconception:**

Growth mindset doesn''t mean "anyone can be anything with enough effort." It means everyone can improve with the right strategies and support. You might not become an NBA player, but you can absolutely become a better basketball player.

Your potential is not fixed. Your brain is malleable. You can grow.', 6, ARRAY['Abilities can be developed through effort and learning', 'Add "yet" to transform fixed mindset statements', 'Embrace challenges as opportunities for growth', 'Focus on process and learning, not just outcomes', 'Your brain is malleable - you can change and grow']),

('Self-Compassion in Goal Setting', 'Psychology', 'The way you talk to yourself when you fall short determines whether you get back up or stay down. Self-compassion isn''t self-indulgence - it''s a powerful tool for sustained progress.

**What Self-Compassion Is:**

Treating yourself with the same kindness you''d offer a good friend who''s struggling. It has three components:

1. **Self-Kindness** - Being warm toward yourself when you fail or struggle
2. **Common Humanity** - Recognizing that struggle is part of being human
3. **Mindfulness** - Holding painful thoughts and feelings in balanced awareness

**What It''s NOT:**

- Not making excuses or lowering standards
- Not self-pity or victim mentality
- Not self-indulgence
- Not weakness

**The Self-Criticism Trap:**

Many people believe harsh self-criticism motivates them to do better. Research shows the opposite:

- Self-criticism triggers threat response (fight/flight/freeze)
- It drains motivation and increases procrastination
- It leads to anxiety and depression
- It actually reduces the likelihood of achieving goals

**Self-Compassion Actually:**

- Increases motivation (approach goals with enthusiasm, not fear)
- Builds resilience (bounce back faster from setbacks)
- Improves performance (reduces performance anxiety)
- Increases willingness to try again

**How to Practice:**

**When You Miss a Goal:**

Self-Criticism: "I''m so lazy. I always fail. Why do I even try?"

Self-Compassion: "I missed my workout today. That''s disappointing, but everyone has off days. What got in the way? What can I learn? Tomorrow is a new start."

**The Self-Compassion Break:**

1. Acknowledge: "This is hard right now"
2. Normalize: "Struggle is part of growth"
3. Support: "What do I need? How can I help myself?"

**Journal Prompt:**

Write what you''d say to a friend in your situation. Then direct that same kindness to yourself.

Remember: You can''t hate yourself into becoming someone you love. Self-compassion is the foundation of lasting change.', 7, ARRAY['Self-compassion is self-kindness, not self-indulgence', 'Self-criticism decreases motivation and performance', 'Treat yourself like you''d treat a struggling friend', 'Everyone struggles - you''re not alone', 'Self-compassion builds resilience and sustains long-term change']);

-- Insert habit templates
INSERT INTO public.habits (name, frequency, time_of_day, difficulty, is_template, category, icon, user_id, tracking_type)
SELECT 'Morning Workout', 'Daily', 'Morning', 'medium', true, 'Health', 'dumbbell', id, 'duration'
FROM auth.users LIMIT 1
ON CONFLICT DO NOTHING;

-- Note: More templates will be added via code to avoid RLS issues