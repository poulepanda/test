import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bhvxmypqbmlzadfbajti.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJodnhteXBxYm1semFkZmJhanRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzA2NTk5MywiZXhwIjoyMDU4NjQxOTkzfQ.gyyGTpWlB2igG4vcLziVQPfrcG7wZ2ZhI8FgHzTA1iY';

export const supabase = createClient(supabaseUrl, supabaseKey);