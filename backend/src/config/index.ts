export interface AppConfig {
  openai: { apiKey: string };
  anthropic: { apiKey: string; model: string };
  audio: {
    maxFileSizeMB: number;
    bitrate: string;
    sampleRate: number;
    chunkDurationMinutes: number;
  };
  whisper: { model: string; language: string };
  supabase: { url: string; serviceRoleKey: string } | null;
}

const REQUIRED_KEYS = ["OPENAI_API_KEY", "ANTHROPIC_API_KEY"] as const;

export function validateConfig() {
  const missing = REQUIRED_KEYS.filter((key) => !process.env[key]);
  return { isValid: missing.length === 0, missingKeys: missing };
}

export function validateSupabaseConfig() {
  const hasUrl = !!process.env.SUPABASE_URL;
  const hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { isValid: hasUrl && hasKey, hasUrl, hasKey };
}

export function loadConfig(): AppConfig {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return {
    openai: { apiKey: process.env.OPENAI_API_KEY! },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY!,
      model: "claude-sonnet-4-5",
    },
    audio: {
      maxFileSizeMB: 24,
      bitrate: "32k",
      sampleRate: 16000,
      chunkDurationMinutes: 25,
    },
    whisper: { model: "whisper-1", language: "id" },
    supabase: supabaseUrl && supabaseKey ? { url: supabaseUrl, serviceRoleKey: supabaseKey } : null,
  };
}
